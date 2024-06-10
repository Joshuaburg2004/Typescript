"use strict";
const id = (v) => v;
const Updater = (f) => Object.assign(f, {
    fun: Fun(f),
    then: function (g) {
        return Updater(s => g(this(s)));
    }
});
const Parent = {
    Default: () => ({
        x: 0,
        child1: Child.Default(),
        child2: Child.Default(),
    }),
    Updaters: {
        x: (fieldUpdater) => Updater(entity => ({ ...entity, x: fieldUpdater(entity.x) })),
        child1: (fieldUpdater) => Updater(entity => ({ ...entity, child1: fieldUpdater(entity.child1) })),
        child2: (fieldUpdater) => Updater(entity => ({ ...entity, child2: fieldUpdater(entity.child2) })),
    }
};
const Child = {
    Default: () => ({
        s: ""
    }),
    Updaters: {
        s: (fieldUpdater) => Updater(entity => ({ ...entity, s: fieldUpdater(entity.s) })),
    }
};
const incr = Updater(_ => _ + 1);
const decr = Updater(_ => _ - 1);
const dobl = Updater(_ => _ * 2);
const geqz = Fun(_ => _ >= 0);
const todr = Updater(_ => "Dr " + _);
const tomr = Updater(_ => "Mr " + _);
const toms = Updater(_ => "Ms " + _);
const excl = Updater(_ => _ + "!");
const replaceWith = (s) => Updater(_ => s);
const initialisation = Parent.Updaters.child1(Child.Updaters.s(replaceWith("John Doe"))).then(Parent.Updaters.child2(Child.Updaters.s(replaceWith("Jane Doe"))));
const child1Graduation = Child.Updaters.s(todr).then(Child.Updaters.s(excl));
const child2Graduation = Child.Updaters.s(todr.then(toms));
const pipeline = initialisation.then(Parent.Updaters.x(incr.then(dobl)).then(Parent.Updaters.child1(child1Graduation).then(Parent.Updaters.child2(child2Graduation))));
console.log(pipeline(Parent.Default()));
const Pair = () => ({
    Default: (a, b) => ([a, b]),
    Map: {
        left: (f) => Fun(([a, b]) => ([f(a), b])),
        right: (f) => Fun(([a, b]) => ([a, f(b)])),
        both: (f, g) => Pair().Map.left(f).then(Pair().Map.right(g))
    }
});
const Either = () => ({
    Default: {
        left: (a) => ({ kind: "left", value: a }),
        right: (b) => ({ kind: "right", value: b })
    },
    Map: {
        left: (f) => Either().Map.both(f, (id)),
        right: (g) => Either().Map.both((id), g),
        both: (f, g) => Fun(e => e.kind == "left" ? Either().Default.left(f(e.value)) : Either().Default.right(g(e.value)))
    }
});
const NumStr = Pair();
const pipeline2 = NumStr.Map.left(incr.then(dobl));
const Parents = Pair();
const pipeline3 = Parents.Map.both(initialisation, pipeline);
console.log(pipeline3(Parents.Default(Parent.Default(), Parent.Default())));
const List = () => ({
    Default: {
        empty: () => ({ kind: "empty" }),
        full: (head, tail) => ({ kind: "list", head, tail })
    },
    Map: (f) => Fun(list_a => list_a.kind == "empty" ? List().Default.empty() :
        List().Default.full(f(list_a.head), List().Map(f)(list_a.tail))),
    Filter: (p) => Fun(list_a => list_a.kind == "empty" ? List().Default.empty() :
        p(list_a.head) ?
            List().Default.full(list_a.head, List().Filter(p)(list_a.tail))
            : List().Filter(p)(list_a.tail)),
});
//# sourceMappingURL=lesson4.js.map