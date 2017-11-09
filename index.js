const ms = require('ms');
const dotenv = require('dotenv');
const assert = require('assert');
const api = require('./lib/api');
const stargazerCount = require('./lib/stargazer-count');

dotenv.config();

assert(process.env.REPOS, 'REPOS env var is required');
const repos = process.env.REPOS.split(',');

assert(process.env.ACCESS_TOKEN, 'ACCESS_TOKEN env var is required');
const token = process.env.ACCESS_TOKEN;

const verbose = Boolean(process.env.VERBOSE);

const apiCallable = api(token, {verbose});

// Should be the only side effect in the app
let data = {};

// Cache data now and every X ms
cacheData();
setInterval(cacheData, ms('15m'));

async function cacheData () {
  // Run requests concurrently
  const [ dataStargazerCount ] = await Promise.all([
    await stargazerCount(apiCallable, repos)
  ]);

  // Reset cached data
  data = {
    stargazerCount: dataStargazerCount
  };
}

module.exports = async (req, res) => {
  // Allow CORS requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Lazy populate
  return data;
};
