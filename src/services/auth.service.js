const httpStatus = require("http-status");
const { User, Token } = require("../../models");
const ApiError = require("../utils/ApiError");
const logger = require("../../config/logger");
const { tokenTypes } = require("../../config/token");
const { userService, getUserById, updateUserById } = require("./user.service");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const {
  tokenService,
  verifyToken,
  generateAuthTokens,
} = require("./token.service");
const bcrypt = require("bcryptjs");

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
        const newUser = {
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profileImage: profile.photos[0].value,
          password: "98nrjegbfd8u@8782*&#@6g2vd",
        };

        try {
          let user = await User.findOne({ googleId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
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
const changePassword = async (userBody, refreshToken) => {
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

  if (!(await user.isPasswordMatch(userBody.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  if (userBody.new_password !== userBody.confirm_password) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "New password and confirm password must be the same"
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userBody.new_password, salt);

  await updateUserById(user.id, { password: hashedPassword });
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

const resetPasswordFromEmailToken = async (resetPasswordToken, newPassword) => {
  const resetPasswordTokenDoc = await verifyToken(
    resetPasswordToken,
    tokenTypes.RESET_PASSWORD
  );

  logger.info(resetPasswordTokenDoc);

  const user = await getUserById(resetPasswordTokenDoc.userId);

  if (!user) {
    throw new Error("User not found");
  }
  await Token.destroy({
    where: {
      userId: user.id,
      type: tokenTypes.RESET_PASSWORD,
    },
  });
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  await updateUserById(user.id, { password: hashedPassword });
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
  const tokens = await generateAuthTokens(user);
  return { user, tokens };
};

const emailVerification = async (emailVerificationToken) => {
  const emailVerificationTokenDoc = await verifyToken(
    emailVerificationToken,
    tokenTypes.EMAIL_VERIFICATION
  );
  const user = await getUserById(emailVerificationTokenDoc.userId);
  if (!user) {
    throw new Error("User not found");
  }
  await Token.destroy({
    where: {
      userId: user.id,
      type: tokenTypes.EMAIL_VERIFICATION,
    },
  });
  const updatedUser = await updateUserById(user.id, {
    isEmailVerified: true,
  });

  if (!updatedUser) {
    throw new Error("Failed to update user email verification status");
  }

  return updatedUser;
};

module.exports = {
  registerUser,
  googleOAuth,
  twitterOAuth,
  loginUserWithEmailAndPassword,
  logoutUser,
  resetPasswordFromEmailToken,
  refreshAuthToken,
  emailVerification,
  changePassword,
};
