module.exports =
  ({ authService, jsonwebtoken, authErrors, logger }) =>
  async (request, response, next) => {
    try {
      const { authorization } = request.headers;
      const accessToken =
        authorization && authorization.startsWith('Bearer') && authorization.split(' ')[1];

      if (!accessToken) {
        const unauthorizedError = new authErrors.UnauthorizedError({
          message: 'No token authorization provided',
        });

        return next(unauthorizedError);
      }

      const decoded = await jsonwebtoken.decode(accessToken);

      const userById = await authService.getUserForTokenVerify({ user_id: decoded.payload.sub });

      if (!decoded.payload.sub || !userById) {
        throw new Error('Error while decoding token or user_id not valid');
      }

      const decodedVerified = await jsonwebtoken.verify(accessToken, userById.password);

      request.app.user = {
        id: decodedVerified.sub,
        role: decodedVerified.userRole,
      };

      next();
    } catch (err) {
      logger.log({
        level: 'info',
        message: err.message,
      });

      const forbiddenError = new authErrors.ForbiddenError({
        message: 'The provided token is not valid or the user has not access',
      });

      next(forbiddenError);
    }
  };
