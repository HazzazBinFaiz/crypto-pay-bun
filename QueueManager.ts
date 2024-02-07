

class QueueManager <T extends {}>{
    timeout: number;
    maxCall: number;
    queue: T[];
    #timeoutId: NodeJS.Timeout;
    #processor: (tasks: T[]) => any

    constructor(processor: (tasks: T[]) => any, timeout?: number, maxCall?: number) {
        this.timeout = timeout ?? 1000;
        this.maxCall = maxCall ?? 10;
        this.#timeoutId = setTimeout(this.processQueue.bind(this), 1000);
        this.queue = [];
        this.#processor = processor;
    }

    processQueue() {
        this.#timeoutId = setTimeout(this.processQueue.bind(this), 1000);
        setTimeout(this.#processor, 1, [...this.queue]);
        this.queue = [];
    }

    enqueue(task: T) {
        this.queue.push(task);
        if (this.queue.length >= this.maxCall) {
            if (this.#timeoutId) clearTimeout(this.#timeoutId);
            this.processQueue();
        }
    }
}

export default QueueManager