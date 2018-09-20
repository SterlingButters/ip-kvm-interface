#!/bin/bash
RESPONSE=
COUNT=1

# Case Right Now
KEYBOARD=/dev/cu.SLAB_USBtoUART

# KEYBOARD=/dev/ttyUSB0
# MOUSE=/dev/ttyUSB1

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

runCommand(KEYBOARD);
runCommand(MOUSE);

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

	echo "Setting up auto login on the serial terminal"
	echo "sudo systemctl enable serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo cp /lib/systemd/system/serial-getty@.service /etc/systemd/system/serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo sed -i 's/agetty --keep-baud 115200/agetty -a pi --keep-baud 115200/g' /etc/systemd/system/serial-getty@ttyAMA0.service" >> DEVICE
	echo "sudo systemctl daemon-reload" >> DEVICE

	echo "Disabling network to speed Pi0 bootup"
	echo "sudo systemctl disable networking" >> DEVICE
	echo "sudo apt-get -y remove dhcpcd5 isc-dhcp-client isc-dhcp-common" >> DEVICE
	echo "Waiting for removal of network to complete (90s)"
	sleep 90

	login(KEYBOARD)
	login(MOUSE)
