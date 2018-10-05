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

  Serial.println("Serial Connection Established");
}

void loop() {
  const int sensitivity = 250;  // Higher sensitivity value = slower mouse,
                                // should be <=~ 500

  if (rpiSerial.available()) {
    // read incoming serial data:
    var cursorInfo = rpiSerial.read();

    // parse cursor info
    var horzValue = ;
    var vertValue = ;
    var clickValue = ;
    var clickDown = ;

    if (horzValue != 0){
      Mouse.move(horzValue/sensitivity, 0, 0);  // move mouse on x axis;
    }
    if (vertValue != 0){
      Mouse.move(0, vertValue/sensitivity, 0);  // move mouse on y axis
    }

    // MOUSE_LEFT || MOUSE_RIGHT || MOUSE_MIDDLE || MOUSE_ALL

    if (clickValue = 0 && clickDown = true){
    Mouse.press(MOUSE_LEFT);  // click the left button down
    }
    if (clickValue = 0 && clickDown = false){
    Mouse.release(MOUSE_LEFT);  // release the left button
    }

    if (clickValue = 1 && clickDown = true){
    Mouse.press(MOUSE_RIGHT);
    }
    if (clickValue = 1 && clickDown = false){
    Mouse.release(MOUSE_RIGHT);
    }

    if (clickValue = 2 && clickDown = true){
    Mouse.press(MOUSE_MIDDLE);
    }
    if (clickValue = 2 && clickDown = false){
    Mouse.release(MOUSE_MIDDLE); 
    }

    Serial.println(horzValue, vertValue, clickValue, clickDown);
  }
}
