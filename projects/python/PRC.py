from random import randint

options = ('piedra', 'papel', 'tijera')

def choice (player):
    if player == 1:
        return (options[0])
    elif player == 2:
        return (options[1])
    elif player == 3:
        return (options[2])
    else:
        return ("Opción no disponible")

def text():
    print(f'Has seleccionado: {choice(user_option)}\n')
    print(f'El pc ha seleccionado: {(computer_option)}\n')

print('Juego de piedra, papel o tijera')

user_option = int(
    input('\n1)Piedra\n2)papel\n3)tijera \n Seleciona tu opcion:=>'))

computer_option = options[randint(0,2)]

if choice(user_option) == computer_option:
    text()
    print("Empate!")
    
elif ((choice(user_option) == options[0]) and (computer_option == options[2])) or ((choice(user_option) == options[1]) and (computer_option == options[0])) or ((choice(user_option) == options[2]) and (computer_option == options[1])):
    text()
    print("Ganaste!")
else:
    text()
    print("Perdiste")