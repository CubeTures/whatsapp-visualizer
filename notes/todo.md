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
    -   Links by source
    -   Real day counts
        -   Counts for every day messaged
        -   See the count by year, be able to go into that year and see counts by month for that year, etc. until hour of the day

-   Per person stretch

    -   Most messages/words/letters in an hour/day (and date)
    -   First messages (after 6 hour period of inactivity, who messages first?)
    -   Number of misspellings
    -   Average misspellings per message

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

# Pages

-   Landing page
    -   WhatsApp logo, upload button
-   Overall
    -   Show overall statistics (aggregate, all time)
    -   All count pie charts
    -   Counts by Time
-   By Date
    -   Scrub a top bar that allows you to choose a more specific date (brush)
    -   Links to large points to quickly jump to
        -   Year then month then day then hour
-   Exact
    -   Top frequencies
    -   Longest messages
    -   Word search
        -   See how many times a specific word (and similar words) were used
        -   Get a random word or phrase and how many times it was used

# TODO

-   Info as (i) button
-   lengths in frequency carousel
-   Averages for stacked bars
-   Phrases case insensitive
    -   Make display for frequencies capitalized
-   Sidebar for toggling people, total vs averages, and metric
-   Timestamp for longest message
-   Timestamp logs instead of just count for frequencies
-   Remove aggregate

-   svelte ui
    -   Aggregate comparison
        -   Pie Charts
            -   ~~All counts~~
            -   Unique frequencies
            -   ~~Averages~~
        -   Lists
            -   Longest messages
            -   Top frequencies
        -   Stacked Bar Charts
            -   ~~Count by times (show words, emojis, links, deleted, edited, media, etc.)~~
        -   Expandable Sankey
            -   Exact times
        -   Multiline Charts
            -   Exact times
    -   Tabs for each person + aggregate
        -   Raw data
        -   Word comparison
            -   Type a word and see how many words have also been said the same amount of times
