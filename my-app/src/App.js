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
  const [currTransaction, setCurrTransaction] = useState(null);
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
      setCurrTransaction(message.toString());
    });
    client.current.on("reconnect", () => {
      console.log("reconnect");
      setStatus("Reconnecting");
    });

    return () => {
      client.current.end();
    };
  }
  , []);

  useEffect(() => {
    if (!currTransaction) return;

    setTimeout(() => {
      setTransactions((prevTransactions) => {
        return [currTransaction, ...prevTransactions];
      });
      setCurrTransaction(null);
    }, 5000);

  }, [currTransaction]);

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
        <p>{currTransaction}</p>
      </div>
      {/* TRANSACTION HISTORY */}
      <div className="text-white flex flex-col w-full h-full">
        <h2>Transaction History</h2>
        {/* <div className="flex flex-col w-full h-full"> */}
          {transactions.map((transaction, index) => (
            <Transaction key={index} transaction={transaction} />
          ))}
        {/* </div> */}
      </div>
    </main>
  );
}

export default App;
