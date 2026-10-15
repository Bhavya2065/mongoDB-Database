/*
  =============================================================
  NOTE: Database Name Case Sensitivity & Duplicate DB Rules
  =============================================================

  Reason:
  - On Windows and macOS, the file system is case-insensitive.
  - MongoDB stores database files on disk using the DB name.
  - Since Windows treats "test" and "Test" as the same folder/file,
    MongoDB does NOT allow two databases that differ only by uppercase/lowercase.

  Collections & Fields (Case Sensitivity):
  - This restriction applies ONLY to Database names.
  - Collections and Field names ARE case-sensitive and completely allowed!
    - "users" and "Users" are two separate collections.
    - "name" and "Name" are two separate fields.

  Best Practice:
  - Always use lowercase letters for database names (e.g., use('test')).
*/

use('test')

// 1. Database name error: use('Test') -> FAILS if 'test' exists on Windows

// 2. Collection names ARE case-sensitive (WORKS - creates 2 separate collections):
db.users.insertOne({ name: "Raghav" }) // Inserts in 'users' collection
db.Users.insertOne({ name: "Singham" }) // Inserts in 'Users' collection

// 3. Field names ARE case-sensitive (WORKS - creates 2 different fields):
db.users.insertOne({
    name: "Aman",  // lowercase field
    Name: "Aman"   // uppercase field (treated as different field)
})

/*
  =============================================================
  IMPORT & EXPORT COMMANDS (Run in Terminal, NOT in mongosh)
  =============================================================

  1. IMPORT DATA (mongoimport):
  -------------------------------------------------------------
  A. Normal JSON / Line-by-Line (e.g. user1.json):
     - Standard:
       mongoimport --db newdb --collection users --file user1.json
     - Shorthand:
       mongoimport -d newdb -c users --file user1.json

  B. JSON Array of Objects: [ {...}, {...} ] (e.g. user.json):
     - Must add `--jsonArray` flag:
       mongoimport --db newdb --collection users --file user.json --jsonArray
     - Shorthand:
       mongoimport -d newdb -c users --file user.json --jsonArray


  2. EXPORT DATA (mongoexport):
  -------------------------------------------------------------
  A. Normal JSON (Default line-by-line format):
     - Standard:
       mongoexport --db newdb --collection users --out export_users.json
     - Shorthand:
       mongoexport -d newdb -c users --out export_users.json

  B. JSON Array format: [ {...}, {...} ]
     - Add `--jsonArray` flag:
       mongoexport --db newdb --collection users --out export_users.json --jsonArray
     - Shorthand:
       mongoexport -d newdb -c users --out export_users.json --jsonArray
*/



