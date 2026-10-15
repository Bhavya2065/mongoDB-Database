use('ecommerce')
// db.products.find({})

/*
  =============================================================
  UPDATE OPERATORS IN MONGODB:
  =============================================================
  Field Update Operators:
  1. $set      -> Updates the value of a field
  2. $unset    -> Removes the specified field from a document
  3. $inc      -> Increments or decrements a numeric field value
  4. $mul      -> Multiplies the value of a field by a number
  5. $rename   -> Renames a field
  6. $min      -> Updates the field only if the specified value is less than the current value
  7. $max      -> Updates the field only if the specified value is greater than the current value

  Array Update Operators:
  8. $push     -> Adds an element to an array
  9. $addToSet -> Adds an element to an array only if it doesn't already exist (no duplicates)
  10. $pull    -> Removes all matching elements from an array
*/

// ==================== FIELD UPDATE OPERATORS ====================

// 1. $set: Update field value
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $set: { price: 10.99, inStock: true } }
// )

// 2. $unset: Remove field from document
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $unset: { inStock: '' } }
// )

// 3. $inc: Increase or decrease numeric value (+10 to add, -5 to decrease)
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $inc: { stock: 10 } }
// )

// 4. $mul: Multiply the field value by a number
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $mul: { price: 1.1 } }
// )

// 5. $rename: Change field name
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $rename: { tags: 'productTags' } }
// )

// 6. $min: Update field only if new value is smaller than current value
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $min: { price: 8.99 } }
// )

// 7. $max: Update field only if new value is greater than current value
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $max: { price: 15.99 } }
// )

// ==================== ARRAY UPDATE OPERATORS ====================

// 8. $push: Add element to array
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $push: { tags: 'beauty' } }
// )

// 9. $addToSet: Add element to array without duplicates
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $addToSet: { tags: 'beauty' } }
// )

// 10. $pull: Remove element from array
// db.products.updateOne(
//   { title: 'Essence Mascara Lash Princess' },
//   { $pull: { tags: 'trending' } }
// )
