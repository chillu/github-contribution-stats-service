const mysql = require('mysql2/promise');
const moment = require('moment');

module.exports = async (host, user, password, database) => {
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database
  });

  const addRepoStat = async (nameWithOwner, data) => {
    await conn.query('INSERT INTO repos SET ? ', {
      ...data,
      ...{ nameWithOwner },
      ...{ createdAt: moment().format() }
    });
  };

  return {
    addRepoStat
  };
};
