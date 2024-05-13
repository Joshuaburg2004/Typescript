"use strict";
// tuple not list/array. need to be annotated.
const threeThings = [1, ["a string", 105n], true];
function f(_) {
    console.log(_);
}
const Person = {
    Default: (data) => ({
        ...data, // "with" syntax for quick record copy == "spread" operator
        aged: function (extraYears) {
            return Person.Updaters.aged(extraYears)(this);
        }
    }),
    Updaters: {
        aged: (extraYears) => (person) => Person.Default({ ...person, age: person.age + extraYears })
    },
};
const jimmy = Person.Default({
    surname: "Malcolm", name: "Lionel", age: 21,
});
const jimmyOlder = jimmy.aged(18);
console.log(jimmy);
console.log(jimmyOlder);
const add_c = x => y => x + y;
const add_uc = ([x, y]) => x + y;
/*
: thing : = size
boolean, boolean => 4 combo's
:boolean: = 2, :boolean | unassigned: = 3 => 6 combo's
boolean | unassigned, boolean | unassigned => 9 combo's
or = + in combo's
and = * in combo's
 */
