package main

import "sync"

type Hashmap[T comparable] struct {
	data  map[T]struct{}
	mutex sync.RWMutex
}

func CreateHashmap[T comparable]() *Hashmap[T] {
	return &Hashmap[T]{map[T]struct{}{}, sync.RWMutex{}}
}

func (m *Hashmap[T]) Add(k T) {
	m.mutex.RLock()
	_, exists := m.data[k]
	m.mutex.RUnlock()

	if !exists {
		m.mutex.Lock()
		defer m.mutex.Unlock()
		m.data[k] = struct{}{}
	}
}

func (m *Hashmap[T]) ToSlice() []T {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	result := make([]T, 0, len(m.data))
	for key := range m.data {
		result = append(result, key)
	}

	return result
}
