from pyautogui import moveTo
from time import sleep
from random import randint

while True:
    x = randint(150,360)
    y = randint(150,360)
    print(f'Moving to {x},{y}')
    moveTo (x,y)
    sleep(5)