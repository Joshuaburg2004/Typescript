console.log("Excercise one: ")
const Factors = (n: number) : string => {
    const factors = (curr: number) => (ToReturn: string = '') : string => {
        if((n == curr || n < curr) && ToReturn == '1'){
            return ''
        }
        else if(n == curr || n < curr){
            return ToReturn + " " + n
        }
        else if(curr == 1){
            return factors(curr + 1)('1')
        }
        else if(n % curr == 0){
            return factors(curr + 1)(ToReturn + " " + curr)
        }
        return factors(curr + 1)(ToReturn)
        
    }
    return factors(1)('')
} 

console.log(Factors(77))
console.log(Factors(64))
console.log(Factors(11))

console.log("Excercise two: ")

const repeat = (symbol: string) => (times: number): string =>{
    if(times == 1){
        return symbol
    }
    return symbol + repeat(symbol)(times - 1)
}

type Shape2D = {
    rows: number,
    columns: number,
    draw(this: Shape2D): string;
    draw(this: Shape2D, symbols: string): string;
}

const Shape2D = ([rows, cols]: [number, number]): Shape2D => ({
    rows: rows,
    columns: cols,
    draw(this: Shape2D, symbols: string = "*"): string{
        return repeat(repeat(symbols)(this.columns) + "\n")(this.rows)
    }
})

const box: Shape2D = Shape2D([2,3])
console.log(box.draw())
console.log(Shape2D([1,5]).draw('# '))

console.log("Excercise three: ")

type Branch<T> = {
    kind: "empty"
} | {
    kind: "branch",
    value: T,
    First: Branch<T>,
    Second: Branch<T>
}

const emptyB = <T>() : Branch<T> => {
    return {kind: "empty"}
}
const fromArray = <T>(input: T[]) : Branch<T> => 
    input.length == 0 ? empty() : fromArrayFunc(input)(0)({kind: "empty"})

const fromArrayFunc = <T> (input: T[]) : 
                          (idx: number) => (tmp: Branch<T>) => Branch<T> => idx => tmp =>
  (idx >= input.length) ? tmp : fromArrayFunc(input)(idx + 1)(addToBranch(input[idx])(tmp)) 

const addToBranch = <T> (input: T) => (tmp: Branch<T>) : Branch<T> =>{
    if(tmp.kind == "empty"){
        return {
            kind: "branch",
            value: input,
            First: emptyB(),
            Second: emptyB()
        }
    }
    if(input < tmp.value){
        return {
            kind: "branch",
            value: tmp.value,
            First: addToBranch(input)(tmp.First),
            Second: tmp.Second
        }
    }
    if(input >= tmp.value){
        return {
            kind: "branch",
            value: tmp.value,
            First: tmp.First,
            Second: addToBranch(input)(tmp.Second)
        }
    }
    return {kind: "empty"}
}

console.log("Test")

console.log("Excercise four: ")
type None = {kind: "None"}
type Something<T> = {kind:"Some", Value: T}
type Option<T> = None | Something<T>

const none = () : None => ({kind: "None"})
const some = <T>(param: T) : Something<T> => ({kind: "Some", Value: param}) 

type EmptyList = {kind: "empty"}
type FullList<T> = {kind: "full", head: T, tail:List<T>}
type List<T> = EmptyList | FullList<T>

const empty = () : EmptyList => ({kind: "empty"})
const full = <T>(v: T) : (l: List<T>) => FullList<T> => l => ({kind: "full", head:v, tail: l})
const fullPair = full<[number, number]>

const append = <T>(list1: List<T>) : (list2: List<T>) => List<T> => list2 => 
list2.kind == "empty" ? list1 : 
list1.kind == "empty" ? list2 : 
list1.tail.kind == "empty" ? full(list1.head)(list2):
 full(list1.head)(append(list1.tail)(list2))

const foldList = <U, V>(z: V) : (f: ((_: U) => (__: V) => V)) => (l: List<U>) => V => f => l =>
 l.kind == "empty" ? z : f(l.head)(foldList<U,V>(z)(f)(l.tail)) 

const printList = <T>(list?: List<T>) : string =>
    list == undefined ? "UNDEFINED": 
    list.kind == "empty" ? "":
    list.tail.kind == "empty"?
    `(${list.head})`:
    `(${list.head}) ; ${printList(list.tail)}`

const MaxBy = <A, B> (projection: (_: A) => B) => (list: List<A>) : Option<B> => {
    if(list.kind == "empty"){
        return {kind: "None"}
    }
    const apply = (tmp: List<A>) : List<B> => {
        if(tmp.kind == "empty"){
            return tmp
        }
        return {
            kind: tmp.kind,
            head: projection(tmp.head),
            tail: apply(tmp.tail)
        }
    }
    const getValue = (toReturn: Option<B>) => (tmp: List<B>): Option<B> => {
        if(tmp.kind == "empty")
            return toReturn
        if(toReturn.kind == "None")
            return getValue({kind: "Some", Value: tmp.head})(tmp.tail)
        if(toReturn.Value < tmp.head)
            return getValue({kind: "Some", Value: tmp.head})(tmp.tail)
        return getValue(toReturn)(tmp.tail)
    }
    return getValue({kind: "None"})(apply(list))
}
const numList = full(-3)(full(4)(full(3)(full(0)(full(-5)(full(1)(empty()))))))

console.log(MaxBy(_ => _)(numList)) 

// Max of (squares) -3*-3, 4*4, 3*3, 0*0, -5*-5, 1*1 => 25 
console.log(MaxBy<number, number>(_ => _ * _)(numList)) 

//Max length of strings => 5 
console.log(MaxBy<string, number>(_ => _.length)(full("Small")(full("Big")(empty())))) 

//List{[1, 2]; [30, 4]; [-1, -1]}
const pairList = fullPair([1, 2])(fullPair([30, 4])(fullPair([-1, -1])(empty()))) 

const maxEmpty = MaxBy((_: [number, number]) => _[1])(empty())
const max1 = MaxBy((_: [number, number]) => _[1])(pairList)
const max = MaxBy((_: [number, number]) => _[0] > _[1] ? _[0] : _[1])(pairList)