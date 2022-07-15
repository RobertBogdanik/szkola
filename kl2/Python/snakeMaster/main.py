from turtle import  Turtle, Screen
from waz import Waz
from jedz import Jedzenie
from punktacja import Punktacja
import time

ekran = Screen()
ekran.setup(600, 600)
ekran.bgcolor("black")
ekran.title("Snake")

# waz=[Turtle(), Turtle(), Turtle()]

# i=0
# for el in waz:
#     el.color("white")
#     el.shape("square")
#     el.penup()
#     el.goto(i*(-20), 0)
#     i+=1

ekran.tracer(0)
gramy=True
waz1=Waz(3)
Jedzenie = Jedzenie()
punktacja = Punktacja()
while gramy:
    waz1.ruch()
    ekran.update()
    time.sleep(0.1)

    if waz1.waz[0].distance(Jedzenie)<15:
        Jedzenie.odswierz()

    ekran.listen()
    ekran.onkey(waz1.gora, "Up")
    ekran.onkey(waz1.dol, "Down")
    ekran.onkey(waz1.lewa, "Left")
    ekran.onkey(waz1.prawa, "Right")
# ekran.listen()
# ekran.exitonclick()
