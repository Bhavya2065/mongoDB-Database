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
// find() returns a Cursor (a pointer, not the data itself)
// const cursor = db.data.find();

// Option A: Read one document at a time
// console.log(cursor.next());      // Fetches the next single document
// console.log(cursor.hasNext());   // Returns true if more documents exist

// Option B: Iterate all documents one by one using a while loop
// while (cursor.hasNext()) {
//     console.log(cursor.next());
// }

// Option C: Convert entire cursor to a JavaScript Array at once
// console.log(cursor.toArray());

// ==========================================
// 4. SORTING (.sort)
// ==========================================
//  1: Ascending order (lowest to highest)
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
// 7. EXECUTION ORDER (sort -> skip -> limit)
// ==========================================
// No matter the order written in code, MongoDB ALWAYS executes:
//   Step 1: sort()  -> Sorts first (e.g. 100 down to 1)
//   Step 2: skip()  -> Ignores first 5 items (100, 99, 98, 97, 96)
//   Step 3: limit() -> Returns next 10 items (95 down to 86)
// db.data.find().sort({ value: -1 }).skip(5).limit(10);

// ==========================================
// 8. DYNAMIC PAGINATION (Loop Through All Pages)
// ==========================================
// Formula: skip = (page - 1) * pageSize
// Total Pages = Math.ceil(totalDocuments / pageSize)

const totalDocuments = db.data.countDocuments();
const pageSize = 3;
const totalPages = Math.ceil(totalDocuments / pageSize);

for (let page = 1; page <= totalPages; page++) {
    // Returns a cursor for each page
    const data_on_page = db.data.find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);

    // .toArray() is a MongoDB method that converts the cursor into a JS Array [ {...}, {...} ]
    console.log(`--- Page ${page} ---`);
    console.log(data_on_page.toArray());
}

