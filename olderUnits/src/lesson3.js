"use strict";
// // tuple not list/array. need to be annotated.
// const threeThings: [number, [string, bigint], boolean] = [1, ["a string", 105n], true]
// function f(_: [boolean, boolean]){
//     console.log(_)
// }
// type BasicFun<input,output> = (_:input) => output
// type Updater<state> = BasicFun<state, state>
// type Readonlify<T> = { readonly [k in keyof T]:T[k] }
// type PersonData = { name:string, surname:string, age:number }
// type Person = Readonly<{ name:string, surname:string, age:number }>
// type PersonRepository = {
//   Default:BasicFun<PersonData, Person>,
//   Updaters:{ aged:BasicFun<number, Updater<Person>> }
// }
// const Person : PersonRepository = {
//   Default:(data) => ({
//     ...data, // "with" syntax for quick record copy == "spread" operator
//     aged:function(this:Person, extraYears:number) {
//       return Person.Updaters.aged(extraYears)(this)
//     }  
//   }),
//   Updaters:{
//     aged:(extraYears) => (person: Person) => 
//       Person.Default({ ...person, age:person.age + extraYears })
//   },
// }
// const jimmy:Person = Person.Default({ 
//   surname:"Malcolm", name:"Lionel", age:21, 
// })
// const jimmyOlder = jimmy
// console.log(jimmy)
// console.log(jimmyOlder)
// const add_c : BasicFun<number, BasicFun<number, number>> =
//     x => y => x + y
// const add_uc : BasicFun<[number, number], number> = 
//     ([x, y]) => x + y
// /*
// : thing : = size
// boolean, boolean => 4 combo's
// :boolean: = 2, :boolean | unassigned: = 3 => 6 combo's
// boolean | unassigned, boolean | unassigned => 9 combo's
// or = + in combo's
// and = * in combo's
//  */
// type Job = {name:string, description:string, salary:number}
// type Employee = Person & Job
// const Employee = {
//   Default:(person:Person, job:Job): Employee =>
//     ({...person, ...job}),
//   Updaters:{
//     person:(_:Updater<Person>) :Updater<Employee> =>
//       currentEmployee => ({...currentEmployee, ..._(currentEmployee)}),
//     job:(_:Updater<Job>) :Updater<Employee> =>
//       currentEmployee => ({...currentEmployee, ..._(currentEmployee)}),
//   }
// }
// const e = Employee.Updaters.person(Person.Updaters.aged(10))(Employee.Default(Person.Default({name:"Jim", surname:"Pim", age:20}),
// {name: "Cashier",description: "AH Cashier", salary: 13.5}))
// function PrettyPrintPerson(p: Person, cont:BasicFun<string, void>){
//   cont(`${p.name}, ${p.surname} is ${p.age} years old`)
// }
// function PrettyPrintJob(j: Job, cont:BasicFun<string, void>){
//   cont(`${j.description} pays ${j.salary} euro per hour`)
// }
// PrettyPrintPerson(e, console.log)
// PrettyPrintJob(e, console.log)
