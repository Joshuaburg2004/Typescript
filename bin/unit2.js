"use strict";
const getRandom = (min) => (max) => Math.floor(Math.random() * (max - min) + min);
console.log("============EX-1============");
const pointFactoryVars = (x) => (y) => ({
    Position: [x, y]
});
const PointFactoryRandom = (min) => (max) => ({
    Position: [getRandom(min)(max), getRandom(min)(max)]
});
console.log(pointFactoryVars(5)(10));
console.log(PointFactoryRandom(10)(20));
