# podpiecie pandas i pandas datareader jako zrudla danych
import pandas
import pandas_datareader.data as web

# import plikow
from start import selectCompany as sCom
from edit import changeData as cD
from export import export as ex

# pobieramie indeksu nazwy firmy
companyList = ['Oracle', 'Tesla', 'IBM', 'Yelp', 'Microsoft', 'Google', 'Apple']
company = sCom.select(companyList)

# pobranie skroconej nazwy firmy
shortenedNames = ['ORCL', 'TSLA', 'IBM', 'YELP', 'MSFT', 'GOOGL', 'AAPL']
company = shortenedNames[company-1]

# pobieranie danych giełdowych z yahoo finanse
df = web.DataReader(name=company, data_source='yahoo')

# dodanie sztucznego indexu zamiast kolumny Date i skopiowanie do zmiennek kdf
df = df.reset_index()
kdf = df

# wyświetlenie panelu do edycji
df = cD.start(df, kdf)

# wybranie zakresu danych do eksportu
df = ex.selectDataRange(df)

# wybranie nazwy pliku
fileName = ex.getFileName()

# eksport do pliku
ex.export(df, fileName)