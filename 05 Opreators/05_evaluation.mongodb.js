use('ecommerce')

/*
  =============================================================
  EVALUATION OPERATORS IN MONGODB:
  =============================================================
  1. $regex -> Matches string patterns using regular expressions
  2. $expr  -> Allows using aggregation expressions and comparing two fields in the same document
  3. $mod   -> Performs modulo operation on a field's value ($mod: [divisor, remainder])
  4. $text  -> Performs text search on fields with a text index
*/

// 1. $regex: Find products whose title contains 'Lipstick' (case-insensitive with $options: 'i')
// method 1
db.products.find(
  { title: { $regex: 'lipstick', $options: 'i' } },
  { title: 1, category: 1 }
)

// method 2
db.products.find(
  { title: /lipstick/i },
  { title: 1, category: 1 }
)

// 2. $expr: Compare two fields inside the same document
// (e.g. find products where stock is greater than minimumOrderQuantity)
// db.products.find(
//   { $expr: { $gt: ["$stock", "$minimumOrderQuantity"] } },
//   { title: 1, stock: 1, minimumOrderQuantity: 1 }
// )

// 3. $mod: Matches values where field % divisor == remainder
// (e.g. stock is an even number: stock % 2 == 0)
// db.products.find(
//   { stock: { $mod: [2, 0] } },
//   { title: 1, stock: 1 }
// )
