#!/bin/bash
# TODO: Consider getty service: sudo systemctl enable serial-getty@ttyAMA0.service

RESPONSE=
COUNT=1

KEYBOARD=/dev/ttyUSB0
MOUSE=/dev/ttyUSB1

function processResponse(DEVICE) {
	if [ "$RESPONSE" == "raspberrypi login: " ]; then
		echo "Attempting login"
		echo "pi" >> DEVICE
		echo "raspberry" >> DEVICE
		sleep 1
		runCommand
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
		runCommand;
	else
		echo "Maximum Attempts Reached; Please Debug the Problem"
		exit 1
	fi
}

function runCommand(DEVICE) {
        exec 3<DEVICE                    			 # REDIRECT SERIAL OUTPUT TO FD 3
        cat <&3 > /mnt/ramdisk/ttyDump.dat &           # REDIRECT SERIAL OUTPUT TO FILE
        PID=$!                                				 # SAVE PID TO KILL CAT
        echo "" > DEVICE         						 # SEND COMMAND STRING TO SERIAL PORT
        sleep 1                          							 # WAIT FOR RESPONSE
        kill $PID                             				 # KILL CAT PROCESS
        exec 3<&-                               			 # FREE FD 3
        RESPONSE=$(tail -n 1 /mnt/ramdisk/ttyDump.dat) # DUMP CAPTURED DATA
	processResponse(DEVICE);
}

runCommand(KEYBOARD);
runCommand(MOUSE);

# Set up Keyboard & Mouse
echo "./pi0-keyboard.sh" >> KEYBOARD
echo "./pi0-mouse.sh" >> MOUSE
