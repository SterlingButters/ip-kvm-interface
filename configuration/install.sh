#!/bin/bash

sudo apt-get update
sudo apt-get -y install etherwake node git python3-pip # {other tools}
pip install butterfly
cd /opt/sterling
sudo git clone -b dev https://github.com/SterlingButters/ip-kvm-interface.git
sudo chown pi ip-kvm-interface -R
cd ip-kvm-interface
sudo bash /configuration/composite-gadget-setup_v1.sh
sudo npm install

#echo "Enter Mac Address (00:11:22:33:44:55) of the PC you would like to power on:"
#read macAddress
#echo "Enter ip Address of the PC you would like to power on:" # Remember *.255
#read ipAddress
#echo "Enter desired port for Butterfly terminal [57575]:"
#read butterflyPort
#echo "Enter desired port for Desktop InterFace [3000]:"
#read interfacePort

# Ask user for serial ports?
#echo "cd /dev && ls"
#echo "Enter desired path for serial keyboard:"
#read keyboardPort
#echo "Enter desired path for serial mouse:"
#read mousePort

# Get below to take arguments
#sudo cp /etc/rc.local /etc/rc.local.bak
#sudo sed -i 's/exit 0//g' /etc/rc.local
# Need "?"?
#echo "/bin/ip-kvm-interface/app.js &" | sudo tee --append /etc/rc.local
#echo "exit 0" | sudo tee --append /etc/rc.local

#node app.js $macAddress $ipAddress $butterflyPort $interfacePort $keyboardPort $mousePort # To rc.local
