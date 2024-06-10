"use strict";
console.log("EX-1");
const foldList = (z) => f => l => l.kind == "empty" ? z : f(l.head)(foldList(z)(f)(l.tail));
const map = (l) => (f) => {
    if (l.kind == "empty") {
        return { kind: "empty" };
    }
    return {
        kind: "full",
        head: f(l.head),
        tail: map(l.tail)(f)
    };
};
