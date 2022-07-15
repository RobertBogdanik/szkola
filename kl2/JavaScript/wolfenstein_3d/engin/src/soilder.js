import '../../node_modules/three/build/three.min.js'

export default class Soilder{
    constructor(rotation, position, room, lives) {
        this.position = { x: position[0], y: 2, z: position[1] } 
        this.realRotation = rotation 
        this.room = room

        this.rr = rotation 
        this.soilderRotate = 0 
        this.rotate = 1 

        this.wa = 0 
        this.wb = 0

        this.atackAnimation = 13 
        this.showGun = false
        this.nextFire = -123  
        this.shot = false

        this.attack = false

        this.lives = lives 
        this.died = false
        this.textures = []

        this.getSoilder = this.getSoilder.bind(this)
        this.showGunAnimation = this.showGunAnimation.bind(this)
        this.hideGunAnimation = this.hideGunAnimation.bind(this)
        this.tryFire = this.tryFire.bind(this)
        this.isOnFiringLine = this.isOnFiringLine.bind(this)
        this.rotateSoilder = this.rotateSoilder.bind(this)
        this.checkFire = this.checkFire.bind(this)
        this.diedAnimation = this.diedAnimation.bind(this)
    }

    getSoilder(){
        const links = ["./texture/hitler/1_1.png", "./texture/hitler/1_2.png", "./texture/hitler/1_3.png", "./texture/hitler/1_4.png", "./texture/hitler/1_5.png", "./texture/hitler/1_6.png", "./texture/hitler/1_7.png", "./texture/hitler/1_8.png", "./texture/hitler/6_1.png", "./texture/hitler/6_2.png", "./texture/hitler/6_3.png", "./texture/hitler/6_4.png", "./texture/hitler/6_5.png", "./texture/hitler/7_1.png", "./texture/hitler/7_2.png", "./texture/hitler/7_3.png"]
        for (const link of links) {
            const texture = new THREE.TextureLoader().load(link)
            this.textures.push(texture)
        }
        
        const geometry = new THREE.BoxGeometry( 2, 4, 1 );
        const material = new THREE.MeshBasicMaterial({
            map: this.textures[0],
            transparent: true
        })
        const mesh = new THREE.Mesh( geometry, material )

        mesh.position.y=this.position.y
        mesh.position.x=this.position.x*4-2
        mesh.position.z=this.position.z*4

        this.mesh = mesh
        return mesh
    }

    tryFire(cameraPosition, cameraRoom, walls, doors, rooms){
        const realRestRooms = []
        for (const room of rooms) {
            realRestRooms.push(room.id)
        }
        if(realRestRooms.includes(this.room) || cameraRoom==this.room){
            this.walls = walls
            this.doors = doors
            this.cameraPosition = cameraPosition
            this.rotateSoilder(cameraPosition, cameraRoom)

            if(this.attack){
                const material = new THREE.MeshBasicMaterial({
                    map: this.textures[this.atackAnimation],
                    transparent: true
                })
                this.mesh.material = material
            }

            if(this.shot){
                console.log("fire");
                this.shot = false
                return true }
            else{ return false }
        }else{ return false }
    }
    showGunAnimation(){
        if(this.atackAnimation==15 || this.rotate!=0){
            clearInterval(this.gunAnimation)
            this.fire()
            this.gunAnimation = setInterval(this.hideGunAnimation, 100)
        }else{
            this.atackAnimation+=1
        }
    }
    hideGunAnimation(){
        if(this.atackAnimation<=13 || this.rotate!=0 || this.died===true){
            clearInterval(this.gunAnimation)
            this.showGun = false
            this.nextFire = Date.now()+1000
        }else{
            this.atackAnimation-=1
        }
    }
    fire(){
        const y1 = this.cameraPosition.z
        const x1 = this.cameraPosition.x

        const y2 = this.position.z*4
        const x2 = this.position.x*4-2

        const [wa, wb] = this.wyznaczniki(y1, y2, x1, x2)

        if(this.checkFire(this.cameraPosition, 1, wa, wb)){
            let rr
            if(this.soilderRotate>180)
                rr=360-this.soilderRotate+this.realRotation
            else
                rr= this.realRotation-this.soilderRotate
            
            if(rr<0){
                rr = 360+rr
            }
            this.rr = rr

            this.shot = true
        }
    }
    rotateSoilder(cameraPosition){
        const y1 = cameraPosition.z
        const x1 = cameraPosition.x

        const y2 = this.position.z*4
        const x2 = this.position.x*4-2

        const [wa, wb] = this.wyznaczniki(y1, y2, x1, x2)
        this.wa = wa
        this.wb = wb

        let rotate
        if(cameraPosition.x>this.position.x*4-2){
            if(cameraPosition.z>this.position.z*4){
                rotate = (90-(Math.atan(wa)*180/Math.PI))+180+this.realRotation
            }
            if(cameraPosition.z<=this.position.z*4){
                rotate = (90-(Math.atan(wa)*180/Math.PI))+180+this.realRotation
            }
        }
        if(cameraPosition.x<=this.position.x*4-2){
            if(cameraPosition.z>this.position.z*4){
                rotate = 90-(Math.atan(wa)*180/Math.PI)+this.realRotation
            }
            if(cameraPosition.z<=this.position.z*4){
                rotate = 90-(Math.atan(wa)*180/Math.PI)+this.realRotation
            }
        }

        rotate = rotate%360
        this.soilderRotate = rotate

        if(this.attack==true){
            this.rotate = 0
            if(this.nextFire!=null && this.nextFire!=-123 && Date.now()>this.nextFire && this.showGun==false && this.checkFire(cameraPosition, 0.5, wa, wb)){
                this.nextFire=null
                this.atackAnimation=13
                this.showGun == true
                this.attack = true
                this.gunAnimation = setInterval(this.showGunAnimation, 100)
            }
            if(this.nextFire==-123){
                this.nextFire=null
                this.atackAnimation=13
                this.showGun == true
                this.attack = true
                this.gunAnimation = setInterval(this.showGunAnimation, 100)
            }
            this.mesh.rotation.y = rotate*(Math.PI/180)
        }
        else{
            if(rotate<=45 || rotate>315){
                if(this.checkFire(cameraPosition, 0.5, wa, wb)){
                    this.atackAnimation=13
                    this.nextFire=null
                    this.showGun == true
                    this.attack = true
                    this.gunAnimation = setInterval(this.showGunAnimation, 100)
                }
                this.rotate = 0
            }
            if(rotate>45 && rotate<=55){
                this.rotate = 1
            }
            if(rotate>55 && rotate<=125){
                this.rotate = 2
            }
            if(rotate>125 && rotate<=145){
                this.rotate = 3
            }
            if(rotate>145 && rotate<=215){
                this.rotate = 4
            }
            if(rotate>215 && rotate<=235){
                this.rotate = 5
            }
            if(rotate>235 && rotate<=305){
                this.rotate = 6
            }
            if(rotate>305 && rotate<315){
                this.rotate = 7
            }

            const material = new THREE.MeshBasicMaterial({
                map: this.textures[this.rotate],
                transparent: true
            })
            this.mesh.material = material
            this.mesh.rotation.y = rotate*(Math.PI/180)
        }
    }
    isOnFiringLine(cameraPosition, walls, doors, wa, wb, staticX, staticY, rot, rr){
        const realWalls = []
        const realDoors = []

        for (const wall of walls) {
            realWalls.push({
                id: wall.info.id,
                startX: wall.startX,
                endX: wall.endX,
                startZ: wall.startZ,
                endZ: wall.endZ
            })
        }

        for (const door of doors) {
            realDoors.push({
                id: door.info.id,
                startX: door.info.startPoint[0]*4-(door.info.boxSize[0]/2)-2,
                endX: door.info.startPoint[0]*4+(door.info.boxSize[0]/2)+2,
                startZ: door.info.startPoint[1]*4-(door.info.boxSize[1]/2)-2,
                endZ: door.info.startPoint[1]*4+(door.info.boxSize[1]/2)+2,
                isOpen: door.isOpen
            })
        }
        
        const tolerance = 4
        if(staticX){
            const move = (rot==180) ? 0.1 : -0.1
            let z = cameraPosition.z
            let end = false
            
            if(cameraPosition.x-2>=this.position.x*4-2 || cameraPosition.x+2 <=this.position.x*4-2){ return false }
            while(!end){

                z += move
                
                for (const el of realWalls) {
                    if(el.startX-0.1<=cameraPosition.x && el.endX+0.1>=cameraPosition.x && el.startZ-0.1<z && z<el.endZ+0.1){
                        return false
                    }
                }  
                
                for (const el of realDoors) {
                    if(el.startX+0.1<=cameraPosition.x && el.endX-0.1>=cameraPosition.x && el.startZ+0.1<z && z<el.endZ-0.1 && el.isOpen==false){
                        return false
                    }
                }

                if(this.position.z*4-tolerance<=z && z<=this.position.z*4+tolerance){
                    return true
                }

                if((z>this.position.z*4 && move>0) || (z<this.position.z*4 && move<0) || z<0){
                    end=true
                }
            }
        }
        if(staticY){
            const move = (rot==90) ? 0.1 : -0.1
            let x = cameraPosition.x
            let end = false
            
            if(cameraPosition.z-2>=this.position.z*4 || cameraPosition.z+2 <=this.position.z*4){ return false }
            while(!end){
                x += move
                
                for (const el of realWalls) {
                    if(el.startX-0.1<=x && el.endX+0.1>=x && el.startZ-0.1<cameraPosition.z && cameraPosition.z<el.endZ+0.1){
                        return false
                    }
                }  
                
                for (const el of realDoors) {
                    if(el.startX+0.1<=x && el.endX-0.1>=x && el.startZ+0.1<cameraPosition.z && cameraPosition.z<el.endZ-0.1 && el.isOpen==false){
                        return false
                    }
                }

                if(this.position.x*4-2-tolerance<=x && x<=this.position.x*4-2+tolerance){
                    return true
                }

                if((x>this.position.x*4-2 && move>0) || (x<this.position.x*4-2 && move<0) || x<0){
                    end=true
                }
            }
        }
        if(!staticX && !staticY){
            if(rr<180){
                let end = false
                let counter = cameraPosition.x
                let stan = true

                while(!end){
                    counter+=0.1
                    const y = wa*counter+wb
    
                    for (const el of realWalls) {
                        if(el.startX+0.5<=counter && el.endX-0.5>=counter && el.startZ+0.5<y && y<el.endZ-0.5){
                            return false
                        }
                    }  
                    for (const el of realDoors) {
                        if(el.startX+0.1<=counter && el.endX-0.1>=counter && el.startZ+0.1<y && y<el.endZ-0.1 && el.isOpen==false){
                            return false
                        }
                    }
    
                    if(counter<this.position.x*4-2+0.2 && this.position.x*4-2-0.2<counter && y<this.position.z*4+tolerance && this.position.z*4-tolerance<y){
                        return true
                    }
    
                    if(counter>this.position.x*4-2+tolerance){
                        end = true
                    }
                }
            }else{
                let end = false
                let counter = cameraPosition.x
                let stan = true

                while(!end){
                    counter-=0.1
                    const y = wa*counter+wb
    
                    for (const el of realWalls) {
                        if(el.startX+0.5<=counter && el.endX-0.5>=counter && el.startZ+0.5<y && y<el.endZ-0.5){
                            return false
                        }
                    }  
                    for (const el of realDoors) {
                        if(el.startX+0.1<=counter && el.endX-0.1>=counter && el.startZ+0.1<y && y<el.endZ-0.1 && el.isOpen==false){
                            return false
                        }
                    }
    
                    if(counter<this.position.x*4-2+0.2 && this.position.x*4-2-0.2<counter && y<this.position.z*4+tolerance && this.position.z*4-tolerance<y){
                        return true
                    }
    
                    if(counter<this.position.x*4-2-tolerance){
                        end = true
                    }
                }

            }
        }
        

        return false  
    }
    checkFire(cameraPosition, tolerance, wa, wb){
        const realWalls = []
        const realDoors = []
        for (const wall of this.walls) {
            realWalls.push({
                id: wall.info.id,
                startX: wall.startX,
                endX: wall.endX,
                startZ: wall.startZ,
                endZ: wall.endZ
            })
        }

        for (const door of this.doors) {
            realDoors.push({
                id: door.info.id,
                startX: door.info.startPoint[0]*4-(door.info.boxSize[0]/2),
                endX: door.info.startPoint[0]*4+(door.info.boxSize[0]/2),
                startZ: door.info.startPoint[1]*4-(door.info.boxSize[1]/2),
                endZ: door.info.startPoint[1]*4+(door.info.boxSize[1]/2),
                isOpen: door.isOpen
            })
        }

        if(cameraPosition.x<=this.position.x*4-2){
            let end = false
            let counter = this.position.x*4-2
            while(!end){
                counter -= 0.05
                const y = wa*counter+wb
                
                for (const el of realWalls) {
                    if(el.startX-0.1<=counter && el.endX+0.1>=counter && el.startZ-0.1<y && y<el.endZ+0.1-tolerance){
                        return false
                    }
                }  
                
                for (const el of realDoors) {
                    if(el.startX-0.1<=counter && el.endX+0.1>=counter && el.startZ-0.1<y && y<el.endZ+0.1 && el.isOpen==false){
                        return false
                    }
                }

                if(counter<cameraPosition.x){
                    end = true
                }
            }
            return true
        }else{
            let end = false
            let counter = this.position.x*4-2
            while(!end){
                counter += 0.05
                const y = wa*counter+wb
                
                for (const el of realWalls) {
                    if(el.startX-0.1<=counter && el.endX+0.1>=counter && el.startZ-0.1<y && y<el.endZ+0.1){
                        return false
                    }
                } 

                for (const el of realDoors) {
                    if(el.startX-0.1<=counter && el.endX+0.1>=counter && el.startZ-0.1<y && y<el.endZ+0.1 && el.isOpen==false){
                        return false
                    }
                }

                if(counter>cameraPosition.x){
                    end = true
                }
            }
            return true
        }
    }
    hit(){
        this.attack = true
        this.lives-=1.1
    }
    startDied(){
        this.died = true
        this.atackAnimation = 7
        this.diedAnim = setInterval(this.diedAnimation, 100)
    }
    diedAnimation(){
        this.atackAnimation +=1
        const material = new THREE.MeshBasicMaterial({
            map: this.textures[this.atackAnimation],
            transparent: true
        })
        this.mesh.material = material
        if(this.atackAnimation>11){
            setTimeout(() => {
                const material = new THREE.MeshBasicMaterial({
                    map: this.textures[12],
                    transparent: true
                })
                this.mesh.material = material
            }, 200)
            clearInterval(this.diedAnim)
        }
    }
    rotateAfterDied(cameraPosition){
        const y1 = cameraPosition.z
        const x1 = cameraPosition.x

        const y2 = this.position.z*4
        const x2 = this.position.x*4-2

        const [wa, wb] = this.wyznaczniki(y1, y2, x1, x2)
        this.wa = wa
        this.wb = wb

        let rotate
        if(cameraPosition.x>this.position.x*4-2){
            if(cameraPosition.z>this.position.z*4){
                rotate = (90-(Math.atan(wa)*180/Math.PI))+180+this.realRotation
            }
            if(cameraPosition.z<=this.position.z*4){
                rotate = (90-(Math.atan(wa)*180/Math.PI))+180+this.realRotation
            }
        }
        if(cameraPosition.x<=this.position.x*4-2){
            if(cameraPosition.z>this.position.z*4){
                rotate = 90-(Math.atan(wa)*180/Math.PI)+this.realRotation
            }
            if(cameraPosition.z<=this.position.z*4){
                rotate = 90-(Math.atan(wa)*180/Math.PI)+this.realRotation
            }
        }

        rotate = rotate%360
        this.mesh.rotation.y = rotate*(Math.PI/180)
    }
    funkcja(a, x, b){
        return a*x+b
    }
    rowananie(y, a, x){
        const b = y-(a*x)
        return b
    }
    wyznaczniki(y1, y2, x1, x2){
        const w = x1-x2
        const w1 = y1-y2
        const w2 = (x1*y2)-(x2*y1)

        const a = w1/w
        const b = w2/w
        return [a, b]
    }
}