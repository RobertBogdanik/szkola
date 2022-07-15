# dolaczenie pandas
import pandas as pd

def filter(df, column, operation):
    # wyswietlenie instrukcji i pobranie wartosc
    print("\n" * 30)
    value = input("Podaj wartosc: ")

    # pruba wykonania oeperacji
    try:
        # sformatowanie df do formatu pandas(dla bezpieczenstwa)
        df = pd.DataFrame(df)

        # skonstrulowanie warunku
        condition = column+" "+operation+" '"+value+"'"

        # wykonanie warunku
        dfQ = df.query(condition)

        # zwrucenie zartosci po wykonaniu warunku
        return dfQ
    except:
        # jesli wystapil blad wyswietl komunikat
        print("Wystapil blad")