from turtle import Turtle
from time import sleep

from zones import Zones
from map import Map
from player import Player

class Engine(Zones):
    def __init__(self):
        super().__init__()
        self.isGame = True
        self.map = []
        self.gameEnd = False
        self.score = 0
        self.line = 0
        self.mapConstructor = Map()

        self.start()

    def start(self):
        # odczyt dotychczasowego rekordu
        try:
            file = open("./score.txt", "r")
            self.hightScore = file.read()
            file.close()
        except:
            self.hightScore=0

        # napisy na ekranie początkowym przez 4 sekundy
        text = Turtle()
        text.hideturtle()
        text.color("white")
        text.penup()
        text.pensize(3)
        text.back(80)
        text.left(90)
        text.write("Up arrow - move top")
        text.back(40)
        text.write("Left arrow - move left")
        text.back(40)
        text.write("Right arrow - move right")
        sleep(4)

        # wygenerowanie mapy
        self.map = self.mapConstructor.sartGenerate()

        # uruchomienie rysowania mapy
        self.startGame(self.map, self.line)

        # postawienie gracza
        self.player = Player(0)

    def update(self):
        # sprawdzenie czy zachodzi kolizja, jeśłi tak zakończenie gry
        colision = self.checkColision(self.player.position())
        if colision:
            self.isGame = False

        # aktualizacja ruchu elementów
        self.updateZone()

    def eventTop(self):
        # ustalenie  na którym bloku znajduje się gracz
        posit = self.player.posit
        if posit<0:
            posit = 5-(posit*-1)
        else:
            posit = posit+5

        # pobranie drugiej od dołu lini
        topTree = self.getSubBottomLine()

        # sprawdzenie czy ruch w górę jest możliwy (nie jest blokowany przez drzewo)
        acces = True
        for tree in topTree:
            if tree["x"] == posit:
                acces=False

        # jeśli ruch jest mozliwy
        if acces:
            # stwórz nowego gracza(przesuń na wyższą warstwę)
            posit = self.player.posit
            self.player.hideturtle()
            self.player = Player(posit)

            # stwórz nową linię i usuń dolną
            newLine = self.mapConstructor.getNewLine()
            self.map.append(newLine)
            self.map.pop(0)

            # dodaj nową linię i przesuń mapę w dól
            self.addNewLine(newLine, self.line)
            self.moveMap(self.map)

            # zwiększ licznik punktów
            self.score+=1

    def eventLeft(self):
        # ustalenie  na którym bloku znajduje się gracz
        posit = self.player.posit
        if posit<0:
            posit = 5-(posit*-1)
        else:
            posit = posit+5
        posit -= 1

        # pobierz aktualną linię i sprawdź czy ruch nikoliduje z graczę
        trees = self.getBottomLine()
        acces = True
        for tree in trees:
            if tree["x"] == posit:
                acces=False
        
        # jeśli nie koliduje
        if acces:
            # przesuń gracza w lewo
            self.player.moveLeft()

    def eventRight(self):
        # ustalenie  na którym bloku znajduje się gracz
        posit = self.player.posit
        if posit<0:
            posit = 5-(posit*-1)
        else:
            posit = posit+5
        posit += 1

        # pobierz aktualną linię i sprawdź czy ruch nikoliduje z graczę
        trees = self.getBottomLine()
        acces = True
        for tree in trees:
            if tree["x"] == posit:
                acces=False

        # jeśli nie koliduje
        if acces:
            # przesuń gracza w prawo
            self.player.moveRight()

    def cancelGame(self):
        # zakończ grę
        self.gameEnd = True
        self.isGame = False
