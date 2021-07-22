/**
 * User controller class.
 */
class UserController {
  /**
   * Constructor for UserController.
   *
   * @param {*} dependencies The dependencies payload
   */
  constructor({ userService, userMapper }) {
    this.userService = userService;
    this.userMapper = userMapper;
  }

  /**
   * Handles incoming request from the /user endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async index(request, response, next) {
    try {
      const { skip, search } = request.query;

      const users = await this.userService.findAll({ skip, search });

      const usersDto = users.map((user) => this.userMapper.toDto(user));

      response.send({
        message: 'Ok',
        data: usersDto,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:id endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async show(request, response, next) {
    try {
      const { userId } = request.params;

      const user = await this.userService.find(userId);

      const userDto = this.userMapper.toDto(user);

      response.send({
        message: 'Ok',
        data: userDto,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:userId endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async destroy(request, response, next) {
    try {
      const { userId } = request.params;

      const userDeletedId = await this.userService.delete(userId);

      response.send({
        message: 'Deleted',
        data: {
          userDeletedId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:userId/restore endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async restore(request, response, next) {
    try {
      const { userId } = request.params;

      const userRestoredId = await this.userService.restore(userId);

      response.send({
        message: 'Restored',
        data: {
          userRestoredId,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming request from the /users/:userId/change-password endpoint
   *
   * @param {*} request
   * @param {*} response
   * @param {*} next
   */
  async changePassword(request, response, next) {
    try {
      const { userId } = request.params;
      const { current_password, new_password } = request.body;

      await this.userService.changePassword({
        userId,
        current_password,
        new_password,
      });

      response.send({
        message: 'Ok',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
