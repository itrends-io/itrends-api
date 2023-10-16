const postAssociation = (User, Post, TaggedUser, PollOption) => {
  Post.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(Post, {
    foreignKey: "user_id",
    as: "posts",
  });

  Post.belongsToMany(TaggedUser, {
    through: "PostTaggedUsers",
    foreignKey: "post_id",
    as: "tagged_users",
  });

  TaggedUser.belongsToMany(Post, {
    through: "PostTaggedUsers",
    foreignKey: "user_id",
    as: "posts",
  });

  Post.hasMany(PollOption, {
    foreignKey: "post_id",
  });

  PollOption.belongsTo(Post, {
    foreignKey: "post_id",
  });
};

module.exports = { postAssociation };
