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
1) Debug HID setup on RPi0's:
      - http://isticktoit.net/?p=1383
      - https://github.com/Fmstrat/diy-ipmi/blob/master/Pi0/enableHID.sh
2) See if Circuit Python will work and add installation scripts to configuration directory:
      - https://learn.adafruit.com/circuitpython-essentials/circuitpython-hid-keyboard-and-mouse
      - https://circuitpython.readthedocs.io/projects/hid/en/latest/examples.html
3) Figure out ZeroRPC server issue

4) Add Pi3 terminal to interface & adjust debugging `div` element(s)

5) Add loading icon atop video once power-on initiated

6) Add multi-server support
