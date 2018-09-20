echo "Getting software..."
sudo apt-get update
# sudo apt-get -y install $PACKAGES
cd /opt
sudo git clone https://github.com/SterlingButters/ip-kvm-interface.git
sudo chown pi ip-kvm-interface -R
chmod +x /opt/ip-kvm-interface/python/*.py
chmod +x /opt/ip-kvm-interface/configuration/*.sh
cd -

# LOGIN HERE

# Set up Keyboard & Mouse
echo "./pi0-keyboard.sh" >> KEYBOARD
# echo "./pi0-mouse.sh" >> MOUSE

echo "Transfering files to Pi0 for HID"
echo "rm -f /tmp/B64" >> DEVICE
for LINE in $(base64 /opt/diy-ipmi/Pi0/enableHID.sh); do echo "echo $LINE >> /tmp/B64" >> DEVICE; done
echo "base64 -d /tmp/B64 > /home/pi/enableHID.sh" >> DEVICE
echo "chmod +x /home/pi/enableHID.sh" >> DEVICE

echo "Enabling HID on Pi0 and adding boot options"
echo "sudo /home/pi/enableHID.sh" >> DEVICE
echo "sudo sed -i 's/exit 0//g' /etc/rc.local" >> DEVICE
echo "echo /home/pi/enableHID.sh | sudo tee --append /etc/rc.local" >> DEVICE
echo "echo exit 0 | sudo tee --append /etc/rc.local" >> DEVICE
}

setup(KEYBOARD)
# setup(MOUSE)

echo "Finished! Try http://<ip of pi3>"
