import React from 'react';

export default function Home() {
  const [client, setClient] = useState(null);
  const mqttConnect = (host, mqttOption) => {
    setConnectStatus('Connecting');
    setClient(mqtt.connect(host, mqttOption));
  };

  useEffect(() => {
    if (client) {
      console.log(client);
      client.on('connect', () => {
        setConnectStatus('Connected');
      });
      client.on('error', (err) => {
        console.error('Connection error: ', err);
        client.end();
      });
      client.on('reconnect', () => {
        setConnectStatus('Reconnecting');
      });
      client.on('message', (topic, message) => {
        const payload = { topic, message: message.toString() };
        setPayload(payload);
      });
    }
  }, [client]);

  const mqttSub = (subscription) => {
    if (client) {
      const { topic, qos } = subscription;
      client.subscribe(topic, { qos }, (error) => {
        if (error) {
          console.log('Subscribe to topics error', error);
          return;
        }
        setIsSub(true);
      });
    }
  };

  const mqttUnsub = (topic) => {
    if (client) {
      client.unsubscribe(topic, (error) => {
        if (error) {
          console.log('Unsubscribe to topics error', error);
          return;
        }
        setIsSub(false);
      });
    }
  }

  const mqttPub = (topic, message, qos) => {
    if (client) {
      client.publish(topic, message, { qos }, (error) => {
        if (error) {
          console.log('Publish message error', error);
          return;
        }
      });
    }
  };

  const mqttDisconnect = () => {
    if (client) {
      client.end();
      setConnectStatus('Disconnected');
    }
  }

  return (
    <main>
      
    </main>
  );
}
