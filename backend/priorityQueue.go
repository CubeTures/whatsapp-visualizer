package main

import (
	"container/heap"
	"encoding/json"
	"fmt"
	"slices"
	"strings"
)

type PriorityQueue[T any] struct {
	pq  *PQ[T]
	cap int
}

func CreateQueue[T any](capacity int) *PriorityQueue[T] {
	return &PriorityQueue[T]{pq: &PQ[T]{}, cap: capacity}
}

func (pq *PriorityQueue[T]) Push(value T, priority int) {
	item := CreateItem(value, priority)
	heap.Push(pq.pq, item)
}

func (pq *PriorityQueue[T]) Pop() T {
	item := heap.Pop(pq.pq).(*Item[T])
	return item.value
}

func (pq *PriorityQueue[T]) Peek() (value T, priority int) {
	item := pq.pq.Peek().(*Item[T])
	if item == nil {
		return value, priority
	}

	return item.value, item.Priority
}

func (pq *PriorityQueue[T]) Len() int {
	return pq.pq.Len()
}

func (pq *PriorityQueue[T]) PushIfLowerPriority(value T, priority int) bool {
	if pq.Len() < pq.cap {
		pq.Push(value, priority)
	} else if pq.Len() == pq.cap {
		_, p := pq.Peek()
		if p < priority {
			pq.Pop()
			pq.Push(value, priority)
		} else {
			return false
		}
	}

	return true
}

func (a *PriorityQueue[T]) Join(b *PriorityQueue[T]) {
	b.Range(func(priority int, value T) {
		a.PushIfLowerPriority(value, priority)
	})
}

func (pq *PriorityQueue[T]) Range(f func(priority int, value T)) {
	for _, item := range *(pq.pq) {
		f(item.Priority, item.value)
	}
}

func (pq *PriorityQueue[T]) String() string {
	var slice []*Item[T] = *(pq.pq)
	slices.SortFunc(slice, func(a, b *Item[T]) int {
		return a.Priority - b.Priority
	})

	var builder strings.Builder
	builder.WriteString("[ ")

	for _, item := range slice {
		builder.WriteString(fmt.Sprintf("(%v: %v) ", item.Priority, item.value))
	}

	builder.WriteString("]")
	return builder.String()
}

func (pq *PriorityQueue[T]) MarshalJSON() ([]byte, error) {
	return json.Marshal(*(pq.pq))
}

type Item[T any] struct {
	value    T
	Priority int `json:"length"`
	index    int
}

func (i *Item[T]) MarshalJSON() ([]byte, error) {
	// Marshal the Value field
	valueBytes, err := json.Marshal(i.value)
	if err != nil {
		return nil, err
	}

	// Unmarshal Value into a map to flatten it
	var valueMap map[string]interface{}
	if err := json.Unmarshal(valueBytes, &valueMap); err != nil {
		return nil, err
	}

	// Create the base map for the rest of the fields
	baseMap := map[string]interface{}{
		"length": i.Priority,
	}

	// Merge Value fields into the base map
	for k, v := range valueMap {
		baseMap[k] = v
	}

	// Marshal the combined map to JSON
	return json.Marshal(baseMap)
}

func CreateItem[T any](value T, priority int) *Item[T] {
	return &Item[T]{value: value, Priority: priority, index: -1}
}

type PQ[T any] []*Item[T]

func (pq PQ[T]) Len() int { return len(pq) }

func (pq PQ[T]) Less(i, j int) bool {
	return pq[i].Priority < pq[j].Priority
}

func (pq PQ[T]) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
	pq[i].index = i
	pq[j].index = j
}

func (pq *PQ[T]) Push(x any) {
	n := len(*pq)
	item := x.(*Item[T])
	item.index = n
	*pq = append(*pq, item)
}

func (pq *PQ[T]) Pop() any {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil
	item.index = -1
	*pq = old[0 : n-1]
	return item
}

func (pq *PQ[T]) Peek() any {
	if pq.Len() == 0 {
		return nil
	}

	return (*pq)[0]
}
