//here a, b and c are three different types: 
//notice that b is the return type of f, 
//this type has to be the same as the input type of g
//the function compose takes two functions as input (f and g) 
//and returns a function from type a to type c
//resulting from merging f: (_:a) => b with g: (_: b) => c

const compose_v1 = <a,b,c>(f: (_:a) => b, g: (_: b) => c) => { 
const merge = (input: a): c => {
                                const output_f: b = f(input)
                                const output_g: c = g(output_f)
                                return output_g
                                }
return merge
}

const compose_v2 = <a,b,c>(f: (_:a) => b, g: (_: b) => c) => { 
const merge = (input: a): c => g(f(input))
return merge
}

const compose_v3 = <a,b,c>(f: (_:a) => b, g: (_: b) => c) => 
                                (input: a): c => g(f(input))

const compose_ = <a,b,c>(f: (_:a) => b) : (g: (_: b) => c) => ((_: a) => c) => g =>
input => g(f(input))

const compose = <a,b,c>(f: (_:a) => b) => (g: (_: b) => c) =>
(input: a): c => g(f(input))

console.log(compose_v1<number,number,number>(_ => _ + 2, _ => _ * 3)(3))
console.log(compose_v2<number,number,number>(_ => _ + 2, _ => _ * 3)(3))
console.log(compose_v3<number,number,number>(_ => _ + 2, _ => _ * 3)(3))
console.log(compose_<number,number,number>(_ => _ + 2)(_ => _ * 3)(3))
console.log(compose<number,number,number>(_ => _ + 2)(_ => _ * 3)(3))

type BasicFunc<T1, T2> = (_:T1) => T2

type Fun<input, output> = 
  BasicFunc<input, output> &
  {
    then: <nextOutput>(other:BasicFunc<output, nextOutput>) => Fun<input, nextOutput>
  }

const Fun = <input, output>(actual: BasicFunc<input, output>) : Fun<input, output> => {
  const f = actual as Fun<input, output>
  f.then = function<nextOutput>(this: Fun<input, output>, other: BasicFunc<output, nextOutput>) : 
           Fun<input, nextOutput>        
           {
              return Fun((input: input) => other(this(input)))
           }       
  return f
}

const id = <T>() => Fun<T, T> ((x: T) => x)

const incr = Fun((x: number) => x + 1)
const double = Fun((x: number) => x * 2)
const halve = Fun((x: number) => x / 2)

const incrDouble= incr.then(double)

const calculations = double.then(incr).then(incr).then(halve)

const processer =  id<number>()
                .then((x: number) => x + 1)
                .then(id())
                .then(((x: number) => x + 10))
                .then((x: number) => x + "")
                .then((x: string) => x + "!?")
                .then((x: string) => x + "!!!")
                .then(x => x.length)
                .then((x => x + "!!!"))
                .then(id())

console.log(calculations(200))
console.log(`\n EXAMPLE: ${processer(51238)}`)

const repeat = <T> (f: Fun<T, T>) : (n: bigint) => Fun<T, T> => n => 
    n == 0n ? id<T>() : f.then(repeat(f)(n - 1n))

const star = Fun((s:string) => s + "*")
const space = Fun((s:string) => s + " ")
const newline = Fun((s:string) => s + "\n")

const row = Fun((n: bigint) => repeat(star)(n))
const square = Fun((n: bigint) => repeat(row(n).then((newline)))(n))

console.log(row(10n).then(newline)(""))
console.log(square(10n)(""))

type Pair<a,b> = [a,b]
const mapTupleLeft = <a, b>(f: BasicFunc<a, a>) : ([x, y]: Pair<a, b>) => 
                                                   Pair<a, b> => ([x, y]: Pair<a, b>) => [f(x), y]

const p1 = mapTupleLeft(incr)([1,"a"]) // => ([2,"a"])
const p2 = mapTupleLeft(double)([2,"a"]) // => ([4,"a"])
const p3 = mapTupleLeft(incr.then(double))([2,["a","b"]]) // => ([6,["a","b"]])
console.log(`p1: [${p1[0]}, ${p1[1]}]\np2: [${p2[0]}, ${p2[1]}] \np3: [${p3[0]}, ${p3[1]}]`)

const mapTupleRight = <a, b>(f: BasicFunc<b, b>) : ([x, y]: Pair<a, b>) => Pair<a, b> => 
    ([x, y]: Pair<a, b>) => [x, f(y)]

type None = {kind: "None"}
type Something<T> = {kind:"Some", Value: T}
type Option<T> = None | Something<T>

const none = () : None => ({kind: "None"})
const some = <T>(param: T) : Something<T> => ({kind: "Some", Value: param}) 

const mapOption = <U, V> (f: BasicFunc<U, V>) : ((input: Option<U>) => Option<V>) =>
  input => input.kind == "None" ? none() : some(f(input.Value))

const optRes1 = mapOption(incr)(none()) // => None
const optRes2 = mapOption(incr)(some(3)) // => Some 4
const optRes3 = mapOption(double)(some(3)) // => Some 6

//-------List--------
type EmptyList = {kind: "empty"}
type FullList<T> = {kind: "full", head: T, tail:List<T>}
type List<T> = EmptyList | FullList<T>

const empty = () : EmptyList => ({kind: "empty"})
const full = <T>(_: T) : (__: List<T>) => FullList<T> => 
             __ => ({kind: "full", head:_, tail: __})

const List = <T>(array : T[]) : List<T> => (array.length == 0) ? 
                                           empty() :
                                           (array.length == 1) ?
                                           full(array[0])(empty()) :
                                           full(array[0])(List(array.slice(1)))                
//--------------------

const mapList = <U, V> (f: BasicFunc<U, V>) : (l: List<U>) => List<V> => l => 
                 l.kind == "empty" ? empty() : full(f(l.head))(mapList(f)(l.tail))

const emptyList = mapList(incr)(empty()) // => []
const numberList1 = mapList(incr)(full(1)(full(2)(full(5)(empty())))) // => [2,3,6]))
const numberList = mapList(incr)(List([1, 2, 5])) // => [2,3,6]))

const mapListOption = <U, V> (f: BasicFunc<U, V>) => 
    Fun< BasicFunc<U, V>, BasicFunc<Option<U>, Option<V>> >(mapOption).then(mapList)(f)

const filterOption = <T> (p: BasicFunc<T, boolean>) : (_: Option<T>) => Option<T> => 
    l => l.kind == "Some" && p(l.Value) ? some(l.Value) : none()
  
console.log(filterOption((_: number) => _ % 3 == 0)(some(9)))
console.log(filterOption((_: number) => _ % 3 == 0)(none()))

const filterList_ = <U> (p: (_: U) => boolean) : (l: List<U>) => List<U> => 
    l =>
       l.kind == "empty" ? empty() : 
       p(l.head)? full(l.head)(filterList(p)(l.tail)) : 
       filterList(p)(l.tail)

const filterList = <U> (p: BasicFunc<U, boolean>) : BasicFunc<List<U>, List<U>> => 
    l =>
        l.kind == "empty" ? empty() : 
        p(l.head)? full(l.head)(filterList(p)(l.tail)) : 
        filterList(p)(l.tail) 

console.log(filterList((_: number) => _ % 2 == 0)(List([1, 4, 6, 7, 21, 64, 78, 11, 20]))) 
// => [4, 6, 64, 78, 20]  
console.log(filterList((_: string) => _.startsWith("a"))(List(["a", "aa", "baa", "bb"]))) 
// => ["a", "aa"]


  
const foldList2 = <U, V>(z: V) : (f: ((_: U) => (__: V) => V)) => (l: List<U>) => V => f => l =>
    l.kind == "empty" ? z : foldList<U, V>(f(l.head)(z))(f)(l.tail) 

foldList<number, number>(0)(x => y => x + y)(List([1, 2, 3])) 
// => (1 + (2 + (3 + 0))) => 6

foldList2<number, number>(0)(x => y => x + y)(List([1, 2, 3])) 
// => (((0 + 1) + 2) + 3) => 6

console.log(foldList<number, number>(0)(x => y => x + y)(List([20, 34, 56, 12])))
console.log(foldList<string, string>("")(x => y => x + y)(List(["h", "e", "l", "l", "o"])))
console.log(foldList<number, string>("")(x => y => x + ", " + y)(List([20, 34, 56, 12])))

const add : BasicFunc<number, BasicFunc<number, number>> = x => y => x + y
console.log(add(1)(3))

const conditionalPipeline = <T, U>(p: BasicFunc<T, boolean>) : 
                                 (f: BasicFunc<T, U>) => (g: BasicFunc<T, U>) => (x: T) => U =>
                                 f => g => x => p(x) ? f(x) : g(x)
console.log(conditionalPipeline<number, string>(_ => _ > 0)(_ => _ + "!!!")(_ => _ + "???")(2))

const isPositive_incrOrDouble = conditionalPipeline<number, number>(_ => _ > 0)(_ => _ + 1)(_ => _ * 2)

console.log(isPositive_incrOrDouble(-4))  // => -8
console.log(isPositive_incrOrDouble(3))   // => 4

const curry = <U> (f: (_: U, __: U) => U ) : BasicFunc<U, BasicFunc<U, U>> => 
    x => y => f(x, y)

const uncurry = <U> (f: BasicFunc<U, BasicFunc<U, U>> ) : (x: U, y: U) => U =>
    (x, y) => f(x)(y)

const drawWrong = (sym: string, s: string) => s + sym
const draw = curry(drawWrong)

type Person = { name:string, surname:string }
const rename = (newName: string) : (p: Person) => Person => p => ({...p, name: newName })

const georgeify = rename("George")
const janeify = rename("Jane")
const jackify = rename("Jack")

const person1 = georgeify({ name: "Giorgio", surname: "Ruffa" })
const person2 = janeify({ name: "Alex", surname: "Pomaré" })

type Manager = {
    name: string,
    surname: string,
    birthday: Date,
    company: string,
    salary: number
}

type Student = {
    Name: string,
    Surname: string,
    Birthday: Date,
    StudyPoints: number
}

type IPerson<p> = {
    getName: (_: p) => string,
    getSurname: (_: p) => string,
    getBirthday: (_: p) => Date,
    setName: (_: string) => (__: p) => p,
    setSurname: (_: string) => (__: p) => p,
    setBirthday: (_: Date) => (__: p) => p
}

const managerPerson: IPerson<Manager> =
{
  getName : (x: Manager) => x.name,
  getSurname : (x: Manager) => x.surname,
  getBirthday : (x: Manager) => x.birthday,
  setName : (v: string) : (x: Manager) => Manager => x => ({...x, name: v}),
  setSurname : (v: string) : (x: Manager) => Manager => x => ({...x, surname: v}),
  setBirthday : (v: Date) : (x: Manager) => Manager => x => ({...x, birthday: v}),
}

const studentPerson: IPerson<Student> =
{
  getName : (x:Student) => x.Name,
  getSurname : (x:Student) => x.Surname,
  getBirthday : (x:Student) => x.Birthday,
  setName :  (v: string) : (x: Student) => Student => x => ({...x, Name: v}),
  setSurname : (v: string) : (x: Student) => Student => x => ({...x, Surname: v}),
  setBirthday : (v: Date) : (x: Student) => Student => x => ({...x, Birthday: v}),
}

const genericProgram = <p>(i: IPerson<p>) : (person :p) => p => person => {
    const p1 = i.setSurname ("o' " + i.getSurname(person))(person) 
    const oldBirthday = i.getBirthday(p1)
    const newBirthday = new Date(oldBirthday.getFullYear() + 1, 
                                 oldBirthday.getMonth(),
                                 oldBirthday.getDay())
    return i.setBirthday(newBirthday)(p1) 
}

console.log(
    genericProgram(studentPerson)( 
                                    { 
                                      Name: "Jack",
                                      Surname: "Lantern",
                                      Birthday: new Date(1985, 2, 3),
                                      StudyPoints: 120,
                                    }
                                  )
)

console.log(
  genericProgram(managerPerson)( 
                                { 
                                  name: "John",
                                  surname: "Connor",
                                  birthday: new Date(1965, 2, 3),
                                  company: "Microsoft",
                                  salary: 150000,
                                } 
                               )
)

const applyMany = <a,b,c>(l: List<Fun<a, Fun<b,c>>>) : (x: a) => (y: b) => List<c> => 
    x => y => (mapList((f: Fun<a, Fun<b,c>>) => f(x)(y))(l))
  
console.log(applyMany<number, number, number>(List([Fun(_ => Fun(__ => _ + __)), 
                                                    Fun(_ => Fun(__ => _ - __))]))(4)(3))