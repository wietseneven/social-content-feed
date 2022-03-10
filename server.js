require('dotenv').config()
const Twit = require('twit');
const express = require('express')
const cors = require('cors')
const http = require('http');
const app = express();
const port = process.env.PORT || 3000;

const twitter = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true, // optional - requires SSL certificates to be valid.
});

const searchTweets = async (searchTerm) => {
  let newTweets = await twitter.get('search/tweets', {
    q: searchTerm,
    count: 5,
  })
  return newTweets.data;
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const corsOptions = {
  origin: '*',
}

app.use(cors(corsOptions));

app.get('/search-tweets', async (req, res) => {
  if (!req.query.q) {
    res.send({ message: 'No query provided' });
    return;
  }
  const data = await searchTweets(req.query.q);
  res.send(data)
})

http.createServer(app).listen(port);
