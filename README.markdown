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

1) Debug ATmega32U4 (Arduino Micro) port opening/serial monitor:
```
https://www.sparkfun.com/tutorials/337
https://www.amazon.com/OSOYOO-ATmega32U4-arduino-Leonardo-ATmega328/dp/B012FOV17O (SUPER CHEAP)
```

2) Create `mouse-transmit.ino` file and debug

3) Add Keyboard Modifier Keys

4) ~~Add Pi3 terminal to interface:~~
  - Butterfly: https://github.com/paradoxxxzero/butterfly

5) Create `install.sh` for user; include:
  - WebServer
  - Arduino File upload
  - Butterfly as Daemon
  - DDNS and port forwarding

6) Add loading icon atop video once power-on initiated

7) Add Full Screen Option

8) Adjust debugging `div` element(s) + Latency

10) Add multi-server support with relay board
