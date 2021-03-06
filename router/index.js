import { Router } from 'express';
import { writeFile, readFile } from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';
import path from 'path';
import buildFeed from '../services/buildFeed';

const router = Router();

router.get('/episode/:id', (req, res, next) => {
  const options = {
    root: path.join(__dirname, '../downloads'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true
    }
  };

  res.sendFile(`${req.params.id}.mp3`, options, function (err) {
    if (err) {
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
});

router.post('/', async (req, res, next) => {
  try {
    const {
      body: { id }
    } = req;
    const folder = path.join(__dirname, '../downloads', `${id}.mp3`);
    const stream = ytdl(`http://www.youtube.com/watch?v=${id}`, {
      quality: 'highestaudio'
    });
    const start = Date.now();
    ffmpeg(stream)
      .audioBitrate(128)
      .save(folder)
      .on('end', async () => {
        console.log(`\ndone with ${id} - ${(Date.now() - start) / 1000}s`);
        const output = path.join(__dirname, '../downloads', `${id}.json`);
        const {
          videoDetails: { title, description, ownerChannelName }
        } = await ytdl.getBasicInfo(id);
        const info = {
          id,
          title,
          description,
          ownerChannelName,
          added: Date.now()
        };
        await writeFile(output, JSON.stringify(info), 'utf-8');
        res.json({ location: folder });
      })
      .on('error', err => {
        console.error(err);
        res.status(500).json(err);
      });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get('/build', async (req, res, next) => {
  // ok
  const feed = await buildFeed();
  const output = path.join(__dirname, '../', `feed.xml`);
  await writeFile(output, feed, 'utf-8');
  res.send(output);
});

router.get('/feed.xml', async (req, res, next) => {
  const file = await readFile(path.join(__dirname, '../feed.xml'));
  res.set('Content-Type', 'text/xml');
  res.send(file);
});

export default router;
