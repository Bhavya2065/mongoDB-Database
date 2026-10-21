use('test')

// =============================================================================
// 📌 COMPLETE MONGODB INDEXING GUIDE
// =============================================================================
//
// 💡 WHAT IS AN INDEX?
// - Think of an index like the index page at the back of a textbook.
// - Without Index: MongoDB does a "COLLSCAN" (Collection Scan). It checks EVERY document one by one (slow: O(N)).
// - With Index: MongoDB does an "IXSCAN" (Index Scan). It jumps directly to the matching data using a B-Tree structure (fast: O(log N)).
//
// ⚖️ TRADE-OFF:
// - Indexes make READ queries (find) extremely fast.
// - But indexes slow down WRITE queries (insert, update, delete) because MongoDB must update both the document and the index.
// - Indexes also consume RAM and Disk storage.
// =============================================================================


// =============================================================================
// 1. SINGLE FIELD INDEX
// =============================================================================
// An index created on a single field.
// Value:  1 = Ascending order (A to Z, 0 to 9)
// Value: -1 = Descending order (Z to A, 9 to 0)

// Step 1: Check performance before creating index
// Notice "stage": "COLLSCAN" and "totalDocsExamined" will be high
// db.users.find({name: 'Pooja Mishra'}).explain('executionStats')

// Step 2: Create single field index on 'name'
// db.users.createIndex({name: 1})

// Step 3: View all existing indexes on this collection
// db.users.getIndexes()

// Step 4: Drop an index (Two ways)
// db.users.dropIndex({name: 1})     // Method 1: Pass the key pattern
// db.users.dropIndex('name_1')       // Method 2: Pass the index name string

// Step 5: Check performance after creating index
// Notice "stage": "IXSCAN" and "totalDocsExamined" will be 1
// db.users.find({name: 'Pooja Mishra'}).explain('executionStats')


// =============================================================================
// 2. COMPOUND INDEX
// =============================================================================
// An index on multiple fields together (e.g., { name: 1, age: 1 }).
//
// ⚠️ Index Prefix Rule:
// Order of fields is very important!
// If index is { name: 1, age: 1 }:
// - Query with { name }               -> Uses index ✅ (Prefix match)
// - Query with { name, age }          -> Uses index ✅ (Prefix match)
// - Query with { age } alone          -> Cannot use this index ❌ (COLLSCAN)
//
// 💡 Best Practice ESR Rule:
// When creating compound index, follow ESR order:
// 1. Equality fields first (e.g. status: "active")
// 2. Sort fields second    (e.g. createdAt: -1)
// 3. Range fields last     (e.g. age: { $gt: 20 })

// db.users.getIndexes()
// db.users.createIndex({name: 1, age: -1})
// db.users.getIndexes()

// Testing prefix rule:
// db.users.find({name: 'Pooja Mishra'}).explain('executionStats')  // Uses index ✅
// db.users.find({age: 23}).explain('executionStats')              // Does COLLSCAN ❌

// Dropping compound index
// db.users.dropIndex('name_1_age_-1')
// db.users.getIndexes()
// db.users.createIndex({name: 1, age: 1})

// Queries using both fields or prefix:
// db.users.find({name: 'Sneha Gupta', age: 24}).explain('executionStats')
// db.users.find({name: "Sneha Gupta"}).explain('executionStats')
// db.users.find({age: 24}).explain('executionStats')

// Compound index vs Two separate single indexes:
// A compound index {name: 1, age: 1} is much faster than having two separate indexes {name: 1} and {age: 1}.
// db.users.getIndexes()
// db.users.dropIndex('name_1_age_1')
// db.users.createIndex({name: 1})
// db.users.createIndex({age: 1})
// db.users.getIndexes()
// db.users.find({name: 'Sneha Gupta', age: 24}).explain('executionStats')


// =============================================================================
// 3. MULTIKEY INDEX (ARRAY INDEXING)
// =============================================================================
// When you index a field that contains an array, MongoDB automatically creates a "Multikey Index".
// It creates a separate index entry for every element inside the array.

// A. Indexing Array of simple values (e.g. tags: ['laptop', 'electronics'])
// db.products.getIndexes()
// db.products.find({tags: 'laptop'}).explain('executionStats')
// db.products.createIndex({tags: 1})
// db.products.getIndexes()
// db.products.find({tags: 'laptop'}).explain('executionStats')

// B. Indexing Array of Objects (Subdocuments)
// Indexing the entire array field requires exact matching (all keys in exact same order):
// db.products.createIndex({reviews: 1})
// db.products.find({
//     reviews: {
//         user: "Sneha",
//         rating: 4
//     }
// }).explain('executionStats') // Only works when matching the whole document inside array.
// db.products.dropIndex('reviews_1')

// Best Practice: Use dot notation to index specific fields inside the subdocuments
// db.products.createIndex({'reviews.user': 1, 'reviews.rating': 1})
// db.products.getIndexes()

// Now queries on specific nested properties use index efficiently:
// db.products.find({
//     'reviews.user': 'Sneha'
// }).explain('executionStats')


// =============================================================================
// 4. TEXT INDEX & TEXT SEARCH
// =============================================================================
// Used for search features (searching keywords inside strings, articles, titles).
//
// ⚠️ Important Rules:
// 1. A collection can have only ONE text index (it can cover multiple fields).
// 2. Uses $text and $search operators.
// 3. Automatically handles case-insensitivity, word stemming, and stop words (like 'the', 'is').

// db.articles.createIndex({title: 'text'})
// db.articles.getIndexes()
// db.articles.find({$text: {$search: "beginners Database"}})
// db.articles.find({$text: {$search: "Beginners"}}).explain('executionStats')
// db.articles.dropIndex('title_text')

// Compound Text Index with Field Weights:
// Weights give higher importance to specific fields.
// In this example: tags match (weight 3) is more important than title match (weight 1).
// db.articles.createIndex(
//     {title: 'text', content: 'text', tags: 'text'},
//     {weights: {title: 1, content: 2, tags: 3}}
// )
// db.articles.getIndexes()

// textScore Calculation:
// MongoDB scores how relevant each document is based on:
// - Term frequency (how many times word appears)
// - Field weight
// - Field length
// db.articles.find(
//     {$text: {$search: "web"}},
//     {myscore: {$meta: 'textScore'}}
// ).sort({myscore: {$meta: 'textScore'}})

// db.articles.find({$text: {$search: "MongodB performance spanish"}}).explain('executionStats')
// db.articles.dropIndex('title_text_content_text_tags_text')


// =============================================================================
// 5. SPECIAL & ADVANCED INDEX TYPES
// =============================================================================

// -----------------------------------------------------------------------------
// A. UNIQUE INDEX ({ unique: true })
// -----------------------------------------------------------------------------
// Ensures no two documents have the same value for the indexed field (e.g., email).
// Note: If duplicate values already exist in collection, index creation fails with error.
// db.users.getIndexes()
// db.users.createIndex({ email: 1 }, { unique: true })
// db.users.getIndexes()

// -----------------------------------------------------------------------------
// B. PARTIAL INDEX (partialFilterExpression)
// -----------------------------------------------------------------------------
// Indexes only documents that meet a specific condition.
// Benefits: Saves huge RAM & storage by ignoring unnecessary documents.
// db.orders.createIndex(
//     {totalAmount: 1}, 
//     {partialFilterExpression: {totalAmount: {$gt: 4000}}}
// )
// db.orders.getIndexes()
// db.orders.find({totalAmount: 80000}).explain('executionStats') // totalDocsExamined: 1 (Uses index ✅)
// db.orders.find({totalAmount: 1200}).explain('executionStats')  // totalDocsExamined: 5 (COLLSCAN ❌, amount <= 4000 not in index)

// -----------------------------------------------------------------------------
// C. SPARSE INDEX ({ sparse: true })
// -----------------------------------------------------------------------------
// Indexes ONLY documents that actually contain the field.
// Documents where the field is missing/null are excluded from the index.
// Useful when many documents do not have this field, saving index size.
// db.users.createIndex({ phone: 1 }, { sparse: true })

// -----------------------------------------------------------------------------
// D. TTL INDEX (Time-To-Live - expireAfterSeconds)
// -----------------------------------------------------------------------------
// Automatically deletes documents after a certain number of seconds.
// Perfect for: OTP verification, user sessions, temp cache, activity logs.
// Rule: Field MUST store a BSON Date (e.g. ISODate() or new Date()).
// db.sessions.createIndex(
//     { createdAt: 1 }, 
//     { expireAfterSeconds: 3600 } // Automatically deletes 1 hour (3600s) after createdAt
// )


// =============================================================================
// 6. PERFORMANCE & QUERY ANALYSIS
// =============================================================================

// -----------------------------------------------------------------------------
// A. COVERED QUERY (Fastest Possible Query)
// -----------------------------------------------------------------------------
// A query is "Covered" when:
// 1. All queried fields are in the index.
// 2. All returned (projected) fields are in the index.
// 3. The `_id` field is explicitly excluded (`_id: 0`).
//
// Result: MongoDB answers directly from index memory!
// "totalDocsExamined": 0 (Zero documents loaded from disk/collection).
// db.articles.getIndexes()
// db.articles.createIndex({title: 1})
// db.articles.find({title: "Advanced MongoDB Text Search"}, { title: 1, _id: 0 }).explain('executionStats')

// -----------------------------------------------------------------------------
// B. WINNING PLAN vs REJECTED PLANS
// -----------------------------------------------------------------------------
// When multiple indexes can satisfy a query, MongoDB Query Optimizer runs candidate plans.
// - "winningPlan": The most efficient plan selected by the optimizer.
// - "rejectedPlans": Alternative candidate plans that were slower.
// - Plan Cache: MongoDB caches the winning plan for future queries with the same pattern.
// db.articles.find({title: "Advanced MongoDB Text Search"}).explain('executionStats')


// =============================================================================
// 📌 QUICK REVISION CHEATSHEET
// =============================================================================
// | Term / Stage | Meaning                                                    |
// |--------------|------------------------------------------------------------|
// | COLLSCAN     | Scanned every document (Bad, slow)                         |
// | IXSCAN       | Scanned only index keys (Good, fast)                       |
// | PROJECTION   | Selected specific fields                                   |
// | ESR Rule     | Equality -> Sort -> Range (Compound index order)           |
// | Covered Query| totalDocsExamined = 0 (Super fast)                         |
// | dropIndexes()| Drops all custom indexes except default _id index          |
// =============================================================================
