console.time("start");

let arr = [4, 5, 3, 6, 3, 2, 4];

arr.sort((v1, v2) => {
    return v1 < v2
});

console.log(`sorted array ${arr}`)

console.timeEnd("start");


function isPrime(value) {
    if (!isPrime.answers) {
        isPrime.answers = {};
    }
    if (isPrime.answers[value] !== undefined) {
        return isPrime.answers[value];
    }
    var prime = value !== 1; // 1 is not a prime

    for (var i = 2; i < value; i++) {
        if (value % i === 0) {
            prime = false;
            break;
        }
    }
    return isPrime.answers[value] = prime;
}


console.log("immediate function ", (x => x * 2)(6));


function multiMax(first, ...remainingNumbers) {

    console.log(first, remainingNumbers);
    return first * remainingNumbers.sort((a, b) => b - a)[0];
}

var samurai = (() => "Tomoe")();
var ninja = (() => {
    return "Yoshi"
})();

console.log("olaboga ", multiMax(2, 5));



function getNinjaWieldingWeapon(ninja, weapon = "katana") {
    // console.log("this is ", this)
    katana = "twoja stara"
    return ninja + " " + katana;
}
var message1 = getNinjaWieldingWeapon("Yoshi");
var message2 = getNinjaWieldingWeapon("Yoshi", "wakizashi");

//var katana;

console.log(message1, message2);

function whatever(a, b, c) {
    arguments.length == 5;
    arguments[0] === a;
}

whatever(1, 2, 3, 4, 5)

var peasant = {
    oneProp: false,
    secondProp: "true"
};
"use strict";

function Ninja() {
    this.objProperty = "some value";

    return 1;
    //return peasant;
}


var value = Ninja(); // zwroci 1

console.log(objProperty); // objProperty utworzony w global

var ninja = new Ninja() // zwroci obiekt z property, bo wywolane z new 

var who = new Ninja() // zwroci peasant, jest odkomentowane w ctorze

var ninjitsu = {
    lul: false
};
console.log(ninjitsu.lul);

function juggle() {
    var result = 0;
    for (var n = 0; n < arguments.length; n++) {
        result += arguments[n];
    }
    this.result = result;
}
var ninja1 = {};
var ninja2 = {};
juggle.apply(ninja1, [1, 2, 3, 4]);
juggle.call(ninja2, 5, 6, 7, 8);