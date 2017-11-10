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
          forks {
            totalCount
          }
          watchers {
            totalCount
          }
          issues(states: [OPEN]) {
            totalCount
          }
          pullRequests(states: [OPEN]) {
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
      stargazersCount: node.stargazers.totalCount,
      forksCount: node.forks.totalCount,
      watchersCount: node.watchers.totalCount,
      issuesOpenCount: node.issues.totalCount,
      pullRequestsOpenCount: node.pullRequests.totalCount
    };
    return acc;
  }, {});

  return Promise.resolve(data);
};
