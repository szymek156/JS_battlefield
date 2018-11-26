const assert = require('assert');

// var ninja1 = {
//     whoAmI: function () {
//         return this;
//     }
// };
// var ninja2 = {
//     whoAmI: ninja1.whoAmI
// };
// var identify = ninja2.whoAmI;
// assert(ninja1.whoAmI() === ninja1, "ninja1");
// assert(ninja2.whoAmI() === ninja2, " ninja2");
// assert(identify() === global, "global");
// assert(ninja1.whoAmI.call(ninja2) === ninja2, "ninja2 ");

// /////////////////////////////
// function whoAmI1() {
//     "use strict";
//     return this;
// }

// function whoAmI2() {
//     return this;
// }
// assert(whoAmI1() === undefined, "undefined");
// assert(whoAmI2() === global, "global");

///////////////////
// function Ninja() {
//     this.whoAmI = () => this; // arrow function will remember,
//     // context
// }
// // Creating by ctor, this is ninja1
// var ninja1 = new Ninja();

// // Creating by literal, this is ninja2, but inside whoAmI is ninja1, 
// // because whoAmI is arrow function
// var ninja2 = {
//     whoAmI: ninja1.whoAmI,
//     whoAmI2: function () {
//         return this;
//     }
// };
// assert(ninja1.whoAmI() === ninja1, "ninja1 here");
// assert(ninja2.whoAmI() === ninja1, "ninja1 here");
// assert(ninja2.whoAmI2() === ninja2, "ninja2 here");
////////////////////////////

// var button = {
//     clicked: false,
//     click: () => {
//         this.clicked = true;
//         assert(button.clicked, "The button has been clicked"); // FALSE
//         //console.log(this);

//         // Asserts will pass, when click invoked as callback
//         assert(this === global, "In arrow function this === window");
//         assert(global.clicked, "Clicked is stored in window");
//     }
// }

// button.click();
// tutaj this jest:
// { clicked: true } cokolwiek to znaczy

///////////////////////////////////////////////
{
    function Ninja() {
        this.whoAmI = function () {
            return this;
        }.bind(this);
    }
    let ninja1 = new Ninja();
    let ninja2 = {
        whoAmI: ninja1.whoAmI
    };
    assert(ninja1.whoAmI() === ninja1, "ninja1 here");
    assert(ninja2.whoAmI() === ninja1, "ninja1 here");
}
////////////////////////////////////////////////
{
    function Ninja() {
        this.whoAmI = function () {
            return this;
        }
    } // NO BIND

    let ninja1 = new Ninja();
    let ninja2 = {
        whoAmI: ninja1.whoAmI
    };
    assert(ninja1.whoAmI() === ninja1, "ninja1 here");
    assert(ninja2.whoAmI() === ninja2, "ninja2 here");
}



// tworzymy global context
// step 2 przeszukaj funkcje - znalazl function fun, zarejestruj
// step 3 przeszukaj zmienne, znajdzie fun = 3, ale fun juz jest 
// zarejestrowany dla funkcji, wiec nie winduje (nie przypisuje zmiennej 
// jako undefined)
// wykonanie kodu assert

assert(typeof fun === "function", "We access the function");
// assert widzi fun jako funkcje

var fun = 3;
// wykonanie kodu, fun jest zarejestrowany jako zmienna z wartoscia 3

assert(typeof fun === "number", "Now we access the number");
// assert widzi fun jako liczbe

function fun(){}
// kod sie nie wykonuje, to tylko deklaracja, nie ma tworzenia kontekstu,
// linia jest pomijana

assert(typeof fun === "number", "Still a number");
// assert widzi fun jako liczbe

fun(); // error nie ma takiej funkcji