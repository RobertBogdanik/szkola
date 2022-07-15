import './../../node_modules/three/build/three.min.js'

export default class Material{
    getMaterial(material){
        const fileList = ["darkWood", "blueCard", "darkBlue1", "darkBlue2", "blueWall", "darkFlag", "darkGreyWall1", "darkGreyWall2", "darkGreyWall3", "door", "doorHinge", "flag", "greyWall1", "greyWall2", "greyWall3", "flag"]
        if(fileList.find(el => el == material)){
            const texture = new THREE.TextureLoader().load("./texture/"+material+".jpg")
            return new THREE.MeshBasicMaterial({ map: texture })
        }else{
            const texture = new THREE.TextureLoader().load("./texture/greyWall1.jpg")
            return new THREE.MeshBasicMaterial({ map: texture })
        }
    }
}