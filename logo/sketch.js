let editor;
let turtle;

function setup() {
    editor = select("#code");
    editor.input(goTurtle);

    createCanvas(400, 400);
    angleMode(DEGREES);
    background(0);

    goTurtle();
}

function draw() {
}

function goTurtle() {
    push();
    background(0);
    

    turtle = new Turtle(200, 200, 0);
    let tokens = editor.value().split(" ");
    let reg = editor.value().match(/([a-z]{2}) ([0-9]*)/g)

    console.log(reg[0].match(/([a-z][a-z])([0-9][0-9]?)/g));
    let i = 0;
    while (i < tokens.length) {
        let instruction = tokens[i++];
        let value = tokens[i++];
        
        if (instruction && value) {
            commands[instruction](value);
        }
    }

    pop();
}
