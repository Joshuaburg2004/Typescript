"use strict";
const Fun = (f) => Object.assign(f, {
    then: function (g) {
        return Fun(a => g(this(a)));
    }
});
const Updater = (f) => Object.assign(f, {
    fun: Fun(f),
    then: function (g) {
        return Updater(s => g(this(s)));
    }
});
const incr = Fun(_ => _ + 1);
const decr = Fun(_ => _ - 1);
const dobl = Fun(_ => _ * 2);
const geqz = Fun(_ => _ >= 0);
