package main

import (
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"sync"
)

type SyncMap[V any] struct {
	data  map[string]V
	mutex sync.RWMutex
}

func CreateMap[V any]() *SyncMap[V] {
	return &SyncMap[V]{data: map[string]V{}, mutex: sync.RWMutex{}}
}

func (m *SyncMap[V]) Load(key string) (V, bool) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	v, ok := m.data[key]
	return v, ok
}

func (m *SyncMap[V]) LoadInit(key string, init func() V) (V, bool) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	v, ok := m.data[key]

	if !ok {
		v = init()
		m.data[key] = v
	}

	return v, ok
}

func (m *SyncMap[V]) Store(key string, value V) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	m.data[key] = value
}

func (m *SyncMap[V]) Update(key string, update func(V) V) {
	m.mutex.Lock()
	defer m.mutex.Unlock()

	v := m.data[key]
	m.data[key] = update(v)
}

func (m *SyncMap[V]) Range(f func(key string, value V)) {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	for key, value := range m.data {
		f(key, value)
	}
}

func (m *SyncMap[V]) String() string {
	// return ""

	m.mutex.RLock()
	defer m.mutex.RUnlock()

	ordered := make([]string, 0, len(m.data))
	for key := range m.data {
		ordered = append(ordered, key)
	}
	sort.Strings(ordered)

	var builder strings.Builder
	builder.WriteString("[ ")

	for key, value := range m.data {
		builder.WriteString(fmt.Sprintf("(%v: %v) ", key, value))
	}

	builder.WriteString(" ]")
	return builder.String()
}

func (m *SyncMap[V]) StringCustom(toString func(string, V) string) string {
	m.mutex.RLock()
	defer m.mutex.RUnlock()

	ordered := make([]string, 0, len(m.data))
	for key := range m.data {
		ordered = append(ordered, key)
	}
	sort.Strings(ordered)

	var builder strings.Builder
	builder.WriteString("[ ")

	for key, value := range m.data {
		builder.WriteString(fmt.Sprintf("(%v: %v) ", key, toString(key, value)))
	}

	builder.WriteString(" ]")
	return builder.String()
}

func (m *SyncMap[V]) MarshalJSON() ([]byte, error) {
	return json.Marshal(m.data)
}
