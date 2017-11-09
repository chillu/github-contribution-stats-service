/**
 * @param Function Returns a promise, runs API call
 * @param Array
 * @return Promise
 */
module.exports = async (apiCallable, repos) => {
  const query = `query ($query: String!, $type: SearchType!) {
    search(query: $query, type: $type, first: 100) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        ... on Repository {
          nameWithOwner
          stargazers {
            totalCount
          }
        }
      }
    }
  }`;

  const variables = {
    query: repos.map(repo => `repo:${repo}`).join(' '),
    type: 'REPOSITORY'
  };

  const response = await apiCallable({
    query,
    variables
  });

  // Flatten data
  const data = response.data.search.nodes.reduce((acc, node) => {
    acc[node.nameWithOwner] = {
      count: node.stargazers.totalCount
    };
    return acc;
  }, {});

  return Promise.resolve(data);
};
