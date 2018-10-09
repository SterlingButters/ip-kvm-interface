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

void setup() {
  // Open serial communications and wait for port to open:
  Serial.begin(9600);
  // Set the data rate for the SoftwareSerial port
  rpiSerial.begin(9600);
  // initialize control over the keyboard:
  Mouse.begin();
  while (!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  Serial.println("Mouse Serial Connection Established");
}

void loop() {
  const int sensitivity = 250;  // Higher sensitivity value = slower mouse,
                                // should be <=~ 500

  if (rpiSerial.available()) {
    // read incoming serial data:
    String cursorInfo = String(rpiSerial.read());

    // Parse cursor info
    Serial.println(cursorInfo);

    // MOUSE_LEFT || MOUSE_RIGHT || MOUSE_MIDDLE || MOUSE_ALL

    if (cursorInfo = 'leftDown') {Mouse.press(MOUSE_LEFT);};
    if (cursorInfo = 'leftUp') {Mouse.release(MOUSE_LEFT);};
    if (cursorInfo = 'middleDown') {Mouse.press(MOUSE_LEFT);};
    if (cursorInfo = 'middleUp') {Mouse.release(MOUSE_LEFT);};
    if (cursorInfo = 'rightDown') {Mouse.press(MOUSE_LEFT);};
    if (cursorInfo = 'rightUp') {Mouse.release(MOUSE_LEFT);};
    else {
      // Get x/y values from info string; strtok() function
      int xValue = getValue(cursorInfo, ',', 0).toInt();
      int yValue = getValue(cursorInfo, ',', 1).toInt();

      // Cursor Movement
      if (xValue != 0){
        Mouse.move(xValue/sensitivity, 0, 0);  // move mouse on x axis;
      };
      if (yValue != 0){
        Mouse.move(0, yValue/sensitivity, 0);  // move mouse on y axis
      };
    };
  };
};
