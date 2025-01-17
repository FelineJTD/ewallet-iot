// ewallet-iot.ino
// UTS IF4051 Pengembangan Sistem IoT Semester 2 2023/2024
// Nama: Felicia Sutandijo
// NIM: 13520050

// Imports
#include <WiFi.h>
#include <PubSubClient.h>

// WiFi params
const char* ssid = "Indah 231";
const char* password = "gakpakepassword";
// const char* ssid = "There's no wifi again >:(";
// const char* password = "wiiifiii";
const char* mqtt_server = "test.mosquitto.org";
const char* user_id = "person-1";

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
unsigned long lastClick = 0;
bool just_checked = false;

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
  char nominal_top_up[10] = "";
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
    nominal_top_up[i] = (char)payload[i];
  }
  int nominal_top_up_int = atoi(nominal_top_up);
  Serial.println();

  Serial.println(nominal_top_up_int);
  top_up(nominal_top_up_int);
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
      client.subscribe("merchant/top-up/person-1");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void check() {
  snprintf (msg, MSG_BUFFER_SIZE, "%ld", saldo);
  client.publish("user/check/person-1", msg);
  // LED
  int onTime = 1000;
  digitalWrite(BUILTIN_LED, HIGH);
  delay(onTime);
  digitalWrite(BUILTIN_LED, LOW);
}

// Pay
void pay(int nominal) {
  Serial.println("Pay");
  if (nominal > saldo) {
    Serial.println("SALDO TIDAK MENCUKUPI.");
    // LED
    int blinkTime = 5000;
    int frek = 100;
    snprintf (msg, MSG_BUFFER_SIZE, "%ld;failed;%ld", saldo, nominal_transaksi);
    client.publish("user/payment/person-1", msg);
    for (int i=0; i<=blinkTime; i+=frek) {
      digitalWrite(BUILTIN_LED, HIGH);
      delay(frek / 2);
      digitalWrite(BUILTIN_LED, LOW);
      delay(frek / 2);
    }
  } else {
    saldo -= nominal;
    Serial.println(saldo);
    snprintf (msg, MSG_BUFFER_SIZE, "%ld;success;%ld", saldo, nominal_transaksi);
    client.publish("user/payment/person-1", msg);
    // LED
    int onTime = 5000;
    digitalWrite(BUILTIN_LED, HIGH);
    delay(onTime);
    digitalWrite(BUILTIN_LED, LOW);
  }
}

void top_up(int nominal) {
  Serial.println("Top up");
  saldo += nominal;
  Serial.println(saldo);
  snprintf (msg, MSG_BUFFER_SIZE, "%ld;success;%ld", saldo, nominal);
  client.publish("user/top-up/person-1", msg);
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

  int button_state = digitalRead(BUTTON);
  unsigned long now = millis();
  if (curr_button_state == LOW && button_state == LOW && (now - lastClick > 2000)) {
    check();
    curr_button_state = LOW;
    lastClick = now;
    just_checked = true;
  } else if (just_checked == false && curr_button_state == LOW && button_state == HIGH) {
    pay(nominal_transaksi);    
    curr_button_state = HIGH;
  } else if (button_state == HIGH) {
    curr_button_state = HIGH;
    lastClick = now;
    just_checked = false;
  } else if (button_state == LOW) {
    curr_button_state = LOW;
  }
}
