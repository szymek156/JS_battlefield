
let logUpdate = require("log-update");

// Mine so so version
// class PromiseQueue {
//     constructor(tasks = [], toRunConcurently = 1) {
//         this.todo       = tasks;
//         this.doing      = [];
//         this.done       = [];
//         this.concurrent = toRunConcurently;
//     }

//     run() {
//         while (this.doing.length < this.concurrent && this.todo.length > 0) {
//             let job = this.todo.shift();
//             this.doing.push(job);

//             let promise = Promise.resolve().then(() => {
//                 const {task, args = []} = job;

//                 console.log("queing a task");

//                 task(...args);
//                 this.done.push(this.doing.shift());
//                 this.run();
//             });
//         }
//     }
// }

// function job(seconds) {
//     console.log(`Job running for ${seconds} started`);
//     setTimeout(function() {
//         console.log(`Job running for ${seconds} finished`);
//     }, seconds * 1000);
// }

// tasks = [
//     {task: job, args: [1]}, {task: job, args: [0]}, {task: job, args: [5]}, {task: job, args:
//     [3]}, {task: job, args: [6]}, {task: job, args: [4]}, {task: job, args: [10]}
// ];

// let queue = new PromiseQueue(tasks, 2);

// queue.run();
/////////////////////////////////////////////////////////

var delay = (seconds) => new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
});


class PromiseQueue {
    constructor(promises = [], concurrentCount = 1) {
        this.concurrent = concurrentCount;
        this.total      = promises.length;
        this.todo       = promises;
        this.running    = [];
        this.complete   = [];
    }

    get runAnother() {
        return (this.running.length < this.concurrent) && this.todo.length;
    }

    graphTasks() {
        var {todo, running, complete} = this;

        logUpdate(`
        todo:     [${todo.map(toX)}]    
        running:  [${running.map(toX)}]
        complete: [${complete.map(toX)}]
        `);
    }

    run() {
        while (this.runAnother) {
            let promise = this.todo.shift();

            promise.then(() => {
                this.complete.push(this.running.shift());
                this.graphTasks();
                this.run();
            });

            this.running.push(promise);
            this.graphTasks();
        }
    }
}

var tasks = [delay(4), delay(1), delay(3), delay(8), delay(2), delay(0), delay(8)];

var delayQueue = new PromiseQueue(tasks, 2);
delayQueue.run();

function toX() {
    return "X";
}