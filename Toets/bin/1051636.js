"use strict";
console.log("Excercise one: ");
const Factors = (n) => {
    const factors = (curr) => (ToReturn = '') => {
        if ((n == curr || n < curr) && ToReturn == '1') {
            return '';
        }
        else if (n == curr || n < curr) {
            return ToReturn + " " + n;
        }
        else if (curr == 1) {
            return factors(curr + 1)('1');
        }
        else if (n % curr == 0) {
            return factors(curr + 1)(ToReturn + " " + curr);
        }
        return factors(curr + 1)(ToReturn);
    };
    return factors(1)('');
};
console.log(Factors(77));
console.log(Factors(64));
console.log(Factors(11));
console.log("Excercise two: ");
const repeat = (symbol) => (times) => {
    if (times == 1) {
        return symbol;
    }
    return symbol + repeat(symbol)(times - 1);
};
const Shape2D = ([rows, cols]) => ({
    rows: rows,
    columns: cols,
    draw(symbols = "*") {
        return;
    }
});
const box = Shape2D([2, 3]);
console.log(box.draw());
console.log("Excercise three: ");
const addToBranch = (input) => (tmp) => {
};
