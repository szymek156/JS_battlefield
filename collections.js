// let input = "fd 60 rt 120"

// // dir := fd | bk | rt | lt 
// let dir = /\b(fd|bk|rt|lt)\b/

// // move := dir number
// let move = /(\b[a-z]{2}\b) ([\d]+)/g

// // loop := 'repeat' number [tokens]
// let repeat = /repeat ([\d]+) (\[.*\])/


// let tokens = /(\b[a-z]{2}\b) ([\d]+)|(repeat ([\d]+) (\[.*\]))/g

// console.log(move.exec(input));
// console.log(move.exec(input));
// console.log(move.exec(input));
// console.log(move.exec(input));


// function upper(all, letter) {
//     return letter.toUpperCase();
// }

// let snake = "border-bottom-width";
// let camel = snake.replace(/-(\w)/g, upper);

// console.log(snake, camel);

// function test(str) {
//     str[0] = "A"
// }

// test(snake);

// console.log(snake);


let str = `Name ${ninja.name}
template strings are
multilined` // mozna wyciagac property z obiektow

const ninja = {
    name: "Yoshi",
    action: "skulk",
    weapon: "shuriken"
};

const {
    name,
    action,
    weapon
} = ninja;
// Object destructuring: we
// can assign each property
// to a variable of the same
// name, all at once.

const {
    name: myName,
    action: myAction,
    weapon: myWeapon
} = ninja;
// If necessary, we can explicitly
// name the variables to which
// we want to assign values.


const ninjas = ["Yoshi", "Kuma", "Hattori"];
const [firstNinja, secondNinja, thirdNinja] = ninjas;
const [, , third] = ninjas;
const [first, ...remaining] = ninjas; // remaing is an array


// Old way
const name = "Yoshi";
const oldNinja = {
    name: name,
    getName: function () {
        return this.name;
    }
};
oldNinja["old" + name] = true;

// New way
const newNinja = {
    name, // same as name: name
    getName() { // same as getName: function()...
        return this.name;
    },
    ["new" + name]: true // dynamically created property can 
    //be done inside literal
};

setTimeout(function repeatMe() {
    /* Some long block of code... */
    setTimeout(repeatMe, 10);
}, 10);

setInterval(() => {
    /* Some long block of code... */
}, 10);