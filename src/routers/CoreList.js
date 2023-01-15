async function selectList(model, query, populate = null) {
  let labelColumnName = Object.entries(model.schema.obj).filter(
    (e) => e[1].label
  )[0][0];
  let searchValue = query.search;
  let findOpt = {};
  if (searchValue) {
    findOpt[labelColumnName] = {
      $regex: new RegExp(searchValue.toLowerCase(), "i"),
    };
  }
  let result = await model.aggregate([
    {
      $match: findOpt,
    },
    {
      $project: {
        value: "$_id",
        label: "$" + labelColumnName,
        _id: 0,
      },
    },
    {
      $sort: { label: 1 },
    },
    {
      $limit: 20,
    },
  ]);
  return result;
}

module.exports = async function CoreList(model, req, populate = null) {
  let query = req.body;

  let queryType = query.type;
  if (queryType == "select") {
    return await selectList(model, query, populate);
  } else {
    const { searchValue, order, field, columns } = query;
    let limit = Number(query.results);
    let pageNumber = Number(query.page);
    let sortParams;
    let options = { limit: limit, skip: (pageNumber - 1) * limit };
    let collationOpt = {};
    collationOpt.locale = "tr";
    let findOpt = {};
    if (order) {
      sortParams = {};
      sortParams[field] = order == "ascend" ? 1 : -1;
    }
    console.log(searchValue);
    if (searchValue) {
      findOpt["$or"] = [];
      columns.forEach((e) => {
        if (e.searchable == "true") {
          let a = {};
          a[e.data] = {
            $regex: new RegExp(searchValue.toLowerCase(), "i"),
          };
          findOpt["$or"].push(a);
        }
      });
    }

    let list;
    let count = 0;

    if (searchValue) {
      let firstPromise = model.countDocuments(findOpt, null);
      let secondPromise = model
        .find(findOpt, null, options)
        .populate(populate)
        .collation(collationOpt)
        .sort(sortParams ?? { created_at: 1 });

      await Promise.all([firstPromise, secondPromise])
        .then((values) => {
          count = values[0];
          list = values[1];
        })
        .catch(() => console.log(JSON.stringify(findOpt)));
    } else {
      let firstPromise = model.count();
      let secondPromise = model
        .find(findOpt, null, options)
        .populate(populate)
        .collation(collationOpt)
        .sort(sortParams ?? { created_at: 1 });
      await Promise.all([firstPromise, secondPromise]).then((values) => {
        count = values[0];
        list = values[1];
      });
    }
    let result = {
      results: list,
      info: { page: pageNumber, results: count },
    };
    return result;
  }
};
