const assert = require("assert");
// const moment = require('moment');
const db = require("./lib/db");
const { addRepoStat } = require("./lib/writers");
const apiGraphQl = require("./lib/api/github-graphql");
// const apiRest = require('./lib/api/github-rest');
const repoStats = require("./lib/stats/repo");
// const eventStats = require('./lib/stats/event');

assert(process.env.REPOS, "REPOS env var is required");
const repos = process.env.REPOS.split(",");

assert(process.env.ACCESS_TOKEN, "ACCESS_TOKEN env var is required");
const token = process.env.ACCESS_TOKEN;

assert(process.env.DB_HOST, "DB_HOST env var is required");
const dbHost = process.env.DB_HOST;

assert(process.env.DB_USER, "DB_USER env var is required");
const dbUser = process.env.DB_USER;

assert(process.env.DB_PASSWORD, "DB_PASSWORD env var is required");
const dbPassword = process.env.DB_PASSWORD;

assert(process.env.DB_NAME, "DB_NAME env var is required");
const dbName = process.env.DB_NAME;

// const sinceMonths = process.env.SINCE_MONTHS ? process.env.SINCE_MONTHS : 6;
// const since = moment().subtract(sinceMonths, 'months').startOf('month');
const verbose = process.env.VERBOSE == "true";
const logger = verbose ? console.log : () => {};

// Refresh data now and every X ms
let data = {};

async function collectRepoStats() {
  const apiGraphQlCallable = apiGraphQl(token, { logger });
  const results = await repoStats(apiGraphQlCallable, repos, { logger });

  // Store in database
  const { query, end } = await db(dbHost, dbUser, dbPassword, dbName);
  Object.keys(results).forEach(repo => {
    addRepoStat(query, repo, results[repo]);
  });

  // Expose data
  data.repos = results;

  end();
}

// async function collectEventStats () {
//   const apiRestObj = apiRest(token, {verbose});
//   const results = await eventStats(apiRestObj, repos);
//
//   // Store in database
//   const { addEventStat } = await db(dbHost, dbUser, dbPassword, dbName);
//   Object.keys(results).forEach(repo => {
//     addEventStat(repo, results[repo]);
//   });
//
//   // Expose data
//   data.events = results;
// }

export async function handle(event, context, callback) {
  await collectRepoStats();
}

//Handle errors to provent V8 from shutting down in the future
process.on("unhandledRejection", e => {
  console.log(e);
});

