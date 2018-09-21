#!/bin/bash
# --------------------- GETTING REPO --------------------- #
echo "Getting software..."
sudo apt-get update
# sudo apt-get -y install $PACKAGES
cd /opt
sudo git clone https://github.com/SterlingButters/ip-kvm-interface.git
sudo chown pi ip-kvm-interface -R
chmod +x /opt/ip-kvm-interface/python/*.py
chmod +x /opt/ip-kvm-interface/configuration/*.sh
cd -
# --------------------- GETTING REPO --------------------- #
													#######
# ----------------------- KEYBOARD ----------------------- #
# KEYBOARD=/dev/ttyUSB0
KEYBOARD=/dev/cu.SLAB_USBtoUART

# - LOGIN - #
echo "Setting up the first at $KEYBOARD as keyboard..."
echo "Logging into Pi0..."

RESPONSE=
COUNT=1
function runCommand(DEVICE) {
    exec 3<DEVICE                    			 				 # REDIRECT SERIAL OUTPUT TO FD 3
    cat <&3 > /mnt/ramdisk/ttyDump.dat &           # REDIRECT SERIAL OUTPUT TO FILE
    PID=$!                                				 # SAVE PID TO KILL CAT
    echo "" > DEVICE         						 					 # SEND COMMAND STRING TO SERIAL PORT
    sleep 1                          							 # WAIT FOR RESPONSE
    kill $PID                             				 # KILL CAT PROCESS
    exec 3<&-                               			 # FREE FD 3
    RESPONSE=$(tail -n 1 /mnt/ramdisk/ttyDump.dat) # DUMP CAPTURED DATA
	processResponse(DEVICE);
}
function processResponse(DEVICE) {
	if [ "$RESPONSE" == "raspberrypi login: " ]; then
		echo "Attempting login"
		echo "pi" >> DEVICE
		echo "raspberry" >> DEVICE
		sleep 1
		runCommand(DEVICE)
		if [ "$RESPONSE" == "pi@raspberrypi:~$ " ]; then
			echo "Login successful"
		else
			echo "Error logging in"
		fi
	elif [ "$RESPONSE" == "pi@raspberrypi:~$ " ]; then
		echo "Already logged in"
	elif [ ! $COUNT -eq 5 ]; then
		echo "Error logging into Pi0 on try $COUNT.. Retrying in 10s"
		let COUNT=COUNT+1
		sleep 10;
		runCommand(DEVICE);
	else
		echo "Maximum Attempts Reached; Please Debug the Problem"
		exit 1
	fi
}
function login(DEVICE) {
	LOGINSUCCESS=0
	while [ $LOGINSUCCESS -eq 0 ]; do
		if ! /opt/ip-kvn-interface/configuration/serial-login.sh; then
			echo "     Logging into the Pi0 as 'pi' with password 'raspberry' has failed"
			echo "     Open another terminal session and use 'screen /dev/ttyUSB0 115200' to login to the Pi0"
			echo "     Once logged in, hit 'Ctrl-A' then type ':quit' to exit the screen session"
			echo "     Lastly, return here and press 'Enter' to continue or 'Ctrl-C' to give up."
			read CONT
		else
			LOGINSUCCESS=1
		fi
	done

	echo "Setting up auto-login on the serial terminal"
	echo "sudo systemctl enable serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo cp /lib/systemd/system/serial-getty@.service /etc/systemd/system/serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo sed -i 's/agetty --keep-baud 115200/agetty -a pi --keep-baud 115200/g' /etc/systemd/system/serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo systemctl daemon-reload" >> DEVICE

	echo "Disabling network to speed Pi0 bootup"
	echo "sudo systemctl disable networking" >> DEVICE
	echo "sudo apt-get -y remove dhcpcd5 isc-dhcp-client isc-dhcp-common" >> DEVICE
	echo "Waiting for removal of network to complete (90s)"
	sleep 90
}
runCommand(KEYBOARD);
login(KEYBOARD);
# - LOGIN - #

# - SET UP - #
function setup(DEVICE) {
	echo "Enabling Correct Modules on Pi0"
	echo "dtoverlay=dwc2" | sudo tee -a /boot/config.txt >> DEVICE
	echo "dwc2" | sudo tee -a /etc/modules >> DEVICE
	echo "libcomposite" | sudo tee -a /etc/modules >> DEVICE

	echo "Transfering files to Pi0 for HID"
	echo "rm -f /tmp/B64" >> DEVICE
	for LINE in $(base64 /opt/ip-kvm-interface/configuration/enable-hid-keyboard.sh);
		do echo "echo $LINE >> /tmp/B64" >> DEVICE;
		done
	echo "base64 -d /tmp/B64 > /home/pi/enable-hid-keyboard.sh" >> DEVICE
	echo "chmod +x /home/pi/enable-hid-keyboard.sh" >> DEVICE

	echo "Enabling HID on Pi0 and adding boot options"
	echo "sudo /home/pi/enable-hid-keyboard.sh" >> DEVICE
	echo "sudo cp /etc/rc.local /etc/rc.local.bak" >> DEVICE
	echo "sudo sed -i 's/exit 0//g' /etc/rc.local" >> DEVICE
	echo "echo /home/pi/enable-hid-keyboard.sh | sudo tee --append /etc/rc.local" >> DEVICE
	echo "echo exit 0 | sudo tee --append /etc/rc.local" >> DEVICE
}
setup(KEYBOARD)
# - SET UP - #
# ----------------------- KEYBOARD ----------------------- #
													#######
# ------------------------ MOUSE ------------------------ #
MOUSE=/dev/ttyUSB1

# - LOGIN - #
echo "Setting up the second at $MOUSE as keyboard..."
echo "Logging into Pi0..."

RESPONSE=
COUNT=1
function runCommand(DEVICE) {
    exec 3<DEVICE                    			 				 # REDIRECT SERIAL OUTPUT TO FD 3
    cat <&3 > /mnt/ramdisk/ttyDump.dat &           # REDIRECT SERIAL OUTPUT TO FILE
    PID=$!                                				 # SAVE PID TO KILL CAT
    echo "" > DEVICE         						 					 # SEND COMMAND STRING TO SERIAL PORT
    sleep 1                          							 # WAIT FOR RESPONSE
    kill $PID                             				 # KILL CAT PROCESS
    exec 3<&-                               			 # FREE FD 3
    RESPONSE=$(tail -n 1 /mnt/ramdisk/ttyDump.dat) # DUMP CAPTURED DATA
	processResponse(DEVICE);
}
function processResponse(DEVICE) {
	if [ "$RESPONSE" == "raspberrypi login: " ]; then
		echo "Attempting login"
		echo "pi" >> DEVICE
		echo "raspberry" >> DEVICE
		sleep 1
		runCommand(DEVICE)
		if [ "$RESPONSE" == "pi@raspberrypi:~$ " ]; then
			echo "Login successful"
		else
			echo "Error logging in"
		fi
	elif [ "$RESPONSE" == "pi@raspberrypi:~$ " ]; then
		echo "Already logged in"
	elif [ ! $COUNT -eq 5 ]; then
		echo "Error logging into Pi0 on try $COUNT.. Retrying in 10s"
		let COUNT=COUNT+1
		sleep 10;
		runCommand(DEVICE);
	else
		echo "Maximum Attempts Reached; Please Debug the Problem"
		exit 1
	fi
}
function login(DEVICE) {
	LOGINSUCCESS=0
	while [ $LOGINSUCCESS -eq 0 ]; do
		if ! /opt/ip-kvn-interface/configuration/serial-login.sh; then
			echo "     Logging into the Pi0 as 'pi' with password 'raspberry' has failed"
			echo "     Open another terminal session and use 'screen /dev/ttyUSB0 115200' to login to the Pi0"
			echo "     Once logged in, hit 'Ctrl-A' then type ':quit' to exit the screen session"
			echo "     Lastly, return here and press 'Enter' to continue or 'Ctrl-C' to give up."
			read CONT
		else
			LOGINSUCCESS=1
		fi
	done

	echo "Setting up auto-login on the serial terminal"
	echo "sudo systemctl enable serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo cp /lib/systemd/system/serial-getty@.service /etc/systemd/system/serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo sed -i 's/agetty --keep-baud 115200/agetty -a pi --keep-baud 115200/g' /etc/systemd/system/serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo systemctl daemon-reload" >> DEVICE

	echo "Disabling network to speed Pi0 bootup"
	echo "sudo systemctl disable networking" >> DEVICE
	echo "sudo apt-get -y remove dhcpcd5 isc-dhcp-client isc-dhcp-common" >> DEVICE
	echo "Waiting for removal of network to complete (90s)"
	sleep 90
}
runCommand(MOUSE);
login(MOUSE);
# - LOGIN - #

# - SET UP - #
function setup(DEVICE) {
	echo "Enabling Correct Modules on Pi0"
	echo "dtoverlay=dwc2" | sudo tee -a /boot/config.txt >> DEVICE
	echo "dwc2" | sudo tee -a /etc/modules >> DEVICE
	echo "libcomposite" | sudo tee -a /etc/modules >> DEVICE

	echo "Transfering files to Pi0 for HID"
	echo "rm -f /tmp/B64" >> DEVICE
	for LINE in $(base64 /opt/ip-kvm-interface/configuration/enable-hid-mouse.sh);
		do echo "echo $LINE >> /tmp/B64" >> DEVICE;
		done
	echo "base64 -d /tmp/B64 > /home/pi/enable-hid-mouse.sh" >> DEVICE
	echo "chmod +x /home/pi/enable-hid-mouse.sh" >> DEVICE

	echo "Enabling HID on Pi0 and adding boot options"
	echo "sudo /home/pi/enable-hid-mouse.sh" >> DEVICE
	echo "sudo cp /etc/rc.local /etc/rc.local.bak" >> DEVICE
	echo "sudo sed -i 's/exit 0//g' /etc/rc.local" >> DEVICE
	echo "echo /home/pi/enable-hid-mouse.sh | sudo tee --append /etc/rc.local" >> DEVICE
	echo "echo exit 0 | sudo tee --append /etc/rc.local" >> DEVICE
setup(MOUSE)
# - SET UP - #
# ------------------------ MOUSE ------------------------ #
													#######
# ------------------- OPEN SERVER HERE ------------------- #
echo "Finished! Try http://<ip of pi3>"
