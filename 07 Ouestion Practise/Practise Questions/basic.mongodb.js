// db.users.insertMany([
//     {
//         name: "Rahul Sharma",
//         age: 22,
//         city: "Delhi",
//         email: "rahul@gmail.com",
//         phone: "9876543210",
//         isActive: true
//     },
//     {
//         name: "Priya Singh",
//         age: 27,
//         city: "Mumbai",
//         email: "priya@yahoo.com",
//         isActive: true
//     },
//     {
//         name: "Amit Verma",
//         age: 30,
//         city: "Delhi",
//         email: "amit@gmail.com",
//         phone: "9123456780",
//         isActive: false
//     },
//     {
//         name: "Sneha Gupta",
//         age: 24,
//         city: "Kolkata",
//         email: "sneha@gmail.com",
//         phone: "9988776655",
//         isActive: true
//     },
//     {
//         name: "Rohit Kumar",
//         age: 29,
//         city: "Patna",
//         email: "rohit@yahoo.com",
//         isActive: true
//     },
//     {
//         name: "Ankit Raj",
//         age: 21,
//         city: "Patna",
//         email: "ankit@gmail.com",
//         phone: "8899776655",
//         isActive: false
//     },
//     {
//         name: "Neha Agarwal",
//         age: 26,
//         city: "Delhi",
//         email: "neha@gmail.com",
//         phone: "8877665544",
//         isActive: true
//     },
//     {
//         name: "Riya Das",
//         age: 23,
//         city: "Mumbai",
//         email: "riya@gmail.com",
//         isActive: true
//     },
//     {
//         name: "Karan Malhotra",
//         age: 31,
//         city: "Bangalore",
//         email: "karan@yahoo.com",
//         phone: "9988112233",
//         isActive: false
//     },
//     {
//         name: "Pooja Mishra",
//         age: 28,
//         city: "Lucknow",
//         email: "pooja@gmail.com",
//         phone: "7766554433",
//         isActive: true
//     }
// ])

use('test')

// =============================================================
// BASIC (Assume collection: users)
// =============================================================

// Q1: Find all users from Delhi.
// db.users.find({city: 'Delhi'})

// Q2: Find users whose age is greater than 25
// db.users.find({age: {$gt: 25}})

// Q3: Find users whose age is less than or equal to 30.
// db.users.find({age: {$lte: 30}})

// Q4: Find users whose city is not Mumbai.
// db.users.find({city: {$ne: 'Mumbai'}}) 
// db.users.find({city: {$nin: ['Mumbai']}})

// Q5: Find users whose age is between 20 and 30.
// db.users.find({$and: [{ age: { $gt: 20 } }, { age: { $lt: 30 } }]})
// db.users.find({ age: { $gt: 20, $lt: 30 } })

// Q6: Show only name and email of all users.
// db.users.find({}, { name: 1, email: 1, _id: 0 })

// Q7: Find users whose name starts with "R".
// db.users.find({name: /^R/})
// db.users.find({name: {$regex: '^R'}})

// Q8: Find users whose email contains gmail.
// db.users.find({email: /gmail/i})

// Q9: Find users whose city field exists.
// db.users.find({city: {$exists: true}})

// Q10: Find users whose phone field does not exist.
// db.users.find({phone: {$exists: false}})

// Q11: Sort users by age ascending.
// db.users.find().sort({age: 1})

// Q12: Sort users by age descending.
// db.users.find().sort({age: -1})

// Q13: Show only first 5 users.
// db.users.find().limit(5)

// Q14: Skip first 10 users and show next 5 users.
// db.users.find().skip(10).limit(5)

// Q15: Find users whose age is either 20, 25, or 30.
// db.users.find({ age: { $in: [20, 25, 30] } })

// Q16: Find users whose age is not 20, 25, 30.
// db.users.find({ age: { $nin: [20, 25, 30] } })

// Q17: Count total users in database.
// db.users.countDocuments()
// db.users.find().count()

// Q18: Find users whose name is Rahul Sharma and city is Delhi.
// db.users.find({ name: 'Rahul Sharma', city: 'Delhi' })

// Q19: Find users whose city is Delhi OR Mumbai.
// db.users.find({ $or: [{ city: 'Delhi' }, { city: 'Mumbai' }] })

// Q20: Find users whose age is not greater than 30.
// db.users.find({ age: { $lte: 30 } })
// db.users.find({ age: { $not: { $gt: 30 } } })

// Q21: Find users whose name ends with "a".
// db.users.find({name: /a$/})

// Q22: Find users whose email domain is yahoo.com.
// db.users.find({email: /yahoo\.com$/})

// Q23: Find users whose age field type is number.
// db.users.find({age: {$type: 'number'}})

// Q24: Find users where age is even.
// db.users.find({age: {$mod: [2,0]}})

// Q25: Find users whose name length is greater than 5 characters.
// db.users.find({
//     $expr: {
//         $gt: [{$strLenCP: '$name'}, 5]
//     }
// }) 