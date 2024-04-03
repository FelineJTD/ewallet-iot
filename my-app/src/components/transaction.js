import { useEffect, useRef } from "react";
import logo from './logo.svg';
import './App.css';
import mqtt from "precompiled-mqtt";

function Transaction({ transaction }) {
  // Params
  const mqttHost = "test.mosquitto.org";
  const mqttPort = 8081;
  const mqttTopic = "13520050-if4051-out";

  const mqttUrl = `mqtts://${mqttHost}:${mqttPort}`;
  const client = useRef(null);

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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Transaction;
