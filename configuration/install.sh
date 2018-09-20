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
echo "Setting up Pi0..."
echo "Logging into Pi0..."

# HID SETUP HERE

# OPEN SERVER HERE
echo "Finished! Try http://<ip of pi3>"
