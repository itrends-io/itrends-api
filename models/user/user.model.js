const bcrypt = require("bcryptjs");
const { DataTypes, Op } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: true,
        len: [4, 40],
      },
    },
    twitter_id: {
      type: DataTypes.STRING,
    },
    oauth_google: {
      type: DataTypes.STRING,
    },
    profile_photo: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    cover_photo: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      trim: true,
      defaultValue: null,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      validate: {
        isEmail: true,
      },
    },
    is_email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        len: [8, undefined],
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      defaultValue: "user",
    },
    bio: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      trim: true,
      // profilePhoto,
      defaultValue: null,
    },
    location: {
      type: DataTypes.STRING(64),
      allowNull: true,
      trim: true,
      defaultValue: null,
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true,
      trim: true,
      defaultValue: null,
      validate: {
        isURL: true,
      },
    },
    amazon_wishlist: {
      type: DataTypes.STRING(100),
      defaultValue: null,
      allowNull: true,
      trim: true,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
    },
    two_factor_secret: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_two_factor_enabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    followers_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    following_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });

  User.beforeCreate(async (user, options) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
  });

  User.prototype.isPasswordMatch = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.isEmailTaken = async function (email, excludeUserId) {
    const user = await User.findOne({
      where: {
        email,
        user_id: {
          [Op.not]: excludeUserId,
        },
      },
    });
    return !!user;
  };

  User.sync();
  return User;
};
