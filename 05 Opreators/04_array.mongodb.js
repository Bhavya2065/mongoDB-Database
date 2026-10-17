use('ecommerce')

/*
  =============================================================
  ARRAY OPERATORS IN MONGODB:
  =============================================================
  1. $all       -> Matches arrays that contain ALL specified elements
  2. $elemMatch -> Matches documents containing an array field with at least one element that matches all criteria
  3. $size      -> Matches arrays that have the exact number of elements specified
*/

// 1. $all: Find products whose tags array contains BOTH 'beauty' and 'mascara'
// db.products.find(
//   { tags: { $all: ['beauty', 'mascara'] } },
//   { title: 1, tags: 1 }
// )

// Difference between $in vs $all:
// - $in  (OR logic) : Matches if the array has ANY ONE of the values (e.g., 'beauty' OR 'mascara')
// - $all (AND logic): Matches ONLY if the array has ALL specified values (both 'beauty' AND 'mascara')

// 2. $elemMatch: Matches embedded objects in array matching multiple conditions
// (e.g. at least one review has rating 5 and reviewerName 'Eleanor Collins')
// db.products.find(
//   { reviews: { $elemMatch: { rating: 5, reviewerName: 'Eleanor Collins' } } },
//   { title: 1, reviews: 1 }
// )

// 3. $size: Find products where 'tags' array has exactly 2 elements
// db.products.find(
//   { reviews: { $size: 3 } },
//   { title: 1, reviews: 1 }
// )
