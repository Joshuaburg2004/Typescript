type Option<T> = {
  kind : "none"
} | {
  kind: "some"
  value: T
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

console.log(rev(filledList(15, 12, 9, 6, 3)))

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
console.log(append(l1)(l2))

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
