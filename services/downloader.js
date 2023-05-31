import { writeFile } from 'fs/promises';
import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';
import path from 'path';

async function getInfo(id) {
  const output = `./downloads/${id}.json`;
  const {
    videoDetails: { title, description, ownerChannelName }
  } = await ytdl.getBasicInfo(id);
  const info = { id, title, description, ownerChannelName, added: Date.now() };
  await writeFile(output, JSON.stringify(info), 'utf-8');
  return info;
}

async function downloadAndConvert(id) {
  try {
    const folder = path.join(__dirname, '../downloads', `${id}.mp3`);
    console.log(folder);
    return new Promise((resolve, reject) => {
      const stream = ytdl(`http://www.youtube.com/watch?v=${id}`, {
        quality: 'highestaudio'
      });
      const start = Date.now();
      ffmpeg(stream)
        .audioBitrate(128)
        .save(folder)
        .on('end', () => {
          console.log(`\ndone with ${id} - ${(Date.now() - start) / 1000}s`);
          resolve(folder);
        })
        .on('error', err => {
          console.error(err);
          reject(err);
        });
    });
  } catch (error) {
    console.error(error);
  }
}

export default async function downloaderService(id) {
  try {
    const info = await getInfo(id);
    const file = await downloadAndConvert(id);
    return { ...info, file };
  } catch (error) {
    console.error(error);
  }
}
