/**
 * Admin repository class.
 */
class AdminRepository {
  /**
   * Constructor for UserRepository.
   *
   * @param {*} dependencies The dependencies payload
   */
  constructor({ adminDao, adminMapper }) {
    this.adminDao = adminDao;
    this.adminMapper = adminMapper;
  }

  /**
   * @param {any} connection
   * @returns {Promise} The query result
   */
  async findAll(connection) {
    const [result] = await this.adminDao.getAll(connection);

    return result;
  }

  /**
   * @param {number} adminId
   * @param {any} connection
   * @returns {Promise} The query result
   */
  async findById(adminId, connection) {
    const [result] = await this.adminDao.getById(adminId, connection);

    return result[0];
  }

  /**
   * @param {number} userId
   * @param {any} connection
   */
  async findTrashedById(userId, connection) {
    const [result] = await this.adminDao.getTrashedById(userId, connection);

    return result[0];
  }

  /**
   * @param {string} email
   * @param {any} connection
   * @returns {Promise} The query result
   */
  async findByEmail(email, connection) {
    const [result] = await this.adminDao.getByEmail(email, connection);

    return result[0];
  }

  /**
   * @param {object} user
   * @param {any} connection
   */
  async store(user, connection) {
    const userDbEntity = this.adminMapper.toDatabaseEntity(user);

    const [result] = await this.adminDao.create(userDbEntity, connection);

    return result.insertId;
  }

  /**
   * @param {object} user
   * @param {number} userId
   * @param {any} connection
   * @returns {Promise} The query result
   */
  async update(user, userId, connection) {
    const userDbEntity = this.adminMapper.toDatabaseEntity(user);

    const [result] = await this.adminDao.update(userDbEntity, userId, connection);

    return result.affectedRows;
  }
}

module.exports = AdminRepository;
