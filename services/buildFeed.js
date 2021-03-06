import Podcast from 'podcast';
import path from 'path';
import { readdir } from 'fs/promises';
import { readFileSync } from 'fs';

function getFeed() {
  return new Podcast({
    title: "mike's youtube stuff",
    description: 'audio from youtube vids',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    image_url: 'http://example.com/icon.png',
    docs: 'http://example.com/rss/docs.html',
    author: 'mike',
    managingEditor: 'mike',
    webMaster: 'mike',
    copyright: '2021 mike',
    language: 'en',
    categories: ['Category 1', 'Category 2', 'Category 3'],
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
    itunesImage: 'http://example.com/image.png'
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
    url: `https://yt.mikedettmer.com/episode/${id}`,
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
