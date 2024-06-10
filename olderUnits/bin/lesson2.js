"use strict";
// optional parameter
const square = (x) => {
    if (x == undefined)
        return undefined;
    return x * x;
};
console.log(square(125));
console.log(square(15));
function makeDate(dOrTimeStamp, m, y) {
    if (m !== undefined && y !== undefined) {
        return new Date(y, m, dOrTimeStamp);
    }
    else {
        return new Date(dOrTimeStamp);
    }
}
const d1 = makeDate(31122012);
const d2 = makeDate(20, 3, 2004);
// rest arguments
const multiplyMap = (n) => (...m) => {
    return m.map((x) => n * x);
};
console.log(multiplyMap(10)(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));
const sum = ({ a, b, c }) => {
    return a + b + c;
};
console.log(sum({ a: 10, b: 20, c: 15 }));
const multiply = ({ a, b, c }) => {
    return a * b * c;
};
console.log(multiply({ a: 10, b: 20, c: 15 }));
const thing = (...b) => {
    if (b.length > 1) {
        return b[0] * thing(...b.slice(1));
    }
    return b[0];
};
console.log(thing(5, 4, 3, 2));
//# sourceMappingURL=lesson2.js.map