# IP-KVM-InterFace

![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Example.png)


## About
This project is a "fork" of https://github.com/Fmstrat/diy-ipmi. The project creates a
web-accessable IPMI / IP KVM system utilizing several RPi's that provides full keyboard control,
monitor view, and and the ability to reboot computers with standard motherboards remotely as if
you were sitting in front of them with a keyboard and monitor. This projects intends to, first and
foremost, provide mouse support but also create the same interface (or better) with more human-readable
code structure via use of various API's and organization. There is much left to do on the project
but things are moving quickly.

### TODO List
1) Options for HID input:

  a) RPi0:

  i) Enable HID:
      - http://isticktoit.net/?p=1383
      - https://github.com/Fmstrat/diy-ipmi/blob/master/Pi0/enableHID.sh

 ii) Then this:
      - https://github.com/boochow/micropython-raspberrypi

iii) Then this:
      - https://learn.adafruit.com/circuitpython-essentials/circuitpython-hid-keyboard-and-mouse
      - https://circuitpython.readthedocs.io/projects/hid/en/latest/examples.html
      - https://github.com/adafruit/Adafruit_CircuitPython_Bundle
      - https://github.com/adafruit/Adafruit_CircuitPython_HID

  b) PyBoard:
      - https://docs.micropython.org/en/latest/pyboard/pyboard/tutorial/usb_mouse.html
      - https://www.amazon.com/Development-Boards-Kits-MicroPython-pyboard/dp/B01BKA8UR8 (SUPER EXPENSIVE)

  c) **TOP CHOICE: ATmega32U4 (Arduino Compatible)**:
      - https://www.sparkfun.com/tutorials/337
      - https://github.com/thearn/Python-Arduino-Command-API
      - https://www.amazon.com/OSOYOO-ATmega32U4-arduino-Leonardo-ATmega328/dp/B012FOV17O (SUPER CHEAP)
      - No serial login
3) Figure out ZeroRPC server issue

4) Add Pi3 terminal to interface & adjust debugging `div` element(s)

5) Add loading icon atop video once power-on initiated

6) Help user set up DDNS and port forwarding for remote access

7) Add multi-server support
