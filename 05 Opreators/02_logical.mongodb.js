use('ecommerce')

/*
  =============================================================
  LOGICAL OPERATORS IN MONGODB:
  =============================================================
  1. $and -> All conditions must be true.
  2. $or  -> At least one condition must be true.
  3. $not -> Negates/inverts a condition (condition must be false).
  4. $nor -> All conditions must be false (none must match).
*/

// 1. $and: Both conditions must match (category is 'beauty' AND price < 12.99)
db.products.find(
  { $and: [{ category: 'beauty' }, { price: { $lt: 12.99 } }] },
  { title: 1, category: 1, price: 1 }
)

// 2. $or: At least one condition matches (category is 'beauty' OR price > 100)
db.products.find(
  { $or: [{ category: 'beauty' }, { price: { $gt: 100 } }] },
  { title: 1, category: 1, price: 1 }
)

// 3. $not: Inverts the condition (returns products where price is NOT greater than 20)
db.products.find(
  { price: { $not: { $gt: 20 } } },
  { title: 1, price: 1 }
)

// 4. $nor: None of the conditions match (neither 'beauty' NOR 'fragrances')
db.products.find(
  { $nor: [{ category: 'beauty' }, { category: 'fragrances' }] },
  { title: 1, category: 1 }
)
