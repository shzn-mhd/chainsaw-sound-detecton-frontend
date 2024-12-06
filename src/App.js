import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mqtt from 'mqtt';
import { encodeWav } from './utils/wavEncoder'; // Utility to convert data to .wav file

const App = () => {
  const [message, setMessage] = useState('');
  const [alarmPlaying, setAlarmPlaying] = useState(false);
  const [client, setClient] = useState(null);
  const [isReceiving, setIsReceiving] = useState(false);

  const brokerURL = 'wss://af2e889793a54ad0a21bf88b46c781e3.s1.eu.hivemq.cloud:8884/mqtt';
  const topic = 'node/chainsaw/status';

  useEffect(() => {
    if (client) {
      client.on('message', (topic, payload) => {
        handleDataReceived(JSON.parse(payload.toString()));
      });
    }
  }, [client]);

  const handleStart = () => {
    const mqttClient = mqtt.connect(brokerURL, {
      username: 'dinuka',
      password: 'Dinu@123',
      protocol: 'wss',
    });

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe(topic);
      setIsReceiving(true);
    });

    mqttClient.on('error', (err) => {
      console.error('MQTT error:', err);
    });

    setClient(mqttClient);
  };

  const handleStop = () => {
    if (client) {
      client.end();
      console.log('Disconnected from MQTT broker');
    }
    setClient(null);
    setIsReceiving(false);
    setMessage('Stopped receiving data.');
  };

  const handleDataReceived = async (data) => {
    try {
      // Convert incoming data to WAV file
      const wavFile = encodeWav(data);

      // Prepare form data
      const formData = new FormData();
      formData.append('file', wavFile);

      // Send the WAV file to the backend
      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.prediction === 'Hazard in forest area') {
        setMessage('Hazard detected: Chainsaw sound identified!');
        setAlarmPlaying(true);
      } else {
        setMessage('Safe: No chainsaw sound detected.');
        setAlarmPlaying(false);
      }
    } catch (error) {
      console.error('Error predicting the audio:', error);
      setMessage('Error detecting sound. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chainsaw Sound Detector</h1>
      <button onClick={handleStart} style={{ marginRight: '10px', padding: '5px 15px' }}>
        Start
      </button>
      <button onClick={handleStop} style={{ padding: '5px 15px' }}>
        Stop
      </button>
      <div style={{ marginTop: '20px', fontSize: '18px' }}>{message}</div>
      {alarmPlaying && (
        <audio src="/alarm.mp3" autoPlay loop />
      )}
    </div>
  );
};

export default App;
