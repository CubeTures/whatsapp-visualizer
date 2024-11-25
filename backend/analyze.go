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
			Year:  make(map[int]*Counts),
			Exact: make(map[int]map[int]map[int]map[int]*Counts),
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
	counts := analyzePersonalMessageCounts(message, stats)
	analyzePersonalMessageTime(message, counts, stats)
	analyzePersonalMessageLength(message, stats)
}

func analyzePersonalMessageCounts(message *Message, stats *Statistics) *Counts {
	counts := &Counts{}
	counts.Messages += 1

	if message.content.isMedia {
		counts.Media += 1
	} else if message.content.isCall {
		counts.Calls += 1
	} else if message.content.isDeleted {
		counts.Deleted += 1
	} else if message.content.isEdited {
		counts.Edited += 1
	} else {
		counts.Emojis += len(message.content.emojis)

		if 0 < counts.Words && counts.Words <= 3 {
			phrase := strings.Join(message.content.words, " ")

			if len(phrase) < 50 {
				stats.Frequencies.Phrases[phrase] += 1
			}
		}

		wordCount := 0
		letterCount := 0
		for _, word := range message.content.words {
			clean, valid := cleanWord(word)

			if valid {
				wordCount += 1
				letterCount += len(strings.Split(clean, ""))
				stats.Frequencies.Words[clean] += 1
			}
		}
		counts.Words += wordCount
		counts.Letters += letterCount

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
				counts.Links += 1
			}
		}
	}

	stats.Counts.Join(counts)
	return counts
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

func analyzePersonalMessageTime(message *Message, counts *Counts, stats *Statistics) {
	year := message.date.Year()
	month := int(message.date.Month()) - 1
	weekday := int(message.date.Weekday())
	day := message.date.Day()
	hour := message.date.Hour()

	if existing, ok := stats.CountsByTime.Year[year]; ok {
		existing.Join(counts)
	} else {
		copy := *counts
		stats.CountsByTime.Year[year] = &copy
	}

	stats.CountsByTime.Month[month].Join(counts)
	stats.CountsByTime.Weekday[weekday].Join(counts)
	stats.CountsByTime.Hour[hour].Join(counts)
	updateExactTimeCount(stats.CountsByTime.Exact, counts, year, month, day, hour)
}

func updateExactTimeCount(exact map[int]map[int]map[int]map[int]*Counts, counts *Counts, year, month, day, hour int) {
	if exact[year] == nil {
		exact[year] = make(map[int]map[int]map[int]*Counts)
	}
	yearMap := exact[year]

	if yearMap[month] == nil {
		yearMap[month] = make(map[int]map[int]*Counts)
	}
	monthMap := yearMap[month]

	if monthMap[day] == nil {
		monthMap[day] = make(map[int]*Counts)
	}
	dayMap := monthMap[day]

	if c, ok := dayMap[hour]; ok {
		c.Join(counts)
	} else {
		copy := *counts
		dayMap[hour] = &copy
	}
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

func (a *Counts) Join(b *Counts) {
	a.Messages += b.Messages
	a.Words += b.Words
	a.Letters += b.Letters
	a.Emojis += b.Emojis
	a.Links += b.Links
	a.Media += b.Media
	a.Calls += b.Calls
	a.Deleted += b.Deleted
	a.Edited += b.Edited
}

func (a *Statistics) Join(b *Statistics) {
	// counts
	a.Counts.Join(b.Counts)

	// frequency
	joinMapInts(a.Frequencies.Phrases, b.Frequencies.Phrases)
	joinMapInts(a.Frequencies.Words, b.Frequencies.Words)
	joinMapInts(a.Frequencies.Emojis, b.Frequencies.Emojis)
	joinMapInts(a.Frequencies.Links, b.Frequencies.Links)

	// time
	joinTimes(&a.CountsByTime.Hour, &b.CountsByTime.Hour)
	joinTimes(&a.CountsByTime.Weekday, &b.CountsByTime.Weekday)
	joinTimes(&a.CountsByTime.Month, &b.CountsByTime.Month)
	joinYears(a.CountsByTime.Year, b.CountsByTime.Year)
	joinExacts(a.CountsByTime.Exact, b.CountsByTime.Exact)

	// length
	a.Lengths.LongestMessages.Join(b.Lengths.LongestMessages)
	joinRunningAverages(a.Lengths.AverageWordsPerMessage, b.Lengths.AverageWordsPerMessage)
	joinRunningAverages(a.Lengths.AverageEmojisPerMessage, b.Lengths.AverageEmojisPerMessage)
}

func joinMapInts[T comparable](a, b map[T]int) {
	for key, value := range b {
		a[key] += value
	}
}

func joinYears(a, b map[int]*Counts) {
	for year, count := range b {
		if existing, ok := a[year]; ok {
			existing.Join(count)
		} else {
			copy := *count
			a[year] = &copy
		}
	}
}

func joinExacts(a, b map[int]map[int]map[int]map[int]*Counts) {
	for year, monthMap := range b {
		for month, dayMap := range monthMap {
			for day, hourMap := range dayMap {
				for hour, count := range hourMap {
					updateExactTimeCount(a, count, year, month, day, hour)
				}
			}
		}
	}
}

func joinTimes[T ~*[24]Counts | *[7]Counts | *[12]Counts](a, b T) {
	var slice []Counts

	switch v := any(b).(type) {
	case *[24]Counts:
		slice = v[:]
	case *[7]Counts:
		slice = v[:]
	case *[12]Counts:
		slice = v[:]
	default:
		panic("Unsupported type")
	}

	for i, n := range slice {
		a[i].Join(&n)
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
