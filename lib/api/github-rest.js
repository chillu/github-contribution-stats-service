var GitHubApi = require("github");

module.exports = (token, { verbose = false }) => {
  var github = new GitHubApi({
    debug: verbose,
    Promise: Promise
  });
  github.authenticate({
    type: "token",
    token: token
  });
  return github;
};
