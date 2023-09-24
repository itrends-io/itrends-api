const followAssociation = (User) => {
  User.belongsToMany(User, {
    through: "Follower",
    as: "followers",
    foreignKey: "followee_id",
  });

  User.belongsToMany(User, {
    through: "Follower",
    as: "following",
    foreignKey: "follower_id",
  });
};

module.exports = {
  followAssociation,
};
