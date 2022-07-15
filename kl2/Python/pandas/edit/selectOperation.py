import keyboard
import pandas as pd

# lista slowna operacji
operationList=['Wieksze niz', 'Mniejsze niz']
selected = 1

def showMenu():
    global selected

    # wyswietlenie instrukcji
    print("\n" * 30)
    print("Wybierz rodzaj przyrownania:")

    a = 1
    for option in operationList:
        if a == selected:
            # jesli aktualnie wybrana operacja dodaj > i <
            print("\t> " + str(a) + ". " + option + " " + "<")
        else:
            print("\t  " + str(a) + ". " + option)

        a += 1

def select():
    # wyswietl liste operacji
    showMenu()

    # wyczysc poprzednie i ustaw nowe przypisania do klawiszy
    keyboard.unhook_all_hotkeys()
    keyboard.add_hotkey('up', up)
    keyboard.add_hotkey('down', down)

    # oczekuj wybrania operatora
    keyboard.wait('enter')

    # wybierz i zwruc operator na podstawie zmiennej selected
    operation = ['>', '<']
    return operation[selected-1]

# funkcje up() i down() opisane w pliku README.md
def up():
    global selected
    if selected == 1:
        return
    selected -= 1
    showMenu()

def down():
    global selected
    if selected == 4:
        return
    selected += 1
    showMenu()