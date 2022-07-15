# PYTHON - PANDAS

Wymagane biblioteki: keyboard, pandas, pandas_datareader

Instalacja:
     
    pip install keyboard
    pip install pandas
    pip install pandas-datareader

### Całość była pisana w PyCharm i nietestowana w cmd oraz na linuxie!

# Funkcja up():

    def up():
      global selected
      if selected == 1:
        return
      selected -= 1
      showMenu()
      
Funkcja zmienia watosc zmiennej selected o -1 jesli jest różna od 1. Na koniec wywołuje showMenu(), które jest odpowiedzialne za pokazanie na ekranie możliwości wyboru

# Funkcja down():

    def down():
        global selected
        if selected == len(data.columns)+1:
            return
        selected += 1
        showMenu()
        
Działa anoligicznie jak funkcja up(). Jedynymi różnicami jest zmina wartości o +1 oraz niezmienianie wartosci kiedy warunek lub liczba równają się wartości zmiennej selected. Podobnie na koniec wywołuje showMenu().
