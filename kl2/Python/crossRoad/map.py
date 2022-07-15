from random import randrange
class Map:
    def sartGenerate(self):
        map = []
        # dodanie do mapy pierszych wierszy
        map.append({"object": self.generateStart()})
        map.append({"object": self.generateStart()})

        left = 9
        bezTrawy = 0
        while left>0:
            los = randrange(1, 4)
            # jeśli wylosowano trawę lub niebyło jej przez 3 bloki(ułatwienie mające na celu wolniejsze zniechęcenie gracza przez niewielki wynik)
            if los == 1 or bezTrawy>=3:
                bezTrawy = 0
                # wylosuj liczbę lini trawy
                size = randrange(1, 3)
                for a in range(0, size):
                    # wygeneruj trawę i dodaj do mapy
                    line = self.generateGarss()
                    map.append({"object": line})

                # zmnniejsz pozostałą ilość bloków
                left -= size
            elif los==2:
                # jeśli wylosowano 2
                # zwiększ liczbę lini bez trawy  zmniejsz pozostałe linie
                bezTrawy+=1
                left-=1

                # wygeneruj i dołącz pociąg do mapy
                train = self.generateTraine()
                map.append({"object": train})
            else:
                # jeśli wyloswano 3

                # wylosuj liczbę lini trawy
                size = randrange(1, 3)
                for a in range(0, size):
                    # wygeneruj trawę i dołącz ją do mapy
                    rode = self.generateRode()
                    map.append({"object": rode[0], "car": rode[1]})
                    
                    # zwiększ liczbę lini bez trawy zmniejsz pozostałe linie
                    bezTrawy+=1

                # zmniejsz liczbe pozosałych lini trawy
                left -= size
        return map

    def getNewLine(self):
        # wylosuj rodzaj lini
        los = randrange(1, 5)
        if los == 1:
            # jeśli 1 zwróć trawę
            line = self.generateGarss()
            map = { "type": "grass", "object": line }
        elif los==2:
            # jeśli 1 zwróć pociąg
            train = self.generateTraine()
            map = { "type": "train", "object": train }
        else:
            # jeśli nie 1 lub 2 zwróć drogę
            rode = self.generateRode()
            map = { "type": "road", "object": rode[0], "car": rode[1] }

        return map

    def generateTraine(self):
        # zwrace tablicę 11 elementów
        line = []
        for a in range(0, 11):
            line.append("train")
        return line

    def generateRode(self):
        # zwrace tablicę 11 elementów "street"
        line = []
        car = []
        countCar = 0
        for a in range(0, 11):
            line.append("street")
            # jeśli jest mniej niż 6 samochodów 
            if countCar<6:
                # wylosuj czy ma pojawić się samochud
                if randrange(0, 3)==1:
                    countCar+=1
                    car.append(a)

        # eśli samochodów jest mniej niż 3 wstaw samochowy na konkretne pozycję
        if len(car)<3:
            car.append(0)
            car.append(5)
            car.append(9)

        return [line, car]

    def generateGarss(self):
        line = []
        for a in range(0, 11):
            los = randrange(0, 3)
            # jeśli wylosowano 2 i a!=5 to dodaj dzrewo
            if los == 2 and a != 5:
                line.append("tree")
            else:
                # w przeciwnym razie dodag trawę
                line.append("grass")
        return line

    def generateStart(self):
        line = []
        # wygeneruj tablicę 11x trawa
        for a in range(0, 11):
            line.append("grass")

        for a in range(0, 11):
            a = randrange(0, 9)
            # jeśli wylosowano coś innego niż 5 to zamień trawę na drzewo
            if a != 5:
                line[a] = "tree"
        return line