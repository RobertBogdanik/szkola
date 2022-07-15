# dolaczenie biblioteki do obslugi klawiatury
import keyboard

options = []
selected = 1

# funkcja odpowiedzialna za wyswietlanie listy firm
def showMenu():
    # wyswietlenie instrukcji
    print("\n" * 30)
    print("Wybierz firme a nastepnie nacisnij enter")

    a = 1
    # wyswietl mozliwe firmy
    for option in options:
        if selected == a:
            # dodaj > i < jesli aktualna firma
            print("\t>" + str(a) + ". " + option + " " + "<")
        else:
            print("\t " + str(a) + ". " + option)

        # zwieksz licznik wiersza
        a += 1

# funkcja z mechanika wyboru listy firm
def select(opt):
    #ustaw zmienna option na wartosc otrzymanej opt
    global options
    options = opt

    # wyswietlenie listy firm
    showMenu()

    # przypisanie klawiszom funkcji ktora wywola sie po nacisnieciu
    keyboard.add_hotkey('up', up)
    keyboard.add_hotkey('down', down)

    # zaczekaj do mometu nacisniecia klawisza enter(wybranie firmy)
    keyboard.wait('enter')

    # zwrucenie numeru wybranej firmy
    return selected

# funkcje up() i down() opisane w pliku README.md
def up():
    global selected
    if selected == 1:

        return
    selected -= 1
    showMenu()


def down():
    global selected
    if selected == 7:
        return
    selected += 1
    showMenu()
