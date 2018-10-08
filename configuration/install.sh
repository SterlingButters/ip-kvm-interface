sudo apt-get
sudo apt-get -y install etherwake node git screen python3-pip # {other tools}
pip install # {butterfly}
cd /bin # or /opt
sudo git clone https://github.com/SterlingButters/ip-kvm-interface.git
sudo chown pi ip-kvm-interface -R
chmod +x /bin/ip-kvm-interface/*.js
npm install # {node tools}
# Ask user for PC Mac Address
# Ask user for PC IP Address
# Ask user for desired Butterfly port
# Ask user for desired Interface port
# Maybe ask user for serial ports?
node app.js # To rc.local
