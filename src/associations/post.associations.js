const postAssociation = (User, Post) => {
  Post.belongsTo(User, {
    foreignKey: "userId",
  });
};

module.exports = { postAssociation };
