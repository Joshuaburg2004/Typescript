"use strict";
const aggregate = (reducer) => (begin) => (end) => {
    const loop = (i) => {
        if (i > end)
            return 0;
        return reducer(i)(loop(i + 1));
    };
    return loop(begin);
};
const reducer = (a) => b => a + b;
console.log(reducer(1)(reducer(2)(reducer(3)(4))));
console.log(reducer(4)(reducer(3)(reducer(2)(1))));
console.log(aggregate(reducer)(1)(4));
console.log(aggregate((a) => b => a + b)(1)(4));
//# sourceMappingURL=sample2.js.map