// Level - 1 : Database Setup

// Switch to (or create) database
use('shopApp')

// List all existing databases
show('dbs')

// Create a new collection explicitly
db.createCollection('users')

// Switch to database and list collections
use('shopApp')
show('collections')

// Level - 2 : User Data (Create & Read)

use('shopApp')

// Insert a single document
db.users.insertOne({
    name: "Rahul",
    email: "rahul@gmail.com",
    city: "Bhagalpur",
    age: "22"
})

// Insert another single document
db.users.insertOne({
    name: "Meghna",
    email: "meghna@gmail.com",
    city: "Sitapur",
    age: "20"
})

use('shopApp')

// Insert multiple documents at once
db.users.insertMany([{ name: "Neha", email: "neha@gmail.com", city: "Delhi", age: 24 }, { name: "Ravi", email: "ravi@gmail.com", city: "Bhagalpur", age: 21 }, { name: "Priya", email: "priya@gmail.com", city: "Mumbai", age: 23 }])

// Find and display all documents in users collection
db.users.find();

// Find documents with filter (city: Bhagalpur)
db.users.find({ city: "Bhagalpur" });

// Level 3 - Product System (Create, Read & Count)

// Check databases and switch to ecommerce database
show('dbs')
use('ecommerce')

// Create products collection
db.createCollection("products")

// Insert multiple product documents
db.products.insertMany([{ name: "iPhone", price: 80000, category: "electronics", stock: 10 }, { name: "Laptop", price: 60000, category: "electronics", stock: 5 }, { name: "Headphones", price: 2000, category: "electronics", stock: 20 }, { name: "Shoes", price: 3000, category: "fashion", stock: 15 }])

// Find all products
db.products.find()

// Find products with specific category
db.products.find({ category: "electronics" })

// Count total documents in products collection
db.products.countDocuments({})

// Level 4 — Update Real World Data (Update)

// Update a single document's city field using $set
use('shopApp')
db.users.updateOne( { name: "Rahul" }, { $set: { city: "Mumbai" } } )

// Update price of a single product
use('ecommerce')
db.products.updateOne( { name: "Laptop" }, { $set: { price: 65000 } } )

// Update stock of all products (empty filter matches all documents)
use('ecommerce')
db.products.updateMany( {}, { $set: { stock: 25 } } )

// Update a single user's email
use('shopApp')
db.users.updateOne( { name: "Neha" }, { $set: { email: "neha123@gmail.com" } } )

// Level 5 — Delete Operations (Delete)

use('shopApp')

// Delete a single document matching name
db.users.deleteOne({name: "Ravi"})

// Delete multiple documents where age is greater than 18 ($gt)
db.users.deleteMany({age: {$gt: 18}})

use('ecommerce')

// Delete a single document matching category
db.products.deleteOne({category: "fashion"})

// List collections in current database
show('collections')