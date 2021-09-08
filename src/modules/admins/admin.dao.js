/**
 * Performs the SQL query to get all admin users.
 *
 * @param {any} connection
 * @return {Promise}
 */
async function getAll({ skip = 0, limit = 10, orderBy = 'id', userStatus, search }, connection) {
  let query = `SELECT 
        adm.id,
        usr.id AS user_id,
        usr.first_name,
        usr.last_name,
        usr.email,
        adm.is_super,
        usr.created_at,
        usr.updated_at,
        usr.deleted_at
    FROM admins adm
    LEFT JOIN users usr ON adm.id = usr.id
    WHERE 1`;

  if (userStatus) {
    if (userStatus === 'active') {
      query += ' AND usr.deleted_at IS NULL';
    } else {
      query += ' AND usr.deleted_at IS NOT NULL';
    }
  }

  if (search) {
    query += ` AND MATCH(first_name, last_name) AGAINST("${connection.escape(
      search
    )}*" IN BOOLEAN MODE)`;
  }

  if (orderBy) {
    let order = 'ASC';

    if (orderBy.charAt(0) === '-') {
      order = 'DESC';
      orderBy = orderBy.substring(1);
    }

    query += ` ORDER BY ${connection.escapeId(orderBy)} ${order}`;
  }

  query += ` LIMIT ${connection.escape(skip)}, ${connection.escape(limit)}`;

  return connection.query(query);
}

/**
 * Performs the SQL query to get a non-deleted/active admin user by its id.
 *
 * @param {number} adminId
 * @param {any} connection
 * @return {Promise}
 */
async function getById(adminId, connection) {
  const query = `SELECT 
        adm.id,
        usr.id AS user_id,
        usr.first_name,
        usr.last_name,
        usr.email,
        adm.is_super,
        usr.created_at,
        usr.updated_at,
        usr.deleted_at
    FROM admins adm
    LEFT JOIN users usr ON adm.user_id = usr.id
    WHERE adm.id = ?`;

  return connection.query(query, [adminId]);
}

/**
 * Performs the SQL query to get a non-deleted/active admin user by its email address.
 *
 * @param {string} email
 * @param {any} connection
 * @return {Promise}
 */
async function getByEmail(email, connection) {
  const query = `SELECT 
        adm.id,
        usr.id AS user_id,
        usr.first_name,
        usr.last_name,
        usr.email,
        adm.is_super,
        usr.created_at,
        usr.updated_at,
        usr.deleted_at
    FROM admins adm
    LEFT JOIN users usr ON adm.user_id = usr.id
    WHERE usr.email = ?`;

  return connection.query(query, [email]);
}

/**
 * Performs the SQL query to insert a admin user.
 *
 * @param {object} admin
 * @param {any} connection
 * @return {Promise}
 */
async function create(admin, connection) {
  const query = 'INSERT INTO admins SET ?';

  return connection.query(query, [admin]);
}

/**
 * Performs the SQL query to update a admin user.
 *
 * @param {object} admin
 * @param {number} adminId
 * @param {any} connection
 * @return {Promise}
 */
async function update(admin, adminId, connection) {
  const query = 'UPDATE admins SET ? WHERE id = ? LIMIT 1';

  return connection.query(query, [admin, adminId]);
}

module.exports = {
  getAll,
  getById,
  getByEmail,
  create,
  update,
};
