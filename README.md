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

## Configuration

Uses environment variables. Either write a `.env` to the project folder,
or set the vars in runtime context.

 * `REPOS`: (required) Comma-separated list of Github repo names incl. org
   Example: silverstripe/silverstripe-framework
 * `ACCESS_TOKEN`: Personal access token from Github ([create one](https://github.com/settings/tokens))
 * `VERBOSE`: Log GraphQL requests and responses

## Usage

Start a development server (accessible under `http://localhost:3000`):

```
npm run dev
```
