#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h>

const char *ssid = "YourNetworkSSID";
const char *password = "YourNetworkPassword";
const int relayPin = "YourPinNumber";

ESP8266WebServer server(80);

void handleRoot()
{
    server.send(200, "text/plain", "Hello from ESP8266!");
}

void handleGet()
{
    server.send(200, "text/plain", "Online");
}

void setRelayModule(String relayOn)
{
    pinMode(relayPin, OUTPUT);

    if (relayOn == "true")
    {
        digitalWrite(relayPin, HIGH);
    }
    else
    {
        digitalWrite(relayPin, LOW);
    }
}

void handlePut()
{
    String jsonString = server.arg("plain");

    DynamicJsonDocument jsonDocument(1024);
    DeserializationError error = deserializeJson(jsonDocument, jsonString);

    if (error == DeserializationError::Ok)
    {
        String relayOn = jsonDocument["relayOn"].as<String>();
        setRelayModule(relayOn);

        server.send(200, "text/plain", "Success");
    }
    else
    {
        server.send(400, "text/plain", "Failed to parse JSON data");
    }
}

void setup()
{
    Serial.begin(115200);

    pinMode(relayPin, OUTPUT);
    digitalWrite(relayPin, LOW);

    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }

    Serial.println("Wi-Fi connected");
    Serial.println("IP address: " + WiFi.localIP().toString());

    server.on("/", handleRoot);
    server.on("/relay", HTTP_GET, handleGet);
    server.on("/relay", HTTP_PUT, handlePut);

    server.begin();
    Serial.println("HTTP server started");
}

void loop()
{
    server.handleClient();
}
