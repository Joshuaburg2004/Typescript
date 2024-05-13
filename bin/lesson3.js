"use strict";
// tuple not list/array. need to be annotated.
const threeThings = [1, ["a string", 105n], true];
function f(_) {
    console.log(_);
}
f([true, true]);
/*
: thing : = size
boolean, boolean => 4 combo's
:boolean: = 2, :boolean | unassigned: = 3 => 6 combo's
boolean | unassigned, boolean | unassigned => 9 combo's
or = + in combo's
and = * in combo's
 */
