# Statistics

-   Per person

    -   Message count by time of day, day of week, month, year
    -   Message, word, letter, emoji, video, image, link counts
    -   Most common phrase, word, emoji
        -   Phrase is any message less than 5 words
    -   Longest message word length
    -   Average words per message
    -   Average emojis per message
    -   Total unique words / emojis

-   Per person stretch

    -   Links by source
    -   Most messages/words/letters in an hour/day (and date)
    -   First messages (after 6 hour period of inactivity, who messages first?)
    -   Number of misspellings
    -   Average misspellings per message
    -   Real day counts
        -   Counts for every day messaged
        -   See the count by year, be able to go into that year and see counts by month for that year, etc. until hour of the day

-   Bundled statistics

    -   Total words for everyone
    -   Total unique words for everyone
    -   Average misspellings for everyone
    -   etc.

-   Inspiration

    -   [ChatAnalytics](https://chatanalytics.app/demo)

# Tokenization

-   Split into message struct
    -   date and time
    -   sender
    -   message
        -   words

# Fixes

-   svelte ui
    -   Word comparison
        -   Type a word and see how many words have also been said the same amount of times
