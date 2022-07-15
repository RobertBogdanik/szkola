
import json


file = open('./mapa1.1.csv', "r")
Lines = file.readlines()

def split(word): 
    return [char for char in word]  

# res = {"walls": []}
res = []
# print("[")
all=0
row = 1
for line in Lines:
    col = 1
    for el in line.split(";")[:-1]:
        if el!= "":
            if el != "c":
                obj = {'id': int(el), 'type': "static", 'metirial': "blueWall", 'startPoint': [col,row]}
                # res["walls"].append(obj)
                res.append(obj)
                # print(json.dumps(obj)+",")
                # print(row, col)
            all+=1
        col+=1
    row += 1

# sorted(res["walls"], id)
# res = json.dumps(res)
# resu.sort(key=lambda x: x["id"])
# # products.sort(key=lambda x: x["brand"])
# print("]")
file.close()

result = []
a=0
while a<=650:
    result.append({})
    a+=1
    
for el in res:
#     print(el["id"])
    result[int(el["id"])]=el
# print(result)
print("[")
# licz = 0
for el in result:
    if el!={}:
        print(json.dumps(el)+", ")
    # licz+=1
print("]")
# print(len(res))
# print(all)
# products = res

# # Print the original data
# print("The original JSON data:\n{0}".format(res))
# # Sort the JSON data based on the value of the brand key
# res.sort(key=lambda x: x["id"])

# # Print the sorted JSON data
# print("The sorted JSON data based on the value of the brand:\n{0}".format(res))


# json_obj = {"walls": res}

# sorted_obj = {}
# sorted_obj['walls'] = sorted(res, key=lambda x : x['id'])

# print(sorted_obj)
# print(json_obj)

