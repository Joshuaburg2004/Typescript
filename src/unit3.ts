type Option<T> = {
  kind : "none"
} | {
  kind: "some"
  value: T
}

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
      if(curr.tail.kind == "empty"){return true}
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

