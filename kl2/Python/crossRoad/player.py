from turtle import Turtle

class Player(Turtle):
    def __init__(self, posit):
        super(Player, self).__init__()
        self.posit = posit
        self.penup()
        self.left(90)
        self.goto(60*self.posit, -270)
        self.showturtle()
        self.shape("square")
        self.color("red")

    def moveLeft(self):
        if self.posit>=-4:
            self.posit-=1
        self.goto(60*self.posit, -270)

    def moveRight(self):
        if self.posit<=4:
            self.posit+=1
        self.goto(60*self.posit, -270)