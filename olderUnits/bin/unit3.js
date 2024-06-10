"use strict";
const Fun = (f) => Object.assign(f, {
    then: function (g) {
        return Fun(a => g(this(a)));
    }
});
const prettyprintList = (l, cont) => {
    if (l.kind == "empty") {
        return;
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
            if (curr.tail.kind == "empty" && revl.tail.kind == "empty") {
                return true;
            }
            if (curr.tail.kind == "empty" || revl.tail.kind == "empty") {
                return false;
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
prettyprintList(compress(filledList("1", "2", "3", "3", "4", "4", "5", "5", "5", "6", "2", "1", "0")), console.log);
console.log("EX-7");
const caesarCypher = (l) => (shift) => {
    const caesar = (list) => {
        if (list.kind == "list" && list.head.charCodeAt(0) + Number(shift) <= 122) {
            return ({
                kind: "list",
                head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift)),
                tail: caesar(list.tail)
            });
        }
        if (list.kind == "list" && list.head.charCodeAt(0) + Number(shift) >= 122) {
            return ({
                kind: "list",
                head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift) + 96 - 122),
                tail: caesar(list.tail)
            });
        }
        return emptyList();
    };
    return caesar(l);
};
const caesarCypherWithUpper = (l) => (shift) => {
    const caesar = (list) => {
        if (list.kind == "list" && list.head.charCodeAt(0) + Number(shift) <= 122) {
            return ({
                kind: "list",
                head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift)),
                tail: caesar(list.tail)
            });
        }
        if (list.kind == "list" && list.head.charCodeAt(0) + Number(shift) >= 122) {
            return ({
                kind: "list",
                head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift) + 65 - 122),
                tail: caesar(list.tail)
            });
        }
        return emptyList();
    };
    return caesar(l);
};
prettyprintList(caesarCypherWithUpper(filledList("h", "z", "g", "b"))(15n), console.log);
prettyprintList(caesarCypher(filledList("h", "z", "g", "b"))(15n), console.log);
console.log("EX-8");
const splitAt = (i) => (l) => {
    const splitter = (iterator) => (list) => {
        if (list.kind == "list" && iterator <= i) {
            return [
                ({
                    kind: "list",
                    head: list.head,
                    tail: splitter(iterator + 1n)(list.tail)[0]
                }),
                splitter(iterator + 1n)(list.tail)[1]
            ];
        }
        if (list.kind == "list" && iterator > i) {
            return [
                splitter(iterator + 1n)(list.tail)[0],
                ({
                    kind: "list",
                    head: list.head,
                    tail: splitter(iterator + 1n)(list.tail)[1]
                })
            ];
        }
        return [emptyList(), emptyList()];
    };
    return splitter(0n)(l);
};
prettyprintList(splitAt(5n)(filledList(1, 2, 3, 4, 5, 6, 7, 8, 9))[0], console.log);
console.log("-------");
prettyprintList(splitAt(5n)(filledList(1, 2, 3, 4, 5, 6, 7, 8, 9))[1], console.log);
console.log("EX-9");
const merge = (l1) => (l2) => {
    const merger = (curr1) => (curr2) => {
        if (curr1.kind == "empty") {
            return curr2;
        }
        if (curr2.kind == "empty") {
            return curr1;
        }
        if (curr1.head < curr2.head) {
            return ({
                kind: "list",
                head: curr1.head,
                tail: merger(curr1.tail)(curr2)
            });
        }
        return ({
            kind: "list",
            head: curr2.head,
            tail: merger(curr1)(curr2.tail)
        });
    };
    return merger(l1)(l2);
};
prettyprintList(merge(filledList(1, 2, 3, 5, 6, 7))(filledList(4, 8, 9, 10)), console.log);
prettyprintList(merge(filledList("d", "e", "f"))(filledList("a", "b", "c", "p")), console.log);
console.log("EX-10");
const mergeSort = (l1) => {
    const sortedMerge = (l2) => (l3) => {
        if (l3.kind == "empty") {
            return l2;
        }
        if (l2.kind == "empty") {
            return l3;
        }
        if (l3.head < l2.head) {
            return ({
                kind: "list",
                head: l3.head,
                tail: sortedMerge(l3.tail)(l2)
            });
        }
        return ({
            kind: "list",
            head: l2.head,
            tail: sortedMerge(l3)(l2.tail)
        });
    };
    const mergeSorter = (curr1) => {
        if (curr1.kind == "empty" || curr1.tail.kind == "empty") {
            return curr1;
        }
        const list = getMiddle(curr1);
        if (list.kind != "empty") {
            const next = list.tail;
            if (next.kind == "empty") {
                return curr1;
            }
            list.tail = emptyList();
            return sortedMerge(mergeSorter(curr1))(next);
        }
        return curr1;
    };
    const getMiddle = (list) => {
        const getter = (slow) => (fast) => {
            if (fast.kind == "empty" || fast.tail.kind == "empty")
                return slow;
            if (slow.kind != "empty") {
                slow = slow.tail;
                fast = fast.tail.tail;
                return getter(slow)(fast);
            }
            return fast;
        };
        return getter(list)(list);
    };
    return mergeSorter(l1);
};
prettyprintList(mergeSort(filledList(5, 4, 9, 8, 2, 3, 6)), console.log);
const isAtomic = (_) => _.kind == "Atomic";
//const isNumber = (_ : Value) => typeof(_) == typeof(0)
const isNumber = (_) => typeof (_) == 'number';
const AValue = (_) => ({ AtomicValue: _, kind: "Atomic", Eval: Eval });
const AsAtomicValue = (_) => ({ AtomicValue: _, kind: "Atomic" });
const Add = (ex1) => ex2 => ({ Add: [ex1, ex2], kind: "Add", Eval: Eval });
const Sub = (ex1) => ex2 => ({ Sub: [ex1, ex2], kind: "Sub", Eval: Eval });
const Mul = (ex1) => ex2 => ({ Mul: [ex1, ex2], kind: "Mul", Eval: Eval });
const Div = (ex1) => ex2 => ({ Div: [ex1, ex2], kind: "Div", Eval: Eval });
const Mod = (ex1) => ex2 => ({ Mod: [ex1, ex2], kind: "Mod", Eval: Eval });
function Eval() {
    switch (this.kind) {
        case "Atomic": return this;
        case "Add":
            {
                const l = this.Add[0].Eval();
                const r = this.Add[1].Eval();
                if (l.kind == "Atomic" && r.kind == "Atomic")
                    return (isNumber(l.AtomicValue) && isNumber(r.AtomicValue)) ?
                        AValue(l.AtomicValue + r.AtomicValue) :
                        AValue("" + l.AtomicValue + r.AtomicValue);
            }
            break;
        case "Sub":
            {
                const l = this.Sub[0].Eval();
                const r = this.Sub[1].Eval();
                if (l.kind == "Atomic" && r.kind == "Atomic")
                    return (isNumber(l.AtomicValue) && isNumber(r.AtomicValue)) ?
                        AValue(l.AtomicValue - r.AtomicValue) :
                        AValue("INCORRECT EXPR");
            }
            break;
        case "Div":
            {
                const l = this.Div[0].Eval();
                const r = this.Div[1].Eval();
                if (l.kind == "Atomic" && r.kind == "Atomic")
                    return (isNumber(l.AtomicValue) && isNumber(r.AtomicValue)) ?
                        AValue(l.AtomicValue / r.AtomicValue) :
                        AValue("INCORRECT EXPR");
            }
            break;
        case "Mod":
            {
                const l = this.Mod[0].Eval();
                const r = this.Mod[1].Eval();
                if (l.kind == "Atomic" && r.kind == "Atomic")
                    return (isNumber(l.AtomicValue) && isNumber(r.AtomicValue)) ?
                        AValue(l.AtomicValue % r.AtomicValue) :
                        AValue("INCORRECT EXPR");
            }
            break;
        case "Mul":
            {
                const l = this.Mul[0].Eval();
                const r = this.Mul[1].Eval();
                if (l.kind == "Atomic" && r.kind == "Atomic")
                    return (isNumber(l.AtomicValue) && isNumber(r.AtomicValue)) ?
                        AValue(l.AtomicValue * r.AtomicValue) :
                        AValue("INCORRECT EXPR");
            }
            break;
        default: return this;
    }
    return this;
}
const aValue = AValue(12786);
console.log(aValue);
console.log(aValue.kind == "Atomic" ? aValue.AtomicValue : "<NO VALUE>");
const expr = Div(Mul(AValue(10))(Sub(AValue(20))(Add(AValue(-3))(Add(AValue(2))(AValue(5))))))(AValue(2));
console.log(expr.Eval());
//# sourceMappingURL=unit3.js.map