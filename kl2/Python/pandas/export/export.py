# dolaczenie biblioteki do obslugi klawiatury i pandas
import keyboard
import pandas as pd

selected = 1
# mozliwosci eksportu
options = ['Pierwsze 5', 'Wszystkie', 'Ostatnie 5']

# wyswietl mozliwosci eksportu
def showMenu():
    global selected

    # wyswietlenie instrukcji
    print("\n" * 30)
    print("Wybierz zakres exportu:")
    a = 1
    # wyswietlenie mozliwosci
    for option in options:
        if selected == a:
            # dodaj < i > jesli aktualnie wybrane
            text = "\t>" + str(a) + ". " + option + " " + "<"
            print(text)
        else:
            text = "\t " + str(a) + ". " + option
            print(text)
        a += 1

# wybranie zakresu danych do eksportu
def selectDataRange(data):
    global selected

    # wyswietl liste operacji
    showMenu()

    # wyczysc poprzednie i ustaw nowe przypisania do klawiszy
    keyboard.unhook_all_hotkeys()
    keyboard.add_hotkey('up', up)
    keyboard.add_hotkey('down', down)

    # oczekuj wybrania rodzaju sortowania
    keyboard.wait('enter')

    if selected == 1:
        # jesli wybrano 1 zwruc gorne
        data = data.head()
        return data
    elif selected == 2:
        # jesli wybrano 2 zwruc wszystkie
        return data
    else:
        # jesli wybrano 3 zwruc dolne
        data = data.tail()
        return data

# pobranie nazwy pliku i nazwy arkusza
def getFileName():
    print("\n" * 30)
    return (input("Podaj nazwe pliku: "), input("Podaj nazwe arkusza: "))

# eksport do pliku
def export(data, fileName):
    try:
        data = pd.DataFrame(data)
        data.to_excel(fileName[0]+'.xlsx', sheet_name=fileName[1], index=True)
    except:
        # jesli wystapil blad wypisz komunikat
        print("Wystapil blad")

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






















