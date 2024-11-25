package main

import "fmt"

func main() {
	fileName := "RealChat"
	log := true

	messages, members := read(fileName, log)
	bundle := bundle(messages, members, log)
	write(fileName, bundle, log)
}

func read(fileName string, log bool) ([]*Message, []string) {
	if log {
		fmt.Println("Starting Read")
	}

	messages, members := ReadFilePooled(fileName + ".txt")

	if log {
		fmt.Println("Completed Read")
	}

	return messages, members
}

func bundle(messages []*Message, members []string, log bool) *Bundle {
	if log {
		fmt.Println("Starting Bundle")
	}

	bundle := createBundle(messages, members)

	if log {
		fmt.Println("Completed Bundle")
	}

	return bundle
}

func write(fileName string, bundle *Bundle, log bool) {
	if log {
		fmt.Println("Starting Write")
	}

	// writeFileDump(fileName+"Export.txt", bundle)
	writeFile(fileName+"Export.json", bundle)

	if log {
		fmt.Println("Completed Write")
	}
}
