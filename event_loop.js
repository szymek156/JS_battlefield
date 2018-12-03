
// let longComputation = 1000000000;
// const chunks = 10;
// let batch = longComputation / chunks
// let iteration = 1;

// let timer = setTimeout(
//     function processChunk() {
//         let start = (iteration - 1) * batch;
//         let end = start + batch;

//         console.log(`decoupled task, processing ${start} - ${end}`);

//         for (let i = start; i < end; i++) {;
//         }

//         if (iteration < chunks) {
//             setTimeout(processChunk, 0);
//         }

//         iteration++;
//     }, 0)

// outerContainer.addEventListener("click", function (event) {
//     report("innerContainer handler");
//     assert(this === outerContainer,
//         "This refers to the outerContainer");
//     assert(event.target === innerContainer,
//         "event.target refers to the innerContainer");
// });

const iterations = 5;
let iteration = 0;

let interval = setInterval(
    () => {
        console.log("small task, can I?");
        iteration++;

        if (iteration > iterations) {
            clearInterval(interval);
            clearInterval(render);
        }
    }, 0);

let render = setInterval(
    () => console.log("render event, can I?"), 0);


function wait() {
    for (let i = 0; i < 1000000000; i++) {;}
}

let prom = new Promise(function (resolve, reject) {
    console.log("hello from promise executor");
    wait();
    
    resolve();
});


prom.then(function() {
    console.log("then 1 from promise");
    wait();
    
    })
    .then(function() {
        console.log("then 2 from promise");
        wait();

    });

function waitForMe(val) {
    console.log("waitForMe ", val);
    wait(); 
    return val;
}
async function testo() {
    let a = await waitForMe("a");
    let b = await waitForMe("b");
    let c = await waitForMe("c");
    let d = await waitForMe("d");

    console.log(a,b,c,d);
}

testo();

function *gen() {
    let counter = 0;

    while (counter++ < 5) {
        yield counter;
    }
}

const iter = gen();

for (val of iter) {
    console.log(`val from gen ${val}`);
}


