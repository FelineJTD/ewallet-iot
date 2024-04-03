import { useEffect, useRef, useState } from "react";
import './styles/text.css';
import mqtt from "precompiled-mqtt";
import Transaction from "./components/transaction";
import Clock from "./components/clock";

function App() {
  // Params
  const mqttHost = "test.mosquitto.org";
  const mqttPort = 8081;
  const mqttTopic = "13520050-if4051-out";

  const mqttUrl = `mqtts://${mqttHost}:${mqttPort}`;
  const client = useRef(null);
  const [status, setStatus] = useState("Disconnected");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    client.current = mqtt.connect(mqttUrl);
    client.current.on("connect", () => {
      console.log("connected");
      setStatus("Connected");
      client.current.subscribe(mqttTopic);
    });
    client.current.on("message", (topic, message) => {
      console.log(topic, message.toString());
      setTransactions((prevTransactions) => {
        return [...prevTransactions, message];
      });
    });
    client.current.on("reconnect", () => {
      console.log("reconnect");
      setStatus("Reconnecting...");
    });

    return () => {
      client.current.end();
    };
  }
  , []);

  return (
    <main className="bg-zinc-800 text-zinc-50 min-h-screen w-full py-24 px-24 xl:px-[20vw]">
      {/* HEADER */}
      <header className="flex justify-between">
        <h1 className="">Merchant-UI</h1>
        <div className="text-right">
          <Clock />
          <p className={status != "Connected" ? "text-red-500" : "text-green-500"}><b>● {status}</b></p>
        </div>
      </header>
      {/* INCOMING TRANSACTION/STATUS WINDOW */}
      <div>

      </div>
      {/* TRANSACTION HISTORY */}
      <div>
        {transactions.map((transaction, index) => {
          <Transaction key={index} transaction={transaction} />
        })}
      </div>
    </main>
  );
}

export default App;
