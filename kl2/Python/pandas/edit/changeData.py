# daodanie keyboard i pandas
import keyboard
import pandas as pd

# import plikow
from edit import selectColumns as scs
from edit import selectColumn as sc
from edit import sortValue as sv
from edit import selectOperation as so
from edit import filterData as fd

options = ['Wybierz kolumny', 'Posortuj', 'Dodaj warunek', 'Eksportuj']
selected = 1
data = None
kData = None

# wyswietlenie mozliwosci edycji
def showMenu():
    # wyswietlenie instrukcji
    print("\n" * 30)
    print("Wybierz opcje:")

    a = 1
    # wyswietl mozliwe operacje
    for option in options:
        if selected == a:
            # dodaj > i < jesli jest to obecnie zaznaczona opcja
            print("\t>" + str(a) + ". " + option + " " + "<")
        else:
            print("\t " + str(a) + ". " + option)
        a += 1

# mechanika edycji
def start(df, kdf):
    # przypisanie do globalnych zmennych otrzymane wartosci df i kdf
    global selected, data, kData
    data = df
    kData = kdf

    # sprawdzenie czy zmienna data jest pusta
    if data.empty:
        # przejdz do eksportu jesli data jest pusta
        return df

    # pokazanie listy mozliwosci
    showMenu()

    # usuniecie poprzednich przypisan akcji do klawiszy klawiatury
    keyboard.unhook_all_hotkeys()

    # przypisanie klawiszom funkcji ktora wywola sie po nacisnieciu
    keyboard.add_hotkey('up', up)
    keyboard.add_hotkey('down', down)

    # zaczekaj do mometu nacisniecia klawisza enter(wybranie operacji)
    keyboard.wait('enter')

    # spreawdzenie jaka operacja zostala wyslana
    if selected == 1:
        # wybranie kolumn ktore zostana wyswietlone
        # wybranie kolumn(odwolanie do pliku selectColumns)
        dat2 = pd.DataFrame(scs.selectColumn(data, kData))

        # ponowne wywolanie funkcji z danymi po edyji
        start(dat2, kData)
    elif selected == 2:
        # sortowanie
        # pobranie nazwy kolumny do sortowania
        column = sc.select(data)

        # wykonanie sortowania
        data = pd.DataFrame(sv.sortValue(data, column))

        # ponowne wywolanie funkcji z danymi po edyji
        start(data, kData)
    elif selected == 3:
        # warunek
        # wybranie kolumny do warunku
        column = sc.select(data)

        # wybranie operacji(> i <)
        operation = so.select()

        # wykonanie warunku
        data = pd.DataFrame(fd.filter(data, column, operation))

        # ponowne wywolanie funkcji z danymi po edyji
        start(data, kData)
    else:
        # eksport
        # zwrucenie df po edycjach
        return df


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
