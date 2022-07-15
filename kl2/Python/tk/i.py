from cmath import inf
from email.mime import image
from tkinter import Button, Canvas, Label, PhotoImage, Tk
from tkinter import ttk
from tkinter import messagebox
from tkinter.messagebox import showinfo
from turtle import onclick
from PIL import ImageTk, Image

from tkinter import messagebox
okno = Tk()
# okno.config(padx=20, pady=20)

# img = ImageTk.PhotoImage(Image.open('a.png'))
# label = Label(image=img)
# label.pack()

# canvas = Canvas(width=208, height=198)
# img=PhotoImage(file='a.png')
# canvas.create_image(104, 99, image=img)
# canvas.create_text(104, 99, text="00:00", fill="#fff", font=('Arial', 35, "bold"))
# canvas.pack()
# canvas.grid(row=1, column=1)

# start = ttk.Button(text='start')
# start.grid(row=2, column=0)

# rest = ttk.Button(text='Reset')
# rest.grid(row=2, column=2)

# checkMark = Label(text='ok', fg='green', font=('Arial', 10, "bold"))
# checkMark.grid(row=3, column=1)

# class Timer:
#     def __init__(self) -> None:
#         self.second = 0
#         self.label = Label(text="0 s", font="Arial 30")
#         self.label.pack()
#         self.label.after(1000, self.update)
#     def update(self):
#         self.second+=1
#         self.label.config(text=f"{self.second} s")
#         self.label.after(1000, self.update)

# timer = Timer()

# info  = showinfo("sdf", "sf")
# info.pack()
def aaa():
    print("sdfsd")

def msg():
    result = messagebox.askquestion("123", "")
    if result == "yes":
        print("ok")
    else:
        print("nie")
# message.pack()
Button = Button(text="123", command=msg, )
Button.pack()

okno.mainloop()