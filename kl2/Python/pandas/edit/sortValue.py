import keyboard
import pandas as pd

data = []
selected = 1

def showMenu():
    global selected
    # wyswietlenie instrukcji
    print("\n" * 30)
    print("Wybierz rodzaj sortowania:")

    # wyswietlenie w zaleznosci od obecnego wybrania
    if selected == 1:
        print("\t> Rosnaco <")
        print("\t  Malejsco")
    else:
        print("\t  Rosnaco")
        print("\t> Malejsco <")


def sortValue(df, column):
    # przypisz do zmiennej data otrzymana df
    global data
    data = pd.DataFrame(df)

    # wyswietl liste operacji
    showMenu()

    # wyczysc poprzednie i ustaw nowe przypisania do klawiszy
    keyboard.unhook_all_hotkeys()
    keyboard.add_hotkey('up', up)
    keyboard.add_hotkey('down', down)

    # oczekuj wybrania rodzaju sortowania
    keyboard.wait('enter')

    if selected == 1:
        # jesli wybrana opcja 1 posortuj rosnaco i zwruc
        return data.sort_values(by=column)
    else:
        # jesli wybrana opcja 2 posortuj malejaco i zwruc
        return data.sort_values(by=column, ascending=False)

# funkcje up() i down() opisane w pliku README.md
def up():
    global selected
    if selected == 1:
        return
    selected -= 1
    showMenu()

def down():
    global selected
    if selected == 2:
        return
    selected += 1
    showMenu()