use("bank");

// without transaction

// db.accounts.insertMany([
//     {
//         _id: 1,
//         name: 'manas',
//         balance: 5000
//     },
//     {
//         _id: 2,
//         name: 'muskan',
//         balance: 2000
//     },
// ])

// try {
//   db.accounts.updateOne({ name: "manas" }, { $inc: { balance: -500 } });

//   throw new Error('Server crashed!!')

//   db.accounts.updateOne({ name: "muskan" }, { $inc: { balance: 500 } });
// } catch (error) {
//   console.log(error);
// }

// db.accounts.find()

// with Transaction

const session = db.getMongo().startSession();
const accounts = session.getDatabase("bank").accounts;

session.startTransaction()

try {
  accounts.updateOne({ name: "manas" }, { $inc: { balance: -500 } });
  console.log("500 deducted from Manas");

  throw new Error("Server Crashed");

  accounts.updateOne({ name: "muskan" }, { $inc: { balance: 500 } });
  console.log("500 added to Muskan");
  session.commitTransaction();
} catch (error) {
    session.abortTransaction();
  console.log(error.message);
  console.log("Transaction rolled back!!");
}

session.endSession();

db.accounts.find()