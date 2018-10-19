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
#include <Mouse.h>

SoftwareSerial rpiSerial(10, 11); // RX, TX


String inString = "";

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  // Set the data rate for the SoftwareSerial port
  rpiSerial.begin(9600);
  // initialize control over the Mouse:
  Mouse.begin();
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  Serial.println("Mouse Serial Connection Established");
}

String value = "";
String state = "";

void loop() {
  const int sensitivity = 250;  // Higher sensitivity value = slower mouse,
                                // should be <=~ 500

  while (rpiSerial.available() > 0) {
    // read incoming serial data:
    int data = rpiSerial.read();
    if (isDigit(data)) {
      value += (char)data;
    }

    if (isAlpha(data)) {
      state += (char)data;
    }

    if (data == '\n') {
      Serial.print(state);
      Serial.println(value.toInt());

      // Cursor Movement
      // Should check if value == 0 ?
      if (state == 'x') {
        Mouse.move(value.toInt()/sensitivity, 0, 0);
      }

      if (state == 'y') {
        Mouse.move(0, value.toInt()/sensitivity, 0);
      }

      // MOUSE_LEFT || MOUSE_RIGHT || MOUSE_MIDDLE || MOUSE_ALL
      if (state = "leftDown") {Mouse.press(MOUSE_LEFT);};
      if (state = "leftUp") {Mouse.release(MOUSE_LEFT);};
      if (state = "middleDown") {Mouse.press(MOUSE_LEFT);};
      if (state = "middleUp") {Mouse.release(MOUSE_LEFT);};
      if (state = "rightDown") {Mouse.press(MOUSE_LEFT);};
      if (state = "rightUp") {Mouse.release(MOUSE_LEFT);};

    }
  }
}  
