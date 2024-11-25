package main

import (
	"os"
	"regexp"
	"strings"
	"sync"
)

func ReadFileSequential(fileName string) []*Message {
	messages := readFile(fileName)
	parsed := make([]*Message, len(messages))

	for index, message := range messages {
		parsed[index] = ParseMessage(message)
	}

	return parsed
}

func ReadFileInfiniteGoroutines(fileName string) []*Message {
	messages := readFile(fileName)
	parsed := make([]*Message, len(messages))

	var group sync.WaitGroup
	for index, message := range messages {
		group.Add(1)
		go func(index int, message string) {
			defer group.Done()
			parsed[index] = ParseMessage(message)
		}(index, message)
	}

	group.Wait()
	return parsed
}

func ReadFilePooled(fileName string) ([]*Message, []string) {
	messages := readFile(fileName)
	parsed := make([]*Message, len(messages))
	hashmap := CreateHashmap[string]()

	var poolSize int = min(len(messages), 100)
	pool := CreatePool(poolSize, len(messages), func(id int, args ...interface{}) {
		index := args[0].(int)
		message := args[1].(string)
		parsed[index] = ParseMessage(message)
		hashmap.Add(parsed[index].sender)
	})

	for i, message := range messages {
		pool.SubmitTask(i, message)
	}

	pool.CompleteTasks()
	return parsed, hashmap.ToSlice()
}

func readFile(fileName string) []string {
	bytes, err := os.ReadFile(fileName)

	if err != nil {
		panic(err)
	}

	str := string(bytes)
	return splitOnNewMessage(str)[1:]
}

func splitOnNewMessage(str string) []string {
	entryStartPattern := `^\d{1,2}\/\d{1,2}\/\d{1,2}, \d{1,2}:\d{2} [AP]M - .+?:`
	entryRegex := regexp.MustCompile(entryStartPattern)

	lines := strings.Split(str, "\n")
	messages := make([]string, 0, len(lines))
	var builder strings.Builder

	for _, line := range lines {
		if entryRegex.MatchString(line) {
			if builder.Len() > 0 {
				messages = append(messages, strings.TrimSpace(builder.String()))
				builder.Reset()
			}
		} else {
			if builder.Len() > 0 {
				builder.WriteString("\n")
			}
		}

		builder.WriteString(line)
	}

	if builder.Len() > 0 {
		messages = append(messages, strings.TrimSpace(builder.String()))
	}

	return messages
}
