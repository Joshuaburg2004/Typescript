// tuple not list/array. need to be annotated.
const threeThings: [number, [string, bigint], boolean] = [1, ["a string", 105n], true]
function f(_: [boolean, boolean]){
    console.log(_)
}
type BasicFun<input,output> = (_:input) => output
type Updater<state> = BasicFun<state, state>

type Readonlify<T> = { readonly [k in keyof T]:T[k] }

type PersonData = { name:string, surname:string, age:number }

type Person = Readonly<{ name:string, surname:string, age:number, aged:BasicFun<number, Person> }>
type PersonRepository = {
  Default:BasicFun<PersonData, Person>,
  Updaters:{ aged:BasicFun<number, Updater<Person>> }
}
const Person : PersonRepository = {
  Default:(data) => ({
    ...data, // "with" syntax for quick record copy == "spread" operator
    aged:function(this:Person, extraYears:number) {
      return Person.Updaters.aged(extraYears)(this)
    }  
  }),
  Updaters:{
    aged:(extraYears) => (person: Person) => 
      Person.Default({ ...person, age:person.age + extraYears })
  },
}

const jimmy:Person = Person.Default({ 
  surname:"Malcolm", name:"Lionel", age:21, 
})

const jimmyOlder = jimmy.aged(18)
console.log(jimmy)
console.log(jimmyOlder)
const add_c : BasicFun<number, BasicFun<number, number>> =
    x => y => x + y

const add_uc : BasicFun<[number, number], number> = 
    ([x, y]) => x + y

/*
: thing : = size
boolean, boolean => 4 combo's
:boolean: = 2, :boolean | unassigned: = 3 => 6 combo's
boolean | unassigned, boolean | unassigned => 9 combo's
or = + in combo's
and = * in combo's
 */
