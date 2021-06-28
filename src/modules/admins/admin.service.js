/**
 * Admin service class.
 */
class AdminService {
  /**
   * Constructor for AdminService.
   *
   * @param {*} dependencies The dependencies payload
   */
  constructor({
    dbConnectionPool, adminRepository, userRepository, adminErrors, bcrypt,
  }) {
    this.dbConnectionPool = dbConnectionPool;
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
    this.adminErrors = adminErrors;
    this.bcrypt = bcrypt;
  }

  /**
   *
   */
  async findAll() {
    let connection;

    try {
      connection = await this.dbConnectionPool.getConnection();

      const admins = await this.adminRepository.findAll(connection);

      connection.release();

      return admins;
    } catch (err) {
      if (connection) connection.release();

      if (err.sqlMessage) {
        throw new Error('Error while retrieving admins');
      }

      throw err;
    }
  }

  /**
   * @param {number} adminId
   */
  async find(adminId) {
    let connection;

    try {
      connection = await this.dbConnectionPool.getConnection();

      const admin = await this.adminRepository.findById(adminId, connection);
      if (!admin) {
        throw new this.adminErrors.UserNotFoundError();
      }

      connection.release();

      return admin;
    } catch (err) {
      if (connection) connection.release();

      if (err.sqlMessage) {
        throw new Error('Error while retrieving admin');
      }

      throw err;
    }
  }

  /**
   * @param {object} admin
   */
  async store(admin) {
    let connection;

    try {
      connection = await this.dbConnectionPool.getConnection();

      connection.beginTransaction();

      const userByEmail = await this.userRepository.findByEmailWithTrashed(admin.email, connection);
      if (userByEmail) {
        throw new this.adminErrors.EmailAlreadyTakenError({ email: admin.email });
      }

      const passwordHash = await this.bcrypt.hashPassword(admin.password);

      const createdAdminId = await this.adminRepository.store({
        isSuper: admin.isSuper,
      }, connection);

      await this.userRepository.store({
        ...admin, password: passwordHash, userableType: 'App/Admin', userableId: createdAdminId,
      }, connection);

      const createdAdmin = await this.adminRepository.findById(createdAdminId);

      connection.commit();
      connection.release();

      return createdAdmin;
    } catch (err) {
      if (connection) {
        connection.rollback();
        connection.release();
      }

      if (err.sqlMessage) {
        throw new Error('Error while storing admin');
      }

      throw err;
    }
  }

  /**
   * @param {number} adminId
   * @param {object} admin
   */
  async update(adminId, admin) {
    let connection;

    try {
      connection = await this.dbConnectionPool.getConnection();

      connection.beginTransaction();

      const adminById = await this.adminRepository.findById(adminId);
      if (!adminById) {
        throw new this.adminErrors.UserNotFoundError();
      }

      const passwordHash = await this.bcrypt.hashPassword(admin.password);

      const adminAffectedRows = await this.adminRepository.update(adminId, {
        isSuper: admin.isSuper,
      },
      connection);

      const userAffectedRows = await this.userRepository.update(adminById.id, {
        ...admin, password: passwordHash,
      },
      connection);

      if (adminAffectedRows < 1 || userAffectedRows < 1) {
        throw new Error('Admin was not updated');
      }

      const updatedAdmin = await this.adminRepository.findById(adminId, connection);

      connection.commit();
      connection.release();

      return updatedAdmin;
    } catch (err) {
      if (connection) {
        connection.rollback();
        connection.release();
      }

      if (err.sqlMessage) {
        throw new Error('Error while updating admin');
      }

      throw err;
    }
  }
}

module.exports = AdminService;
