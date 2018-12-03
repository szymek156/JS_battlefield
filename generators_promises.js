// function sleep(where) {
//     console.log("sleeeep " + where);
//     for (let i = 0; i < 10 * 1000 * 1000 * 1000 / 2; i++) {
//         ;
//     }
// }


// function getJSON(url) {
//     const promise = new Promise((resolve, reject) => {
//         console.log("hello from promise ", url);

//         sleep(url);
//         resolve(url);// async call
//         sleep(url);
//     });

//     return promise;
// }


// function* EvenGenerator() { let num = 2; while (true) { yield num; num = num + 2; } }
// let generator = EvenGenerator();
// let a1 = generator.next().value; let a2 = generator.next().value; let a3 = EvenGenerator().next().value; let a4 = generator.next().value;

// console.log(a1, a2, a3, a4)

// function* NinjaGenerator() {
//     yield "Yoshi";   // zwroci {value: "Yoshi", done: false}
//     yield "Hattori"; // zwroci {value: "Hattori", done: true}
//     yield "Hanzo"; // nigdy sie nie wykona
// }

// var ninjas = [];
// for (let ninja of NinjaGenerator()) {
//     ninjas.push(ninja);
// }

// console.log(ninjas)


// function* Gen(val) {
//     val = yield val * 2;
//     yield val;
// }

// let generator = Gen(2);
// let a1 = generator.next(3).value;
// let a2 = generator.next(4).value

// console.log(a1, a2)

// const promise = new Promise((resolve, reject) => {
//     resolve("hattori");
//     reject("Hattori");
// });

// promise.then(val => { throw "olaboga"; })
//     .catch(e => console.log("Error: " + e))



// function isPrime(number) {
//     if (number < 2) { return false; }
//     for (let i = 2; i < number; i++) {
//         if (number % i === 0) { return false; }
//     }
//     return true;
// }
// isPrime = new Proxy(isPrime, {
//     apply: (target, thisArg, args) => {
//         console.time("isPrime");
//         const result = target.apply(thisArg, args);
//         console.timeEnd("isPrime");
//         return result;
//     }
// });
// isPrime(1299827);

const ninjas = [
    { name: "Yagyu", weapon: "shuriken" },
    { name: "Yoshi" },
    { name: "Kuma", weapon: "wakizashi" }
];

const ninjaShallowCopy = ninjas.find(ninja => ninja.name === "Kuma");
ninjaShallowCopy.name = "RUTKOWSKI"

const arr = ninjas.filter(ninja => "weapon" in ninja);
arr[0].weapon = "CHANGED"

console.log(ninjas)
console.log(ninjaShallowCopy)


if (1) {
    console.log("false");
} else {
    console.log("true");
}
