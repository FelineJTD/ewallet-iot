import { useEffect, useRef } from "react";
import logo from './logo.svg';
import './App.css';
import mqtt from "precompiled-mqtt";
// import Connector from "react-mqtt-client/dist/Connector";

function App() {
  const client = useRef(null);

  useEffect(() => {
    client.current = mqtt.connect("mqtts://test.mosquitto.org:8081");
    client.current.on("connect", () => {
      console.log("connected");
      client.current.subscribe("13520050-if4051-out");
    });
    client.current.on("message", (topic, message) => {
      console.log(topic, message.toString());
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

export default App;
