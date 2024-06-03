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

const id = <a>(v:a) => v

type BasicUpdater<s> = BasicFun<s, s>
type Updater<s> = BasicUpdater<s> & {
    then:(g:BasicUpdater<s>) => Updater<s>
}
const Updater = <s>(f:BasicUpdater<s>) : Updater<s> => 
    Object.assign(
        f, 
        {
            fun:Fun(f),
            then:function<s>(this:Updater<s>, g:BasicUpdater<s>): Updater<s> {
                return Updater(s => g(this(s)))
            }
        }
    )


type Parent = {
    x: number
    child1: Child
    child2: Child
    }
    const Parent = {
    Default: (): Parent => ({
        x: 0,
        child1: Child.Default(),
        child2: Child.Default(),
    }),
    Updaters: {
        x: (fieldUpdater: BasicUpdater<Parent["x"]>): Updater<Parent> =>
        Updater(entity => ({ ...entity, x: fieldUpdater(entity.x) })),
        child1: (fieldUpdater: BasicUpdater<Parent["child1"]>): Updater<Parent> =>
        Updater(entity => ({ ...entity, child1: fieldUpdater(entity.child1) })),
        child2: (fieldUpdater: BasicUpdater<Parent["child2"]>): Updater<Parent> =>
        Updater(entity => ({ ...entity, child2: fieldUpdater(entity.child2) })),
    }
}
type Child = {
    s: string
}
const Child = {
    Default: (): Child => ({
        s: ""
    }),
    Updaters: {
        s: (fieldUpdater: BasicUpdater<Child["s"]>): Updater<Child> =>
        Updater(entity => ({ ...entity, s: fieldUpdater(entity.s) })),
    }
}
const incr = Updater<number> (_ => _ + 1)
const decr = Updater<number> (_ => _ - 1)
const dobl = Updater<number> (_ => _ * 2)
const geqz = Fun<number, boolean> (_ => _ >= 0)
const todr = Updater<string>(_ => "Dr " + _)
const tomr = Updater<string>(_ => "Mr " + _)
const toms = Updater<string>(_ => "Ms " + _)
const excl = Updater<string>(_ => _ + "!")
const replaceWith = <s>(s: s): Updater<s> => Updater(_ => s)

const initialisation =
  Parent.Updaters.child1(Child.Updaters.s(replaceWith("John Doe"))).then(
    Parent.Updaters.child2(Child.Updaters.s(replaceWith("Jane Doe")))
  )

const child1Graduation = Child.Updaters.s(
  todr
).then(
  Child.Updaters.s(
    excl
  )
)

const child2Graduation = Child.Updaters.s(
  todr.then(toms)
)


const pipeline =
  initialisation.then(
    Parent.Updaters.x(incr.then(dobl)).then(
      Parent.Updaters.child1(
        child1Graduation
      ).then(
        Parent.Updaters.child2(
          child2Graduation
        )
      )
    )
  )

console.log(pipeline(Parent.Default()))

type Pair<a, b> = [a, b]
const Pair = <a, b>() => ({
    Default:(a:a, b:b): Pair<a, b> => ([a, b]),
    Map:{
        left:<c>(f:BasicFun<a,c>) : Fun<Pair<a,b>, Pair<c, b>> => Fun(([a, b]) => ([f(a), b])),
        right:<c>(f:BasicFun<b,c>): Fun<Pair<a, b>, Pair<a,c>> => Fun(([a,b]) => ([a, f(b)])),
        both:<c,d>(f: BasicFun<a,c>, g:BasicFun<b,d>) : Fun<Pair<a,b>, Pair<c,d>> => Pair<a,b>().Map.left<c>(f).then(Pair<c,b>().Map.right(g))
    }
})
type Either<a, b> = {kind: "left", value: a} | {kind: "right", value: b}
const Either = <a, b>() => ({
    Default:{
        left:(a:a): Either<a, b> => ({kind: "left", value:a}),
        right:(b:b): Either<a,b> => ({kind: "right", value:b})
    },
    Map:{
        left:<c>(f:BasicFun<a,c>) : Fun<Either<a,b>, Either<c, b>> => Either<a,b>().Map.both(f, id<b>),
        right:<d>(g:BasicFun<b,d>) : Fun<Either<a,b>, Either<a, d>> => Either<a,b>().Map.both(id<a>, g),
        both:<c,d>(f: BasicFun<a,c>, g:BasicFun<b,d>) : Fun<Either<a,b>, Either<c,d>> => 
            Fun(e => e.kind == "left" ? Either<c,d>().Default.left(f(e.value)) : Either<c,d>().Default.right(g(e.value)))
    }
})
type lOption<a> = Either<a, void>

const NumStr = Pair<number, string>()
const pipeline2 = NumStr.Map.left(incr.then(dobl))

const Parents = Pair<Parent, Parent>()
const pipeline3 = Parents.Map.both(initialisation, pipeline)
console.log(pipeline3(Parents.Default(Parent.Default(), Parent.Default())))

const List = <a>() => ({
    Default:{
        empty:() : List<a> => ({kind: "empty"}),
        full:(head:a, tail:List<a>) : List<a> => ({kind: "list", head, tail})
    },
    Map:<b>(f:BasicFun<a,b>): Fun<List<a>, List<b>> => 
        Fun(list_a => list_a.kind == "empty" ? List<b>().Default.empty() : 
        List<b>().Default.full(
            f(list_a.head), 
            List<a>().Map(f)(list_a.tail))),
    Filter:(p:BasicFun<a,boolean>) : Fun<List<a>, List<a>> => 
        Fun(list_a => list_a.kind == "empty" ? List<a>().Default.empty() : 
            p(list_a.head) ? 
            List<a>().Default.full(
                list_a.head, 
                List<a>().Filter(p)(list_a.tail))
            : List<a>().Filter(p)(list_a.tail)
        ),
    
})