from turtle import Screen, Turtle
from time import sleep
from engine import Engine

# ustawienie ekranu
screen = Screen()
screen.setup(660, 600)
screen.bgcolor("black")
screen.title("Crossy road")
screen.tracer(0)
screen.listen()

while True:
    # stworzenie elementów gry
    engine = Engine()

    # gra
    while engine.isGame:
        # aktualizacja gry i okna
        engine.update()
        screen.update()

        # czekanie (60fps => 0.017)
        sleep(0.017)

        # zdarzenia klawiatury
        screen.onkey(engine.eventTop, "Up")
        screen.onkey(engine.eventLeft, "Left")
        screen.onkey(engine.eventRight, "Right")
        screen.onkey(engine.cancelGame, "space")

    # wyczyszczenie ekranu
    screen.clear()

    # zapisz wynik jeśli rekord
    if int(engine.score)>int(engine.hightScore):
        engine.hightScore = engine.score
        file = open("./score.txt", "w+", encoding="utf-8")
        file.write(str(engine.score))
        file.close()
    
    # pokazanie napisu końcowego
    text = Turtle()
    text.penup()
    text.hideturtle()
    text.write("GAME END")
    text.right(90)
    text.forward(30)
    text.write(f'Your score: {engine.score}')
    text.forward(30)
    text.write(f'Beast score: {engine.hightScore}')

    # uruchomieni ponownie gry po 3sekundach
    sleep(3)
    if engine.gameEnd==True:
        screen.bye()
        break
    else:
        screen.tracer(0)
        screen.update()