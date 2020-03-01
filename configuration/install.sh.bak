#!/bin/bash

apt-get update

dpkg -s git
git=`$?`
if [ git -eq 0 ]
then
  echo "git installed... moving on"
else
  echo "git not installed... installing"
  apt-get install -y git
fi

dpkg -s etherwake
etherwake=`$?`
if [ etherwake -eq 0 ]
then
  echo "etherwake installed... moving on"
else
  echo "etherwake not installed... installing"
  apt-get install -y etherwake
fi

dpkg -s python3-pip
pip=`$?`
if [ git -eq 0 ]
then
  echo "pip installed... moving on"
else
  echo "pip not installed... installing"
  apt-get install -y python3-pip
fi

node -v
node=`$?`
npm -v
npm=`$?`
if [ node -eq 0 ] || [ npm -eq 0]
then
  echo "node installed... moving on"
else
  echo "node not installed... installing"
  wget https://nodejs.org/dist/v12.16.0/node-v12.16.0-linux-armv7l.tar.xz
  tar -xzf node-v12.16.0-linux-armv7l.tar.xz
  cd node-v12.16.0-linux-armv7l/
  cp -R * /usr/local/
fi

python -c "import butterfly"
butterfly=`$?`
if [ butterfly -eq 0 ]
then
  echo "butterfly installed... moving on"
else
  echo "butterfly not installed... installing"
  pip install butterfly
fi

echo "moving project under /opt"
cp ../../ip-kvm-interface /opt/ip-kvm-interface
rm -r ../../ip-kvm-interface
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
