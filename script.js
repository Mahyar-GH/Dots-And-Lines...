// SVG Containing Dots
const board = document.getElementById("board");
const namespace = "http://www.w3.org/2000/svg";
const shadows = {
    circle: board.firstElementChild,
    line: board.lastElementChild,
};
const Dots = [];
const Lines = [];

let clickingDot = false;
let prevLine = false;

function dotOnPos(x, y) {
    for (let dot of Dots) {
        const xRange = Math.abs(dot.cx.baseVal.value - x);
        const yRange = Math.abs(dot.cy.baseVal.value - y);
        if (xRange < 15 && yRange < 15) {
            return dot;
        }
    }
}

function reamoveUnnessecary({x1, y1, x2, y2}) {
    Lines.forEach((line, i) => {
        const opposite = (
            line.x1.baseVal.value === x2.baseVal.value &&
            line.y1.baseVal.value === y2.baseVal.value &&
            line.x2.baseVal.value === x1.baseVal.value &&
            line.y2.baseVal.value === y1.baseVal.value
        );
        const same = (
            line.x1.baseVal.value === x1.baseVal.value &&
            line.y1.baseVal.value === y1.baseVal.value &&
            line.x2.baseVal.value === x2.baseVal.value &&
            line.y2.baseVal.value === y2.baseVal.value
        );
        const zeroLine = (
            line.x1.baseVal.value === line.x2.baseVal.value &&
            line.y1.baseVal.value === line.y2.baseVal.value
        );

        if ((i !== Lines.length - 1) && (same || opposite) || zeroLine) {
            Lines[i].remove();
            Lines[i] = null;
        }
    })
    for (i in Lines) {
        if (!Lines[i]) {
            Lines.splice(i,1);
        }
    }
}

function makeDot(e) {
    if (e.button) return;

    let isLastDot = false, dotHovered = false;
    let x = e.clientX;
    let y = e.clientY;


    if (prevLine) {
        if (e.shiftKey) {
            const distance = {
                h: Math.abs(prevLine.x1.baseVal.value - x),
                v: Math.abs(prevLine.y1.baseVal.value - y)
            }
            if (distance.h < distance.v) {
                x = prevLine.x1.baseVal.value;
            }
            else {
                y = prevLine.y1.baseVal.value;
            }
        } else {
            dotHovered = dotOnPos(x, y);
            isLastDot = Dots[Dots.length - 1] === dotHovered;
            if (dotHovered) {
                x = dotHovered.cx.baseVal.value;
                y = dotHovered.cy.baseVal.value;
            }
        }
    }


    if (!dotHovered) {
        const newDot = document.createElementNS(namespace, "circle");
        newDot.setAttribute("cx", x);
        newDot.setAttribute("cy", y);
        board.appendChild(newDot);
        Dots.push(newDot);
    }
    
    
    

    const newLine = document.createElementNS(namespace, "line");
    newLine.setAttribute("x1", x);
    newLine.setAttribute("y1", y);
    newLine.setAttribute("x2", x);
    newLine.setAttribute("y2", y);

    if (prevLine) {
        if (isLastDot || e.type === "mouseup") {
            prevLine.setAttribute("x2", x);
            prevLine.setAttribute("y2", y);
            reamoveUnnessecary(prevLine);
        } else {
            Lines.splice(-1, 1);
            prevLine.remove();
            prevLine = false;
        }
    }

    prevLine = newLine;

    board.appendChild(newLine);
    Lines.push(newLine);


    //======================================//
    shadows.circle.toggleAttribute("show");
    shadows.line.toggleAttribute("show");
    clickingDot = (clickingDot)? false : true;
}

board.addEventListener("mousedown", makeDot);
board.addEventListener("mouseup", makeDot);

board.addEventListener("mousemove", function(e) {
    if (!clickingDot || !prevLine) return;
    let x = e.clientX;
    let y = e.clientY;


    if (e.shiftKey) {
        const distance = {
            h: Math.abs(prevLine.x1.baseVal.value - x),
            v: Math.abs(prevLine.y1.baseVal.value - y)
        }
        if (distance.h < distance.v) {
            x = prevLine.x1.baseVal.value;
        }
        else {
            y = prevLine.y1.baseVal.value;
        }
    } else {
        const dotHovered = dotOnPos(x, y);
        if (dotHovered) {
            x = dotHovered.cx.baseVal.value;
            y = dotHovered.cy.baseVal.value;
        }
    }



    shadows.circle.setAttribute("cx", x);
    shadows.circle.setAttribute("cy", y);

    const line = shadows.line;
    line.setAttribute("x1", prevLine.x1.baseVal.value);
    line.setAttribute("y1", prevLine.y1.baseVal.value);
    line.setAttribute("x2", x);
    line.setAttribute("y2", y);
});