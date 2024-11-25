package main

import (
	"encoding/json"
	"os"
	"strings"
)

func writeFileDump(fileName string, bundle *Bundle) {
	var builder strings.Builder

	builder.WriteString(bundle.Aggregate.String())

	builder.WriteString(bundle.Personal.StringCustom(func(person string, stat *Statistics) string {
		return stat.String()
	}))

	os.WriteFile(fileName, []byte(builder.String()), 0644)
}

func writeFile(fileName string, bundle *Bundle) {
	b, err := json.Marshal(bundle)

	if err != nil {
		panic(err)
	}

	os.WriteFile(fileName, b, 0644)
}
