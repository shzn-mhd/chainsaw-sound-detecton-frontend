// Install necessary packages before starting:
// npm install axios react-audio-player
// Ensure you have a backend (like Flask or Node.js) set up to handle model prediction.

import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [message, setMessage] = useState('');
  const [alarmPlaying, setAlarmPlaying] = useState(false);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
    setMessage('');
    setAlarmPlaying(false);
  };

  const handlePredict = async () => {
    if (!audioFile) {
      alert('Please select an audio file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioFile);

    try {
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
      }
    } catch (error) {
      console.error('Error predicting the audio:', error);
      setMessage('Error detecting sound. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chainsaw Sound Detector</h1>
      <input type="file" accept="audio/wav" onChange={handleFileChange} />
      <button onClick={handlePredict} style={{ marginLeft: '10px', padding: '5px 15px' }}>
        Detect Sound
      </button>
      <div style={{ marginTop: '20px', fontSize: '18px' }}>{message}</div>
      {alarmPlaying && (
        <audio src="/alarm.mp3" autoPlay loop />
      )}
    </div>
  );
};

export default App;
