const postAssociation = (User, Post) => {
  Post.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(Post, {
    foreignKey: "user_id",
    as: "posts",
  });
};

module.exports = { postAssociation };
