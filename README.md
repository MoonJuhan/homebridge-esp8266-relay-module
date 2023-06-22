# homebridge-esp8266-relay-module

Manage relay module with ESP8266 in HomeKit.

## Installation

1. [How to set ESP8266](./arduino-sketch/HowToSetESP8266.md)
2. Install this plugin using: `npm i homebridge-esp8266-relay-module`
3. Update your configuration file.

## Configuration

```
"accessories": [
    {
        "accessory": "ESP8266RelayModule",
        "name": "ESP8266",
        "ip": "192.168.0.0",
    }
]
```
