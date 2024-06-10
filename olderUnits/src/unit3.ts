type Option<T> = {
  kind : "none"
} | {
  kind: "some"
  value: T
}

type BasicFun<a, b> = (_:a) => b
type Fun<a, b> = BasicFun<a,b> & {
    then: <c>(g:BasicFun<b, c>) => Fun<a, c>
}
const Fun = <a, b>(f:BasicFun<a,b>) : Fun<a, b> => 
  Object.assign(
      f, 
      {
          then:function<c>(this:Fun<a,b>, g:BasicFun<b,c>): Fun<a,c> {
              return Fun(a => g(this(a)))
          }
      }
  )



const prettyprintList = <T>(l: List<T>, cont:BasicFun<T, void>) =>{
  if(l.kind == "empty"){return}
  else{
    cont(l.head)
    prettyprintList(l.tail, cont)
  }
}

type List<T> = { 
  kind: "empty" 
}
| { 
  kind: "list",
  head: T,
  tail: List<T>
}

const emptyList = <T>() : List<T> => ({
    kind: "empty"
  }
)

const filledList = <T>(...value: T[]) : List<T> => {
  if(value.length == 0){
    return {kind:"empty"}
  }
  return {kind:"list", head: value[0], tail:filledList(...value.slice(1))}
}

const findIndex = <T>(arr: T[]) => (k:T) : number => {
    const find = (i: number) : number => {
      if(i > arr.length - 1){return -1}
      if(arr[i] == k){
        return i
      }
      return find(i + 1)
    }
    return find(0)
  }

const findValue = <T>(arr: T[]) => (k: T) : Option<T> =>
    {
        const inner = (index: number): Option<T> =>
            index >= arr.length? {kind:"none"} : arr[index] == k ? {kind:"some", value:k} : inner(index + 1)
        return inner(0)
    }
console.log(findIndex([1, 2, 3, 4, 5, 6, 7, 8])(-7))
console.log(findValue([1, 2, 3, 4, 5, 6, 7, 8])(-7))


console.log("EX-1")
const last = <T>(l : List<T>):Option<T> =>
{
  if(l.kind == "empty"){
    return {kind:"none"}
  } else if(l.tail.kind == "empty"){
    return {kind:"some", value:l.head}
  }
  return last(l.tail)
}

console.log(last(emptyList()))
console.log(last(filledList(5)))
console.log(last(filledList(5, 12)))

console.log("EX-2")

const rev = <T>(l: List<T>): List<T> => {
  const inner = (liner: List<T>) => (emptyL: List<T>): List<T> => {
    if(liner.kind == "empty"){
        return emptyL
    }
    emptyL = {
      kind: "list",
      head: liner.head,
      tail: emptyL
    }
    return inner(liner.tail)(emptyL)
  }
  return inner(l)(emptyList())
}

prettyprintList(rev(filledList(15, 12, 9, 6, 3)), console.log)

console.log("EX-3")
const append = <T>(l1 : List<T>) => (l2 : List<T>) : List<T> =>{
  if(l1.kind == "empty"){
    return l2
  }
  return{
    kind:"list",
    head:l1.head,
    tail:append(l1.tail)(l2)
  }
}

const l1 = filledList(1)
const l2 = filledList(2, 3)
prettyprintList(append(l1)(l2), console.log)

console.log("EX-4")

const nth = <T>(n : bigint) => (l : List<T>) : Option<T> => {
  const item = (index: bigint) => (list: List<T>) : Option<T> =>
  {
    if(index > n || list.kind == "empty"){
      return{kind:"none"}
    }
    if(index == n){
      return{kind:"some", value:list.head}
    }
    return item(index + 1n)(list.tail)
  }
  return item(0n)(l)
}

console.log(nth(4n)(filledList(1, 2, 3, 4, 5, 6)))

console.log("EX-5")
const palindrome = <T>(l : List<T>) : boolean => {
  const inner = (curr: List<T>) => (revl: List<T>): boolean => {
    if(curr.kind != "empty" && revl.kind != "empty"){
      if(curr.tail.kind == "empty" && revl.tail.kind == "empty"){return true}
      if(curr.tail.kind == "empty" || revl.tail.kind == "empty"){return false}
      if(curr.head == revl.head){return inner(curr.tail)(revl.tail)}
      return false
    }
    return true
  }
  return inner(l)(rev(l))
}

console.log(palindrome(filledList(1, 2, 3, 4, 3, 2, 1)))
console.log(palindrome(filledList(1)))
console.log(palindrome(filledList(1, 3, 4, 3, 2, 1)))

console.log("EX-6")

const compress = <T>(l : List<T>) : List<T> => {
  const inner = (curr: List<T>) => (item: Option<T>) : List<T> => {
    if(curr.kind == "empty"){
      return emptyList()
    }
    if(item.kind == "none" || item.value != curr.head){
      return {
        kind: "list",
        head: curr.head,
        tail: inner(curr.tail)({kind: "some", value: curr.head})
      }
    }
    return inner(curr.tail)(item)
  }
  return inner(l)({kind: "none"})
}

prettyprintList(compress(filledList(1, 2, 3, 3, 4, 4, 5, 5, 5, 6, 2, 1, 0)), console.log)
prettyprintList(compress(filledList("1", "2", "3", "3", "4", "4", "5", "5", "5", "6", "2", "1", "0")), console.log)


console.log("EX-7")
const caesarCypher = (l: List<string>) => (shift: bigint) : List<string> =>
{
  const caesar = (list: List<string>) : List<string> => {
    if(list.kind == "list" && list.head.charCodeAt(0) + Number(shift) <= 122){
      return ({
        kind: "list",
        head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift)),
        tail: caesar(list.tail)
      })
    }
    if(list.kind == "list" && list.head.charCodeAt(0) + Number(shift) >= 122){
      return ({
        kind: "list",
        head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift) + 96 - 122),
        tail: caesar(list.tail)
      }) 
    }
    
    return emptyList()
  }
  return caesar(l)
}

const caesarCypherWithUpper = (l: List<string>) => (shift: bigint) : List<string> =>
  {
    const caesar = (list: List<string>) : List<string> => {
      if(list.kind == "list" && list.head.charCodeAt(0) + Number(shift) <= 122){
        return ({
          kind: "list",
          head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift)),
          tail: caesar(list.tail)
        })
      }
      if(list.kind == "list" && list.head.charCodeAt(0) + Number(shift) >= 122){
        return ({
          kind: "list",
          head: String.fromCharCode(list.head.charCodeAt(0) + Number(shift) + 65 - 122),
          tail: caesar(list.tail)
        }) 
      }
      
      return emptyList()
    }
    return caesar(l)
  }

prettyprintList(caesarCypherWithUpper(filledList("h", "z", "g", "b"))(15n), console.log)
prettyprintList(caesarCypher(filledList("h", "z", "g", "b"))(15n), console.log)
console.log("EX-8")
const splitAt = <T>(i : bigint) => (l : List<T>) : [List<T>,List<T>] =>{
  const splitter = (iterator: bigint) => (list: List<T>) : [List<T>, List<T>] => {
    if(list.kind == "list" && iterator <= i){
      return[
        ({
          kind: "list",
          head: list.head,
          tail: splitter(iterator + 1n)(list.tail)[0]
        }),
        splitter(iterator + 1n)(list.tail)[1]
      ]
    }
    if(list.kind == "list" && iterator > i){
      return[
        splitter(iterator + 1n)(list.tail)[0],
        ({
          kind: "list",
          head: list.head,
          tail: splitter(iterator + 1n)(list.tail)[1]
        })
      ]
    }
    return [emptyList(), emptyList()]
  }
  return splitter(0n)(l)
}

prettyprintList(splitAt(5n)(filledList(1,2,3,4,5,6,7,8,9))[0], console.log)
console.log("-------")
prettyprintList(splitAt(5n)(filledList(1,2,3,4,5,6,7,8,9))[1], console.log)

console.log("EX-9")
const merge = <T>(l1: List<T>) => (l2: List<T>) : List<T> => {
  const merger = (curr1: List<T>) => (curr2 : List<T>) : List<T> => {
    if(curr1.kind == "empty"){
      return curr2
    }
    if(curr2.kind == "empty"){
      return curr1
    }
    if(curr1.head < curr2.head){
      return ({
        kind: "list",
        head: curr1.head,
        tail: merger(curr1.tail)(curr2)
      })
    }
    return ({
      kind: "list",
      head: curr2.head,
      tail: merger(curr1)(curr2.tail)
    })
  }
  return merger(l1)(l2)
}

prettyprintList(merge(filledList(1, 2, 3, 5, 6,7))(filledList(4, 8, 9, 10)), console.log)
prettyprintList(merge(filledList("d", "e", "f"))(filledList("a", "b", "c", "p")), console.log)

console.log("EX-10")

const mergeSort = <T>(l1: List<T>) : List<T> => {
  const sortedMerge = (l2: List<T>) => (l3: List<T>) : List<T> => {
    if(l3.kind == "empty"){
      return l2
    }
    if(l2.kind == "empty"){
      return l3
    }
    if(l3.head < l2.head){
      return ({
        kind: "list",
        head: l3.head,
        tail: sortedMerge(l3.tail)(l2)
      })
    }
    return ({
      kind: "list",
      head: l2.head,
      tail: sortedMerge(l3)(l2.tail)
    })
  }
  const mergeSorter = (curr1: List<T>) : List<T> => {
    if(curr1.kind == "empty" || curr1.tail.kind == "empty"){
      return curr1
    }
    const list = getMiddle(curr1)
    if(list.kind != "empty"){
      const next = list.tail
      if(next.kind == "empty"){
        return curr1
      }
      list.tail = emptyList<T>()
      return sortedMerge(mergeSorter(curr1))(next)
    }
    
    return curr1
  }

  const getMiddle = (list: List<T>) : List<T> => {
    const getter = (slow: List<T>) => (fast: List<T>) : List<T> => {
      if(fast.kind == "empty" || fast.tail.kind == "empty")
        return slow
      if(slow.kind != "empty"){
        slow = slow.tail
        fast = fast.tail.tail
        return getter(slow)(fast)
      }
      return fast
    }
    return getter(list)(list)
  }
  return mergeSorter(l1)
}

prettyprintList(mergeSort(filledList(5, 4, 9, 8, 2, 3, 6)), console.log)

type Value = number | string

type Atomic = {AtomicValue: Value, kind: "Atomic"}
type Expression = (
                    Atomic | 
                    {Add:  [Expression, Expression], kind: "Add"} |
                    {Sub:  [Expression, Expression], kind: "Sub"} |
                    {Mul:  [Expression, Expression], kind: "Mul"} |
                    {Div:  [Expression, Expression], kind: "Div"} |
                    {Mod:  [Expression, Expression], kind: "Mod"} 
                  )
                  & 
                  {
                    Eval : () => Expression,
                    // EvalStack : () => (stack? : List<[string, number]>) => Expression // exercises 12, 13
                    // PrintExpression : () => string
                  }

const isAtomic = (_: Expression): boolean => _.kind == "Atomic"            
//const isNumber = (_ : Value) => typeof(_) == typeof(0)
const isNumber = (_ : Value) => typeof(_) == 'number'

const AValue = (_: Value) : Expression => ({AtomicValue: _, kind: "Atomic", Eval: Eval})
const AsAtomicValue = (_: Value) : Atomic => ({AtomicValue: _, kind: "Atomic"})
const Add = (ex1: Expression) : (ex2: Expression) =>  Expression => ex2 => ({Add:  [ex1, ex2], kind: "Add", Eval: Eval})
const Sub = (ex1: Expression) : (ex2: Expression) =>  Expression => ex2 => ({Sub:  [ex1, ex2], kind: "Sub", Eval: Eval})
const Mul = (ex1: Expression) : (ex2: Expression) =>  Expression => ex2 => ({Mul:  [ex1, ex2], kind: "Mul", Eval: Eval})
const Div = (ex1: Expression) : (ex2: Expression) =>  Expression => ex2 => ({Div:  [ex1, ex2], kind: "Div", Eval: Eval})
const Mod = (ex1: Expression) : (ex2: Expression) =>  Expression => ex2 => ({Mod:  [ex1, ex2], kind: "Mod", Eval: Eval})

function Eval(this: Expression) : Expression {
  switch(this.kind) {
    case "Atomic": return this
    case "Add": return Add(this.Add[0].Eval())(this.Add[1].Eval())
    case "Sub": return Sub(this.Sub[0].Eval())(this.Sub[1].Eval())
    case "Div": return Div(this.Div[0].Eval())(this.Div[1].Eval())
    case "Mod": return Mod(this.Mod[0].Eval())(this.Mod[1].Eval())
    case "Mul": return Mul(this.Mul[0].Eval())(this.Mul[1].Eval())
    default: return this
  }
}

const aValue : Expression = AValue(12786)
console.log(aValue)
console.log(aValue.kind == "Atomic" ? aValue.AtomicValue : "<NO VALUE>")

const expr: Expression = Div(Mul(AValue(10))(Sub(AValue(20))(Add(AValue(-3))(Add(AValue(2))(AValue(5))))))(AValue(2))

console.log(expr.Eval())