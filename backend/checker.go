package main

import "fmt"

func checkBundle(bundle *Bundle) {
	checkPersonalCounts(bundle)
	checkAggregateCounts(bundle)
	checkAggregateConsistency(bundle)
}

func checkPersonalCounts(bundle *Bundle) {
	bundle.Personal.Range(func(person string, stats *Statistics) {
		fmt.Printf("\n===== Checking Personal (%v) =====\n", person)
		checkIndividualCounts(stats)
	})
}

func checkAggregateCounts(bundle *Bundle) {
	fmt.Println("\n===== Checking Aggregate =====")
	checkIndividualCounts(bundle.Aggregate)
}

func checkIndividualCounts(stats *Statistics) {
	maps := []string{"Words", "Emojis", "Links"}
	fields := []string{"Messages", "Words", "Letters", "Emojis", "Links", "Media", "Calls", "Deleted", "Edited"}
	cbt := []string{"Hour", "Weekday", "Month", "Year", "Exact"}

	for i, mp := range maps {
		fmt.Printf("\nChecking %v (Frequencies):\n", mp)
		count := stats.Counts.getField(mp)
		m := stats.Frequencies.getMap(mp)
		c := accumulateMap(m)

		if c != count {
			fmt.Printf("%v failed check: %v (expected), %v (received)\n", maps[i], count, c)
		}
	}

	for _, field := range fields {
		fmt.Printf("\nChecking %v (Counts by Time):\n", field)
		count := stats.Counts.getField(field)
		acc := accumulateField(stats, field)

		for i, c := range acc {
			if c != count {
				fmt.Printf("%v failed check: %v (expected), %v (received)\n", cbt[i], count, c)
			}
		}
	}
}

func accumulateField(stats *Statistics, field string) []int {
	var result []int

	acc := 0
	for _, count := range stats.CountsByTime.Hour {
		acc += count.getField(field)
	}
	result = append(result, acc)

	acc = 0
	for _, count := range stats.CountsByTime.Weekday {
		acc += count.getField(field)
	}
	result = append(result, acc)

	acc = 0
	for _, count := range stats.CountsByTime.Month {
		acc += count.getField(field)
	}
	result = append(result, acc)

	acc = 0
	for _, count := range stats.CountsByTime.Year {
		acc += count.getField(field)
	}
	result = append(result, acc)

	acc = 0
	for _, monthMap := range stats.CountsByTime.Exact {
		for _, dayMap := range monthMap {
			for _, hourMap := range dayMap {
				for _, count := range hourMap {
					acc += count.getField(field)
				}
			}
		}
	}
	result = append(result, acc)

	return result
}

func (count *Counts) getField(field string) int {
	switch field {
	case "Messages":
		return count.Messages
	case "Words":
		return count.Words
	case "Letters":
		return count.Letters
	case "Emojis":
		return count.Emojis
	case "Links":
		return count.Links
	case "Media":
		return count.Media
	case "Calls":
		return count.Calls
	case "Deleted":
		return count.Deleted
	case "Edited":
		return count.Edited
	default:
		panic(fmt.Sprintf("%v is not a key of Counts", field))
	}
}

func accumulateMap(m map[string]int) int {
	acc := 0
	for _, value := range m {
		acc += value
	}
	return acc
}

func (f *Frequencies) getMap(field string) map[string]int {
	switch field {
	case "Words":
		return f.Words
	case "Emojis":
		return f.Emojis
	case "Links":
		return f.Links
	default:
		panic(fmt.Sprintf("%v is not a key of Frequencies", field))
	}
}

func checkAggregateConsistency(bundle *Bundle) {
	fmt.Println("\n===== Checking Consistency =====")

	maps := []string{"Words", "Emojis", "Links"}
	fields := []string{"Messages", "Words", "Letters", "Emojis", "Links", "Media", "Calls", "Deleted", "Edited"}
	cbt := []string{"Hour", "Weekday", "Month", "Year", "Exact"}

	for i, mp := range maps {
		fmt.Printf("\nChecking %v (Frequencies):\n", mp)
		c := 0
		count := bundle.Aggregate.Counts.getField(mp)

		bundle.Personal.Range(func(person string, stats *Statistics) {
			m := stats.Frequencies.getMap(mp)
			c += accumulateMap(m)
		})

		if c != count {
			fmt.Printf("%v failed check: %v (expected), %v (received)\n", maps[i], count, c)
		}
	}

	for _, field := range fields {
		fmt.Printf("\nChecking %v (Counts by Time):\n", field)
		count := bundle.Aggregate.Counts.getField(field)

		var acc []int
		bundle.Personal.Range(func(person string, stats *Statistics) {
			_acc := accumulateField(stats, field)

			for i, a := range _acc {
				if len(acc) <= i {
					acc = append(acc, a)
				} else {
					acc[i] += a
				}
			}
		})

		for i, c := range acc {
			if c != count {
				fmt.Printf("%v failed check: %v (expected), %v (received)\n", cbt[i], count, c)
			}
		}
	}
}
