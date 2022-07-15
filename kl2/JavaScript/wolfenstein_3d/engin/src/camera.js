import './../../node_modules/three/build/three.min.js'

export default class Camera{
    constructor(){
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.z = 8;
        this.camera.position.y = 2;
        this.camera.position.x = 27*4;
        this.rr = 90
        this.rotate = 0

        this.rotateLeft = this.rotateLeft.bind(this)
        this.rotateRight = this.rotateRight.bind(this)
    }
    setRotation(rotate){
        this.rotate = rotate
    }
    rotateRight(){
        this.rr += 6
        if(this.rr<0){ this.rr = 360+this.rr }
        this.rr %= 360
        this.rotate -= 6
        this.rotate %= 360
        this.camera.rotation.y = Math.PI * this.rotate * 0.0055555555555556

        return [this.camera.position.x, this.camera.position.y, this.camera.position.z]
    }
    rotateLeft(){
        this.rr -= 6
        if(this.rr<0){ this.rr = 360+this.rr }
        this.rotate += 6
        this.rotate %= 360
        this.camera.rotation.y = Math.PI * this.rotate * 0.0055555555555556

        return [this.camera.position.x, this.camera.position.y, this.camera.position.z]
    }
}