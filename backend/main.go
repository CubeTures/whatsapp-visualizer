package main

import (
	"encoding/json"
	"fmt"
	"syscall/js"
)

func main() {
	done := make(chan struct{}, 0)

	js.Global().Set("BundleFile", js.FuncOf(BundleFile))
	js.Global().Set("Parse", js.FuncOf(Parse))
	js.Global().Set("Analyze", js.FuncOf(Analyze))
	js.Global().Set("Write", js.FuncOf(Write))

	<-done
}

func BundleFile(this js.Value, args []js.Value) interface{} {
	text := args[0].String()

	js.Global().Set("BundleStatus", js.ValueOf("Parsing Chat"))
	messages, members := read(text, false)

	js.Global().Set("BundleStatus", js.ValueOf("Analyzing Chat"))
	bundle := bundle(messages, members, false)

	js.Global().Set("BundleStatus", js.ValueOf("Bundling Analyzed Data"))
	bytes, err := json.Marshal(bundle)

	if err != nil {
		panic(err)
	}

	js.Global().Set("BundleStatus", js.ValueOf("Returning Bundled Data"))
	return js.ValueOf(string(bytes))
}

func Parse(this js.Value, args []js.Value) interface{} {
	return js.ValueOf(nil)
}

func Analyze(this js.Value, args []js.Value) interface{} {
	return js.ValueOf(nil)
}

func Write(this js.Value, args []js.Value) interface{} {
	return js.ValueOf(nil)
}

func localFile(fileName string) {
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

	messages, members := ReadFileSequential(fileName + ".chat.txt")

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
