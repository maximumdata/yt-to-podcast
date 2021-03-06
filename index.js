import express from 'express';
import bodyParser from 'body-parser';
import router from './router';

const app = express();
app.use(bodyParser.json());
app.use(router);

app.listen(9090);

// import buildFeed from './services/buildFeed';
// (async () => {
//   const what = await buildFeed();
//   // console.log(what);
// })();
