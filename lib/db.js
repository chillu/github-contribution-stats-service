const mysql = require("mysql2/promise");
const moment = require("moment");

module.exports = async (host, user, password, database) => {
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database
  });

  const addRepoStat = async (nameWithOwner, data) => {
    await conn.query("REPLACE INTO repoStats SET ? ", {
      ...data,
      ...{ nameWithOwner },
      ...{ createdAt: moment().format() }
    });
  };

  const addEvent = async (nameWithOwner, data) => {
    await conn.query("REPLACE INTO events SET ? ", {
      ...data,
      ...{ nameWithOwner }
    });
  };

  return {
    addRepoStat,
    addEvent
  };
};
