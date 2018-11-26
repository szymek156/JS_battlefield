class Turtle {
    constructor(x, y, angle) {
        translate(x, y);
        rotate(angle);
        this.pen = true;
    }

    move(amount) {
        if (this.pen) {
            stroke(255);
            strokeWeight(2);
            line(0, 0, amount, 0);
        }

        translate(amount, 0);
    }
    
    turn(angle) {
        rotate(angle);
    } 
}

const commands = {
    "fd" : function(amnt) {
        turtle.move(amnt);
    },
    "bd" : function(amnt) {
        turtle.move(-amnt);
    },
    "rt" : function(amnt) {
        turtle.turn(amnt);
    },
    "lt" : function(amnt) {
        turtle.turn(-amnt);
    },
    "pu" : function() {
        turtle.pen = false;
    },
    "pd" : function() {
        turtle.pen = true;
    }
}