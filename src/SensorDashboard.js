// src/SensorDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line,
  XAxis, YAxis,
  Tooltip, CartesianGrid
} from 'recharts';

export default function SensorDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // İlk çekişte tüm son 20 kaydı al
    axios.get('/sensor/latest?limit=20')
      .then(res => setData(res.data.reverse()))
      .catch(console.error);

    // Her 2 saniyede bir yalnızca tek yeni kayıt alacak şekilde akışı simüle et
    const id = setInterval(async () => {
      try {
        const res = await axios.get('/sensor/latest?limit=1');
        setData(prev => {
          const next = [...prev, res.data[0]];     // eski + yeni
          return next.length > 20 
            ? next.slice(next.length-20)           // en fazla 20 tut
            : next;
        });
      } catch (e) {
        console.error(e);
      }
    }, 2000);

    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Canlı Sensör Verisi (Son 20 Kayıt)</h2>
      <LineChart
        width={700} height={300} data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        isAnimationActive={false}       // tüm grafiğin animasyonunu kapat
      >
        <CartesianGrid stroke="#ccc" />
        <XAxis
          dataKey="timestamp"
          tickFormatter={t => t.split('T')[1].substr(0,8)}
        />
        <YAxis />
        <Tooltip labelFormatter={t => new Date(t).toLocaleTimeString()} />
        <Line
          type="monotone"
          dataKey="temperature"
          name="Sıcaklık"
          stroke="#ff7300"
          isAnimationActive={false}     // satır animasyonunu kapat
          animationDuration={0}
        />
        <Line
          type="monotone"
          dataKey="humidity"
          name="Nem"
          stroke="#387908"
          isAnimationActive={false}
          animationDuration={0}
        />
        <Line
          type="monotone"
          dataKey="vibration"
          name="Titreşim"
          stroke="#8884d8"
          isAnimationActive={false}
          animationDuration={0}
        />
      </LineChart>
    </div>
  );
}
