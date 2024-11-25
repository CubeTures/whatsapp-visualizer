package main

import (
	"fmt"
	"strconv"
	"strings"
	"time"
	"unicode"
)

func ParseMessage(message string) *Message {
	reader := strings.NewReader(message)

	_date := readUntilRune(reader, ',', 8)
	skipRunes(reader, 1)
	_time := readUntilSpace(reader, 5)
	_timeOfDay := readUntilSpace(reader, 2)
	skipRunes(reader, 2)
	sender := readUntilRune(reader, ':', 14)
	_content, _emojis := readContent(reader)

	date := parseDate(_date, _time, _timeOfDay)
	content := parseMessageContent(_content, _emojis)

	return &Message{date, sender, content}
}

func readUntilRune(reader *strings.Reader, end rune, size int) string {
	var builder strings.Builder
	builder.Grow(size)

	for {
		char, _, err := reader.ReadRune()

		if err != nil {
			if err.Error() == "EOF" {
				break
			}

			panic(err)
		}

		if char == end {
			break
		}

		builder.WriteRune(char)
	}

	return builder.String()
}

func readUntilSpace(reader *strings.Reader, size int) string {
	var builder strings.Builder
	builder.Grow(size)

	for {
		char, _, err := reader.ReadRune()

		if err != nil {
			fmt.Println(builder.String())
			panic(err)
		}

		if unicode.IsSpace(char) {
			break
		}

		builder.WriteRune(char)
	}

	return builder.String()
}

func skipRunes(reader *strings.Reader, size int) {
	for i := 0; i < size; i++ {
		reader.ReadRune()
	}
}

func readContent(reader *strings.Reader) (string, []string) {
	var builder strings.Builder
	var emojis []string
	builder.Grow(reader.Len())

	for {
		char, _, err := reader.ReadRune()

		if err != nil {
			if reader.Len() == 0 {
				break
			}

			panic(err)
		}

		if char > 0xFF && IsEmoji(char) {
			emojis = append(emojis, GetEmoji(char))
		} else {
			builder.WriteRune(char)
		}
	}

	return strings.TrimSpace(builder.String()), emojis
}

func parseDate(_date string, _time string, _timeOfDay string) time.Time {
	dateSplit := strings.Split(_date, "/")
	timeSplit := strings.Split(_time, ":")

	month := parseInt(dateSplit[0])
	day := parseInt(dateSplit[1])
	year := parseInt(dateSplit[2]) + 2000

	hour := parseInt(timeSplit[0])
	minute := parseInt(timeSplit[1])

	if hour == 12 {
		hour = 0
	}
	if _timeOfDay[0] == 'P' {
		hour += 12
	}

	return time.Date(year, time.Month(month), day, hour, minute, 0, 0, time.Local)
}

func parseInt(str string) int {
	val, err := strconv.Atoi(str)

	if err != nil {
		panic(err)
	}

	return val
}

func parseMessageContent(content string, emojis []string) *MessageContent {
	mc := MessageContent{}
	mediaAttached := strings.Contains(content, "(file attached)")
	mc.mediaOmitted = strings.HasPrefix(content, "<Media omitted>")
	mc.isMedia = mediaAttached || mc.mediaOmitted
	mc.isCall = content == "null"
	mc.isDeleted = content == "This message was deleted" || content == "You deleted this message"
	mc.isEdited = strings.HasSuffix(content, "<This message was edited>")

	if mediaAttached {
		tag := "(file attached)"
		index := strings.Index(content, tag)
		mc.media = content[:index-1]
		if !strings.HasSuffix(content, tag) {
			content = content[len(tag)+index+1:]
		}
	} else if mc.mediaOmitted {
		tag := "<Media omitted>"
		index := strings.Index(content, tag)
		if !strings.HasSuffix(content, tag) {
			content = content[len(tag)+index+1:]
		}
	}

	if mc.isEdited {
		tag := "<This message was edited>"
		index := strings.Index(content, tag)
		content = content[:index]
	}

	if !mc.isCall && !mc.isDeleted {
		mc.words, mc.links = removeLinks(content)
		mc.emojis = emojis
	}

	return &mc
}

func removeLinks(content string) ([]string, []string) {
	mixed := strings.Fields(content)
	var words []string = make([]string, 0, len(mixed))
	var links []string

	for _, word := range mixed {
		isLink := strings.HasPrefix(word, "https://") ||
			strings.HasPrefix(word, "http://") ||
			strings.HasPrefix(word, "www.")
		if isLink {
			links = append(links, word)
		} else {
			words = append(words, word)
		}
	}

	if len(links) == 0 && len(words) != cap(words) {
		output := fmt.Sprintf("Allocated more space than necessary. Words: %v, Len: %v, Cap: %v; Links: %v, Len: %v, Cap: %v", words, len(words), cap(words), links, len(links), cap(links))
		panic(output)
	}

	return words, links
}
