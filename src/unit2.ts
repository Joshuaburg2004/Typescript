const getRandom = (min: number) => (max: number): number => Math.floor(Math.random() * (max - min) + min)
console.log("============EX-1============")
interface Point2D {
    Position : [x: number, y: number]
}

const pointFactoryVars = (x: number) => (y: number): Point2D =>
({
    Position : [x, y]
})

const PointFactoryRandom = (min: number) => (max: number): Point2D =>
({
    Position: [getRandom(min)(max), getRandom(min)(max)]
})

console.log(pointFactoryVars(5)(10))
console.log(PointFactoryRandom(10)(20))