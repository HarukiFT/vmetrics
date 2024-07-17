export const DistinctFieldAggregation = (filters: Record<string, any>) => ([
    {
      $match: {
        ...filters
      }
    },
    {
      $project: {
        _id: 0,
        keys: { $objectToArray: "$$ROOT" }
      }
    },
    {
      $unwind: "$keys"
    },
    {
      $match: {
        "keys.k": { $ne: "_id" }
      }
    },
    {
      $group: {
        _id: "$keys.k"
      }
    },
    {
      $project: {
        _id: 0,
        field: "$_id"
      }
    }
  ]);