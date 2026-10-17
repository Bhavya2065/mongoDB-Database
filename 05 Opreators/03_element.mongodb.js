use('myuser')

/*
  =============================================================
  ELEMENT OPERATORS IN MONGODB:
  =============================================================
  1. $exists -> Checks if a field exists in a document (true/false)
  2. $type   -> Selects documents where the field is of specified BSON type
*/

// 1. $exists: Find products that have a 'brand' field
db.user.insertMany([
  { name: 'Manas', age: 21 },
  { name: 'mukesh' },
  { age: 34 },
  { name: 'rohan', age: '45' },
  { age: '45' }
])

// Find products where 'discountPercentage' does NOT exist:
db.user.find({ age: { $exists: true } })

// 2. $type: Find products where 'price' is of type 'double' (number) or 'string'
db.user.find({ age: { $type: "string" } })
