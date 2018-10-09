/*
  Receives from the hardware serial, sends to software serial.
  Receives from software serial, sends to hardware serial.

  The circuit:
   RX is digital pin 10 (connect to TX of other device)
   TX is digital pin 11 (connect to RX of other device)

  Not all pins on the Leonardo and Micro support change interrupts,
  so only the following can be used for RX:
  8, 9, 10, 11, 14 (MISO), 15 (SCK), 16 (MOSI).
*/

#include <SoftwareSerial.h>
#include <Keyboard.h>

SoftwareSerial rpiSerial(10, 11); // RX, TX

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  // Set the data rate for the SoftwareSerial port
  rpiSerial.begin(9600);
  // initialize control over the keyboard:
  Keyboard.begin();
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  };

  Serial.println("Keyboard Serial Connection Established");
};

void loop() {
  if (rpiSerial.available()) {
    // read incoming serial data:
    String inKey = String(rpiSerial.read());
    // Type the ASCII value received:
    // https://www.arduino.cc/en/Reference/KeyboardModifiers
    // TODO: Create Press/Release functionality; Add insert, delete, etc later
    // https://www.arduino.cc/en/Reference/KeyboardPress
    if (inKey = "space") {Keyboard.println(" ");};
    if (inKey = "enter") {Keyboard.write(176);};

    if (inKey = "backspace") {Keyboard.write(178);};
    if (inKey = "shiftleft") {Keyboard.write(129);};
    if (inKey = "shiftright") {Keyboard.write(133);};
    if (inKey = "capslock") {Keyboard.write(193);};

    if (inKey = "altleft") {Keyboard.write(130);};
    if (inKey = "altright") {Keyboard.write(134);};
    if (inKey = "metaleft") {Keyboard.write(131);};
    if (inKey = "metaright") {Keyboard.write(135);};
    if (inKey = "controlleft") {Keyboard.write(128);};
    if (inKey = "controlright") {Keyboard.write(132);};
    if (inKey = "escape") {Keyboard.write(177);};

    if (inKey = "arrowleft") {Keyboard.write(216);};
    if (inKey = "arrowright") {Keyboard.write(215);};
    if (inKey = "arrowup") {Keyboard.write(218);};
    if (inKey = "arrowdown") {Keyboard.write(217);};

    if (inKey = "f1") {Keyboard.write(194);};
    if (inKey = "f2") {Keyboard.write(195);};
    if (inKey = "f3") {Keyboard.write(196);};
    if (inKey = "f4") {Keyboard.write(197);};
    if (inKey = "f5") {Keyboard.write(198);};
    if (inKey = "f6") {Keyboard.write(199);};
    if (inKey = "f7") {Keyboard.write(200);};
    if (inKey = "f8") {Keyboard.write(201);};
    if (inKey = "f9") {Keyboard.write(202);};
    if (inKey = "f10") {Keyboard.write(203);};
    if (inKey = "f11") {Keyboard.write(204);};
    if (inKey = "f12") {Keyboard.write(205);};

    else {Keyboard.println(inKey);};

    Serial.println(inKey);
  };
};
