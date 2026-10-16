// ==========================================
// 1. SELECT DATABASE
// ==========================================
use('test');

// ==========================================
// 2. INSERT SAMPLE DATA (Run once if needed)
// ==========================================
// for (let i = 0; i < 100; i++) {
//     db.data.insertOne({ value: i + 1 });
// }

// ==========================================
// 3. CURSOR BASICS (Iterating Documents)
// ==========================================
// const cursor = db.data.find();
// console.log(cursor);
// console.log(cursor.next());      // Gets the next document
// console.log(cursor.hasNext());   // Returns true if more documents exist

// Iterate all documents with while loop:
// while (cursor.hasNext()) {
//     console.log(cursor.next());
// }

// ==========================================
// 4. SORTING (.sort)
// ==========================================
// 1: Ascending order (lowest to highest)
// -1: Descending order (highest to lowest)
// db.data.find().sort({ value: 1 });
// db.data.find().sort({ value: -1 });

// ==========================================
// 5. LIMITING (.limit)
// ==========================================
// Returns only the first 5 documents
// db.data.find().limit(5);

// ==========================================
// 6. SKIPPING (.skip)
// ==========================================
// Skips the first 50 documents
// db.data.find().skip(50);

// ==========================================
// 7. PAGINATION (Chaining: sort + skip + limit)
// ==========================================
// MongoDB ALWAYS executes in this fixed order:
//   Step 1: sort()  -> Sorts descending (100, 99, 98, ...)
//   Step 2: skip()  -> Ignores first 5 items (100, 99, 98, 97, 96)
//   Step 3: limit() -> Returns next 10 items (95 down to 86)
db.data.find().sort({ value: -1 }).skip(5).limit(10);