package main

import "fmt"

func main() {
	fileName := "../data/RealChat"
	log := true

	messages, members := read(fileName, log)
	bundle := bundle(messages, members, log)
	write(fileName, bundle, log)
	check(bundle, log)
}

func read(fileName string, log bool) ([]*Message, []string) {
	if log {
		fmt.Println("Starting Read")
	}

	messages, members := ReadFilePooled(fileName + ".chat.txt")

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

	// writeFileDump(fileName+"Export.chat.txt", bundle)
	writeFile(fileName+"Export.chat.json", bundle)

	if log {
		fmt.Println("Completed Write")
	}
}

func check(bundle *Bundle, log bool) {
	if log {
		fmt.Println("Starting Check")
	}

	checkBundle(bundle)

	if log {
		fmt.Println("Completed Check")
	}
}
