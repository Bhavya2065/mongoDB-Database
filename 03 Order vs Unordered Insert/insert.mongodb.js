use('testDB')
// db.createCollection('users')
/*
  ==============================
  ORDERED vs UNORDERED INSERT:
  ==============================
  
  1. Ordered Insert (Default: { ordered: true }):
     - Inserts documents one by one in order.
     - If an error happens (e.g. duplicate _id: 1), it STOPS immediately.
     - Remaining documents are NOT inserted.
     
  2. Unordered Insert ({ ordered: false }):
     - MongoDB tries to insert ALL documents.
     - If one fails, it does NOT stop. It continues inserting the rest.

  -------------------------------------------------------------
  Comparison:
  -------------------------------------------------------------
  Feature         | Ordered Insert       | Unordered Insert
  -------------------------------------------------------------
  On Error        | Stops immediately    | Continues inserting rest
  Default         | Yes ({ordered: true})| No ({ordered: false})
  Performance     | Slower               | Faster (Bulk operations)
  -------------------------------------------------------------

  Real World Use Cases:
  - Ordered Insert:
    When data order matters and steps depend on previous ones.
    Example: Banking transactions, ledger records, sequential logs.

  - Unordered Insert:
    When documents are independent and speed matters.
    Example: CSV / Excel bulk data import, Product catalog upload.
*/

// Example 1: Ordered (Default) - Stops at duplicate _id: 1
db.users.insertMany([
    {_id: 1, name: 'mkl1'},
    {_id: 2, name: 'mkl2'},
    {_id: 1, name: 'mkl4'}, // Fails here (duplicate _id) -> Stops!
    {_id: 3, name: 'mkl3'}  // Not inserted
], { ordered: true })

// Example 2: Unordered - Continues even if one fails
db.users.insertMany([
    {_id: 1, name: 'mkl1'},
    {_id: 2, name: 'mkl2'},
    {_id: 1, name: 'mkl4'}, // Fails here, but continues!
    {_id: 3, name: 'mkl3'}  // Inserted successfully
], { ordered: false })

db.users.deleteMany({})