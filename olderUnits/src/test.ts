const Factors: (n: number) => string = (n: number): string => {
    const isPrime = (num: number) => (i: number): boolean => {
        if (i <= 1) return true
        if (i * i == num) return false
        return isPrime(num)(i - 1)
    }


    if (isPrime(n)) {
        return ''
    }

    const inner = (num: number) => (curr: number): string => {
        console.log(`${num} | ${curr}`)

        const isFactor = (n: number) => (i: number): boolean => {
            console.log(`is ${i} a factor of ${n}?`)
            if (i < 1) return false
            if (i == 1) return true
            if (n % i == 0) return true
            return false
        }

        if (isFactor(num)(curr)) {
            return `, ${curr}` + inner(num)(curr - 1)
        }

        return `, ${curr}`
    }

    return inner(n)(n)
}

console.log(Factors(99))