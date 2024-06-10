"use strict";
console.log("EX-1");
const allNumber = (n) => {
    const allnumber = (i) => {
        if (n == i)
            return String(n);
        return i + " " + allnumber(i + 1);
    };
    return allnumber(0);
};
console.log(allNumber(7));
console.log("EX-2");
const allRevNumber = (n) => {
    const allnumber = (i) => {
        if (n == i)
            return String(n);
        return allnumber(i + 1) + " " + i;
    };
    return allnumber(0);
};
console.log(allRevNumber(7));
console.log("EX-3");
const allNumberRange = (lower) => (upper) => {
    const allnumber = (n) => (i) => {
        if (n == i)
            return String(n);
        return i + " " + allnumber(n)(i + 1);
    };
    return allnumber(upper)(lower);
};
console.log(allNumberRange(5)(15));
console.log("EX-4");
const allNumberRangeRev = (lower) => (upper) => {
    // if(n == lower - 1){
    //     return ""
    // }
    // const allnumber = allNumber(n - 1)
    // if(allnumber == ""){
    //     return String(n)
    // }
    // return String(n) + " " + allnumber
    const allnumber = (n) => (i) => {
        if (n == i)
            return String(n);
        return allnumber(n)(i + 1) + " " + i;
    };
    return allnumber(upper)(lower);
};
console.log(allNumberRangeRev(5)(15));
console.log("EX-5");
const allEvenRange = (lower) => (upper) => {
    const allnumber = (n) => (i) => {
        if (n == i) {
            if (i % 2 == 0)
                return String(n);
            return "";
        }
        else {
            if (i % 2 == 0)
                return i + " " + allnumber(n)(i + 1);
            return allnumber(n)(i + 1);
        }
    };
    return allnumber(upper)(lower);
};
console.log(allEvenRange(0)(15));
console.log("EX-6");
const drawLine = (length) => {
    const drawline = (l) => (cnt) => {
        if (cnt == l)
            return "";
        return "*" + drawline(l)(cnt + 1);
    };
    return drawline(length)(0);
};
console.log(drawLine(15));
console.log("EX-7");
const drawSymbols = (symbol) => (length) => {
    if (symbol.length == 1) {
        const drawsymbols = (s) => (l) => (cnt) => {
            if (cnt == l)
                return "";
            return drawsymbols(s)(l)(cnt + 1) + s;
        };
        return drawsymbols(symbol)(length)(0);
    }
    return "";
};
console.log(drawSymbols("H")(10));
console.log("EX-8");
const toBinary = (n) => {
    if (n < 0)
        return "";
    const tobinary = (n) => {
        if (n == 1)
            return "1";
        return toBinary(Math.floor(n / 2)) + String(n % 2);
    };
    return tobinary(n);
};
console.log(toBinary(15));
console.log("EX-9");
const toBase = (n) => (base) => {
    if (n < 0)
        return "";
    const tobase = (n) => {
        if (n < 5)
            return `${n}`;
        return tobase(Math.floor(n / base)) + String(n % base);
    };
    return tobase(n);
};
console.log(toBase(15)(5));
//# sourceMappingURL=app.js.map