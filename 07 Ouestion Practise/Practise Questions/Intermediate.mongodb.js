// db.products.insertMany([
//     {
//         name: "Gaming Laptop",
//         price: 75000,
//         category: "electronics",
//         stock: 15,
//         discount: 10,
//         tags: ["gaming", "laptop", "electronics"]
//     },
//     {
//         name: "Smartphone",
//         price: 25000,
//         category: "electronics",
//         stock: 8,
//         discount: 15,
//         tags: ["phone", "android", "electronics"]
//     },
//     {
//         name: "Wireless Mouse",
//         price: 800,
//         category: "accessories",
//         stock: 50,
//         discount: 5,
//         tags: ["mouse", "computer", "electronics"]
//     },
//     {
//         name: "Mechanical Keyboard",
//         price: 3500,
//         category: "accessories",
//         stock: 20,
//         discount: 12,
//         tags: ["keyboard", "gaming", "computer"]
//     },
//     {
//         name: "LED Monitor",
//         price: 12000,
//         category: "electronics",
//         stock: 5,
//         discount: 18,
//         tags: ["monitor", "display", "electronics"]
//     },
//     {
//         name: "Office Chair",
//         price: 6000,
//         category: "furniture",
//         stock: 0,
//         discount: 20,
//         tags: ["chair", "office", "furniture"]
//     },
//     {
//         name: "Gaming Headset",
//         price: 4500,
//         category: "electronics",
//         stock: 12,
//         discount: 25,
//         tags: ["gaming", "audio", "electronics"]
//     }
// ])

// db.orders.insertMany([
//     {
//         user: "Rahul Sharma",
//         totalAmount: 80000,
//         status: "delivered",
//         orderDate: new Date("2025-02-10")
//     },
//     {
//         user: "Priya Singh",
//         totalAmount: 3000,
//         status: "pending",
//         orderDate: new Date("2025-03-01")
//     },
//     {
//         user: "Amit Verma",
//         totalAmount: 15000,
//         status: "cancelled",
//         orderDate: new Date("2024-12-15")
//     },
//     {
//         user: "Rahul Sharma",
//         totalAmount: 4500,
//         status: "delivered",
//         orderDate: new Date("2025-01-20")
//     },
//     {
//         user: "Sneha Gupta",
//         totalAmount: 1200,
//         status: "pending",
//         orderDate: new Date("2025-03-05")
//     }
// ])

use('test')

// =============================================================
// INTERMEDIATE (Q26 - Q60)
// =============================================================

// Q26: Find products whose price is greater than 1000.
// db.products.find({price: {$gt: 1000}})

// Q27: Find products whose price is between 500 and 2000.
// db.products.find({price: {$gt: 500 , $lt: 2000}})

// Q28: Find products that belong to category "electronics".
// db.products.find({category: 'electronics'})

// Q29: Find products whose stock is less than 10.
// db.products.find({stock: {$lt: 10}})

// Q30: Find products whose that are out of stock.
// db.products.find({stock: 0})

// Q31: Find products sorted by price (low to high).
// db.products.find({}).sort({price: 1})

// Q32: Find top 5 most expensive products.
// db.products.find({}).sort({price: -1}).limit(5)

// Q33: Find products whose name contains "phone".
// db.products.find({name: /phone/i})

// Q34: Find products whose discount is greater than 20%.
// db.products.find({discount: {$gt: 20}})

// Q35: Find products that do not belong to electronics category.
// db.products.find({category: {$nin: ['electronics']}})
// db.products.find({category: {$ne: 'electronics'}})

// Q36: Find products having tag "gaming".
// db.products.find({ tags: { $elemMatch: {$eq: 'gaming'} } })
// db.products.find({tags: {$in: ['gaming']}})
// db.products.find({tags: {$all: ['gaming']}})

// Q37: Find products that have both "gaming" and "laptop" tags.
// db.products.find({tags: {$all: ['gaming', 'laptop']}})

// Q38: Find products having exactly 3 tags.
// db.products.find({tags: {$size: 3}})

// Q39: Add a new tag "new" to a product.
// db.products.updateOne({}, { $push: { tags: 'new' } })

// Q40: Remove tag "old" from a product.
// db.products.updateOne({}, { $pull: { tags: 'old' } })

// Q41: Find all orders placed by user Rahul.
// db.orders.find({user: /rahul/i})

// Q42: Find orders whose total amount > 5000.
// db.orders.find({totalAmount: {$gt: 5000}})

// Q43: Find orders placed after 1 Jan 2025.
// db.orders.find({orderDate: {$gt: ISODate('2025-01-01')}})

// Q44: Find orders with status = delivered.
// db.orders.find({status: 'delivered'})

// Q45: Find orders with status not equal to cancelled.
// db.orders.find({status: {$ne: 'cancelled'}})

// Q46: Increase product price by 10%.
// db.products.updateMany({}, {$mul: {price: 1.1}})

// Q47: Increase product stock by 50.
// db.products.updateMany({}, {$inc: {stock: 50}})

// Q48: Rename field price → productPrice.
// db.products.updateMany({}, {$rename: {price: 'productPrice'}})

// Q49: Remove discount field from product.
// db.products.updateMany({}, {$unset: {discount: ''}})

// Q50: Add field featured: true to product.
// db.products.updateMany({}, {$set: {featured: true}})

// Q51: Delete products whose stock is 0.
// db.products.deleteMany({stock: 0})

// db.users.updateMany(
//     {},
//     {$set: {
//         orders:[],
//         wishlist:[],
//         cart:[],
//     }}
// )

// db.users.updateMany(
//     {},
//     {$push: {orders: {id: 101}}}
// )
// db.users.find()
// db.users.updateMany(
//     {name: 'Rahul Sharma'},
//     {$pull: {orders: {id: 101}}}
// )

// Q52: Delete users who never placed any order.
// db.users.deleteMany({orders: {$size: 0}})

// db.orders.insertOne({
//     user: 'Namit Manhotra',
//     totalAmount: 100000,
//     status: 'delieverd',
//     orderDate: new ISODate('2020-12-01')
// })

// Q53: Delete orders older than 5 years.
// const date = new Date();
// date.setFullYear(date.getFullYear() - 5);
// db.orders.deleteMany({orderDate: {$lt: date}})
// db.orders.deleteMany({$expr: {$lt: ["$orderDate", date]}})

// db.blogs.insertMany([
//     {
//         title: "MongoDB Basics",
//         views: 120,
//         comments: [
//             { user: "Rahul", text: "Great tutorial" },
//             { user: "Amit", text: "Very helpful" }
//         ]
//     },
//     {
//         title: "JavaScript Async Guide",
//         views: 300,
//         comments: [
//             { user: "Priya", text: "Awesome explanation" }
//         ]
//     },
//     {
//         title: "Node.js Performance Tips",
//         views: 80,
//         comments: []
//     }
// ])

// Q54: Increase view count of a blog post by 1.
// db.blogs.updateMany({}, { $inc: { views: 1 } })

// Q55: Add new comment to blog post.
// db.blogs.updateOne(
//     { title: "MongoDB Basics" }, 
//     { $push: {comments: { name: 'Manish', text: 'Ab to shudhar ja' }} }
// )

// Q56: Remove a specific comment.
// db.blogs.updateOne(
//     {title: "MongoDB Basics"},
//     {$pull: {comments: {name: "Manish"}}}
// )

// Q57: Add product to user wishlist.
// db.users.updateOne(
//     {},
//     {$push: {wishlist: {id: 101}}}
// )

// Q58: Remove product from wishlist.
// db.users.updateOne({}, {$pull: {wishlist: {id: 101}}})

// Q59: Add item to shopping cart.
// db.users.updateOne(
//     {},
//     {$push: {cart: {id: 101}}}
// )

// Q60: Remove item from cart.
// db.users.updateOne({}, {$pull: {cart: {id: 101}}})
