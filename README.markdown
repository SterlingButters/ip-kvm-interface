# IP-KVM-InterFace

![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Example.png)


## About
This project is a "fork" of https://github.com/Fmstrat/diy-ipmi. For information regarding the
goal of that repo, please use the link supplied. This projects intends to create
the same interface (or better) with more human-readable code structure via use of various
API's and organization. There is much left to do on the project but things are moving quickly.

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
