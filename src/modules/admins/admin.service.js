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
    dbConnectionPool,
    adminRepository,
    userRepository,
    adminErrors,
    userRoles,
    bcrypt,
    logger,
  }) {
    this.dbConnectionPool = dbConnectionPool;
    this.adminRepository = adminRepository;
    this.userRepository = userRepository;
    this.adminErrors = adminErrors;
    this.userRoles = userRoles;
    this.bcrypt = bcrypt;
    this.logger = logger;
  }

  /**
   *
   */
  async findAll({ sort, status, search }) {
    let connection;

    try {
      connection = await this.dbConnectionPool.getConnection();

      const admins = await this.adminRepository.findAll(
        { orderBy: sort, userStatus: status, search },
        connection
      );

      connection.release();

      return admins;
    } catch (err) {
      if (connection) connection.release();

      if (err.sqlMessage) {
        this.logger.log({
          level: 'error',
          message: err.message,
        });

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
        this.logger.log({
          level: 'error',
          message: err.message,
        });

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
        throw new this.adminErrors.EmailAlreadyTakenError({
          email: admin.email,
        });
      }

      const passwordHash = await this.bcrypt.hashPassword(admin.password);

      const createdUserId = await this.userRepository.store(
        {
          ...admin,
          password: passwordHash,
          user_role_id: this.userRoles.admin.id,
        },
        connection
      );

      const createdAdminId = await this.adminRepository.store(
        {
          is_super: admin.is_super,
          user_id: createdUserId,
        },
        connection
      );

      const createdAdmin = await this.adminRepository.findById(createdAdminId, connection);

      connection.commit();
      connection.release();

      return createdAdmin;
    } catch (err) {
      if (connection) {
        connection.rollback();
        connection.release();
      }

      if (err.sqlMessage) {
        this.logger.log({
          level: 'error',
          message: err.message,
        });

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

      const adminById = await this.adminRepository.findById(adminId, connection);
      if (!adminById) {
        throw new this.adminErrors.UserNotFoundError();
      }

      const userAffectedRows = await this.userRepository.update(
        {
          ...admin,
        },
        adminById.id,
        connection
      );

      if (userAffectedRows < 1) {
        throw new Error('Admin was not updated');
      }

      const updatedAdmin = await this.adminRepository.findById(adminId, connection);

      connection.commit();
      connection.release();

      return updatedAdmin;
    } catch (err) {
      console.log(err);
      if (connection) {
        connection.rollback();
        connection.release();
      }

      if (err.sqlMessage) {
        this.logger.log({
          level: 'error',
          message: err.message,
        });

        throw new Error('Error while updating admin');
      }

      throw err;
    }
  }
}

module.exports = AdminService;
