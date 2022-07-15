from turtle import Screen, Turtle

ekran = Screen()
ekran.setup(800, 600)
ekran.bgcolor("black")
ekran.title("gra")

ekran.tracer(0)

paletka = Turtle()
paletka.shape("square")
paletka.color("white")
paletka.shapesize(stretch_wid=5, stretch_len=1)
paletka.penup()
paletka.goto(350, 0)
ekran.update()

ekran.exitonclick()

