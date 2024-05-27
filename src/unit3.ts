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