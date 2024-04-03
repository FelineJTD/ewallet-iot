import { useEffect, useRef, useState } from "react";
import './styles/text.css';
import mqtt from "precompiled-mqtt";
import Transaction from "./components/transaction";
import Clock from "./components/clock";
import AsciiAnimation from "./components/ascii-animation";

function App() {
  // Params
  const mqttHost = "test.mosquitto.org";
  const mqttPort = 8081;
  const paymentTopic = "user/payment/#";
  const topUpTopic = "user/top-up/#";

  const topUpOptions = [
    { label: "Rp50.000", value: 50000 },
    { label: "Rp100.000", value: 100000 },
    { label: "Rp200.000", value: 200000 },
    { label: "Rp500.000", value: 500000 },
    { label: "Rp1.000.000", value: 1000000 },
  ];

  const mqttUrl = `mqtts://${mqttHost}:${mqttPort}`;
  const client = useRef(null);
  const [status, setStatus] = useState("Disconnected");
  const [currTransaction, setCurrTransaction] = useState(null);
  const [currUser, setCurrUser] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({});

  useEffect(() => {
    client.current = mqtt.connect(mqttUrl);
    client.current.on("connect", () => {
      console.log("connected");
      setStatus("Connected");
      client.current.subscribe(paymentTopic);
      client.current.subscribe(topUpTopic);
    });
    client.current.on("message", (topic, message) => {
      console.log(topic, message.toString());
      const topicParts = topic.split("/");
      const parsed = message.toString().split(";");
      if (topicParts[1] === "payment") {
        setCurrTransaction({user: topicParts[topicParts.length-1], msg: parsed, type: "Pembayaran"});
        setCurrUser(topicParts[topicParts.length-1]);
      } else if (topicParts[1] === "top-up") {
        setCurrTransaction({user: topicParts[topicParts.length-1], msg: parsed, type: "Top-up"});
        setCurrUser(topicParts[topicParts.length-1]);
      }
    });
    client.current.on("reconnect", () => {
      console.log("reconnect");
      setStatus("Reconnecting");
    });

    return () => {
      client.current.end();
    };
  }
  , [mqttUrl, paymentTopic, topUpTopic]);

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
          <p className={status !== "Connected" ? "text-red-500" : "text-green-500"}><b>● {status}</b></p>
        </div>
      </header>
      {/* INCOMING TRANSACTION/STATUS WINDOW */}
      <section className="w-full h-48 border border-zinc-600 mt-8">
        { currTransaction ? 
          <div className="w-full h-full py-8 px-16">
            {/* status */}
            <p className="uppercase">{currTransaction.msg[1] === "failed" ? (`${currTransaction.type} sebesar `  + currTransaction.msg[2] + " gagal." + (currTransaction.type === "Pembayaran" ? " Saldo tidak mencukupi." : "")) : (`${currTransaction.type} sebesar ` + currTransaction.msg[2]  + " berhasil.")}</p>
            {/* saldo */}
            <p>Sisa saldo Anda: {currTransaction.msg[0]}</p>
          </div>
        :
          <div className="w-full h-full flex flex-col items-center justify-center">
            <AsciiAnimation />
            <p className="text-center text-zinc-400">&nbsp;No ongoing transaction.</p>
          </div>
        }
      </section>
      {/* TOP UP MENU */}
      <section className="mt-12">
        <h2>Top Up ({ currUser == "" ? "No user detected. Scan card to top up." : currUser })</h2>
        <div className="flex gap-8 mt-2">
          {topUpOptions.map((option, index) => (
            <button key={index} className="disabled:text-zinc-500 w-full py-4 mt-4 border border-zinc-600 enabled:hover:bg-zinc-200 enabled:hover:text-zinc-950" disabled={currUser === ""} onClick={() => {
              client.current.publish(`merchant/top-up/${currUser}`, `${option.value}`); console.log(`merchant/top-up/${currUser}`, `${option.value}`);
            }}>{option.label}</button>
          ))}
        </div>
      </section>
      {/* TRANSACTION HISTORY */}
      <section className="mt-12">
        <div className="flex justify-between">
          <h2>Transaction History</h2>
          <button className="underline" onClick={() => setTransactions([])}>Clear history</button>
        </div>
        <div className="flex flex-col w-full mt-2">
          {transactions.map((transaction, index) => (
            <Transaction key={index} transaction={transaction} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
