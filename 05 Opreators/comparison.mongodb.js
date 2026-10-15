use('ecommerce')

/*
  =============================================================
  COMPARISON OPERATORS IN MONGODB:
  =============================================================
  1. $eq  -> Equal to (matches values equal to specified value)
  2. $ne  -> Not equal to (matches values not equal to specified value)
  3. $gt  -> Greater than
  4. $gte -> Greater than or equal to
  5. $lt  -> Less than
  6. $lte -> Less than or equal to
  7. $in  -> Matches any value in an array
  8. $nin -> Does not match any value in an array
*/

// 1. $lte (Less than or equal to):
db.products.find(
  { price: { $lte: 12.99 } },
  { title: 1, category: 1, stock: 1, price: 1 }
)

// 2. $eq (Equal to):
db.products.find({ price: { $eq: 9.99 } }, { title: 1, price: 1 })

// 3. $ne (Not equal to):
db.products.find({ category: { $ne: 'beauty' } }, { title: 1, category: 1 })

// 4. $gt (Greater than):
db.products.find({ price: { $gt: 50 } }, { title: 1, price: 1 })

// 5. $gte (Greater than or equal to):
db.products.find({ rating: { $gte: 4.5 } }, { title: 1, rating: 1 })

// 6. $lt (Less than):
db.products.find({ stock: { $lt: 10 } }, { title: 1, stock: 1 })

// 7. $in (In array - matches any of these):
db.products.find({ category: { $in: ['beauty', 'fragrances'] } }, { title: 1, category: 1 })

// 8. $nin (Not in array - matches none of these):
db.products.find({ category: { $nin: ['beauty', 'groceries'] } }, { title: 1, category: 1 })

