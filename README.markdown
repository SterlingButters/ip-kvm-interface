# IP-KVM-InterFace ![](https://img.shields.io/badge/version-1.2.0-yellow.svg)

![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/master/Examples/Example.gif)

# About
This project creates a web-accessable IPMI / IP KVM system utilizing any OTG enabled
Raspberry Pi device (theoretically - testing only done on RPi4) that provides full keyboard and mouse control,
monitor view, and the ability to reboot computers with standard motherboards
remotely (WOL & GPIO-Relay). This projects intends to also create an interface with consistent
and minimal programmatic requirements (i.e. use of web stack languages only) with modularity and organization.
This project is EXTREMELY light weight and easy to install and configure. Additionally, this allows further
development with minimal orientation overhead.

The project's working features:
1) Keyboard Support
2) Mouse Support
3) Video Source Selectability

## Configuration
#### Setup
![alt text](https://github.com/SterlingButters/ip-kvm-interface/blob/dev/configuration/setup.png)

**Needs updating to show channel relay

#### Installation 
1) Enable the dwc2 dtoverlay in `/boot/config.txt` on your Pi4

2) Install node/npm/pip in <project-directory>
  
3) Run `npm install`

4) Run `sudo bash <project-directory>/configuration/composit-gadget-setup_v1.sh`

5) Run `sudo node app.js`

6) Navigate to `http://localhost:3000` in your browser

7) See below for remote access instruction

**Post issue for installation guidance (or look at `/configuration/install.sh`)

#### DDNS and Port Forwarding:
1) Log into router

2) Set up up port forwarding to <RPi-ipAddress>:port that is chosen for the Interface during install
  [3000 recommended]

3) Sign up for DDNS: [![](https://img.shields.io/badge/No--IP-signup-ff69b4.svg)](https://www.noip.com)

4) Create a hostname (no-ip client to be set up in install)

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
1) Mass Storage Controller
[YKUSH3](https://www.yepkit.com/product/300110/YKUSH3)

## Note to developers
This project hosts a node-generated server on an OTG-capable Raspberry Pi device. The install script creates the libcomposite device on the Pi. The code then transcribes the information that is fed through the browser and relays it to the target computer using socket.io. Video is achieved using JSMPEG (would like to find something even faster like WebRTC maybe). There are likely many approaches to current solutions. For instance, the mouse report descriptor is that for a generic mouse with basic functions. It might be possible to create a report descriptor that generates output reports from the mouse to provide absolute position on the screen. Additionally, it might be possible to detect the display resolution and calibrate the mouse movement. Currently, it doesn't seem that that level of rigor is worth it. Other improvements like this could likely be made as well.

I do plan on going back and cleaning up this code to be more readable but we will see if that happens anytime soon.
