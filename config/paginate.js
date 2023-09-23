const paginate = (model) => {
  model.paginate = async function (filter = {}, options = {}) {
    const { sortBy, populate, limit = 10, page = 1 } = options;
    const offset = (page - 1) * limit;

    let sort = "createdAt"; // Default sorting field

    if (sortBy) {
      sort = sortBy.split(",").map((sortOption) => {
        const [field, order] = sortOption.split(":");
        return [field, order === "desc" ? "DESC" : "ASC"];
      });
    }

    const { count, rows } = await model.findAndCountAll({
      where: filter,
      order: sort,
      limit: parseInt(limit, 10),
      offset: offset,
    });

    let results = rows;

    if (populate) {
      const include = populate.split(",").map((populateOption) => {
        return {
          model: sequelize.models[populateOption],
        };
      });

      results = await model.findAll({
        where: filter,
        order: sort,
        limit: parseInt(limit, 10),
        offset: offset,
        include: include,
      });
    }

    const totalPages = Math.ceil(count / limit);

    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults: count,
    };

    return result;
  };
};

module.exports = paginate;
