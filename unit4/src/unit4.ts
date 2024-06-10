const prettyprintList = <T>(l: List<T>, cont:BasicFun<T, void>) =>{
    if(l.kind == "empty"){return}
    else{
      cont(l.head)
      prettyprintList(l.tail, cont)
    }
  }
console.log("EX-1")
type BasicFun<a, b> = (_:a) => b
type Fun<a, b> = BasicFun<a,b> & {
    then: <c>(g:BasicFun<b, c>) => Fun<a, c>
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

const foldList = <U, V>(z: V) : (f: ((_: U) => (__: V) => V)) => (l: List<U>) => V => f => l =>
    l.kind == "empty" ? z : f(l.head)(foldList<U,V>(z)(f)(l.tail))

const map = <T> (l: List<T>) => (f: ((_: T) => (__: T) => T)) : List<T> => {
  if(l.kind == "empty"){
    return {kind: "empty"}
  }
  return foldList<T, List<T>>(l)(f)(l)
}

prettyprintList(map(filledList(5, 2, 7, 1, 9))(x => x * 2), console.log)

