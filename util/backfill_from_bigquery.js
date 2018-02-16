// Usage: <script> [project-id] [table]

const dotenv = require('dotenv');
const assert = require('assert');
const BigQuery = require('@google-cloud/bigquery');
const db = require('../lib/db');

// Load config
dotenv.config();
const args = process.argv.slice(2);

assert(process.env.DB_HOST, 'DB_HOST env var is required');
const dbHost = process.env.DB_HOST;

assert(process.env.DB_USER, 'DB_USER env var is required');
const dbUser = process.env.DB_USER;

assert(process.env.DB_PASSWORD, 'DB_PASSWORD env var is required');
const dbPassword = process.env.DB_PASSWORD;

assert(process.env.DB_NAME, 'DB_NAME env var is required');
const dbName = process.env.DB_NAME;

async function main () {
  const { addEvent } = await db(dbHost, dbUser, dbPassword, dbName);

  const projectId = args[0];
  const table = args[1];
  const bigquery = new BigQuery({
    projectId: projectId
  });

  // Destructure JSON blobs
  const sqlQuery = `SELECT id, type, created_at, repo_name, actor_login,
    JSON_EXTRACT(payload, '$.action') as action,
    JSON_EXTRACT(payload, '$.state') as state
    FROM ${table}
    WHERE type IN (
      'CommitCommentEvent',
      'ForkEvent',
      'IssueCommentEvent',
      'IssuesEvent',
      'MilestoneEvent',
      'PullRequestEvent',
      'PullRequestReviewEvent',
      'PullRequestReviewCommentEvent',
      'PushEvent',
      'StatusEvent'
    )`;

  const options = {
    query: sqlQuery,
    useLegacySql: false // Use standard SQL syntax for queries.
  };

  const removeQuotes = (str) => str ? str.replace(/"/g, '') : str;

  bigquery
    .query(options)
    .then(results => {
      const rows = results[0];
      rows.forEach(row => {
        console.log(row);
        addEvent(row.repo_name, {
          id: row.id,
          createdAt: row.created_at.value,
          type: row.type,
          login: row.actor_login,
          // JSON extracted fields retain their JSON type notation
          action: removeQuotes(row.action),
          state: removeQuotes(row.state)
        });
      });
    })
    .catch(err => {
      console.error('ERROR:', err);
    });
}

main();
