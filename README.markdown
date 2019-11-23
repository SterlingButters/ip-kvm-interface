# IP-KVM-InterFace ![](https://img.shields.io/badge/version-1.0.0-yellow.svg)

![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Example.gif)

# About
This project is a "fork" of https://github.com/Fmstrat/diy-ipmi. The project creates a
web-accessable IPMI / IP KVM system utilizing any OTG enabled Raspberry Pi device (theoretically - testing only done of RPi4) that provide full keyboard control, monitor view, and the ability to reboot computers with standard motherboards
remotely. This projects intends to, first and foremost, provide mouse support but also create the same
interface (or better) with more human-readable code structure via modularity and organization. This project is EXTREMELY light weight and easy to install and configure. 

What's more, is that with the current method of implementation, it will eventually be possible to extend capabilities
to the Xbox One as well. Whats left on the project is listed someplace below. 

## Configuration
#### Setup
![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/configuration/Setup.png)

#### DDNS and Port Forwarding:
1) Log into router

2) Set up up port forwarding to <RPi-ipAddress>:port that is chosen for the Interface during install
  [3000 recommended]

3) Sign up for DDNS: [![](https://img.shields.io/badge/No--IP-signup-ff69b4.svg)](https://www.noip.com)

4) Create a hostname (no-ip client will be set up in install)

#### Install
5) Run `sudo install.sh`

## Shopping List:
  - Raspberry Pi4 (Starter Kit)[$89.99]:
  [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/CanaKit-Raspberry-4GB-Basic-Starter/dp/B07VYC6S56/ref=sr_1_1?keywords=rpi+4+starter+kit&qid=1574491331&s=electronics&sr=1-1)

  - Capture Card Options:
    - LinkStable (verified)[$99.99]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/LinkStable-Streaming-Recorder-Gameplayer-Compatible/dp/B073PXDKFR/ref=sr_1_3?s=electronics&ie=UTF8&qid=1539175400&sr=1-3&keywords=linkstable+capture+card)

    - PenGo [4K] (experimental)[$149.99]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/gp/product/B07BGXVGLS/ref=ox_sc_act_title_1?smid=A39P3WP927BTL5&psc=1)

  - Cables:
    - USB to USB-C [comes in Pi4 starter kit]
    - HDMI x2 [~$5.99]
    - Ribbon Cables [~$7.50]:
    [![](https://img.shields.io/badge/amazon-buy-blue.svg)](https://www.amazon.com/Kuman-Breadboard-Arduino-Raspberry-Multicolored/dp/B01BV3Z342/ref=sr_1_8_sspa?s=electronics&ie=UTF8&qid=1539227097&sr=1-8-spons&keywords=rpi+ribbon+cable+variety+pack&psc=1)

## Troubleshooting
- Ensure all cables are data-transfer capable
- If port is not opening on TTL to USB adapter, check serial monitor

## Cost-Cutting
  - Cheaper capture cards exist; the one chosen allows for throughput of video to a display
  - The complete RPi4 starter kit might be a bit overkill but easy one-stop-shop for beginner

## Collaboration & Support
Donate with PayPal:
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/sterlingbutters)

Join me on Discord:
[![Discord](https://img.shields.io/discord/102860784329052160.svg)](https://discord.gg/uSTr7DZ)

## ToDo List (Essential)
1) Configuration:
  - Finish Install Script
  
2) I/O Features:
  - Add support for WOL
  - Add relay support for hard shutdown
  
3) Interface Features:
  - Virtual Keyboard support
  - General CSS Styling and "Ergonomics"
  - Debug Panel & Latency Monitor 
  ![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Latency.gif)
  
4) Miscellaneous Features:
  - Mass Storage Controller

## Potential Releases

1) Supply mouse/keyboard input to multiple consoles:
  - https://www.newegg.com/Product/Product.aspx?Item=N82E16812119896&ignorebbr=1&nm_mc=KNC-GoogleAdwords-PC&cm_mmc=KNC-GoogleAdwords-PC-_-pla-_-USB+Converters-_-N82E16812119896&gclid=Cj0KCQjwxvbdBRC0ARIsAKmec9YWANflFHZ5qjMTb48rHDq_Y0OstuPRQpPX8xWt4Quvn8GgXR1875YaAoK8EALw_wcB&gclsrc=aw.ds

## Note to developers
This project hosts a node-generated server on an OTG-capable Raspberry Pi device. The install script creates the libcomposite device on the Pi. The code then transcribes the information that is fed through the browser and relays it to the target computer. There are likely many approaches to current solutions. For instance, the mouse report descriptor is that for a generic mouse with basic functions. It might be possible to create a report descriptor that generates output reports from the mouse to provide absolute position on the screen. Additionally, it might be possible to detect the display resolution and calibrate the mouse movement. Currently, it doesn't seem that that level of rigor is worth it. Other improvements like this could likely be made as well. 

I do plan on going back and cleaning up this code to be more readable but we will see if that happens anytime soon.
