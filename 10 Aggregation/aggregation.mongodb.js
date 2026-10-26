// db.products.find(
//     {brand: "Apple"},
//     {name: 1, price: 1, brand: 1, category: 1, _id: 0}
// ).sort({price: -1})

// db.products.aggregate([
//     {
//         $match: {
//           brand: "Apple"
//         }
//     },
//     {
//         $project: {
//           name: 1, price: 1, brand: 1, category: 1, _id: 0
//         }
//     },
//     {
//         $sort: {
//           price: -1
//         }
//     }
// ])

// db.products.aggregate([
//     {
//         $match: {
//           category: "Mobile"
//         }
//     },
//     {
//         $project: {
//           name: 1,
//           rating: 1,
//           _id: 0,
//           avgRating: {
//             $avg: '$ratings'
//           }
//         }
//     }
// ])

// db.products.aggregate([
//   {
//     $group: {
//       _id: '$category',
//       productName: {
//         $push: '$name'
//       },
//       productPrice: {
//         $push: '$price'
//       }
//     }
//   }
// ])

// db.products.aggregate([
//   {
//     $project: {
//       _id: 0,
//       productName: {
//         $toUpper: '$name'
//       },
//       price: {
//         $sum: '$price'
//       },
//       inStock: 'True'
//     }
//   }
// ])

// db.orders.aggregate([
//   {
//     $lookup: {
//       from: 'products',
//       localField: 'products.productId',
//       foreignField: '_id',
//       as: 'productDetails '
//     }
//   }
// ])

// db.orders.aggregate([
//   {
//     $unwind: '$products'
//   },
//   {
//     $project: {
//       products: 1
//     }
//   }
// ])

db.orders.aggregate([
  {
    $match: {
      orderDate: {
        $gt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      },
    },
  },
  {
    $unwind: "$products",
  },
  {
    $lookup: {
      from: "products",
      localField: "products.productId",
      foreignField: "_id",
      as: "productDetails",
    },
  },
  {
    $unwind: "$productDetails"
  },
  {
    $project: {
      _id: 0,
      products: 1,
      orderDate: 1,
      "productDetails.category": 1,
      "productDetails.price": 1
    },
  },
  {
    $group: {
      _id: "$productDetails.category",
      categoryPrice: {
        $sum: {
          $multiply: ["$products.quantity", '$productDetails.price']
        },
      },
    },
  },
]);
