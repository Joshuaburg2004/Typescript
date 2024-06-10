console.log("EX-1")
const foldList = <U, V>(z: V) : (f: ((_: U) => (__: V) => V)) => (l: List<U>) => V => f => l =>
    l.kind == "empty" ? z : f(l.head)(foldList<U,V>(z)(f)(l.tail))
