"use strict";
function Range(min, max, step) {
    const range = (mi) => (ma) => (ste) => {
        if ((ste < 0 && mi < ma) || (ste > 0 && mi > ma) || mi > ma)
            return "";
        if (mi == ma) {
            return String(ma);
        }
        return String(mi) + " " + range(mi + ste)(ma)(ste);
    };
    if (max == undefined)
        return range(0)(min)(1);
    if (step == undefined)
        return range(min)(max)(1);
    return range(min)(max)(step);
}
console.log(Range(10));
console.log(Range(10, 20));
console.log(Range(10, 20, -5));
//# sourceMappingURL=sample1.js.map