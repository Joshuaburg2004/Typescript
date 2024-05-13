console.log("===========EX-1============")

interface Point2D{
    Position: [number, number]
}

const Point2DPos = (t: [x: number, y: number]): Point2D => ({
    Position : t
})

const RandomPoint2D = (min: number, max: number): Point2D => ({
    Position: [Math.floor(Math.random() * (max - min + 1) + min), Math.floor(Math.random() * (max - min + 1) + min)]
})

console.log(Point2DPos([10, 5]).Position)
console.log(RandomPoint2D(0, 10).Position)

console.log("===========EX-2============")

interface Point2DEX2{
    x: number
    y: number
}

const Point2DPosEX2 = (t: [x: number, y: number]): Point2DEX2 => ({
    x : t[0],
    y : t[1]
})

const RandomPoint2DEX2 = (min: number, max: number): Point2DEX2 => ({
    x : Math.floor(Math.random() * (max - min + 1) + min),
    y: Math.floor(Math.random() * (max - min + 1) + min)
})

const Distance = (point: Point2DEX2) => (point1: Point2DEX2): number => Math.sqrt(Math.pow(point.x - point1.x, 2) + Math.pow(point.y - point1.y, 2))
    

console.log(`${Point2DPosEX2([10, 5]).x}, ${Point2DPosEX2([10, 5]).y}`)
const point = RandomPoint2DEX2(0, 10)
console.log(`${point.x}, ${point.y}`)
console.log(Distance(point)(Point2DPosEX2([5, 10])))

console.log("===========EX-3============")

interface blob{
    Position: Point2D
    Size: number
}

const newBlob = (): blob => ({
    Position: RandomPoint2D(-50, 50),
    Size: Math.floor(Math.random() * (5 - 1 + 1) + 1)
})

