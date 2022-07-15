import '../node_modules/three/build/three.min.js'
import Screen from './src/screen.js'

class Game{
	constructor(){
		this.lives = 3
		this.level = 0
		this.levelList = ["level1_1"]


		this.onGame = this.onGame.bind(this)

		this.startingScreen()
	}

	startingScreen(){
		this.screen = new Screen(this.levelList[0], this.lives)
		
		this.screen.startGenerate()

		setInterval(this.onGame, 200)

	}

	onGame(){
		if(this.screen.diedBool==true){
			this.lives-=1
			if(this.lives<=0){ this.level = 0 }

			this.screen = new Screen(this.levelList[this.level], this.lives)

			document.body.removeChild(document.querySelector("canvas"))
			document.body.removeChild(document.querySelector("img"))
			setTimeout(() => {
				this.screen.startGenerate()
				document.body.style.opacity = 1
			}, 700)
		}
		if(this.screen.levelCompleate==true){
			this.level+=1

			document.body.removeChild(document.querySelector("canvas"))
			document.body.removeChild(document.querySelector("img"))

			if(this.level>this.levelList.length){
				this.endGame()
			}else{
				this.screen = new Screen(this.levelList[this.level], this.lives)
			}
		}
	}

	endGame(){
		console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
	}
}

const a = new Game()