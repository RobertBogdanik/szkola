from random import randrange

from train import Train
from turtle import Turtle
from object import Objects

class Zones(Objects):
    def __init__(self):
        self.blocks = []
        self.car = []
        self.train = []
        self.tree = []
        self.toDown = 0

    def startGame(self, map, line):
        # a-licznik wierszy; b-licznik kolumn
        a=line
        while a<line+11:
            b=0
            lineElements = []
            while b<11:
                # odczytanie wiersza bloku
                block = map[a]["object"][b]

                # stworzenie tła
                section = self.generateSectionBlock(a, b)

                # wygenerowanie obiektów i ustawienie tła sekcji
                if block=="grass":
                    section.fillcolor("green")
                elif block=="tree":
                    section.fillcolor("green")
                    trees = self.generateTree(a, b)
                    
                    self.tree.append({"line": a, "x": b,"obj": trees[0]})
                    self.tree.append({"line": a, "x": b,"obj": trees[1]})
                elif block=="street":
                    section.fillcolor("blue")
                elif block=="train":
                    section.fillcolor("black")

                    # stwórz pociąg tylko wtedy kiedy generuje lewą sekcję
                    if b==0:
                        trainObj = Train(a)
                        self.train.append({"line": a, "obj": trainObj})
                b+=1

                # dodaj sekcje do wiersza
                lineElements.append(section)
            # dodaj wiersz do mapy
            self.blocks.append(lineElements)

            # dodaj samocody w wierszu
            # jeśli wiersz jest drogą
            if map[a]["object"][0]=="street":
                # wylosuj pręktosć wiersza
                speed = randrange(1, 5)
                # jeśli w planie jest samochód
                for el in map[a]["car"]:
                    # stwórz samochud i dodaj do listy
                    nCar = self.generateCar(el, a)
                    self.car.append({"line": a, "obj": nCar, "speed": speed})
            a+=1

    def moveMap(self, map):
        # przenoszenie pociągów
        tr = []
        a = 0
        for train in self.train:
            train["obj"].down()
            if train["obj"].line<-6:
                tr.append(a)
            else:
                a+=1
        # usunięcie zbędnych pociągów
        for el in tr:
            self.train.pop(el)

        # PRZENOSZENIE SEKCJI
        for el in self.blocks:
            for a in el:
                a.back(60)

        # usunięcie dolnej sekcji
        self.blocks.pop(0)

        
        # przesunięcie drzew i usunięcie poza ekranem
        a=0
        toRemoveTree=[]
        for tree in self.tree:
            tree["obj"].back(60)
            tree["line"]-=1
            if tree["line"] < 0:
                toRemoveTree.append(a)
            else:
                a+=1
                
        for i in toRemoveTree:
            self.tree.pop(i)

        # przenoszenie aut
        for el in self.car:
            el["obj"].left(90)
            el["obj"].back(60)
            el["obj"].right(90)
            el["line"]-=1

        # wychwycenie i usunięcie aut poza mapą
        a=0
        list = []
        for el in self.car:
            if el["line"] < 0:
                list.append(a)
            else:
                a+=1
        for i in list:
            self.car.pop(i)

    def addNewLine(self, line, firstLine):
        lineElements = []
        # train = False
        for b in range(0, 11):
            # odczytanie sekcji nowej lini
            block = line["object"][b]
            
            # stworzenie tła
            section = self.generateSectionBlock(firstLine+11, b)

            # wygenerowanie obiektów i ustawienie tła sekcji
            if block == "grass":
                section.fillcolor("green")
            elif block == "tree":
                section.fillcolor("green")
                trees = self.generateTree(firstLine+11, b)
                
                self.tree.append({"line": firstLine+11, "x": b, "obj": trees[0]})
                self.tree.append({"line": firstLine+11, "x": b, "obj": trees[1]})
            elif block == "street":
                section.fillcolor("blue")
            elif block == "train":
                section.fillcolor("black")

                # stwórz pociąg tylko wtedy kiedy generuje lewą sekcję
                if b==0:
                    trainObj = Train(firstLine+11)
                    self.train.append({"line": firstLine+11, "obj": trainObj})

            # dodaj sekcje do wiersza
            lineElements.append(section)
        # dodaj wiersz do mapy
        self.blocks.append(lineElements)

        # dodaj samocody w wierszu jeśli wiersz jest drogą
        if line["object"][0] == "street":
            # wylosuj prędkosćć wiersza
            speed = randrange(1, 5)

            # jeśli w planie jest samochód
            for el in line["car"]:
                # stwórz samochud i dodaj do listy
                nCar = self.generateCar(el, firstLine+11)
                self.car.append({"line": firstLine+11, "obj": nCar, "speed": speed})

    def updateZone(self):
        # aktualizacaj pociągów
        for train in self.train:
            train["obj"].update()

        # przesunięcie samochodów
        for obj in self.car:
            obj["obj"].forward(obj["speed"])

            # jeśli samochud wyszedł poza ekran przesuń go na przeciwną strone ekranu
            if obj["obj"].position()[0]>320:
                obj["obj"].setx(-320)

    def getBottomLine(self):
        # pobieranie pozycji drzew w dolnej lini
        trees = []
        for tree in self.tree:
            if tree["line"] == 0:
                trees.append(tree)
        return trees

    def getSubBottomLine(self):
        # pobieranie pozycji drzew w przed dolnej lini
        trees = []
        for tree in self.tree:
            if tree["line"] == 1:
                trees.append(tree)
        return trees

    def checkColision(self, pos):
        endGame = False
        # sprawdzenie kolizji z samochodami
        for car in self.car:
            if car["obj"].distance(pos)<30:
                endGame = True
        
        # sprawdzanie kolizji z pociągami
        for train in self.train:
            if train["obj"].checkColision(pos):
                endGame = True

        return endGame
