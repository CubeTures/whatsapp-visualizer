package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

type Message struct {
	date    time.Time
	sender  string
	content *MessageContent
}

type MessageContent struct {
	words        []string
	emojis       []string
	links        []string
	media        string
	mediaOmitted bool
	isMedia      bool
	isCall       bool
	isDeleted    bool
	isEdited     bool
}

type Bundle struct {
	Personal  *SyncMap[*Statistics] `json:"personal"`
	Aggregate *Statistics           `json:"aggregate"`
}

type Statistics struct {
	Counts       *Counts       `json:"counts"`
	Frequencies  *Frequencies  `json:"frequencies"`
	CountsByTime *CountsByTime `json:"counts_by_time"`
	Lengths      *Lengths      `json:"lengths"`
}

type Counts struct {
	Messages int `json:"messages"`
	Words    int `json:"words"`
	Letters  int `json:"letters"`
	Emojis   int `json:"emojis"`
	Links    int `json:"links"`
	Media    int `json:"media"`
	Calls    int `json:"calls"`
	Deleted  int `json:"deleted"`
	Edited   int `json:"edited"`
}

type Frequencies struct {
	Phrases map[string][]time.Time `json:"phrases"`
	Words   map[string][]time.Time `json:"words"`
	Emojis  map[string][]time.Time `json:"emojis"`
	Links   map[string][]time.Time `json:"links"`
}

type CountsByTime struct {
	Hour    [24]Counts                              `json:"hour"`
	Weekday [7]Counts                               `json:"weekday"`
	Month   [12]Counts                              `json:"month"`
	Year    map[int]*Counts                         `json:"year"`
	Exact   map[int]map[int]map[int]map[int]*Counts `json:"exact"`
}

type Lengths struct {
	LongestMessages *PriorityQueue[TimeContentPair] `json:"longest_messages"`
}

type TimeContentPair struct {
	Time    time.Time `json:"date"`
	Content string    `json:"message"`
}

type CountContentPair[T any] struct {
	count   int
	content T
}

func (pair *CountContentPair[T]) MarshalJSON() ([]byte, error) {
	return json.Marshal(pair.content)
}

func (b *Bundle) MarshalJSON() ([]byte, error) {
	return json.Marshal(b.Personal)
}

// func (f *Frequencies) MarshalJSON() ([]byte, error) {

// }

// func MarshallFrequencyMap(m map[string][]time.Time) ([]byte, error) {
// 	var builder bytes.Buffer

// 	for key, times := range m {

// 	}

// 	return builder.Bytes(), nil
// }

func (stats *Statistics) String() string {
	return fmt.Sprintf("%v\n%v\n%v\n%v\n", stats.Counts, stats.Frequencies, stats.CountsByTime, stats.Lengths)
}

func (count *Counts) String() string {
	return fmt.Sprintf("Counts:\nMessages: %v\nWords: %v\nLetters: %v\nEmojis: %v\nLinks: %v\nMedia: %v\nCalls: %v\nDeleted: %v\nEdited: %v\n", count.Messages, count.Words, count.Letters, count.Emojis, count.Links, count.Media, count.Calls, count.Deleted, count.Edited)
}

func (freq *Frequencies) String() string {
	return fmt.Sprintf("Frequency:\nPhrases: %v\nWords: %v\nEmojis: %v\nLinks: %v\n", freq.Phrases, freq.Words, freq.Emojis, freq.Links)
}

func (cbt *CountsByTime) String() string {
	return fmt.Sprintf("Counts By Time:\nYear: %v\nMonth: %v\nWeekday: %v\nHour: %v\nExact: %v\n", cbt.Year, StringMonth(cbt.Month), StringWeekday(cbt.Weekday), StringHour(cbt.Hour), cbt.Exact)
}

func (ln *Lengths) String() string {
	return fmt.Sprintf("Lengths:\nLongest Messages: %v\n", ln.LongestMessages.String())
}

func StringMonth(months [12]Counts) string {
	var builder strings.Builder
	builder.WriteString("[ ")

	for month, count := range months {
		builder.WriteString(fmt.Sprintf("(%v: %v) ", time.Month(month+1), count))
	}

	builder.WriteString("]")
	return builder.String()
}

func StringWeekday(weekdays [7]Counts) string {
	var builder strings.Builder
	builder.WriteString("[ ")

	for weekday, count := range weekdays {
		builder.WriteString(fmt.Sprintf("(%v: %v) ", time.Weekday(weekday), count))
	}

	builder.WriteString("]")
	return builder.String()
}

func StringHour(hours [24]Counts) string {
	var builder strings.Builder
	builder.WriteString("[ ")

	for hour, count := range hours {
		zone := "AM"
		if hour == 0 {
			hour = 12
		} else if hour == 12 {
			zone = "PM"
		} else if hour > 12 {
			hour -= 12
			zone = "PM"
		}

		builder.WriteString(fmt.Sprintf("(%v %v: %v) ", hour, zone, count))
	}

	builder.WriteString("]")
	return builder.String()
}
