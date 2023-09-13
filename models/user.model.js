const bcrypt = require("bcryptjs");
const { DataTypes, Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  const User = sequelize.define("User", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
      validate: {
        notEmpty: true,
        len: [4, 40],
      },
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
    isEmailVerified: {
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
    },
    location: {
      type: DataTypes.STRING(64),
      allowNull: true,
      trim: true,
    },
    website: {
      type: DataTypes.STRING(100),
      allowNull: true,
      trim: true,
      validate: {
        isURL: true,
      },
    },
    amazon_wishlist: {
      type: DataTypes.STRING(100),
      allowNull: true,
      trim: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
      // validate: {
      //   isPhoneNumber(value) {
      //     if (!/^\d{10}$/.test(value)) {
      //       throw new Error("Invalid phone number format");
      //     }
      //   },
      // },
    },
    twoFactorSecret: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    isTwoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    followersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    followingCount: {
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
        id: {
          [Op.not]: excludeUserId,
        },
      },
    });
    return !!user;
  };

  const UserFollowing = sequelize.define(
    "UserFollowing",
    {},
    { timestamps: false }
  );
  const UserFollowers = sequelize.define(
    "UserFollowers",
    {},
    { timestamps: false }
  );

  User.belongsToMany(User, {
    as: "followers",
    through: "UserFollowers",
    foreignKey: "followerId",
  });

  User.belongsToMany(User, {
    as: "following",
    through: "UserFollowing",
    foreignKey: "followingId",
  });

  User.sync();
  UserFollowing.sync();
  UserFollowers.sync();

  return User;
};
