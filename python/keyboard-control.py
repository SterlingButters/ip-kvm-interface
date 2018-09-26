#!/usr/bin/env python3
import numpy as np

NULL_CHAR = chr(0)


def write_report(report):
    with open('/dev/hidg0', 'rb+') as fd:
        fd.write(report.encode())

ARRAY = np.arange(4, 29, 1)
LETTERS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
           'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r',
           's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
SYMBOLS = [',', '.', '/', ';', '\'', '[', ']', '\\']
MODIFIERS = ['Alt', 'Control', 'Meta', 'Shift', 'Esc']
SPECIAL = ['Space', 'Caps', 'Enter', 'Delete', 'Backspace']


def keypress(letter, hold=False, shift=False):
    id = ARRAY[(LETTERS.index(letter))]
    if not shift:
        write_report(NULL_CHAR * 2 + chr(id) + NULL_CHAR * 5)
        if not hold:
            write_report(NULL_CHAR * 8)
            print(letter)
        print(letter + "...")

    else:
        write_report(chr(32) + chr(id) + NULL_CHAR * 5)
        print(letter)

    return 0


while True:
    letter = input("enter letter:")
    keypress(letter)


# # Press SHIFT + a = A
# write_report(chr(32)+NULL_CHAR+chr(4)+NULL_CHAR*5)

# # Press SHIFT + b = B
# write_report(chr(32)+NULL_CHAR+chr(5)+NULL_CHAR*5)
#
# # Press SPACE key
# write_report(NULL_CHAR*2+chr(44)+NULL_CHAR*5)
#
# # Press RETURN/ENTER key
# write_report(NULL_CHAR*2+chr(40)+NULL_CHAR*5)
