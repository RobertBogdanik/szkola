from turtle import Turtle

KSZTLT = "square"
KOLOR = "white"
POZYCJAX = 0
POZYCJAY = 0
RUCH = 20

class Waz:
    def __init__(self, dlugosc):
        self.dlugosc = dlugosc
        self.waz = []
        przesuniecie = 0
        for el in range(self.dlugosc):
            w=Turtle(KSZTLT)
            w.color(KOLOR)
            w.penup()
            w.goto(POZYCJAX+przesuniecie, POZYCJAY)
            przesuniecie -=20

            self.waz.append(w)

    def ruch(self):
        for el in range(self.dlugosc-1,0, -1):
            x = self.waz[el - 1].position()[0]
            y = self.waz[el - 1].position()[1]
            self.waz[el].goto(x, y)
        self.waz[0].forward(RUCH)
    def prawa(self):
        if self.waz[0].heading()!=180:
            self.waz[0].setheading(0)
    def lewa(self):
        if self.waz[0].heading()!=0:
            self.waz[0].setheading(180)
    def gora(self):
        if self.waz[0].heading()!=270:
            self.waz[0].setheading(90)
    def dol(self):
        if self.waz[0].heading()!=90:
            self.waz[0].setheading(270)
