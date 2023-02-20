import random

def choice (player):
    if player == 1:
        return ('piedra')
    elif player == 2:
        return ('papel')
    elif player == 3:
        return ('tijera')
    else:
        return ("Opción no disponible")

def text():
    print(f'Has elegido: {choice(user_option)}\n')
    print(f'El pc ha elegido: {choice(computer_option)}\n')

print('Juego de piedra, papel o tijera')

user_option = int(
    input('\n1)Piedra\n2)papel\n3)tijera \n Seleciona tu opcion:=>'))

computer_option = random.randint(1,3)

if user_option == computer_option:
    text()
    print("Empate!")
elif user_option == 1 and computer_option == 3 or user_option == 2 and computer_option == 1 or user_option == 3 and computer_option == 2:
    text()
    print("Ganaste!")
else:
    text()
    print("Perdiste")