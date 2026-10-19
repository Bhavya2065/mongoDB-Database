// db.products.insertMany([
//     {
//         name: "Gaming Laptop",
//         price: 85000,
//         category: "electronics",
//         stock: 8,
//         discount: 15,
//         tags: ["gaming", "laptop", "electronics"],
//         reviews: [
//             { user: "Rahul", rating: 5 },
//             { user: "Amit", rating: 4 },
//             { user: "Priya", rating: 5 }
//         ]
//     },
//     {
//         name: "Office Laptop",
//         price: 55000,
//         category: "electronics",
//         stock: 12,
//         discount: 10,
//         tags: ["laptop", "office", "electronics"],
//         reviews: [
//             { user: "Rahul", rating: 3 },
//             { user: "Sneha", rating: 4 }
//         ]
//     },
//     {
//         name: "Gaming Mouse",
//         price: 1500,
//         category: "accessories",
//         stock: 30,
//         discount: 8,
//         tags: ["gaming", "mouse", "computer"],
//         reviews: [
//             { user: "Amit", rating: 5 },
//             { user: "Rahul", rating: 4 }
//         ]
//     },
//     {
//         name: "Mechanical Keyboard",
//         price: 4000,
//         category: "accessories",
//         stock: 20,
//         discount: 12,
//         tags: ["keyboard", "gaming", "computer"],
//         reviews: [
//             { user: "Priya", rating: 5 },
//             { user: "Rahul", rating: 4 }
//         ]
//     },
//     {
//         name: "LED Monitor",
//         price: 12000,
//         category: "electronics",
//         stock: 0,
//         discount: 20,
//         tags: ["monitor", "display", "electronics"],
//         reviews: []
//     }
// ])

use('test')

// =============================================================
// ADVANCE (Q61 - Q100)
// =============================================================

// Q61: Find products reviewed by Rahul.
// db.products.find({reviews: { $elemMatch: { user: 'Rahul' } }})
// db.products.find({'reviews.user': 'Rahul'})

// Q62: Find products where Rahul gave rating 5.
// db.products.find({reviews: {$all: [{user: 'Rahul', rating: 5}]}})
// db.products.find({reviews: {user: 'Rahul', rating: 5}})

// Q63: Find products having rating greater than or equal to 4.
// db.products.find({reviews: {$elemMatch: {rating: {$gte: 4}}}})
// db.products.find({ "reviews.rating": { $gte: 4 } })

// Q64: Find products where the same review document has rating ≥ 4.
// db.products.find({reviews: {$elemMatch: {rating: {$gte: 4}}}})

// Q65: Find products having more than 5 reviews.
// db.products.find({
//   reviews: { $type: "array" },
//   $expr: { $gt: [{ $size: "$reviews" }, 5] }
// })
// db.products.find({ "reviews.5": { $exists: true } })

// Q66: Find products whose price is greater than 5000 and stock less than 10.
// db.products.find(
//     { price: { $gt: 5000 }, stock: { $lt: 10 } }
// )

// Q67: Find products whose discount is between 10 and 30.
// db.products.find({discount: {$gt: 10, $lt: 30}})

// Q68: Find products whose name starts with "G".
// db.products.find({name: /g/i})

// Q69: Find products whose name ends with "Laptop".
// db.products.find({name: /laptop$/i})

// Q70: Find products containing "gaming" tag.
// db.products.find({name: /gaming/i})

// Q71: Find products having both "gaming" and "electronics" tags.
// db.products.find({tags: {$all: ["gaming", "electronics"]}})

// Q72: Find products having exactly 3 tags.
// db.products.find({tags: {$size: 3}})

// Q73: Find products where stock is an even number.
// db.products.find({stock: {$mod: [2,0]}})

// Q74: Find products whose name length is greater than 10 characters.
// db.products.find({$expr: {$gt: [{$strLenCP: "$name"}, 15]}})

// Q75: Find products where discount field exists.
// db.products.find({discount: {$exists: true}})

// Q76: Add a new review to a product.
// db.products.updateOne({name: "Gaming Laptop"},  {$push: {reviews: {user: 'Bhavya', rating: 3}}})

// Q77: Update the rating of Rahul’s review.
// db.products.updateOne(
//     {'reviews.user': 'Rahul'},
//     {$set: {'reviews.$.rating': 2}}
// )

// Q78: Remove review written by Amit.
// db.products.updateOne(
//     {name: "Gaming Laptop"},
//     {$pull: {reviews: {user: "Amit"}}}
// )

// Q79: Add multiple tags to a product.
// db.products.updateOne(
//     {name: "Gaming Laptop"},
//     {$push: {tags: {$each: ["hardware", "graphics"]}}}
// )

// Q80: Remove tag "gaming" from a product.
// db.products.updateOne(
//     {name: "Gaming Laptop"},
//     {$pull: {tags: 'gaming'}}
// )

// Q81: Remove multiple tags from a product.
// db.products.updateOne(
//     { name: "Gaming Laptop" },
//     { $pullAll: { tags: ["laptop", "graphics"] } }
// )
// db.products.updateOne(
//     { name: "Gaming Laptop" },
//     { $pull: { tags: { $in: ["laptop", "graphics"] } } }
// )

// Q82: Find products where ANY review has rating < 3
// db.products.find({reviews: {$elemMatch: {rating: {$lt:3}}}})

// Q83: Find products where SAME review has rating < 3.
// db.products.find({reviews: {$elemMatch: {rating: {$lt:3}}}})

// Q84: Find products where ALL reviews rating ≥ 4.
// db.products.find(
//     {
//         'reviews.rating': { $not: { $lt: 4 } },
//         'reviews.0': {$exists: true}
//     }
// )

// Q85: Find products where Rahul exists in reviews.
// db.products.find(
//     {'reviews.user': 'Rahul'}
// )

// Q86: Find products where Rahul reviewed AND rating < 3 (same review).
// db.products.find({
//     reviews: {
//         $elemMatch: {
//             user: 'Rahul', rating: { $lt: 3 }
//         }
//     }
// })

// Q87: Find products with highest stock.
// db.products.find({}).sort({stock: -1}).limit(1)

// Q88: Add tag "sale" where discount > 20.
// db.products.updateMany(
//     {discount: {$gte: 20}},
//     {$push: {tags: "sale"}}
// )

// Q89: Add review only if product has less than 2 reviews.
// db.products.updateMany(
//     {'reviews.1': {$exists: false}},
//     {$push: {reviews: {user: "Aman", rating: 4}}}
// )

// Q90: Find products where price > stock.
// db.products.find(
//     {$expr: {$gt: ["$price", "$stock"]}}
// )

// Q91: Find products where discount is missing OR 0.
// db.products.find({
//     $or: [{discount: 0}, {discount: {$exists: false}}]
// })

// Q92: Find products where name length > category length.
// db.products.find({
//     $expr: { $gt: [{$strLenCP: "$name"}, {$strLenCP: "$category"}] }
// })

// Q93: Find products having price between 10000 and 40000 and out.
// db.products.find(
//     {price: {$gt: 10000, $lt: 40000}, stock: 0}
// )

// Q94: Find users with empty wishlist.
// db.users.find(
//     {wishlist: {$size: 0}}
// )

// Q95: Find orders where amount > 10000 and status delivered.
// db.orders.find({
//     totalAmount: {$gt: 10000},
//     status: 'delivered'
// })

// Q96: Find products where stock is between 5 and 20 but not 10.
// db.products.find({
//     stock: {$gt: 5, $lt: 20, $ne: 10}
// })

// Q97: Find products where either discount > 20 OR stock < 5.
// db.products.find({
//     $or: [{discount: {$gt: 20}}, {stock: {$lt: 5}}]
// })

// Q98: Find products where tags include "gaming" but not "mobile".
// db.products.find({
//     tags: {$in: ["gaming"], $nin: ["mobile"]}
// })

// Q99: Find products where review count > 2 and < 5.
// db.products.find({
//     reviews: { $type: "array" },
//     $expr: {
//         $and: [
//             { $gt: [{ $size: "$reviews" }, 2] },
//             { $lt: [{ $size: "$reviews" }, 5] }
//         ]
//     }
// })

// Q100: Find products where no review has rating < 3.
// db.products.find(
//     {reviews: {$not: {$elemMatch: {rating: {$lt: 3}}}}}
// )