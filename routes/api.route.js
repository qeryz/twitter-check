const router = require('express').Router();
const Twitter = require('twitter');
 
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

router.get('/friendships', async (req, res) => {
  const source_screen_name = req.query.user1;
  const target_screen_name = req.query.user2;

  try {
    const trends = await client.get('friendships/show', { source_screen_name, target_screen_name })
    res.json(trends);
  }
  catch (error) {
    res.json({errorr: error});
  }
  
});

router.get('/users', async (req, res) => {
  const screen_name = req.query.user;

  try {
    const pic = await client.get('users/show', { screen_name, })
    res.json(pic);
  }
  catch (error) {
    res.json({errorr: error});
  }
  
});

module.exports = router;
