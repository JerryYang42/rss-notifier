import express from 'express';
import { RSSNotifier } from './RSSNotifier';
import { db } from './db';

const app = express();
app.use(express.json());

const notifier = new RSSNotifier();

app.get('/sources', async (req, res) => {
  const sources = await db.query('SELECT * FROM sources');
  res.json(sources.rows);
});

app.post('/sources', async (req, res) => {
  const { url } = req.body;
  await db.query('INSERT INTO sources (url) VALUES ($1)', [url]);
  res.status(201).send();
});

app.post('/check', async (req, res) => {
  await notifier.checkFeeds();
  res.status(200).send();
});

app.listen(4000, () => console.log('Server running on port 4000'));
