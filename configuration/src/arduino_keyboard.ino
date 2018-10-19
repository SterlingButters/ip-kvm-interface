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
  Serial.begin(115200);
  // Set the data rate for the SoftwareSerial port
  rpiSerial.begin(115200);
  // initialize control over the keyboard:
  Keyboard.begin();
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  Serial.println("Keyboard Serial Connection Established");
}

String keyCode = "";
char state;

void loop() {
  while (rpiSerial.available() > 0) {
    // "Type" via keyCodes (recommended for modifiers)
    // https://www.arduino.cc/en/Reference/KeyboardWrite not behaving as expected

    int data = rpiSerial.read();
    if (isDigit(data)) {
      keyCode += (char)data;
    }

    if (isAlpha(data)) {
      state = (char)data;
    }

    if (data == '\n') {
      Serial.print(state);
      Serial.println(keyCode.toInt());

      if (state == 'd') {
        Keyboard.press(keyCode.toInt());
      }

      if (state == 'u') {
        Keyboard.release(keyCode.toInt());
      }

      keyCode = "";
      char state;
    }
  }
}
