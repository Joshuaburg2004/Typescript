"use strict";
//here a, b and c are three different types: 
//notice that b is the return type of f, 
//this type has to be the same as the input type of g
//the function compose takes two functions as input (f and g) 
//and returns a function from type a to type c
//resulting from merging f: (_:a) => b with g: (_: b) => c
const compose_v1 = (f, g) => {
    const merge = (input) => {
        const output_f = f(input);
        const output_g = g(output_f);
        return output_g;
    };
    return merge;
};
const compose_v2 = (f, g) => {
    const merge = (input) => g(f(input));
    return merge;
};
const compose_v3 = (f, g) => (input) => g(f(input));
const compose_ = (f) => g => input => g(f(input));
const compose = (f) => (g) => (input) => g(f(input));
console.log(compose_v1(_ => _ + 2, _ => _ * 3)(3));
console.log(compose_v2(_ => _ + 2, _ => _ * 3)(3));
console.log(compose_v3(_ => _ + 2, _ => _ * 3)(3));
console.log(compose_(_ => _ + 2)(_ => _ * 3)(3));
console.log(compose(_ => _ + 2)(_ => _ * 3)(3));
const Fun = (actual) => {
    const f = actual;
    f.then = function (other) {
        return Fun((input) => other(this(input)));
    };
    return f;
};
const id = () => Fun((x) => x);
const incr = Fun((x) => x + 1);
const double = Fun((x) => x * 2);
const halve = Fun((x) => x / 2);
const incrDouble = incr.then(double);
const calculations = double.then(incr).then(incr).then(halve);
const processer = id()
    .then((x) => x + 1)
    .then(id())
    .then(((x) => x + 10))
    .then((x) => x + "")
    .then((x) => x + "!?")
    .then((x) => x + "!!!")
    .then(x => x.length)
    .then((x => x + "!!!"))
    .then(id());
console.log(calculations(200));
console.log(`\n EXAMPLE: ${processer(51238)}`);
const repeat = (f) => n => n == 0n ? id() : f.then(repeat(f)(n - 1n));
const star = Fun((s) => s + "*");
const space = Fun((s) => s + " ");
const newline = Fun((s) => s + "\n");
const row = Fun((n) => repeat(star)(n));
const square = Fun((n) => repeat(row(n).then((newline)))(n));
console.log(row(10n).then(newline)(""));
console.log(square(10n)(""));
const mapTupleLeft = (f) => ([x, y]) => [f(x), y];
const p1 = mapTupleLeft(incr)([1, "a"]); // => ([2,"a"])
const p2 = mapTupleLeft(double)([2, "a"]); // => ([4,"a"])
const p3 = mapTupleLeft(incr.then(double))([2, ["a", "b"]]); // => ([6,["a","b"]])
console.log(`p1: [${p1[0]}, ${p1[1]}]\np2: [${p2[0]}, ${p2[1]}] \np3: [${p3[0]}, ${p3[1]}]`);
const mapTupleRight = (f) => ([x, y]) => [x, f(y)];
const none = () => ({ kind: "None" });
const some = (param) => ({ kind: "Some", Value: param });
const mapOption = (f) => input => input.kind == "None" ? none() : some(f(input.Value));
const optRes1 = mapOption(incr)(none()); // => None
const optRes2 = mapOption(incr)(some(3)); // => Some 4
const optRes3 = mapOption(double)(some(3)); // => Some 6
const empty = () => ({ kind: "empty" });
const full = (_) => __ => ({ kind: "full", head: _, tail: __ });
const List = (array) => (array.length == 0) ?
    empty() :
    (array.length == 1) ?
        full(array[0])(empty()) :
        full(array[0])(List(array.slice(1)));
//--------------------
const mapList = (f) => l => l.kind == "empty" ? empty() : full(f(l.head))(mapList(f)(l.tail));
const emptyList = mapList(incr)(empty()); // => []
const numberList1 = mapList(incr)(full(1)(full(2)(full(5)(empty())))); // => [2,3,6]))
const numberList = mapList(incr)(List([1, 2, 5])); // => [2,3,6]))
const mapListOption = (f) => Fun(mapOption).then(mapList)(f);
const filterOption = (p) => l => l.kind == "Some" && p(l.Value) ? some(l.Value) : none();
console.log(filterOption((_) => _ % 3 == 0)(some(9)));
console.log(filterOption((_) => _ % 3 == 0)(none()));
const filterList_ = (p) => l => l.kind == "empty" ? empty() :
    p(l.head) ? full(l.head)(filterList(p)(l.tail)) :
        filterList(p)(l.tail);
const filterList = (p) => l => l.kind == "empty" ? empty() :
    p(l.head) ? full(l.head)(filterList(p)(l.tail)) :
        filterList(p)(l.tail);
console.log(filterList((_) => _ % 2 == 0)(List([1, 4, 6, 7, 21, 64, 78, 11, 20])));
// => [4, 6, 64, 78, 20]  
console.log(filterList((_) => _.startsWith("a"))(List(["a", "aa", "baa", "bb"])));
// => ["a", "aa"]
const foldList2 = (z) => f => l => l.kind == "empty" ? z : foldList(f(l.head)(z))(f)(l.tail);
foldList(0)(x => y => x + y)(List([1, 2, 3]));
// => (1 + (2 + (3 + 0))) => 6
foldList2(0)(x => y => x + y)(List([1, 2, 3]));
// => (((0 + 1) + 2) + 3) => 6
console.log(foldList(0)(x => y => x + y)(List([20, 34, 56, 12])));
console.log(foldList("")(x => y => x + y)(List(["h", "e", "l", "l", "o"])));
console.log(foldList("")(x => y => x + ", " + y)(List([20, 34, 56, 12])));
const add = x => y => x + y;
console.log(add(1)(3));
const conditionalPipeline = (p) => f => g => x => p(x) ? f(x) : g(x);
console.log(conditionalPipeline(_ => _ > 0)(_ => _ + "!!!")(_ => _ + "???")(2));
const isPositive_incrOrDouble = conditionalPipeline(_ => _ > 0)(_ => _ + 1)(_ => _ * 2);
console.log(isPositive_incrOrDouble(-4)); // => -8
console.log(isPositive_incrOrDouble(3)); // => 4
const curry = (f) => x => y => f(x, y);
const uncurry = (f) => (x, y) => f(x)(y);
const drawWrong = (sym, s) => s + sym;
const draw = curry(drawWrong);
const rename = (newName) => p => ({ ...p, name: newName });
const georgeify = rename("George");
const janeify = rename("Jane");
const jackify = rename("Jack");
const person1 = georgeify({ name: "Giorgio", surname: "Ruffa" });
const person2 = janeify({ name: "Alex", surname: "Pomaré" });
const managerPerson = {
    getName: (x) => x.name,
    getSurname: (x) => x.surname,
    getBirthday: (x) => x.birthday,
    setName: (v) => x => ({ ...x, name: v }),
    setSurname: (v) => x => ({ ...x, surname: v }),
    setBirthday: (v) => x => ({ ...x, birthday: v }),
};
const studentPerson = {
    getName: (x) => x.Name,
    getSurname: (x) => x.Surname,
    getBirthday: (x) => x.Birthday,
    setName: (v) => x => ({ ...x, Name: v }),
    setSurname: (v) => x => ({ ...x, Surname: v }),
    setBirthday: (v) => x => ({ ...x, Birthday: v }),
};
const genericProgram = (i) => person => {
    const p1 = i.setSurname("o' " + i.getSurname(person))(person);
    const oldBirthday = i.getBirthday(p1);
    const newBirthday = new Date(oldBirthday.getFullYear() + 1, oldBirthday.getMonth(), oldBirthday.getDay());
    return i.setBirthday(newBirthday)(p1);
};
console.log(genericProgram(studentPerson)({
    Name: "Jack",
    Surname: "Lantern",
    Birthday: new Date(1985, 2, 3),
    StudyPoints: 120,
}));
console.log(genericProgram(managerPerson)({
    name: "John",
    surname: "Connor",
    birthday: new Date(1965, 2, 3),
    company: "Microsoft",
    salary: 150000,
}));
const applyMany = (l) => x => y => (mapList((f) => f(x)(y))(l));
console.log(applyMany(List([Fun(_ => Fun(__ => _ + __)),
    Fun(_ => Fun(__ => _ - __))]))(4)(3));
