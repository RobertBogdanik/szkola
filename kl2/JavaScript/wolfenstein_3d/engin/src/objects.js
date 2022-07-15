import Material from "./material.js";
import './../../node_modules/three/build/three.min.js'

class Wall extends Material{
    constructor(info){
        super()
        this.info = info
        this.startX = this.info.startPoint[0]*4 <= 0 ? 0 : this.info.startPoint[0]*4-2
        this.endX = this.startX+4
        this.startZ = this.info.startPoint[1]*4 <= 0 ? 0 : this.info.startPoint[1]*4-2
        this.endZ = this.startZ+4

        this.startX -= 0.5
        this.endX += 0.5
        this.startZ -= 0.5
        this.endZ += 0.5
    }
    show(){ 
        if(this.info.type=="static"){
            return this.showStatic()
        }else{
            return this.showMulti()
        }
    }
    showStatic(){
        const geometry = new THREE.BoxGeometry( 4, 4, 4 );
		const material = this.getMaterial(this.info.metirial)
        const mesh = new THREE.Mesh( geometry, material )

        mesh.position.y=2
        mesh.position.x=this.info.startPoint[0]*4
        mesh.position.z=this.info.startPoint[1]*4

        return mesh
    }
    showMulti(){
        const geometry = new THREE.BoxGeometry( 4, 4, 4 );
		const material = []
        for (const el of this.info.metirialList) {
            material.push(this.getMaterial(el))
        }
        const mesh = new THREE.Mesh( geometry, material )

        mesh.position.y=2
        mesh.position.x=this.info.startPoint[0]*4
        mesh.position.z=this.info.startPoint[1]*4

        return mesh
    }
}

class Door extends Material{
    constructor(info){
        super()
        this.info = info
        this.detection = this.info.detection
        this.isAnimated = false
        this.isOpen = false

        this.openStep = 0

        this.animateOpen = this.animateOpen.bind(this)
        this.animateClose = this.animateClose.bind(this)
    }

    show(){
        const geometry = new THREE.BoxGeometry( this.info.boxSize[0], this.info.boxSize[1], this.info.boxSize[2] );
		const material = this.getMaterial("door")
        const mesh = new THREE.Mesh( geometry, material )

        mesh.position.y=2
        mesh.position.x=this.info.startPoint[0]*4
        mesh.position.z=this.info.startPoint[1]*4

        this.mesh = mesh
        return mesh
    }

    animateOpen(){
        this.openStep+=1
        if(this.openStep>7){
            this.mesh.position.x += 0.01
            this.mesh.position.z += 0.01
            this.isOpen = true
            clearInterval(this.interval)
        }
        this.mesh.position.x += this.info.xMove
        this.mesh.position.z += this.info.zMove
    }
    animateClose(){
        this.openStep+=1
        if(this.openStep>7){
            clearInterval(this.interval)
            this.isAnimated = false
            this.mesh.position.y=2
            this.mesh.position.x=this.info.startPoint[0]*4
            this.mesh.position.z=this.info.startPoint[1]*4
        }else{
            this.mesh.position.x -= this.info.xMove
            this.mesh.position.z -= this.info.zMove
        }
    }

    open(){
        if(!this.isAnimated){
            this.isAnimated = true
            this.openStep = 0
            this.interval = setInterval(this.animateOpen, 100)
        }
    }
}

class Floor extends Material{
    constructor(width, height) {
        super()

        this.width = width,
        this.height = height
    }
    generateFloor(){
        const geometry = new THREE.BoxGeometry( this.width*4, 1, this.height*4 );
		const material = new THREE.MeshBasicMaterial({ color: "#778088" })
        const mesh = new THREE.Mesh( geometry, material )

        mesh.position.y=-0.5
        mesh.position.x=this.width*2-2
        mesh.position.z=this.height*2-2

        return mesh
    }
}

class Ceiling extends Material{
    constructor(width, height) {
        super()

        this.width = width,
        this.height = height
    }
    generateCeiling(){
        const geometry = new THREE.BoxGeometry( this.width*4, 1, this.height*4 );
		const material = new THREE.MeshBasicMaterial({ color: "#3b4044" })
        const mesh = new THREE.Mesh( geometry, material )

        mesh.position.y = 5
        mesh.position.x=this.width*2-2
        mesh.position.z=this.height*2-2

        return mesh
    }
}
export {
    Wall, 
    Door,
    Floor, 
    Ceiling
}