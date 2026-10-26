// =============================================================================
// 📌 COMPLETE MONGODB AGGREGATION PIPELINE GUIDE
// =============================================================================
//
// 💡 WHAT IS AGGREGATION?
// - Aggregation processes data records and returns computed/summarized results.
// - It works like a factory "Assembly Line" (Pipeline):
//   Documents -> [Stage 1: Filter] -> [Stage 2: Group] -> [Stage 3: Sort] -> Final Result
// - Each stage takes documents as input, transforms them, and passes them to the next stage.
//
// 🆚 find() vs aggregate():
// - find(): Simple querying, projection, sorting (limited transformations).
// - aggregate(): Advanced data analysis, grouping, joining collections, reshaping data.
// =============================================================================

use("test");


// =============================================================================
// 1. BASIC PIPELINE: $match, $project, $sort
// =============================================================================
// - $match: Filters documents (works like query in find()). Place early to use indexes!
// - $project: Reshapes documents (1 to include, 0 to exclude, or create new computed fields).
// - $sort: Orders documents (1 = Ascending, -1 = Descending).

// Example: Find Apple products, pick specific fields, and sort by price descending
db.products.aggregate([
  {
    $match: {
      brand: "Apple"
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      price: 1,
      brand: 1,
      category: 1
    }
  },
  {
    $sort: {
      price: -1
    }
  }
]);


// =============================================================================
// 2. $group STAGE & ACCUMULATORS
// =============================================================================
// - Groups documents by a specified identifier (_id).
// - _id: null groups ALL input documents together into a single summary.
// - Common Accumulators:
//   * $sum: Adds values together (or counts if using 1)
//   * $avg: Calculates average of numeric values
//   * $min / $max: Finds lowest / highest value
//   * $push: Adds values to an array (keeps duplicates)
//   * $addToSet: Adds unique values to an array (no duplicates)
//   * $count: Counts total documents in the group

// Example A: Group by category and collect product names + prices
db.products.aggregate([
  {
    $group: {
      _id: "$category",
      totalProducts: { $sum: 1 },
      avgPrice: { $avg: "$price" },
      minPrice: { $min: "$price" },
      maxPrice: { $max: "$price" },
      productNames: { $push: "$name" },
      uniqueBrands: { $addToSet: "$brand" }
    }
  }
]);

// Example B: Overall store statistics (group all documents together using _id: null)
db.products.aggregate([
  {
    $group: {
      _id: null,
      totalInventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
      overallAvgPrice: { $avg: "$price" },
      totalProductsCount: { $sum: 1 }
    }
  }
]);


// =============================================================================
// 3. $addFields / $set (RESHAPING WITHOUT LOSING FIELDS)
// =============================================================================
// - Unlike $project, $addFields keeps ALL existing fields and adds/overwrites only specified ones.
// - $set is an alias for $addFields (MongoDB 4.2+).

// Example: Add totalValue (price * stock) and uppercaseName to every product
db.products.aggregate([
  {
    $addFields: {
      totalValue: { $multiply: ["$price", "$stock"] },
      nameUpper: { $toUpper: "$name" },
      avgRating: { $avg: "$ratings" }
    }
  }
]);


// =============================================================================
// 4. $unwind (FLATTENING ARRAYS)
// =============================================================================
// - Deconstructs an array field from the input document to output a document for EACH element.
// - Example: 1 order with 3 products in array -> turns into 3 separate order documents.
// - Option: preserveNullAndEmptyArrays: true (prevents losing docs where array is empty or missing).

// Example: Unwind products array in orders
db.orders.aggregate([
  {
    $unwind: {
      path: "$products",
      preserveNullAndEmptyArrays: false // default is false
    }
  },
  {
    $project: {
      userId: 1,
      productId: "$products.productId",
      quantity: "$products.quantity",
      status: 1
    }
  }
]);


// =============================================================================
// 5. $lookup (JOINING COLLECTIONS / LEFT OUTER JOIN)
// =============================================================================
// - Performs a left outer join to an unsharded collection in the same database.

// Method 1: Basic Lookup (Field to Field equality)
// Syntax:
//   from: target collection name
//   localField: field from the current collection
//   foreignField: matching field in target collection
//   as: name of the new array field to store results
db.orders.aggregate([
  {
    $unwind: "$products"
  },
  {
    $lookup: {
      from: "products",
      localField: "products.productId",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  {
    // $lookup always produces an array. Unwind to flatten it into an object:
    $unwind: "$productDetails"
  }
]);

// Method 2: Advanced Lookup with Custom Pipeline & Variables (let + pipeline)
// Useful for complex joins, sub-queries, and filtering foreign records before joining.
db.orders.aggregate([
  {
    $lookup: {
      from: "products",
      let: { orderTotal: "$totalAmount" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $gt: ["$price", 50000] }
              ]
            }
          }
        }
      ],
      as: "expensiveProducts"
    }
  }
]);


// =============================================================================
// 6. PAGINATION & COUNT: $skip, $limit, $count
// =============================================================================
// - $skip: Skips n documents.
// - $limit: Limits the output to n documents.
// - $count: Counts the number of documents reaching this stage.

// Example A: Pagination (Page 2, 2 items per page)
db.products.aggregate([
  { $sort: { price: -1 } },
  { $skip: 2 },
  { $limit: 2 }
]);

// Example B: Count documents matching a criteria
db.products.aggregate([
  { $match: { category: "Mobile" } },
  { $count: "totalMobiles" }
]);


// =============================================================================
// 7. CONDITIONAL & EXPRESSION OPERATORS
// =============================================================================
// - $cond: If-Else condition ({ $cond: [ if, then, else ] } or { if: ..., then: ..., else: ... })
// - $switch: Multiple branch condition (like switch-case)
// - Array operators: $size, $filter, $map, $in

// Example: Classify stock status and discount tiers
db.products.aggregate([
  {
    $project: {
      name: 1,
      price: 1,
      stockStatus: {
        $cond: {
          if: { $lte: ["$stock", 10] },
          then: "Low Stock",
          else: "In Stock"
        }
      },
      priceSegment: {
        $switch: {
          branches: [
            { case: { $gte: ["$price", 50000] }, then: "Premium" },
            { case: { $gte: ["$price", 10000] }, then: "Mid-Range" }
          ],
          default: "Budget"
        }
      },
      totalRatingsGiven: { $size: "$ratings" }
    }
  }
]);


// =============================================================================
// 8. $facet (MULTI-FACETED / PARALLEL PIPELINES)
// =============================================================================
// - Allows running multiple aggregation pipelines within a single stage on the same data.
// - Extremely useful for dashboards, e.g., getting data + total count in 1 single query.

db.products.aggregate([
  {
    $facet: {
      // Pipeline 1: Price stats
      priceStats: [
        {
          $group: {
            _id: null,
            avgPrice: { $avg: "$price" },
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" }
          }
        }
      ],
      // Pipeline 2: Category breakdown
      categoryCounts: [
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        }
      ],
      // Pipeline 3: Paginated list
      paginatedProducts: [
        { $sort: { price: -1 } },
        { $limit: 3 },
        { $project: { name: 1, price: 1 } }
      ]
    }
  }
]);


// =============================================================================
// 9. OUTPUT STAGES: $out & $merge
// =============================================================================
// ⚠️ These stages MUST be the LAST stage in the pipeline!
// - $out: Writes result documents into a new collection (REPLACES collection if exists).
//   Example: { $out: "sales_report" }
// - $merge: Writes result documents into an existing collection (UPDATES / INSERTS flexibly).
//   Example: { $merge: { into: "monthly_metrics", whenMatched: "merge", whenNotMatched: "insert" } }


// =============================================================================
// 10. REAL-WORLD COMPLETE PIPELINE EXAMPLE
// =============================================================================
// Goal: Calculate total revenue per product category for orders placed in the last 30 days.
// Pipeline flow:
// 1. $match   -> Filter recent orders
// 2. $unwind  -> Deconstruct products array
// 3. $lookup  -> Join with products collection to get price & category
// 4. $unwind  -> Flatten productDetails array into single object
// 5. $project -> Pick only required fields & calculate subtotal per item
// 6. $group   -> Group by category and sum total revenue
// 7. $sort    -> Sort by highest revenue first

db.orders.aggregate([
  // Step 1: Filter orders placed in the last 30 days
  {
    $match: {
      orderDate: {
        $gt: new Date(Date.now() - 30 * 24 * 3600 * 1000)
      },
      status: { $ne: "Cancelled" }
    }
  },

  // Step 2: Unwind products array in each order
  {
    $unwind: "$products"
  },

  // Step 3: Join with products collection to fetch price and category
  {
    $lookup: {
      from: "products",
      localField: "products.productId",
      foreignField: "_id",
      as: "productDetails"
    }
  },

  // Step 4: Flatten joined product details
  {
    $unwind: "$productDetails"
  },

  // Step 5: Reshape and calculate subtotal for each order line item
  {
    $project: {
      _id: 0,
      orderId: "$_id",
      orderDate: 1,
      category: "$productDetails.category",
      quantity: "$products.quantity",
      unitPrice: "$productDetails.price",
      itemTotal: {
        $multiply: ["$products.quantity", "$productDetails.price"]
      }
    }
  },

  // Step 6: Group by category and calculate total category revenue & total items sold
  {
    $group: {
      _id: "$category",
      totalRevenue: { $sum: "$itemTotal" },
      totalUnitsSold: { $sum: "$quantity" }
    }
  },

  // Step 7: Sort by highest revenue
  {
    $sort: {
      totalRevenue: -1
    }
  }
]);


// =============================================================================
// ⚡ PERFORMANCE & BEST PRACTICES SUMMARY
// =============================================================================
// 1. Filter early: Place $match and $sort at the start of pipeline to leverage indexes.
// 2. Reduce fields early: Drop unnecessary fields with $project to save RAM.
// 3. RAM Limit: By default, pipeline stages have a 100 MB RAM limit.
//    If your data exceeds this, enable: { allowDiskUse: true }
//    Example: db.orders.aggregate([...], { allowDiskUse: true })
// 4. $push vs $addToSet: Use $push for all records; use $addToSet to eliminate duplicates.
// 5. $addFields vs $project: Use $addFields if you want to keep original fields;
//    use $project if you only need a few specific fields.
// =============================================================================
