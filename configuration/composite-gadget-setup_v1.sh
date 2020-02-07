#!/bin/bash
# Composite Gadget Setup Script

echo "Enabling Modules"
modprobe dwc2
modprobe libcomposite

# Assumes a disk image exists here...
#FILE=/home/pi/KVM/mass-storage.img

echo "Creating Composite Gadget..."
cd /sys/kernel/config/usb_gadget/

mkdir -p kvm-gadget
cd kvm-gadget

echo 0x1d6b > idVendor # Linux Foundation
echo 0x0104 > idProduct # Multifunction Composite Gadget
echo 0x0100 > bcdDevice # v1.0.0
echo 0x0200 > bcdUSB # USB2

mkdir -p strings/0x409 # English
echo "0123456789" > strings/0x409/serialnumber
echo "Butters" > strings/0x409/manufacturer
echo "KVM-Gadget" > strings/0x409/product

echo "Creating Functions"
A="name"
# mkdir -p functions/acm.$A
# mkdir -p functions/ecm.$A
mkdir -p functions/hid.mouse
mkdir -p functions/hid.keyboard
mkdir -p functions/mass_storage.usb

# First byte of address must be even
# HOST="48:6f:73:74:50:43" # "HostPC"
# SELF="42:61:64:55:53:42" # "BadUSB"
# echo $HOST > functions/ecm.$A/host_addr
# echo $SELF > functions/ecm.$A/dev_addr

# Mass Storage Functions
#echo 1 > functions/mass_storage.usb/stall
#echo 0 > functions/mass_storage.usb/lun.0/cdrom
#echo 0 > functions/mass_storage.usb/lun.0/ro
#echo 0 > functions/mass_storage.usb/lun.0/nofua
#echo $FILE > functions/mass_storage.usb/lun.0/file

# Mouse Functions
echo 1 > functions/hid.mouse/protocol
echo 1 > functions/hid.mouse/subclass
echo 8 > functions/hid.mouse/report_length
echo -ne \\x05\\x01\\x09\\x02\\xa1\\x01\\x09\\x01\\xa1\\x00\\x05\\x09\\x19\\x01\\x29\\x03\\x15\\x00\\x25\\x01\\x95\\x03\\x75\\x01\\x81\\x02\\x95\\x01\\x75\\x05\\x81\\x01\\x05\\x01\\x09\\x30\\x09\\x31\\x15\\x81\\x25\\x7f\\x75\\x08\\x95\\x02\\x81\\x06\\xc0\\xc0 > functions/hid.mouse/report_desc

# Keyboard Functions
echo 1 > functions/hid.keyboard/protocol
echo 1 > functions/hid.keyboard/subclass
echo 8 > functions/hid.keyboard/report_length
echo -ne \\x05\\x01\\x09\\x06\\xa1\\x01\\x05\\x07\\x19\\xe0\\x29\\xe7\\x15\\x00\\x25\\x01\\x75\\x01\\x95\\x08\\x81\\x02\\x95\\x01\\x75\\x08\\x81\\x03\\x95\\x05\\x75\\x01\\x05\\x08\\x19\\x01\\x29\\x05\\x91\\x02\\x95\\x01\\x75\\x03\\x91\\x03\\x95\\x06\\x75\\x08\\x15\\x00\\x25\\x65\\x05\\x07\\x19\\x00\\x29\\x65\\x81\\x00\\xc0 > functions/hid.keyboard/report_desc

echo "Linking Functions to Configuration"
C=1
mkdir -p configs/c.$C/strings/0x409
echo "Configuration $C" > configs/c.$C/strings/0x409/configuration
echo 250 > configs/c.$C/MaxPower
# ln -s functions/acm.$A configs/c.$C/
# ln -s functions/ecm.$A configs/c.$C/
ln -s functions/hid.mouse configs/c.$C/
ln -s functions/hid.keyboard configs/c.$C/
#ln -s functions/mass_storage.usb configs/c.$C/

echo "Changing Permissions for UDC Control"
chmod -R ug+rw /sys/kernel/config/usb_gadget/kvm-gadget

echo "Handing Off UDC Drivers To Controller"
# Hand off UDC drivers to controller
ls /sys/class/udc > UDC
# echo '' > UDC # Remove driver controller

# ifconfig $A 10.0.0.1 netmask 255.255.255.252 up
# route add -net default gw 10.0.0.2

echo "Configuration Script Complete"
