# IP-KVM-InterFace ![](https://img.shields.io/badge/version-1.0.0-yellow.svg)

![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Example.gif)

# About
This project is a "fork" of https://github.com/Fmstrat/diy-ipmi. The project creates a
web-accessable IPMI / IP KVM system utilizing an RPi3 server/manager and 2 Arduino Micro's that provide
full keyboard control, monitor view, and the ability to reboot computers with standard motherboards
remotely. This projects intends to, first and foremost, provide mouse support but also create the same
interface (or better) with more human-readable code structure via modularity and organization. What's more,
is that with the current method of implementation, it will eventually be possible to extend capabilities
to the Xbox One as well. Whats left on the project is listed someplace below.

## Configuration
#### Setup
![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/configuration/Setup.png)

#### DDNS and Port Forwarding:
1) Log into router

2) Set up up port forwarding to <RPi3-ipAddress>:port that is chosen for the Interface during install
  [3000 recommended]

3) Sign up for DDNS: [![](https://img.shields.io/badge/No--IP-signup-ff69b4.svg)](https://www.noip.com)

4) Create a hostname (no-ip client will be set up in install)

#### Install
5) Run `sudo install.sh`

## Shopping List:
  - Raspberry Pi3 B+ (Starter Kit)[$79.99]:
  [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/CanaKit-Raspberry-Starter-Premium-Black/dp/B07BCC8PK7/ref=sr_1_1_sspa?s=pc&ie=UTF8&qid=1539175242&sr=1-1-spons&keywords=raspberry+pi+3+b%2B&psc=1)

  - Capture Card Options:
    - LinkStable (verified)[$99.99]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/LinkStable-Streaming-Recorder-Gameplayer-Compatible/dp/B073PXDKFR/ref=sr_1_3?s=electronics&ie=UTF8&qid=1539175400&sr=1-3&keywords=linkstable+capture+card)

    - PenGo [4K] (experimental)[$149.99]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/gp/product/B07BGXVGLS/ref=ox_sc_act_title_1?smid=A39P3WP927BTL5&psc=1)

  - ATmega32U4 (Arduino Micro) x2 [$8.99 each]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/OSOYOO-ATmega32U4-arduino-Leonardo-ATmega328/dp/B012FOV17O)

  - TTL to USB Adapter x2 [$7.99 each]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/gp/product/B072K3Z3TL/ref=oh_aui_detailpage_o06_s00?ie=UTF8&psc=1)

  - Cables:
    - Male USB to Male microUSB x2 [~$4.99 each]
    - HDMI x2 [~$5.99]
    - Male USB to Male USB [~$5.99]
    - Ribbon Cables [~$7.50]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/Kuman-Breadboard-Arduino-Raspberry-Multicolored/dp/B01BV3Z342/ref=sr_1_8_sspa?s=electronics&ie=UTF8&qid=1539227097&sr=1-8-spons&keywords=rpi+ribbon+cable+variety+pack&psc=1)

## Troubleshooting
- Ensure all cables are data-transfer capable
- If port is not opening on TTL to USB adapter, check serial monitor

## Cost-Cutting
  - It may be possible to use a single Arduino Micro for mouse & keyboard function
  - Direct serial connection from the RPi3 to the Arduino(s) [requires code revision]
  - Cheaper capture cards exist; the ones chosen allow for throughput of video
  - The complete RPi3 starter kit might be a bit overkill but easy one-stop-shop for beginner

## Collaboration & Support
Donate with PayPal:
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/sterlingbutters)

Join me on Discord:
[![Discord](https://img.shields.io/discord/102860784329052160.svg)](https://discord.gg/uSTr7DZ)

## ToDo List (Essential)
1) Arduino:
  - Compile and upload `mouse-transmit.ino`
  - Explore options for opening serial monitor:
  ```
  https://www.cyberciti.biz/hardware/5-linux-unix-commands-for-connecting-to-the-serial-console/
  https://www.arduino.cc/en/Reference/KeyboardPress
  ```

2) CSS:
  - Keyboard:
    - Styling
    - KeyCode Map
  - Change default scroll position & statics
  - Remove loading icon atop video once media selection made

3) Configuration:
  - `install.sh`:
    - `sudo apt-get update` && install {packages}
    - `git clone` and unpack
    - Arduino File upload:
     `http://forum.arduino.cc/index.php?topic=37534.0`
    - Start as service:
      `https://www.raspberrypi.org/documentation/linux/usage/rc-local.md`
    - DDNS and port forwarding

## Future Bonus Features

1) Set up Pi0 as composite device for other uses [ethernet adapter,
mass storage, etc]:
  - `http://isticktoit.net/?p=1383`

2) Banana Pi BPI W2 RTD1296 Design to Replace RPi3 and Capture Card

3) Supply mouse/keyboard input to multiple consoles:
  - https://www.newegg.com/Product/Product.aspx?Item=N82E16812119896&ignorebbr=1&nm_mc=KNC-GoogleAdwords-PC&cm_mmc=KNC-GoogleAdwords-PC-_-pla-_-USB+Converters-_-N82E16812119896&gclid=Cj0KCQjwxvbdBRC0ARIsAKmec9YWANflFHZ5qjMTb48rHDq_Y0OstuPRQpPX8xWt4Quvn8GgXR1875YaAoK8EALw_wcB&gclsrc=aw.ds
  - https://github.com/thegecko/webusb

4) Modal login

5) Latency [On RPi3]:
  - Get connected public ip: `netstat -tn 2>/dev/null | grep :80 | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -nr | head`
  - Ping that ip: `ping -c 10 -i .5 -W 3 <ipPublic>`
  - Ping ip of PC on local network `ping -c 10 -i .5 -W 3 <ipLocal>`
  - Add times together and plot RTT vs time using plotly:
    - https://plot.ly/javascript/time-series/

6) Bundle Dependencies: https://webpack.js.org/concepts/
