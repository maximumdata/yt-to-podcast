import Podcast from 'podcast';
import path from 'path';
import { readdir } from 'fs/promises';
import { readFileSync } from 'fs';

function getFeed() {
  return new Podcast({
    title: "mike's youtube stuff",
    description: 'audio from youtube vids',
    feed_url: 'http://ytpodcast.mikedettmer.com/feed.xml',
    site_url: 'https://mikedettmer.com',
    image_url: 'https://www.pngkit.com/png/detail/661-6619370_emoji-poop.png',
    docs: 'https://mikedettmer.com',
    author: 'mike',
    managingEditor: 'mike',
    webMaster: 'mike',
    copyright: '2021 mike',
    language: 'en',
    categories: ['Technology'],
    pubDate: Date.now(),
    ttl: 60,
    itunesAuthor: 'Mike',
    itunesSubtitle: 'I am a sub title',
    itunesSummary: 'I am a summary',
    itunesOwner: { name: 'Mike', email: 'mike@mikedettmer.com' },
    itunesExplicit: false,
    itunesCategory: [
      {
        text: 'Entertainment',
        subcats: [
          {
            text: 'Television'
          }
        ]
      }
    ],
    itunesImage: 'https://www.pngkit.com/png/detail/661-6619370_emoji-poop.png'
  });
}

async function getListOfFiles() {
  const folder = path.join(__dirname, '../downloads');
  const files = await readdir(folder);
  const infos = files.filter(file => {
    return file.split('.json').length > 1;
  });
  return infos;
}

function addItemToFeed(file, feed) {
  //https://github.com/maxnowack/node-podcast
  const jsonFilePath = path.join(__dirname, `../downloads/${file}`);
  const rawData = readFileSync(jsonFilePath);
  const { id, title, description, ownerChannelName, added } = JSON.parse(
    rawData
  );

  feed.addItem({
    title,
    description,
    url: `https://mikedettmer.com/`,
    date: new Date(added),
    itunesAuthor: ownerChannelName,
    itunesTitle: title,
    enclosure: {
      url: `http://ytpodcast.mikedettmer.com/episode/${id}`,
      file: path.join(__dirname, `../downloads/${id}.mp3`)
    }
  });
}

export default async function buildFeed() {
  // should iterate all files in ./downloads and build and return an rss feed
  const feed = getFeed();
  // console.log(feed);
  const files = await getListOfFiles();
  files.map(file => {
    addItemToFeed(file, feed);
  });
  return feed.buildXml();
}
