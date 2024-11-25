package main

import (
	"net/url"
	"strings"
	"sync"
	"unicode"
)

func createBundle(messages []*Message, members []string) *Bundle {
	personal := createPersonal(messages, members)
	aggregate := analyzeAggregate(personal)
	return &Bundle{personal, aggregate}
}

func analyzePersonalSequential(messages []*Message) *SyncMap[*Statistics] {
	personal := CreateMap[*Statistics]()

	for _, message := range messages {
		stats, ok := personal.LoadInit(message.sender, newStatistic)
		analyzePersonalMessage(message, stats)

		if !ok {
			personal.Store(message.sender, stats)
		}
	}

	return personal
}

func createPersonal(messages []*Message, members []string) *SyncMap[*Statistics] {
	personal := CreateMap[*Statistics]()

	var group sync.WaitGroup
	for _, member := range members {
		group.Add(1)
		go func(member string) {
			defer group.Done()
			stats := analyzePersonalPooled(messages, member)
			personal.Store(member, stats)
		}(member)
	}

	group.Wait()
	return personal
}

func analyzePersonalPooled(messages []*Message, member string) *Statistics {
	poolSize := min(len(messages), 100)
	slices := make([]*Statistics, 0, poolSize)
	for range poolSize {
		slices = append(slices, newStatistic())
	}

	pool := CreatePool(poolSize, len(messages), func(id int, args ...interface{}) {
		message := args[0].(*Message)
		analyzePersonalMessage(message, slices[id])
	})

	for _, message := range messages {
		if message.sender == member {
			pool.SubmitTask(message)
		}
	}

	pool.CompleteTasks()
	return accumulatePersonal(slices)
}

func newStatistic() *Statistics {
	return &Statistics{
		Counts: &Counts{},
		Frequencies: &Frequencies{
			Phrases: make(map[string]int),
			Words:   make(map[string]int),
			Emojis:  make(map[string]int),
			Links:   make(map[string]int),
		},
		CountsByTime: &CountsByTime{
			Year:  make(map[int]int),
			Exact: make(map[int]map[int]map[int]map[int]int),
		},
		Lengths: &Lengths{
			LongestMessages:         CreateQueue[string](50),
			AverageWordsPerMessage:  &CountContentPair[float32]{},
			AverageEmojisPerMessage: &CountContentPair[float32]{},
		},
	}
}

func accumulatePersonal(slices []*Statistics) *Statistics {
	stats := newStatistic()

	for _, stat := range slices {
		stats.Join(stat)
	}

	return stats
}

func analyzePersonalMessage(message *Message, stats *Statistics) {
	analyzePersonalMessageCounts(message, stats)
	analyzePersonalMessageTime(message, stats)
	analyzePersonalMessageLength(message, stats)
}

func analyzePersonalMessageCounts(message *Message, stats *Statistics) {
	stats.Counts.Messages += 1

	if message.content.isMedia {
		stats.Counts.Media += 1
	} else if message.content.isCall {
		stats.Counts.Calls += 1
	} else if message.content.isDeleted {
		stats.Counts.Deleted += 1
	} else if message.content.isEdited {
		stats.Counts.Edited += 1
	} else {
		messageLength := len(message.content.words)
		stats.Counts.Words += messageLength

		emojiCount := len(message.content.emojis)
		stats.Counts.Emojis += emojiCount

		linkCount := len(message.content.links)
		stats.Counts.Links += linkCount

		if 0 < messageLength && messageLength <= 3 {
			phrase := strings.Join(message.content.words, " ")

			if len(phrase) < 50 {
				stats.Frequencies.Phrases[phrase] += 1
			}
		}

		letterCount := 0
		for _, word := range message.content.words {
			clean, valid := cleanWord(word)

			if valid {
				letterCount += len(strings.Split(clean, ""))
				stats.Frequencies.Words[clean] += 1
			}
		}
		stats.Counts.Letters += letterCount

		for _, emoji := range message.content.emojis {
			stats.Frequencies.Emojis[emoji] += 1
		}

		for _, link := range message.content.links {
			l, err := url.Parse(link)

			if err != nil {
				continue
			}

			host := l.Hostname()

			if host != "" {
				stats.Frequencies.Links[host] += 1
			}
		}
	}
}

func cleanWord(word string) (string, bool) {
	trimmed := strings.TrimFunc(strings.ToLower(word), func(r rune) bool {
		return !unicode.IsLetter(r) && !unicode.IsDigit(r)
	})

	if len(trimmed) == 0 {
		return "", false
	}

	return trimmed, true
}

func analyzePersonalMessageTime(message *Message, stats *Statistics) {
	year := message.date.Year()
	month := int(message.date.Month()) - 1
	weekday := int(message.date.Weekday())
	day := message.date.Day()
	hour := message.date.Hour()

	stats.CountsByTime.Year[year] += 1
	stats.CountsByTime.Month[month] += 1
	stats.CountsByTime.Weekday[weekday] += 1
	stats.CountsByTime.Hour[hour] += 1
	incrementExactTimeCount(stats, year, month, day, hour)
}

func incrementExactTimeCount(stats *Statistics, year, month, day, hour int) {
	_, yearInit := stats.CountsByTime.Exact[year]
	if !yearInit {
		stats.CountsByTime.Exact[year] = make(map[int]map[int]map[int]int)
	}

	_, monthInit := stats.CountsByTime.Exact[year][month]
	if !monthInit {
		stats.CountsByTime.Exact[year][month] = make(map[int]map[int]int)
	}

	_, dayInit := stats.CountsByTime.Exact[year][month][day]
	if !dayInit {
		stats.CountsByTime.Exact[year][month][day] = make(map[int]int)
	}

	stats.CountsByTime.Exact[year][month][day][hour] += 1
}

func analyzePersonalMessageLength(message *Message, stats *Statistics) {
	content := strings.Join(message.content.words, " ")
	stats.Lengths.LongestMessages.PushIfLowerPriority(content, len(message.content.words))

	length := len(message.content.words)
	stats.Lengths.AverageWordsPerMessage = computeRunningAverage(stats.Lengths.AverageWordsPerMessage, length)

	length = len(message.content.emojis)
	stats.Lengths.AverageEmojisPerMessage = computeRunningAverage(stats.Lengths.AverageEmojisPerMessage, length)
}

func computeRunningAverage(pair *CountContentPair[float32], length int) *CountContentPair[float32] {
	if pair.count == 0 {
		pair.count = 1
		pair.content = float32(length)
		return pair
	}

	pair.count += 1
	pair.content += (float32(length) - pair.content) / float32(pair.count)
	return pair
}

func analyzeAggregate(personal *SyncMap[*Statistics]) *Statistics {
	stats := newStatistic()

	personal.Range(func(person string, stat *Statistics) {
		stats.Join(stat)
	})

	return stats
}

func (a *Statistics) Join(b *Statistics) {
	// counts
	a.Counts.Messages += b.Counts.Messages
	a.Counts.Words += b.Counts.Words
	a.Counts.Letters += b.Counts.Letters
	a.Counts.Emojis += b.Counts.Emojis
	a.Counts.Links += b.Counts.Links
	a.Counts.Media += b.Counts.Media
	a.Counts.Calls += b.Counts.Calls
	a.Counts.Deleted += b.Counts.Deleted
	a.Counts.Edited += b.Counts.Edited

	// frequency
	joinMaps(&a.Frequencies.Phrases, &b.Frequencies.Phrases)
	joinMaps(&a.Frequencies.Words, &b.Frequencies.Words)
	joinMaps(&a.Frequencies.Emojis, &b.Frequencies.Emojis)
	joinMaps(&a.Frequencies.Links, &b.Frequencies.Links)

	// time
	joinTimes(&a.CountsByTime.Hour, &b.CountsByTime.Hour)
	joinTimes(&a.CountsByTime.Weekday, &b.CountsByTime.Weekday)
	joinTimes(&a.CountsByTime.Month, &b.CountsByTime.Month)
	joinMaps(&a.CountsByTime.Year, &b.CountsByTime.Year)
	joinDeepestMaps(&a.CountsByTime.Exact, &b.CountsByTime.Exact)

	// length
	a.Lengths.LongestMessages.Join(b.Lengths.LongestMessages)
	joinRunningAverages(a.Lengths.AverageWordsPerMessage, b.Lengths.AverageWordsPerMessage)
	joinRunningAverages(a.Lengths.AverageEmojisPerMessage, b.Lengths.AverageEmojisPerMessage)
}

func joinMaps[T comparable](a, b *map[T]int) {
	for key, value := range *b {
		(*a)[key] += value
	}
}

// joinDeepMaps combines counts in a map of maps
func joinDeepMaps(a, b *map[int]map[int]int) {
	for outerKey, innerMapB := range *b {
		innerMapA, exists := (*a)[outerKey]
		if !exists {
			// If the outerKey doesn't exist in `a`, just assign the whole inner map from `b`
			(*a)[outerKey] = innerMapB
		} else {
			// If the outerKey exists, combine the inner maps
			joinMaps(&innerMapA, &innerMapB)
			(*a)[outerKey] = innerMapA
		}
	}
}

// joinDeeperMaps combines counts in a map of maps of maps
func joinDeeperMaps(a, b *map[int]map[int]map[int]int) {
	for outerKey, middleMapB := range *b {
		middleMapA, exists := (*a)[outerKey]
		if !exists {
			// If the outerKey doesn't exist in `a`, just assign the whole middle map from `b`
			(*a)[outerKey] = middleMapB
		} else {
			// If the outerKey exists, combine the middle maps
			joinDeepMaps(&middleMapA, &middleMapB)
			(*a)[outerKey] = middleMapA
		}
	}
}

// joinDeepestMaps combines counts in a map of maps of maps of maps
func joinDeepestMaps(a, b *map[int]map[int]map[int]map[int]int) {
	for outerKey, deeperMapB := range *b {
		deeperMapA, exists := (*a)[outerKey]
		if !exists {
			// If the outerKey doesn't exist in `a`, just assign the whole deeper map from `b`
			(*a)[outerKey] = deeperMapB
		} else {
			// If the outerKey exists, combine the deeper maps
			joinDeeperMaps(&deeperMapA, &deeperMapB)
			(*a)[outerKey] = deeperMapA
		}
	}
}

func joinTimes[T ~*[24]int | *[7]int | *[12]int](a, b T) {
	var slice []int

	switch v := any(b).(type) {
	case *[24]int:
		slice = v[:]
	case *[7]int:
		slice = v[:]
	case *[12]int:
		slice = v[:]
	default:
		panic("Unsupported type")
	}

	for i, n := range slice {
		a[i] += n
	}
}

func joinRunningAverages(a, b *CountContentPair[float32]) {
	if a.count == 0 {
		a.count = b.count
		a.content = b.content
	} else {
		total := a.count + b.count
		a.content = (a.content*float32(a.count) + b.content*float32(b.count)) / float32(total)
		a.count = total
	}
}
