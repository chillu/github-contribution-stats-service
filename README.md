# Github Contribution Stats Microservice

Periodically aggregates stats from multiple Github repositories,
and exposes this data in JSON format. Useful for building
contribution dashboards, and analysis of contributions
beyond Github's per-repo reporting capabilities.

## Installation

Requires NodeJS 8.0 or newer.

```
npm install
```

We're using `serverless-webpack` and `babel` to transpile
ES6/ES7 code into Node v6 compatible code, see [blog post](https://serverless-stack.com/chapters/add-support-for-es6-es7-javascript.html)
for details.
This is temporary until AWS Lambda supports Node v8.

## Configuration

Uses [serverless env variables](https://serverless.com/framework/docs/providers/aws/guide/variables/#referencing-cli-options).
You'll need to add a `serverless.env.yml` to your project.

Example:

```yml
VERBOSE: "false"
REPOS: ""
ACCESS_TOKEN: ""
DB_HOST: ""
DB_USER: ""
DB_PASSWORD: ""
DB_NAME: ""
```

Reference:

* `REPOS`: (required) Comma-separated list of Github repo names incl. org
  Example: silverstripe/silverstripe-framework
* `ACCESS_TOKEN`: Personal access token from Github ([create one](https://github.com/settings/tokens))
* `VERBOSE`: Log GraphQL requests and responses
* `DB_HOST`: MySQL database host
* `DB_USER`: MySQL username
* `DB_PASSWORD`: MySQL password
* `DB_NAME`: MySQL database name

You'll need a MySQL database connection in order to save results.
Initialise it with the schema in `data/db.sql`.

## Usage

Run the task locally:

```
npm run dev
```

## Deployment

You can deploy this app via [serverless](serverless.com):

```
npm run deploy
```

Note: Serverless is configured to use a custom `playpen` AWS profile
for deployments via `serverless.yml`. Please change this to match your own profile.

## Backfill data from Github Archive

The service only starts filling events

* Create a new [Google Cloud Service Account](https://cloud.google.com/docs/authentication/getting-started)
* Store the resulting file
* Get the `[project-id]` from your [Google Cloud Dashboard](https://console.cloud.google.com/)
* Get the '[tablename]' from your [Google Bigquery Console](https://bigquery.cloud.google.com/project)
* Run the script: `export GOOGLE_APPLICATION_CREDENTIALS="[PATH]" && node util/backfill_from_bigquery.js [project-id] [tablename]`

```
SELECT id, type, created_at, repo.name, actor.login, payload
FROM (TABLE_DATE_RANGE([githubarchive:day.],
  TIMESTAMP('2017-12-01'),
  TIMESTAMP('2017-12-06')
))
WHERE repo.name IN (
'colymba/GridFieldBulkEditingTools',
'silverstripe/silverstripe-asset-admin',
'symbiote/silverstripe-advancedworkflow',
'symbiote/silverstripe-gridfieldextensions',
'symbiote/silverstripe-multivaluefield',
'symbiote/silverstripe-queuedjobs',
'symbiote/silverstripe-versionedfiles',
'silverstripe/comment-notifications',
'silverstripe/cow',
'silverstripe/platform-project',
'silverstripe/silverstripe-admin',
'silverstripe/silverstripe-akismet',
'silverstripe/silverstripe-asset-admin',
'silverstripe/silverstripe-assets',
'silverstripe/silverstripe-blog',
'silverstripe/silverstripe-campaign-admin',
'silverstripe/silverstripe-cms',
'silverstripe/silverstripe-comments',
'silverstripe/silverstripe-contentreview',
'silverstripe/silverstripe-environmentcheck',
'silverstripe/silverstripe-errorpage',
'silverstripe/silverstripe-externallinks',
'silverstripe/silverstripe-faq',
'silverstripe/silverstripe-framework',
'silverstripe/silverstripe-fulltextsearch',
'silverstripe/silverstripe-graphql',
'silverstripe/silverstripe-html5',
'silverstripe/silverstripe-hybridsessions',
'silverstripe/silverstripe-iframe',
'silverstripe/silverstripe-installer',
'silverstripe/silverstripe-lumberjack',
'silverstripe/silverstripe-mimevalidator',
'silverstripe/silverstripe-registry',
'silverstripe/silverstripe-reports',
'silverstripe/silverstripe-restfulserver',
'silverstripe/silverstripe-siteconfig',
'silverstripe/silverstripe-secureassets',
'silverstripe/silverstripe-securityreport',
'silverstripe/silverstripe-selectupload',
'silverstripe/silverstripe-spamprotection',
'silverstripe/silverstripe-spellcheck',
'silverstripe/silverstripe-subsites',
'silverstripe/silverstripe-tagfield',
'silverstripe/silverstripe-taxonomy',
'silverstripe/silverstripe-textextraction',
'silverstripe/silverstripe-translatable',
'silverstripe/silverstripe-userforms',
'silverstripe/silverstripe-versionfeed',
'silverstripe/silverstripe-versioned',
'silverstripe/silverstripe-widgets',
'UndefinedOffset/SortableGridField'
)
```
