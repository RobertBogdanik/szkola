# dolaczenie biblioteki do obslugi klawiatury i pandas
import keyboard
import pandas as pd

selected = 1
data = []

# funkcja odpowiedzialna za wyswietlanie listy kolumn
def showMenu():
    print("\n" * 30)
    print("Wybierz kolumne:")
    a = 1
    for colunm in data.columns:
        if a == selected:
            # dodaj > i < jesli jest to obecnie zaznaczona kolumna
            print("\t> " + str(a) + ". " + colunm + " " + "<")
        else:
            print("\t  " + str(a) + ". " + colunm)

        a += 1

def select(df):
    #ustaw zmienna data na wartosc otrzymanej df
    global data
    data = pd.DataFrame(df)

    # wyswietl liste kolumn
    showMenu()

    # wyczysc poprzednie i ustaw nowe przypisania do klawiszy
    keyboard.unhook_all_hotkeys()
    keyboard.add_hotkey('up', up)
    keyboard.add_hotkey('down', down)

    # oczekuj nacisniecia enter(wybranie firmy)
    keyboard.wait('enter')

    # zwruc indeks wybranej kolumny
    return data.columns[selected-1]

# funkcje up() i down() opisane w pliku README.md
def up():
    global selected
    if selected == 1:
        return
    selected -= 1
    showMenu()

def down():
    global selected
    if selected == len(data.columns)+1:
        return
    selected += 1
    showMenu()