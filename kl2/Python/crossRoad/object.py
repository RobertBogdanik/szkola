from turtle import Turtle

class Objects:
    def __init__(self):
        pass

    def generateSectionBlock(self, a, b):
        section = Turtle()
        section.speed(10)
        section.shape("square")
        section.penup()
        section.left(90)
        section.setx(-300 + (b * 60))
        section.sety(-270 + (a * 60))
        section.turtlesize(3)

        return section

    def generateTree(self, a, b):
        treeA = Turtle()
        treeA.speed(10)
        treeA.left(90)
        treeA.penup()
        treeA.goto(-300 + (b * 60), -270 + (a * 60))
        treeA.forward(5)
        treeA.color("red")

        treeB = Turtle()
        treeB.speed(10)
        treeB.left(90)
        treeB.penup()
        treeB.goto(-300 + (b * 60), -270 + (a * 60))
        treeB.back(5)
        treeB.color("red")

        return [treeA, treeB]

    def generateCar(self, el, a):
        nCar = Turtle()
        nCar.speed(10)
        nCar.color("red")
        nCar.penup()
        nCar.setx(-300 + (el * 60))
        nCar.sety(-270 + (a * 60))
        
        return nCar