const mysql = require("mysql2/promise");

module.exports = async (host, user, password, database) => {
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database
  });

  return {
    query: (sql, opts) => conn.query(sql, opts),
    end: () => conn.end()
  };
};
