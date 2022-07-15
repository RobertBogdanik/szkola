import keyboard
import pandas as pd

data = []
kData = []
actual = []
selected = 1

def showMenu():
    # wyswietl instrkcje
    print("\n" * 30)
    print("Zaznacz kolumny:")

    a = 1
    # pentla po oryginalnej liscie kolumn
    for option in kData.columns:
        if selected == a and actual[a-1] == True:
            # jesli zaznaczone i aktywne dodaj >, <, [*]
            print("\t> [*]" + str(a) + ". " + option + " " + "<")
        elif selected == a and actual[a-1] == False:
            # jesli nie zaznaczone i aktywne dodaj > i <
            print("\t> [ ]" + str(a) + ". " + option + " " + "<")
        elif selected != a and actual[a-1] == True:
            # jesli zaznaczone i nie aktywne dodaj [*]
            print("\t  [*]" + str(a) + ". " + option)
        else:
            # jesli nie zaznaczone i nie aktywne nic niedodawaj
            print("\t  [ ]" + str(a) + ". " + option)

        a += 1

    # wyswietl opcje zakonczenia wykonywania
    if selected == len(kData.columns)+1:
        print("\n\t> Zakoncz wybieranie <")
    else:
        print("\n\t  Zakoncz wybieranie ")

def selectColumn(df, kdf):
    global data, kData, actual
    data = pd.DataFrame(df)
    kData = pd.DataFrame(kdf)

    # podziel kolumny na zaznaczone i niezaznaczone
    for el in kData:
        if el in data:
            actual.append(True)
        else:
            actual.append(False)

    # wyswietl liste kolumn
    showMenu()

    # wyczysc poprzednie i ustaw nowe przypisania do klawiszy
    keyboard.unhook_all_hotkeys()
    keyboard.add_hotkey('up', up)
    keyboard.add_hotkey('down', down)

    # oczekuj nacisniecia enter
    keyboard.wait('enter')

    # jesli wybrano ostatnia opcje zwruc data z uwzglednieniem zaznaczonych kolumn
    if selected == len(kData.columns)+1:
        dat2 = pd.DataFrame(data)
        return dat2

    # jesli kolumna byla zaznaczona a teraz nie jest odznacz ja
    if actual[selected-1] == True:
        actual[selected - 1] = False
    # dla bezpieczenstwa brak mozliwosci zaznaczenia odznaczonych kolumn

    # stworzenie listy kolumn
    columnList = []
    a = 0

    # pentla po orginalnej liscie kolumn
    while a < len(kData.columns):
        if actual[a] == True:
            # jesli kolumna jest zaznaczona dodaj do listy
            columnList.append(kData.columns[a])
        a += 1

    # wybierz kolumny
    data = pd.DataFrame(data[columnList])

    # wywolaj ponownie do momentu wybrania ostatniej opcji w celu mozliwosci odznaczenia kilku kolumn jednoczesnie
    return selectColumn(pd.DataFrame(data), pd.DataFrame(kData))

# funkcje up() i down() opisane w pliku README.md
def up():
    global selected
    if selected == 1:
        return
    selected -= 1
    showMenu()

def down():
    global selected
    if selected == len(kData.columns)+1:
        return
    selected += 1
    showMenu()