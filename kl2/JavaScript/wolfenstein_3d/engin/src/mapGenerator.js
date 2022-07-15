export default class MapGenerator{
    constructor(id) {
        this.mapName = id
        this.loadingMap = this.loadingMap.bind(this)
        this.generateRoom = this.generateRoom.bind(this)
    }
    async loadingMap(){
        const map = await fetch(`./../../map/${this.mapName}.json`).then((res) => { return res.json() })
        this.mapObject = map

        const startedMap = { start: map.start, map: map.map }
        const room = map.rooms.find(el => el.id == map.start.room)
        const rooms = new Set()
        const walls = new Set()
        const doors = new Set()
        const soilders = new Set()
        
        room.fullLoad = true
        rooms.add(room)
        for (const el of room.walls) {
            walls.add(map.walls.find(e => e.id==el))
        }
        
        for (const el of room.next) {
            const nextRoom = map.rooms.find(room => room.id==el)
            nextRoom.fullLoad = false
            rooms.add(nextRoom)
            for (const wall of map.rooms.find(room => room.id==el).walls) {
                walls.add(map.walls.find(e => e.id==wall))
            }
        }

        for (const el of rooms) {
            for (const door of el.doors) {
                doors.add(map.doors.find(el => el.id == door))
            }
        }

        for (const soilder of map.soilders) {
            soilders.add(soilder)
        }
        
        startedMap.walls = walls
        startedMap.rooms = rooms
        startedMap.doors = doors
        startedMap.start = map.start
        startedMap.soilders = soilders
        return startedMap
    }
    generateRoom(id, doors, walls, actualRooms){
        const kWalls = walls
        walls=[]
        for (const wall of kWalls) {
            walls.push(wall.info)
        }

        const kDoors = doors
        doors=[]
        for (const door of kDoors) {
            doors.push(door.info)
        }
        
        const room = this.mapObject.rooms.find(el => el.id == id)

        const newRooms = new Set()
        for (const el of room.next) {
            if(!this.isOnList(actualRooms, el)){
                const newRoom = this.mapObject.rooms.find(ele => ele.id == el)
                newRoom.fullLoad = false
                newRooms.add(newRoom)
            }
        }

        const newWalls = new Set()
        const newDoors = new Set()
        for (const room of newRooms) {
            for (const wall of room.walls) {
                if(!this.isOnList(walls, wall) && !this.isOnList(newWalls, wall)){
                    newWalls.add(this.mapObject.walls.find(el => el.id == wall))
                }
            }
            for (const door of room.doors) {
                if(!this.isOnList(doors, door) && !this.isOnList(newDoors, door)){
                    newDoors.add(this.mapObject.doors.find(el => el.id == door))
                }
            }
        }

        const toReturn = {}
        toReturn.rooms = newRooms
        toReturn.walls = newWalls
        toReturn.doors = newDoors

        return toReturn
    }
    isOnList(list, id) {
        for (const el of list) {
            if(el.id == id){
                return true
            }
        }
        return false
    }
}