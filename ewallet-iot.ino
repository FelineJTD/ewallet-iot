// ewallet-iot.ino
// UTS IF4051 Pengembangan Sistem IoT Semester 2 2023/2024
// Nama: Felicia Sutandijo
// NIM: 13520050

// Imports
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi params
// const char* ssid = "Indah 231";
// const char* password = "gakpakepassword";
const char* ssid = "Christael Art Coffee";
const char* password = "12348765";
const char* mqtt_server = "broker.mqtt-dashboard.com";

// Client setup
WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE	(50)
char msg[MSG_BUFFER_SIZE];

// Variables
int BUILTIN_LED = 2;
int BUTTON = 0;

int curr_button_state = HIGH;
int saldo = 150000;
int nominal_transaksi = 20000;

int freq = 1;

// WiFi setup
void setup_wifi() {

  delay(10);
  // Connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish("13520050-if4051-out", "hello world");
      // ... and resubscribe
      client.subscribe("13520050-if4051-in");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

// Pay
void pay(int nominal) {
  Serial.println("Pay");
  if (nominal > saldo) {
    Serial.println("SALDO TIDAK MENCUKUPI.");
    // LED
    int blinkTime = 5000;
    int frek = 100;
    for (int i=0; i<=blinkTime; i+=frek) {
      digitalWrite(BUILTIN_LED, HIGH);
      delay(frek / 2);
      digitalWrite(BUILTIN_LED, LOW);
      delay(frek / 2);
    }
  } else {
    saldo -= nominal;
    Serial.println(saldo);
    // LED
    int onTime = 5000;
    digitalWrite(BUILTIN_LED, HIGH);
    delay(onTime);
    digitalWrite(BUILTIN_LED, LOW);
  }
}

void setup() {
  pinMode(BUILTIN_LED, OUTPUT);     // Initialize the BUILTIN_LED pin as an output
  pinMode(BUTTON, INPUT);
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  // if (now - lastMsg > 2000) {
  //   lastMsg = now;
  //   snprintf (msg, MSG_BUFFER_SIZE, "13520050: %ld Hz", freq);
  //   Serial.print("Publish message: ");
  //   Serial.println(msg);
  //   client.publish("13520050-if4051-out", msg);
  // }

  int button_state = digitalRead(BUTTON);
  if (curr_button_state == HIGH && button_state == LOW) {
    pay(nominal_transaksi);    
    curr_button_state = LOW;
  } else if (button_state == HIGH) {
    curr_button_state = HIGH;
  }
}
