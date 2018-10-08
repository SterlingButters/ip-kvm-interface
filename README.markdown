# IP-KVM-InterFace

![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Example.png)


## About
This project is a "fork" of https://github.com/Fmstrat/diy-ipmi. The project creates a
web-accessable IPMI / IP KVM system utilizing an RPi3 server/manager and 2 Arduino Micro's that provide
full keyboard control, monitor view, and and the ability to reboot computers with standard motherboards
remotely as if you were sitting in front of them with a keyboard and monitor. This projects intends to,
first and foremost, provide mouse support but also create the same interface (or better) with more human-readable
code structure via modularization and organization. There is much left to do on the project
but things are moving quickly.

### TODO List

1) ~~Debug ATmega32U4 (Arduino Micro) port opening/serial monitor:~~
```
https://www.cyberciti.biz/hardware/5-linux-unix-commands-for-connecting-to-the-serial-console/
https://www.sparkfun.com/tutorials/337
https://www.amazon.com/OSOYOO-ATmega32U4-arduino-Leonardo-ATmega328/dp/B012FOV17O (SUPER CHEAP)
```

2) Create `mouse-transmit.ino` file and debug

3) ~~Add Keyboard Modifier Keys~~ Make Keyboard wider

4) ~~Add Pi3 terminal to interface:~~
  - Butterfly: `https://github.com/paradoxxxzero/butterfly`

5) Create `install.sh` for user & create env; include:
  - WebServer & File Transfer
  - Start as service:
    `https://www.raspberrypi.org/documentation/linux/usage/rc-local.md`
  - Etherwake & npm via "require" search
  - Arduino File upload:
   `http://forum.arduino.cc/index.php?topic=37534.0`
  - DDNS and port forwarding

6) Make loading icon atop video go away once media selection is made

7) Add Full Screen Option:
  - `https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API`

8) Adjust debugging element(s) + Latency

10) Supply mouse/keyboard input to multiple consoles

11) ~~Add password to WebInterface~~ Add modal login

12) Set up Pi0 as composite device for other uses [ethernet adapter,
mass storage, etc]:
  - `http://isticktoit.net/?p=1383`
