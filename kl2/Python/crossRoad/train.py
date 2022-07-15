from turtle import Turtle
from random import randrange
from time import time
class Train:
    def __init__(self, line):
        self.last = time()
        self.status = 1
        self.train = []
        self.line = line
        self.interval = randrange(2, 10)
        self.firstInterval = randrange(0, 3)
        self.first = True
        self.start()

    def start(self):
        if self.line<=5:
            self.line = -(5-self.line)+0.5
        else:
            self.line = self.line-5+0.5

    def update(self):
        # sprawdzenie czy pociąg ma stan 1 - czekanie
        if self.status==1:
            # jeśli jeszcze nie jechał poczekaj krutko
            if time() > self.last+self.firstInterval and self.first == True:
                self.status = 2
                self.train = []
                self.first = False
                self.generateTain()

            # jeśli już jecał poczekaj długo
            if time() > self.last+self.interval and self.first == False:
                self.status = 2
                self.train = []
                self.generateTain()

        # jeśli status 2 - jazda
        elif self.status==2:
            # sprawdz czy pociąg już przejechał
            if self.train[len(self.train)-1].position()[0]>350:
                self.status = 1
                self.removeTrain()
                self.train = []
                self.last = time()
            else:
                # jeśli nie przesuń pociąg
                self.moveTrain()


    def generateTain(self):
        # wygeneruj pociąg poza ekranem
        x = -300
        for i in range(randrange(7, 20)):
            wagon = Turtle()
            wagon.color("red")
            wagon.penup()
            wagon.shape("square")
            wagon.goto(x, self.line*60)
            x-=20
            self.train.append(wagon)

    def moveTrain(self):
        # przeszun karzydy wagon o 20
        for wagon in self.train:
            wagon.forward(20)

    def down(self):
        # obniż pociąg(przy ruchu w górę)
        self.line-=1
        for train in self.train:
            train.left(90)
            train.back(60)
            train.right(90)

    def checkColision(self, pos):
        # sprawdź czy gracz nie wszedł na pociąg
        colision = False
        for wagon in self.train:
            if wagon.distance(pos)<25:
                colision = True
        return colision
    
    def removeTrain(self):
        for wagon in self.train:
            wagon.hideturtle()
