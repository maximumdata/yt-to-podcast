import Podcast from 'podcast';
import path from 'path';
import { readdir } from 'fs/promises';
import { readFileSync } from 'fs';

function getFeed() {
  return new Podcast({
    title: "mike's youtube stuff",
    description: 'audio from youtube vids',
    feed_url: 'http://ytpodcast.mikedettmer.com/feed.xml',
    site_url: 'http://ytpodcast.mikedettmer.com',
    image_url:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Emoji_u1f4a9.svg/1200px-Emoji_u1f4a9.svg.png',
    docs: 'http://ytpodcast.mikedettmer.com',
    author: 'mike',
    managingEditor: 'mike',
    webMaster: 'mike',
    copyright: '2021 mike',
    language: 'en',
    categories: ['Entertainment'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
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
    itunesImage:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Emoji_u1f4a9.svg/1200px-Emoji_u1f4a9.svg.png'
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
    url: `http://ytpodcast.mikedettmer.com/episode/${id}`,
    date: new Date(added),
    itunesAuthor: ownerChannelName
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
