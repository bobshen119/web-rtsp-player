import Stream from 'node-rtsp-stream';
import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const streams = new Map();
let nextPort = 9999;

app.post('/stream', (req, res) => {
  const { url, name } = req.body;
  
  if (streams.has(name)) {
    return res.status(400).json({ error: 'Stream name already exists' });
  }

  try {
    const wsPort = nextPort++;
    const stream = new Stream({
      name,
      streamUrl: url,
      wsPort: wsPort,
      ffmpegOptions: {
        '-stats': '',
        '-r': 30,
        '-q:v': 3
      }
    });

    streams.set(name, { stream, wsPort });
    res.json({ success: true, wsUrl: `ws://localhost:${wsPort}` });
  } catch (error) {
    console.error('Error creating stream:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/stream/:name', (req, res) => {
  const { name } = req.params;
  const streamData = streams.get(name);
  
  if (streamData) {
    try {
      streamData.stream.stop();
      streams.delete(name);
      res.json({ success: true });
    } catch (error) {
      console.error('Error stopping stream:', error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: 'Stream not found' });
  }
});

// 获取所有活动流的信息
app.get('/streams', (req, res) => {
  const activeStreams = Array.from(streams.entries()).map(([name, data]) => ({
    name,
    wsPort: data.wsPort
  }));
  res.json(activeStreams);
});

// 清理所有流
app.delete('/streams', (req, res) => {
  try {
    for (const [name, data] of streams.entries()) {
      data.stream.stop();
    }
    streams.clear();
    res.json({ success: true });
  } catch (error) {
    console.error('Error clearing streams:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket ports will start from:', nextPort);
});
