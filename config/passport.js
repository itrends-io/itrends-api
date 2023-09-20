const { User } = require("../models");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;

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
          ouath_google: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profile_photo: profile.photos[0].value,
          password: process.env.OAUTH_RANDOM_PASSWORD,
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
    done(null, user.user_id);
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
        includeEmail: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          twitter_id: profile.id,
          name: profile.name,
          email: "",
          profileImage: profile.photos[0].value,
          password: "98nrjegbfd8u@8782*&#@6g2vd",
        };
        done(null, profile);

        // try {
        //   let user = await User.findOne({ googleId: profile.id });

        //   if (user) {
        //     done(null, user);
        //   } else {
        //     user = await User.create(newUser);
        //     done(null, user);
        //   }
        // } catch (err) {
        //   console.error(err);
        // }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

module.exports = {
  googleOAuth,
  twitterOAuth,
};
