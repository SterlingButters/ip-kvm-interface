#!/bin/bash

apt-get update
apt-get install git
apt-get install etherwake
apt-get install python3-pip
pip install butterfly

node -v
node=$?
npm -v
npm=$?
if [[ node==0 || npm==0 ]]
then
  echo "node installed... moving on"
else
  echo "node not installed... installing"
  wget https://nodejs.org/dist/v12.16.0/node-v12.16.0-linux-armv7l.tar.xz
  tar -xzf node-v12.16.0-linux-armv7l.tar.xz
  cd node-v12.16.0-linux-armv7l/
  cp -R * /usr/bin/
fi

echo "moving project under /opt"
cp -a ../../ip-kvm-interface /opt/ip-kvm-interface
rm -r ../../ip-kvm-interface

echo "entering project directory"
cd /opt/ip-kvm-interface

echo "changing some permissions"
chown pi . -R

echo "setting up composite gadget"
bash /configuration/composite-gadget-setup_v1.sh

echo "npm configuring project"
npm install

# Once app.js can accept arguments, they can be supplied through ExecStart
echo "converting project into a service"
echo "[Unit]
Description=RPi IPMI KVM Solution
Documentation=https://github.com/SterlingButters/ip-kvm-interface
After=network.target

[Service]
#Environment=NODE_PORT=3001
Type=simple
User=pi
ExecStart=/usr/local/bin/node /opt/ip-kvm-interface/app.js
Restart=on-failure

[Install]
WantedBy=multi-user.target" > /lib/systemd/system/KVM.service

systemctl enable --now KVM.service
# service KVM restart
