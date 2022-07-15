import '../../node_modules/three/build/three.min.js'

import Camera from './camera.js'
import MapGenerator from './mapGenerator.js';
import { Wall, Door, Floor, Ceiling } from './objects.js'
import Player from './player.js';
import Soilder from './soilder.js';

export default class Screen extends Camera{
    constructor(level) {
        super()
        this.level = level
        this.energy = 20
        this.diedBool = false
        this.levelCompleate = false
        this.actualRoom = 1
        this.doors = new Set()
        this.walls = new Set()
        this.rooms = new Set()
        this.soilders = []
        
		this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.mapGenerator = new MapGenerator(this.level)

        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        this.keysPressed ={}
        window.addEventListener("keydown", (e) => {
            this.keysPressed[e.key] = true;
        })
        window.addEventListener('keyup', (e) => {
            if(e.code == "Space"){ this.openDoor() || this.shot() }
            if(e.code == "Numpad0" || e.code == "ControlRight"){ this.shot() }
            delete this.keysPressed[e.key];
        });

        this.gunImage = []
        this.actualGun = 0
        this.ammunition = 300
        this.inShot = false

        this.startGenerate = this.startGenerate.bind(this)
        this.frame = this.frame.bind(this)
        this.shotAnimation = this.shotAnimation.bind(this)
        this.died = this.died.bind(this)
        this.diedAnimation = this.diedAnimation.bind(this)
        this.getActualRoom = this.getActualRoom.bind(this)
    }

    async startGenerate(){
        const objects = await this.mapGenerator.loadingMap()
        this.rooms = objects.rooms

        this.camera.position.x = objects.start.point[0]*4
        this.camera.position.z = objects.start.point[1]*4
        this.camera.rotation.y = Math.PI*0.0055555555555556*objects.start.rotation
        this.setRotation(objects.start.rotation)

        const floor = new Floor(objects.map.width, objects.map.height)
        this.scene.add(floor.generateFloor())

        const ceiling = new Ceiling(objects.map.width, objects.map.height)
        this.scene.add(ceiling.generateCeiling())

        for (const wallFromJSON of objects.walls) {
            const wallObj = new Wall(wallFromJSON)
            this.scene.add(wallObj.show());
            this.walls.add(wallObj)
        }

        for (const door of objects.doors) {
            const doorObj = new Door(door)
            this.scene.add(doorObj.show())
            this.doors.add(doorObj)
        }

        for (const soilderObjest of objects.soilders) {
            const soilder = new Soilder(soilderObjest.rotation, soilderObjest.position, soilderObjest.room, soilderObjest.lives)
            this.soilders.push(soilder)
            this.scene.add(soilder.getSoilder())
        }

        this.screenAnimation = setInterval(this.frame, 40)

        const links = ["./texture/soilder/2_1.png", "./texture/soilder/2_2.png", "./texture/soilder/2_3.png", "./texture/soilder/2_4.png", "./texture/soilder/2_5.png"]

        this.loadGun(links)
    }

    loadGun(links){
        const image = new Image()
        image.src = links[this.gunImage.length]
        image.addEventListener("load", (e) => {
            if(this.gunImage.length==0){
                document.body.appendChild(image)
            }
            this.gunImage.push(image)

            if(this.gunImage.length==links.length){  }
            else{ this.loadGun(links) }
        })
    }
    setRoom(info){
        for (const room of info.rooms) {
            this.rooms.add(room)
        }
        for (const wallFromJSON of info.walls) {
            const wallObj = new Wall(wallFromJSON)
            this.scene.add(wallObj.show());
            this.walls.add(wallObj)
        }
        for (const door of info.doors) {
            const doorObj = new Door(door)
            this.scene.add(doorObj.show())
            this.doors.add(doorObj)
        }

    }

    frame(){
        if(this.energy<0){
            this.died()
            clearInterval(this.screenAnimation)
            return false
        }
        if(this.keysPressed["ArrowUp"]){
            this.moveFront()
        }
        if(this.keysPressed["ArrowDown"]){
            this.moveBack()
        }
        if(this.keysPressed["ArrowLeft"]){
            this.rotateLeft()
        }
        if(this.keysPressed["ArrowRight"]){
            this.rotateRight()
        }

        this.getActualRoom()

        const allWalls = Array.from(this.walls)
        const allDoors = Array.from(this.doors)
        const nextRoomsWalls = new Set()
        const nextRooms = new Set()
        const nextDoors = new Set()
        for (const room of this.rooms) {
            if(room.id==this.actualRoom){
                room.next.forEach(element => {
                    for (const room2 of this.rooms) {
                        if(room2.id==element){
                            nextRooms.add(room2)
                            break
                        }
                    }
                });

                const walls =  allWalls.filter(el2 => room.walls.includes(el2.info.id))
                for (const wall of walls) {
                    nextRoomsWalls.add(wall)
                }

                const doors =  allDoors.filter(el2 => room.doors.includes(el2.info.id))
                for (const door of doors) {
                    nextDoors.add(door)
                }
                break
            }
        }

        nextRooms.forEach(el => {
            const walls =  allWalls.filter(el2 => el.walls.includes(el2.info.id))
            for (const wall of walls) {
                nextRoomsWalls.add(wall)
            }
        })

        nextRooms.forEach(el => {
            const doors =  allDoors.filter(el2 => el.doors.includes(el2.info.id))
            for (const door of doors) {
                nextDoors.add(door)
            }
        })
        
        for (const soilder of this.soilders) {
            if(soilder.lives>0){
                if(soilder.tryFire(this.camera.position, this.actualRoom, nextRoomsWalls, nextDoors, nextRooms)){
                    this.energy -= 1
                    console.log(this.energy);
                }    
            }
            else{
                if(soilder.died==false){
                    soilder.startDied()
                }else{
                    soilder.rotateAfterDied(this.camera.position)
                }
            }
        }

        console.log(this.energy);
        this.renderer.render( this.scene, this.camera );
    }

    died(){
        this.opacity = 1
        this.diedAnim = setInterval(this.diedAnimation, 150)
    }
    diedAnimation(){
        this.opacity-=0.1
        document.body.style.opacity = this.opacity
        console.log("aa");
        if(this.opacity<0){
            clearInterval(this.diedAnim)
            this.diedBool = true
        }
    }

    shot(){
        if(this.ammunition>0 && this.inShot == false){
            this.inShot = true
            this.ammunition -= 1
            this.shotAnimation()

            return true
        }
        return false
    }

    checkShot(){
        const allWalls = Array.from(this.walls)
        const allDoors = Array.from(this.doors)
        const nextRoomsWalls = new Set()
        const nextRooms = new Set()
        const nextDoors = new Set()

        for (const room of this.rooms) {
            if(room.id==this.actualRoom){
                room.next.forEach(element => {
                    for (const room2 of this.rooms) {
                        if(room2.id==element){
                            nextRooms.add(room2)
                            break
                        }
                    }
                });

                const walls =  allWalls.filter(el2 => room.walls.includes(el2.info.id))
                for (const wall of walls) {
                    nextRoomsWalls.add(wall)
                }

                const doors =  allDoors.filter(el2 => room.doors.includes(el2.info.id))
                for (const door of doors) {
                    nextDoors.add(door)
                }
                break
            }
        }

        nextRooms.forEach(el => {
            const walls =  allWalls.filter(el2 => el.walls.includes(el2.info.id))
            for (const wall of walls) {
                nextRoomsWalls.add(wall)
            }
        })

        nextRooms.forEach(el => {
            const doors =  allDoors.filter(el2 => el.doors.includes(el2.info.id))
            for (const door of doors) {
                nextDoors.add(door)
            }
        })
        
        let rot = this.rr
        
        if(rot<90 && rot>0){
            rot += 90
        }else{
            if(rot>90 && rot<180){
                rot -= 90
            }else{
                if(rot>180 && rot<270){
                    rot -= 90
                }else{
                    if(rot>270 && rot<360){
                        rot %= 90
                    }
                }
            }
        }

        const wa = Math.tan((rot)*0.01745329251994329576923690768489)
        const wb = this.camera.position.z-(wa*this.camera.position.x)
        
        for (const soilder of this.soilders) {
            if(soilder.died==false)
                if(soilder.isOnFiringLine(this.camera.position, nextRoomsWalls, nextDoors, wa, wb, (rot==0 || rot==180 || rot==360), (rot==90 || rot==270), rot, this.rr)){
                    soilder.hit()
                }
        }
    }

    shotAnimation(){
        this.actualGun += 1
        if(this.actualGun<5){
            document.body.removeChild(document.querySelector("img"))
            document.body.appendChild(this.gunImage[this.actualGun])
        }
        switch(this.actualGun){
            case 1:
                setTimeout(this.shotAnimation, 90)
                break;
            case 2:
                this.checkShot()
                setTimeout(this.shotAnimation, 150)
                break;
            case 3:
                setTimeout(this.shotAnimation, 125)
                break;
            case 4:
                setTimeout(this.shotAnimation, 90)
                break;
            case 5:
                setTimeout(this.shotAnimation, 90)
                break;
            default:
                this.inShot = false
                this.actualGun = 0 
                document.body.removeChild(document.querySelector("img"))
                document.body.appendChild(this.gunImage[this.actualGun])
        }
    }
    getActualRoom(){
        for (const room of this.rooms) {
            for (const location of room.location) {
                if(this.camera.position.x > location.startX*4 && this.camera.position.x <= location.endX*4 && this.camera.position.z > location.startZ*4 && this.camera.position.z <= location.endZ*4){
                    if(this.actualRoom!=room.id){
                        this.actualRoom = room.id
                        if(!room.fullLoad){
                            room.fullLoad = true
                            this.setRoom(this.mapGenerator.generateRoom(room.id, this.doors, this.walls, this.rooms))
                        }
                    }
                }
            }
        }
    }

    closeDoor(door){
        if(this.camera.position.x>=door.info.startPoint[0]*4-2 && this.camera.position.x<=door.info.startPoint[0]*4+2 && this.camera.position.z>=door.info.startPoint[1]*4-2 && this.camera.position.z<=door.info.startPoint[1]*4+2 ){
            setTimeout(() => {this.closeDoor(door)}, 100)
        }else{
            door.openStep = 0
            door.isOpen = false
            door.interval = setInterval(door.animateClose, 100)
        }
    }

    openDoor(){
        for (const door of this.doors) {
            if(this.camera.position.x>=door.detection.startX*4-2 && this.camera.position.x<=door.detection.endX*4+2 && this.camera.position.z>=door.detection.startZ*4-2 && this.camera.position.z<=door.detection.endZ*4+2 ){
                if(!door.isOpen){ 
                    door.open()
                    setTimeout(() => {
                        if(door.isOpen){
                            this.closeDoor(door)
                        }
                    }, 2600)
                }
                return true
            }
        }
    }
    checkColision(x, z){
        for (const wall of this.walls) {
            if(x>wall.startX && x< wall.endX && z>wall.startZ && z<wall.endZ){
                return false
            }
        }
        for (const door of this.doors) {
            if((x >= door.info.startPoint[0]*4-door.info.boxSize[0]/2-0.5 && x <=door.info.startPoint[0]*4+door.info.boxSize[0]/2+0.5 && z >= door.info.startPoint[1]*4-door.info.boxSize[2]/2-0.5 && z <=door.info.startPoint[1]*4+door.info.boxSize[2]/2+0.5) && door.isOpen==false){
                return false
            }
        }
        return true
    }

    moveFront(){
        const rotate = ((360+this.rotate)%360)
        if(rotate == 0 || rotate == 360){
            const positionZ = this.camera.position.z - 0.5
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate<90){
            const positionX = this.camera.position.x - Math.sin(Math.PI * (rotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z - Math.cos(Math.PI * (rotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate==90){
            const positionX = this.camera.position.x - 0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
        }
        if(rotate>90 && rotate<180){
            const pomRotate = 90-(rotate%90)
            const positionX = this.camera.position.x - Math.sin(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z + Math.cos(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate==180){
            const positionZ = this.camera.position.z + 0.5
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate>180 && rotate <270){
            const pomRotate = rotate%90
            const positionX = this.camera.position.x + Math.sin(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z + Math.cos(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate == 270){
            const positionX = this.camera.position.x + 0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
        }
        if(rotate>270 && rotate<360){
            const pomRotate = 90-rotate%90
            const positionX = this.camera.position.x + Math.sin(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z - Math.cos(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
    }

    moveBack(){
        const rotate = ((360+this.rotate)%360)
        if(rotate == 0 || rotate == 360){
            const positionZ = this.camera.position.z + 0.5
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate<90){
            const positionX = this.camera.position.x + Math.sin(Math.PI * (rotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z + Math.cos(Math.PI * (rotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate==90){
            const positionX = this.camera.position.x + 0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
        }
        if(rotate>90 && rotate<180){
            const pomRotate = 90-(rotate%90)
            const positionX = this.camera.position.x + Math.sin(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z - Math.cos(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate==180){
            const positionZ = this.camera.position.z - 0.5
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate>180 && rotate <270){
            const pomRotate = rotate%90
            const positionX = this.camera.position.x - Math.sin(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z - Math.cos(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
        if(rotate == 270){
            const positionX = this.camera.position.x - 0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
        }
        if(rotate>270 && rotate<360){
            const pomRotate = 90-rotate%90
            const positionX = this.camera.position.x - Math.sin(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            const positionZ = this.camera.position.z + Math.cos(Math.PI * (pomRotate * 0.0055555555555556))*0.5
            if(this.checkColision(positionX, this.camera.position.z)) this.camera.position.x = positionX
            if(this.checkColision(this.camera.position.x, positionZ)) this.camera.position.z = positionZ
        }
    }

}