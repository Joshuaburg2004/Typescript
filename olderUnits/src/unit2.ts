const getRandom = (min: number) => (max: number): number => Math.floor(Math.random() * (max - min) + min)
console.log("============EX-1============")
interface Point2D {
    readonly Position : [x: number, y: number]
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

console.log("============EX-2============")
class Point2DExtention implements Point2D{
    readonly Position: [x: number, y: number]
    get x(): number { return this.Position[0]}
    get y(): number { return this.Position[0]}
    constructor(position: [number, number])
    {
        this.Position = position
    }
    public DistanceTo(point: Point2DExtention) : number{
        return Math.floor(Math.sqrt(Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)))
    }
}

let p1 = new Point2DExtention([10, 12])
let p2 = new Point2DExtention([5, 11])

console.log(p1.DistanceTo(p2))

console.log("============EX-3============")
interface blob{
    Position: Point2DExtention
    Speed: number
}

const blobConstructor = (): blob =>
({
    Position: new Point2DExtention([getRandom(-50)(50), getRandom(-50)(50)]),
    Speed: getRandom(1)(5)
})

console.log(blobConstructor())

console.log("============EX-4============")

const move = (b: blob) : blob => {
    const num = getRandom(0)(3)
    // 0 => up
    // 1 => right
    // 2 => down
    // 3 => left
    if(num == 0){
        return ({
            ...b,
            Position: new Point2DExtention([b.Position.Position[0], b.Position.Position[1] + b.Speed])
        })
    }
    if(num == 1){
        return ({
            ...b,
            Position: new Point2DExtention([b.Position.Position[0] + b.Speed, b.Position.Position[1]])
        })
    }
    if(num == 2){
        return ({
            ...b, Position: new Point2DExtention([b.Position.Position[0], b.Position.Position[1] - b.Speed])
            
        })
    }
    if(num == 3){
        return ({
            ...b,
            Position: new Point2DExtention([b.Position.Position[0] - b.Speed, b.Position.Position[1]])
        })
    }
    return null!
}

let b = blobConstructor()
console.log(b)
let n = move(b)
console.log(n)

console.log("============EX-5============")

class world{
    bl1: blob
    bl2: blob
    ticks: number
    constructor(tick: number){
        this.bl1 = ({Position: new Point2DExtention([getRandom(-50)(50), getRandom(-50)(50)]), Speed: getRandom(1)(5)})
        this.bl2 = ({Position: new Point2DExtention([getRandom(-50)(50), getRandom(-50)(50)]), Speed: getRandom(1)(5)})
        this.ticks = tick
    }
    /**
     * Run
     */
    public Run() {
        const run = (i: number) =>
        {
            if(i > this.ticks){return}
            this.bl1 = move(this.bl1)
            this.bl2 = move(this.bl2)
            console.log(this.bl1)
            console.log(this.bl2)
            run(i + 1)
        }
        run(0)
    }
}

let w = new world(15)
w.Run()