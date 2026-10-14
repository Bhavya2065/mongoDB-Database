// Level - 1 : Database Setup

use('shopApp')

show('dbs')
db.createCollection('users')

use('shopApp')
show('collections')

// Level - 2 : User Data

use('shopApp')
db.users.insertOne({
    name: "Rahul",
    email: "rahul@gmail.com",
    city: "Bhagalpur",
    age: "22"
})
db.users.insertOne({
    name: "Meghna",
    email: "meghna@gmail.com",
    city: "Sitapur",
    age: "20"
})
use('shopApp')
db.users.insertMany([{ name: "Neha", email: "neha@gmail.com", city: "Delhi", age: 24 }, { name: "Ravi", email: "ravi@gmail.com", city: "Bhagalpur", age: 21 }, { name: "Priya", email: "priya@gmail.com", city: "Mumbai", age: 23 }])
db.users.find();
db.users.find({ city: "Bhagalpur" });

// Level 3 - Prorduct System
show('dbs')
use('ecommerce')
db.createCollection("products")
db.products.insertMany([{ name: "iPhone", price: 80000, category: "electronics", stock: 10 }, { name: "Laptop", price: 60000, category: "electronics", stock: 5 }, { name: "Headphones", price: 2000, category: "electronics", stock: 20 }, { name: "Shoes", price: 3000, category: "fashion", stock: 15 }])
db.products.find()
db.products.find({ category: "electronics" })
db.products.countDocuments({})

// Level 4 — Update Real World Data


use('shopApp')
db.users.updateOne( { name: "Rahul" }, { $set: { city: "Mumbai" } } )
use('ecommerce')
db.products.updateOne( { name: "Laptop" }, { $set: { price: 65000 } } )
use('ecommerce')
db.products.updateMany( {}, { $set: { stock: 25 } } )
use('shopApp')
db.users.updateOne( { name: "Neha" }, { $set: { email: "neha123@gmail.com" } } )


use('shopApp')
db.users.deleteOne({name: "Ravi"})
db.users.deleteMany({age: {$gt: 18}})
use('ecommerce')
db.products.deleteOne({category: "fashion"})

show('collections')