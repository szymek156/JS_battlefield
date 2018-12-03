class Person {
    dance() {
        return true;
    }
}

class Ninja extends Person {
    constructor(name, level) {
        super();
        let _age = 97;
        this._name = name;
        this.level = level;
    }

    swingSword() {
        return true;
    }

    get name() {
        console.log("inside getter");
        return this._name;
    }


    static compare(ninja1, ninja2) {
        return ninja1.level - ninja2.level;
    }
}


let ninja = new Ninja("asdf", 4);
ninja.name = "there is no setter, so should be ignored";
ninja.name1 = "dynamically created property";

console.log("old value ", ninja.name);
console.log("new property ", ninja.name1);

function Ninja() {
    let _skillLevel = 0;
    Object.defineProperty(this, 'skillLevel', {
        get: () => {
            report("The get method is called");
            return _skillLevel;
        },
        set: value => {
            report("The set method is called");
            _skillLevel = value;
        }
    });
}