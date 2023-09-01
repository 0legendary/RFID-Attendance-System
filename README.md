# RFID-Attendance-System

#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

#define RST_PIN   D1   // Define reset pin
#define SDA_PIN   D2   // Define SDA pin
#define GREEN_LED D3   // Define green LED pin
#define RED_LED   D4   // Define red LED pin

const char* ssid = "Alen's Galaxy F12";
const char* password = "legendary";
const char* backendURL = "http://192.168.146.206:4000/original-uid";

MFRC522 mfrc522(SDA_PIN, RST_PIN);  // Create MFRC522 instance
WiFiClient wifiClient;  // Create a WiFiClient instance for HTTPClient

unsigned long ledTimer = 0;  // Timer to control LED state
bool ledsOn = false;         // Flag to indicate LED state

void setup() {
  Serial.begin(9600);  // Initialize serial communication
  SPI.begin();         // Initialize SPI bus
  mfrc522.PCD_Init();  // Initialize MFRC522

  WiFi.begin(ssid, password); // Connect to Wi-Fi network
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  
  // Initialize LED pins
  pinMode(GREEN_LED, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  digitalWrite(GREEN_LED, LOW);
  digitalWrite(RED_LED, LOW);
}

void loop() {
  // Look for new cards/tags
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    // Get UID
    String content = "";
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
      content.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    
    // Send UID to backend and receive the response
    String response = sendUIDToBackend(content);
    Serial.println("Received decimalUID from backend: " + response);
    
    // Control LEDs based on the response
    if (response == "1") {
      digitalWrite(GREEN_LED, HIGH);  // Turn on green LED
      digitalWrite(RED_LED, LOW);     // Turn off red LED
      ledTimer = millis();  // Reset the timer
      ledsOn = true;  // Set flag to indicate LEDs are on
    } else if (response == "0") {
      digitalWrite(GREEN_LED, LOW);    // Turn off green LED
      digitalWrite(RED_LED, HIGH);     // Turn on red LED
      ledTimer = millis();  // Reset the timer
      ledsOn = true;  // Set flag to indicate LEDs are on
    } else {
      // Handle other responses if needed
      digitalWrite(GREEN_LED, LOW);    // Turn off green LED
      digitalWrite(RED_LED, LOW);      // Turn off red LED
      ledsOn = false;  // Set flag to indicate LEDs are off
    }
  }

  // Check if it's time to turn off the LEDs
  if (ledsOn && (millis() - ledTimer >= 3000)) {
    digitalWrite(GREEN_LED, LOW);  // Turn off green LED
    digitalWrite(RED_LED, LOW);    // Turn off red LED
    ledsOn = false;  // Set flag to indicate LEDs are off
  }
}

String sendUIDToBackend(String uid) {
  HTTPClient http;
  String response = ""; // Declare the response variable

  String fullURL = String(backendURL) + "?uid=" + uid;

  http.begin(wifiClient, fullURL);  // Use wifiClient instance with begin

  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    response = http.getString(); 
  } else {
    Serial.print("Error in HTTP request. HTTP Response code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
  return response;
}
