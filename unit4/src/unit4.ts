type BasicFunc<T1, T2> = (_:T1) => T2

type Fun<input, output> = 
  BasicFunc<input, output> &
  {
    then: <nextOutput>(other:BasicFunc<output, nextOutput>) => Fun<input, nextOutput>
  }

const Fun = <input, output>(actual: BasicFunc<input, output>) : Fun<input, output> => {
  const f = actual as Fun<input, output>
  f.then = function<nextOutput>(this: Fun<input, output>, other: BasicFunc<output, nextOutput>) : 
           Fun<input, nextOutput>        
           {
              return Fun((input: input) => other(this(input)))
           }       
  return f
}

const id = <T>() => Fun<T, T> ((x: T) => x)