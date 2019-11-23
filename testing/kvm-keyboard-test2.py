#!/usr/bin/env python3

NULL_CHAR = chr(0)

path = input("Enter the HID device pathname for keyboard [/dev/hidg0]: ")

if path == '':
	path = '/dev/hidg0'

def write_report(report):
	with open(str(path), 'rb+') as fd:
		fd.write(report.encode('utf-8'))

# Cntrl-Alt-Del Example
write_report(chr(5)+NULL_CHAR+chr(76)+NULL_CHAR*5)
#write_report(chr(32)+NULL_CHAR+chr(41)+NULL_CHAR*5)
#write_report(NULL_CHAR*2+chr(41)+NULL_CHAR*5)
write_report(NULL_CHAR*8)
