import { useEffect, useRef, useState } from "react";
import logo from './logo.svg';
import './App.css';
import mqtt from "precompiled-mqtt";

function App() {
  // Params
  const mqttHost = "test.mosquitto.org";
  const mqttPort = 8081;
  const mqttTopic = "13520050-if4051-out";

  const mqttUrl = `mqtts://${mqttHost}:${mqttPort}`;
  const client = useRef(null);
  const status = useState("Disconnected");

  useEffect(() => {
    client.current = mqtt.connect(mqttUrl);
    client.current.on("connect", () => {
      console.log("connected");
      client.current.subscribe(mqttTopic);
    });
    client.current.on("message", (topic, message) => {
      console.log(topic, message.toString());
    });
    client.current.on("reconnect", () => {
      console.log("reconnect");
    });

    return () => {
      client.current.end();
    };
  }
  , []);

  return (
    <main className="bg-zinc-800 min-h-screen w-full">
      <h1 className="">Merchant-UI</h1>
    </main>
  );
}

export default App;
