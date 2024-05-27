"use strict";
const emptyList = () => ({
    kind: "empty"
});
const filledList = (...value) => {
    if (value.length == 0) {
        return { kind: "empty" };
    }
    return { kind: "list", head: value[0], tail: filledList(...value.slice(1)) };
};
const findIndex = (arr) => (k) => {
    const find = (i) => {
        if (i > arr.length - 1) {
            return -1;
        }
        if (arr[i] == k) {
            return i;
        }
        return find(i + 1);
    };
    return find(0);
};
const findValue = (arr) => (k) => {
    const inner = (index) => index >= arr.length ? { kind: "none" } : arr[index] == k ? { kind: "some", value: k } : inner(index + 1);
    return inner(0);
};
console.log(findIndex([1, 2, 3, 4, 5, 6, 7, 8])(-7));
console.log(findValue([1, 2, 3, 4, 5, 6, 7, 8])(-7));
console.log("EX-1");
const last = (l) => {
    if (l.kind == "empty") {
        return { kind: "none" };
    }
    else if (l.tail.kind == "empty") {
        return { kind: "some", value: l.head };
    }
    return last(l.tail);
};
console.log(last(emptyList()));
console.log(last(filledList(5)));
console.log(last(filledList(5, 12)));
console.log("EX-2");
const rev = (l) => {
    const inner = (liner) => (emptyL) => {
        if (liner.kind == "empty") {
            return emptyList();
        }
        if (liner.tail.kind != "empty") {
            emptyL = liner.tail;
            return {
                kind: "list",
                head: liner.tail.head,
                tail: emptyL
            };
        }
        return filledList(liner.head);
    };
    return inner(l)(emptyList());
};
console.log(rev(filledList(15, 12, 9, 6, 3)));
