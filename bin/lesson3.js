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
const jimmyOlder = jimmy;
console.log(jimmy);
console.log(jimmyOlder);
const add_c = x => y => x + y;
const add_uc = ([x, y]) => x + y;
const Employee = {
    Default: (person, job) => ({ ...person, job }),
    Updaters: {
        person: (_) => currentEmployee => ({ ...currentEmployee, ..._(currentEmployee) }),
        job: (_) => currentEmployee => ({ ...currentEmployee, job: _(currentEmployee.job) }),
    }
};
const e = Employee.Updaters.person(Person.Updaters.aged(10))(Employee.Default(Person.Default({ name: "Jim", surname: "Pim", age: 20 }), { name: "Cashier", description: "AH Cashier", salary: 13.5 }));
function PrettyPrintPerson(p) {
    console.log(`${p.name}, ${p.surname} is ${p.age} years old`);
}
function PrettyPrintJob(j) {
    console.log(`${j.description} pays ${j.salary} euro per hour`);
}
PrettyPrintPerson(e);
PrettyPrintJob(e.job);
