const fetch = require("node-fetch");
const HttpLink = require("apollo-link-http").HttpLink;
const execute = require("apollo-link").execute;
const makePromise = require("apollo-link").makePromise;
const gql = require("graphql-tag");

/**
 * @param String Github API token
 * @param Object Options
 * @return Promise
 */
module.exports = (
  token,
  { uri = "https://api.github.com/graphql", logger = () => {} }
) => {
  const httpLink = new HttpLink({
    uri,
    fetch,
    headers: {
      Authorization: `bearer ${token}`
    }
  });

  return operation => {
    const queryString = operation.query;
    operation.query = gql(operation.query);
    return makePromise(execute(httpLink, operation)).then(response => {
      logger(`query: ${queryString}`);
      logger("variables: " + JSON.stringify(operation.variables));
      logger("response: " + JSON.stringify(response));

      return response;
    });
  };
};
