"use strict";
console.log("EX-1");
const foldList = (z) => f => l => l.kind == "empty" ? z : f(l.head)(foldList(z)(f)(l.tail));
