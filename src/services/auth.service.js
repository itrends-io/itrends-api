const httpStatus = require("http-status");
const { User, Token } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { userService, getUserById, updateUserById } = require("./user.service");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const { tokenService, verifyToken } = require("./token");

const registerUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({
    where: { email: email },
  });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

const googleOAuth = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "460610816314-erilct3d2hg3ugue45do08mngb27emt5.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/api/v1/auth/google/callback",
      },

      async (accessToken, refreshToken, profile, done) => {
        console.log("Google OAuth2 Authentication Attempt:", profile);

        done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
};

const twitterOAuth = (passport) => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: "0YtBFEqflLf52Qzwg85Y7idtG",
        consumerSecret: "te8hBMzr6uA0rambDnH1qSBJ69t5dBoj0fLBmdowXL22UTDTTj",
        callbackURL: "api/v1/auth/twitter/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        User.findOne({ twitterId: profile.id }, async (err, doc) => {
          if (err) {
            return done(err, null);
          }

          if (!doc) {
            const newUser = new User({
              twitterId: profile.id,
              username: profile.username,
            });

            console.log(newUser);
            await newUser.save();
            done(null, newUser);
          }
          done(null, doc);
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

const logoutUser = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    },
  });

  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Refresh token not found");
  }

  await refreshTokenDoc.destroy();
  // logger.info("Successfully logged out");
};

const resetPassword = async (resetPasswordToken, newPassword) => {
  const resetPasswordTokenDoc = await verifyToken(
    resetPasswordToken,
    tokenTypes.RESET_PASSWORD
  );

  logger.info(resetPasswordTokenDoc);

  const user = await getUserById(resetPasswordTokenDoc.user);

  if (!user) {
    throw new Error("User not found");
  }
  await Token.destroy({
    where: {
      userId: user.id,
      type: tokenTypes.RESET_PASSWORD,
    },
  });
  await updateUserById(user.id, { password: newPassword });
};

const refreshAuthToken = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH,
    },
  });
  if (!refreshTokenDoc) {
    throw new Error("Invalid or expired refresh token");
  }
  const user = await User.findByPk(refreshTokenDoc.userId);
  if (!user) {
    throw new Error("User not found");
  }
  await refreshTokenDoc.destroy();
  const tokens = await tokenService.generateAuthTokens(user);
  return { user, tokens };
};

const emailVerification = async (emailVerificationToken) => {
  try {
    const emailVerificationTokenDoc = await tokenService.verifyToken(
      emailVerificationToken,
      tokenTypes.EMAIL_VERIFICATION
    );
    const user = await userService.getUserById(emailVerificationTokenDoc.user);
    if (!user) {
      throw new Error("User not found");
    }
    await Token.destroy({
      where: {
        userId: user.id,
        type: tokenTypes.EMAIL_VERIFICATION,
      },
    });
    const updatedUser = await userService.updateUserById(user.id, {
      isEmailVerified: true,
    });

    if (!updatedUser) {
      throw new Error("Failed to update user email verification status");
    }

    return updatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
};

module.exports = {
  registerUser,
  googleOAuth,
  twitterOAuth,
  loginUserWithEmailAndPassword,
  logoutUser,
  resetPassword,
  refreshAuthToken,
  emailVerification,
};
