module.exports = async (api, repos, since) => {
  const eventsByRepo = await Promise.all(repos.map(async (repoWithOwner) => {
    const [ owner, repo ] = repoWithOwner.split('/');
    // Can't filter by date
    await api.activity.getEvents({
      owner,
      repo
    });
  }));

  const eventsByRepoFiltered = eventsByRepo.map(events => {
    // TODO
  })
};
