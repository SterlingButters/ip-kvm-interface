# IP-KVM-InterFace

![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Example.png)

# About
This project is a "fork" of https://github.com/Fmstrat/diy-ipmi. The project creates a
web-accessable IPMI / IP KVM system utilizing an RPi3 server/manager and 2 Arduino Micro's that provide
full keyboard control, monitor view, and and the ability to reboot computers with standard motherboards
remotely as if you were sitting in front of them with a keyboard and monitor. This projects intends to,
first and foremost, provide mouse support but also create the same interface (or better) with more human-readable
code structure via modularity and organization. What's more, is that with the current method of
implementation, it will eventually be possible to extend capabilities to the Xbox One as well.
Whats left on the project is listed someplace below.

## Configuration
![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/configuration/Setup.png)
## Shopping List:
  - Raspberry Pi3 B+ (Starter Kit):

  https://www.amazon.com/CanaKit-Raspberry-Starter-Premium-Black/dp/B07BCC8PK7/ref=sr_1_1_sspa?s=pc&ie=UTF8&qid=1539175242&sr=1-1-spons&keywords=raspberry+pi+3+b%2B&psc=1
  - Capture Card Options:
    - LinkStable (verified):

    https://www.amazon.com/LinkStable-Streaming-Recorder-Gameplayer-Compatible/dp/B073PXDKFR/ref=sr_1_3?s=electronics&ie=UTF8&qid=1539175400&sr=1-3&keywords=linkstable+capture+card
    - PenGo [4K] (experimental):

    https://www.amazon.com/gp/product/B07BGXVGLS/ref=ox_sc_act_title_1?smid=A39P3WP927BTL5&psc=1
    - ATmega32U4 (Arduino Micro) x2:

    https://www.amazon.com/OSOYOO-ATmega32U4-arduino-Leonardo-ATmega328/dp/B012FOV17O
  - TTL to USB Adapter x2:

    https://www.amazon.com/gp/product/B072K3Z3TL/ref=oh_aui_detailpage_o06_s00?ie=UTF8&psc=1
  - Cables:
    - Male USB to Male microUSB x2
    - HDMI x2
    - Male USB to Male USB

## Troubleshooting
- Ensure all cables are data-transfer capable
- If port is not opening on TTL to USB adapter, check serial monitor

## Cost-Cutting
  - It may be possible to use a single Arduino Micro for mouse & keyboard function
  - Direct serial connection from the RPi3 to the Arduino(s) [requires code revision]

## Collaboration & Support
Donate with PayPal:
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/sterlingbutters)

Join me on Discord:
[![Discord](https://img.shields.io/discord/102860784329052160.svg)](https://discord.gg/uSTr7DZ)

### TODO List (Essential)
1) Arduino:
  - Explore options for opening serial monitor
```
https://www.cyberciti.biz/hardware/5-linux-unix-commands-for-connecting-to-the-serial-console/
https://www.arduino.cc/en/Reference/KeyboardPress
```
  - Compile and upload `mouse-transmit.ino`

2) Keyboard:
  - Styling
  - KeyCode Map
  - Press/Release Functionality

3) Configuration:
  - `install.sh`; include:
    - WebServer & File Transfer
    - Start as service:
      `https://www.raspberrypi.org/documentation/linux/usage/rc-local.md`
    - Etherwake & npm via "require" search
    - Arduino File upload:
     `http://forum.arduino.cc/index.php?topic=37534.0`
    - DDNS and port forwarding

4) Full Screen Option:
  - `https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API`

5) Remove loading icon atop video once media selection made

## Future Bonus Features

1) Set up Pi0 as composite device for other uses [ethernet adapter,
mass storage, etc]:
  - `http://isticktoit.net/?p=1383`

2) Supply mouse/keyboard input to multiple consoles

3) Modal login

4) Debugging element(s) + Latency
