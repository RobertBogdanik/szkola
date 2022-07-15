from  turtle import Turtle

import random

class Jedzenie(Turtle):
    def __init__(self):
        super().__init__()
        self.shape("circle")
        self.penup()
        self.pensize(0.5)
        self.color("red")
        self.odswierz()

    def odswierz(self):
        x = random.randrange(-280, 280)
        y = random.randrange(-280, 280)
        self.goto(x, y)
