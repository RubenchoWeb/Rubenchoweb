import pyautogui
import time

while True:
    # Espera 3 minutos
    time.sleep(180)
    # Presiona Control + V
    pyautogui.hotkey('ctrl', 'v')
    # Presiona Enter
    pyautogui.press('enter')
