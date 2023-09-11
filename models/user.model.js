const bcrypt = require("bcryptjs");
const { DataTypes, Op } = require("sequelize");

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
      allowNull: false,
      unique: true,
      trim: true,
      defaultValue: () => {
        return `user${sequelize.fn("count", sequelize.col("id")) + 1}`;
      },
      validate: {
        notEmpty: true,
        len: [1, 20],
      },
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

  User.sync();

  return User;
};
