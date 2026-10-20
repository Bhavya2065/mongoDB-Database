use('test')

/*
  ==============================================================================
  DATA MODELING: EMBEDDING VS REFERENCING
  ==============================================================================

  1. EMBEDDING (Denormalization - Nested Data)
  ------------------------------------------------------------------------------
  What: Store related data directly inside the same parent document.
  Best for:
    - 1-to-1 or 1-to-few relationships.
    - Data that is frequently read together.
    - Data that does not change often.

  Real-World Examples:
    - User Profile & Address:
        A user has 1 or 2 addresses (Home, Office). You always want the address
        when viewing the user. Storing address inside user document avoids extra joins.
    - Order & Shipping Address:
        An order's shipping address at the moment of purchase should NEVER change
        even if user changes their profile address later. So embed it inside the order!
    - Product & Specifications:
        Specs (weight, color, dimensions) belong only to that product and are
        read together with the product.


  2. REFERENCING (Normalization - Linked IDs)
  ------------------------------------------------------------------------------
  What: Store data in separate collections and link them using IDs (like foreign keys).
  Best for:
    - 1-to-many or many-to-many relationships.
    - Related data is large or grows unbounded (e.g., unlimited logs/comments).
    - Related data is updated frequently in one place.
    - Avoids data duplication.

  Real-World Examples:
    - Students & Courses (Many-to-Many):
        Many students take the same Course. If course price changes from 50k to 60k,
        we update 1 document in 'courses'. If embedded, we would have to update
        thousands of student documents!
    - Authors & Books / Social Media Followers:
        An influencer can have 1 million followers. Embedding 1 million IDs or
        profiles in one document exceeds MongoDB's 16 MB document size limit.
    - E-commerce Orders & Products:
        Products are master records referenced by order items.


  QUICK CHEAT SHEET:
  +--------------------+---------------------------+---------------------------+
  | Feature            | Embedding                 | Referencing               |
  +--------------------+---------------------------+---------------------------+
  | Read Performance   | Very Fast (Single query)  | Slower (Needs $lookup)    |
  | Data Duplication   | Possible duplication      | No duplication (DRY)      |
  | Doc Size Limit     | Must stay under 16MB      | Scalable, no size limit   |
  | Updates            | Slower if duplicated      | Fast (update in 1 place)  |
  +--------------------+---------------------------+---------------------------+
  ==============================================================================
*/


// =============================================================================
// PART 1: EMBEDDING EXAMPLES
// =============================================================================

// 1. Insert documents with embedded courses array
// db.students.insertMany([
//     {
//         _id: 1,
//         name: 'Manas',
//         courses: [
//             {
//                 _id: 1,
//                 name: 'BCA',
//                 price: 50000,
//                 duration: 3
//             },
//             {
//                 _id: 2,
//                 name: 'Graphics Designing',
//                 price: 10000,
//                 duration: 1
//             }
//         ]
//     },
//     {
//         _id: 2,
//         name: 'Manasi',
//         courses: [
//             {
//                 _id: 2,
//                 name: 'Graphics Designing',
//                 price: 10000,
//                 duration: 1
//             }
//         ]
//     }
// ])

// 2. Query embedded documents using $elemMatch
// db.students.find({
//     courses: {
//         $elemMatch: {
//             name: 'BCA'
//         }
//     }
// })

// 3. Insert document with embedded array of address objects
// db.students.insertOne({
//     _id: 3,
//     name: "Mohit",
//     address: [
//         {
//             city: 'Surat',
//             state: 'GJ'
//         }
//     ]
// })

// 4. Update embedded object inside an array:
// NOTE: For array of objects, use positional operator `$` to update the matched item
// db.students.updateOne(
//     {
//         'address.city': 'Surat'
//     },
//     {
//         $set: {
//             'address.$.city': 'Kashi'
//         }
//     }
// )


// =============================================================================
// PART 2: REFERENCING EXAMPLES
// =============================================================================

// 1. Create separate 'courses' master collection
// db.courses.insertMany([
//     {
//         _id: 1,
//         name: 'Graphics Designing',
//         price: 10000,
//         duration: 3
//     },
//     {
//         _id: 2,
//         name: 'BCA',
//         price: 50000,
//         duration: 4
//     }
// ])

// 2. Insert students storing only referenced Course IDs (numbers)
// db.students.insertMany([
//     {
//         _id: 4,
//         name: 'Ankit',
//         courses: [1]
//     },
//     {
//         _id: 5,
//         name: 'Rahul',
//         courses: [1, 2]
//     }
// ])

// 3. Join collections using $lookup (Aggregation):
// NOTE: If 'students' has mixed old (embedded) and new (referenced) documents,
// filter with `"courses.0": { $type: "number" }` to only pick referenced ones.
db.students.aggregate([
    {
        $match: {
            "courses.0": { $type: "number" }
        }
    },
    {
        $lookup: {
            from: "courses",
            localField: "courses",
            foreignField: "_id",
            as: "courseDetails"
        }
    }
])
