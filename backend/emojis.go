package main

import (
	"log"

	"github.com/lovelydeng/gomoji"
)

func IsEmoji(char rune) bool {
	return gomoji.ContainsEmoji(string(char))
}

func GetEmoji(char rune) string {
	emoji, err := gomoji.GetInfo(string(char))

	if err != nil {
		log.Fatal(err)
	}

	return emoji.Character
}
