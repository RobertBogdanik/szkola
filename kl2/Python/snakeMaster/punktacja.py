from turtle import Turtle

import random

class Punktacja(Turtle):
    def __init__(self):
        super().__init__()
        self.wynik = 0
        self.penup()
        self.goto(0, 270)
        self.