const moment = require("moment");

const addRepoStat = async (query, nameWithOwner, data) => {
  await query("REPLACE INTO repoStats SET ? ", {
    ...data,
    ...{ nameWithOwner },
    ...{ createdAt: moment().format() }
  });
};

const addEvent = async (query, nameWithOwner, data) => {
  await query("REPLACE INTO events SET ? ", {
    ...data,
    ...{ nameWithOwner }
  });
};

module.exports = {
  addRepoStat,
  addEvent
};
