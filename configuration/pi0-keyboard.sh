#!/bin/bash
function setup(DEVICE) {

	echo "Enabling Correct Modules on Pi0"
	echo "dtoverlay=dwc2" | sudo tee -a /boot/config.txt >> DEVICE
	echo "dwc2" | sudo tee -a /etc/modules >> DEVICE
	echo "libcomposite" | sudo tee -a /etc/modules >> DEVICE

	echo "Transfering files to Pi0 for HID"
	echo "rm -f /tmp/B64" >> DEVICE
	for LINE in $(base64 /opt/ip-kvm-interface/configuration/enable-hid.sh);
		do echo "echo $LINE >> /tmp/B64" >> DEVICE;
		done
	echo "base64 -d /tmp/B64 > /home/pi/enable-hid.sh" >> DEVICE
	echo "chmod +x /home/pi/enable-hid.sh" >> DEVICE

	echo "Enabling HID on Pi0 and adding boot options"
	echo "sudo /home/pi/enable-hid.sh" >> DEVICE
	echo "sudo cp /etc/rc.local /etc/rc.local.bak" >> DEVICE
	echo "sudo sed -i 's/exit 0//g' /etc/rc.local" >> DEVICE
	echo "echo /home/pi/enable-hid.sh | sudo tee --append /etc/rc.local" >> DEVICE
	echo "echo exit 0 | sudo tee --append /etc/rc.local" >> DEVICE
}

setup(KEYBOARD)
setup(MOUSE)
