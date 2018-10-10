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
  }

  Serial.println("Serial Connection Established");
}

void loop() {
  if (rpiSerial.available()) {
    // Type the ASCII value received:
    // char inChar = rpiSerial.read();
    // Keyboard.println(inChar);
    // Serial.println(inChar);

    // "Type" via keyCodes (recommended for modifiers)
    // https://www.arduino.cc/en/Reference/KeyboardWrite not behaving as expected
    int inKey = rpiSerial.read();
    Keyboard.write(inKey);
    Serial.write(inKey);
  }
}
