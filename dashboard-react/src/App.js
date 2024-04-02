import React from "react";
import { Connector, subscribe } from "react-mqtt-client";

export default function App() {
  return (
    <Connector
      mqttProps={{
        url: "wss://test.mosquitto.org:8081",
        options: { protocol: "wss" }, // see MQTTjs options
      }}
    >
      <Connected />
    </Connector>
  );
}

const MessageList = (props) => {
  const { mqtt, data } = props;
  // here mqtt is the connection object
  // and data is the object that has the incoming data from the broker

  return (
    <React.Fragment>
      {data.map((d, i) => (
        <p>{`${JSON.stringify(d, null, 4)}`}</p>
      ))}
    </React.Fragment>
  );
};

// name the below component anything you want
const Connected = subscribe({ topic: "13520050-if4051-out" })(MessageList);
