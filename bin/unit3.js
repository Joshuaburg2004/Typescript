"use strict";
const prettyprintList = (l, cont) => {
    if (l.kind == "empty") {
        console.log("done");
    }
    else {
        cont(l.head);
        prettyprintList(l.tail, cont);
    }
};
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
            return emptyL;
        }
        emptyL = {
            kind: "list",
            head: liner.head,
            tail: emptyL
        };
        return inner(liner.tail)(emptyL);
    };
    return inner(l)(emptyList());
};
prettyprintList(rev(filledList(15, 12, 9, 6, 3)), console.log);
console.log("EX-3");
const append = (l1) => (l2) => {
    if (l1.kind == "empty") {
        return l2;
    }
    return {
        kind: "list",
        head: l1.head,
        tail: append(l1.tail)(l2)
    };
};
const l1 = filledList(1);
const l2 = filledList(2, 3);
prettyprintList(append(l1)(l2), console.log);
console.log("EX-4");
const nth = (n) => (l) => {
    const item = (index) => (list) => {
        if (index > n || list.kind == "empty") {
            return { kind: "none" };
        }
        if (index == n) {
            return { kind: "some", value: list.head };
        }
        return item(index + 1n)(list.tail);
    };
    return item(0n)(l);
};
console.log(nth(4n)(filledList(1, 2, 3, 4, 5, 6)));
console.log("EX-5");
const palindrome = (l) => {
    const inner = (curr) => (revl) => {
        if (curr.kind != "empty" && revl.kind != "empty") {
            if (curr.tail.kind == "empty") {
                return true;
            }
            if (curr.head == revl.head) {
                return inner(curr.tail)(revl.tail);
            }
            return false;
        }
        return true;
    };
    return inner(l)(rev(l));
};
console.log(palindrome(filledList(1, 2, 3, 4, 3, 2, 1)));
console.log(palindrome(filledList(1)));
console.log(palindrome(filledList(1, 3, 4, 3, 2, 1)));
console.log("EX-6");
const compress = (l) => {
    const inner = (curr) => (item) => {
        if (curr.kind == "empty") {
            return emptyList();
        }
        if (item.kind == "none" || item.value != curr.head) {
            return {
                kind: "list",
                head: curr.head,
                tail: inner(curr.tail)({ kind: "some", value: curr.head })
            };
        }
        return inner(curr.tail)(item);
    };
    return inner(l)({ kind: "none" });
};
prettyprintList(compress(filledList(1, 2, 3, 3, 4, 4, 5, 5, 5, 6, 2, 1, 0)), console.log);
// const caesarCypher = (l: List<string>) => ()
