package main

import "sync"

type WorkerPool struct {
	numWorkers int
	tasks      chan []interface{}
	group      sync.WaitGroup
	closure    func(id int, args ...interface{})
}

func CreatePool(poolSize, numTasks int, function func(id int, args ...interface{})) *WorkerPool {
	pool := WorkerPool{poolSize, make(chan []interface{}, numTasks), sync.WaitGroup{}, function}

	for i := 0; i < poolSize; i++ {
		go pool.Work(i)
	}

	return &pool
}

func (pool *WorkerPool) Work(id int) {
	for args := range pool.tasks {
		pool.closure(id, args...)
		pool.group.Done()
	}
}

func (pool *WorkerPool) SubmitTask(args ...interface{}) {
	pool.group.Add(1)
	pool.tasks <- args
}

func (pool *WorkerPool) CompleteTasks() {
	close(pool.tasks)
	pool.group.Wait()
}
