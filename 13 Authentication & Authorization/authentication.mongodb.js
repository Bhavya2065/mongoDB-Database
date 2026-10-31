/*
  ============================================================
  CONCEPTS: Authentication & Authorization in MongoDB
  Video Reference: https://youtu.be/FUZV0gyEHxI
  ============================================================

  1. Authentication (AuthN) vs. Authorization (AuthZ):
     - Authentication ("Who are you?"):
       * Verifies the user's identity using credentials (username + password).
       * MongoDB uses SCRAM (Salted Challenge Response Authentication Mechanism) by default.
     - Authorization ("What can you do?"):
       * Controls what databases, collections, and actions the user can access.
       * Managed through Role-Based Access Control (RBAC).

  2. How to Enable Access Control / Security:
     - By default, MongoDB has authentication disabled (anyone can connect locally without password).
     - To enable it:
       1) Open the config file (Windows: `C:\Program Files\MongoDB\Server\<version>\bin\mongod.cfg`).
       2) Add or uncomment:
          security:
            authorization: enabled
       3) Restart the MongoDB server:
          - PowerShell (Admin): Restart-Service -Name MongoDB
          - Or Windows Services: `services.msc` -> MongoDB -> Restart.

  3. Built-in MongoDB Roles Summary:
     - Database Specific:
       * read: Can only read data in that specific database.
       * readWrite: Can read and modify data in that specific database.
       * dbAdmin: Administrative tasks (indexes, stats) on that database.
       * userAdmin: Manage users and custom roles for that database.
       * dbOwner: Full control of that database (readWrite + dbAdmin + userAdmin).
     - All Databases (Apply across server, defined on 'admin' db):
       * readAnyDatabase: Can read data from any database.
       * readWriteAnyDatabase: Can read and write data in all databases.
       * userAdminAnyDatabase: Manage users on all databases.
       * dbAdminAnyDatabase: Admin tasks on all databases.
     - Superuser:
       * root: Complete, unrestricted access to the entire server.

  4. Connecting with Authenticated Users:
     - Shell (mongosh):
       mongosh -u <username> -p <password> --authenticationDatabase admin
     - MongoDB Compass / Connection String URI:
       mongodb://<username>:<password>@localhost:27017/?authSource=admin

  5. Check Current Connection & Roles:
     - Command: db.runCommand({ connectionStatus: 1 })
     - Returns details about the current connection:
       * authenticatedUsers: Shows who is currently logged in.
       * authenticatedUserRoles: Shows what roles/permissions you currently have.
     - Can be executed by any user (does not require admin privileges).
  ============================================================
*/

// ============================================================
// EXAMPLES & COMMANDS (Code Below)
// ============================================================

// 1. Switch to the admin database (all global admins must be created here)
use("admin");

// 2. Create a Root / Superuser (Do this BEFORE enabling authorization)
db.createUser({
  user: "adminUser",
  pwd: "adminPassword123",
  roles: [{ role: "root", db: "admin" }],
});

// 3. Create a Read-Only User for 'admin' database
db.createUser({
  user: "rahul",
  pwd: "rahulPassword123",
  roles: [{ role: "read", db: "admin" }],
});

// 4. Create a User with Read & Write access to a specific database (e.g. 'school')
db.createUser({
  user: "schoolManager",
  pwd: "schoolPassword123",
  roles: [{ role: "readWrite", db: "school" }],
});

// 5. Create a User with access to Read ALL databases
db.createUser({
  user: "globalReader",
  pwd: "readerPassword123",
  roles: [{ role: "readAnyDatabase", db: "admin" }],
});

// 6. Authenticate in current shell session
// db.auth("adminUser", "adminPassword123");

// 7. View existing users in the current database
// db.getUsers();

// 8. Update user roles (e.g. give rahul readWrite on school db too)
// db.updateUser("rahul", {
//   roles: [
//     { role: "read", db: "admin" },
//     { role: "readWrite", db: "school" },
//   ],
// });

// 9. Change a user's password
// db.changeUserPassword("rahul", "newPassword123");

// 10. Drop / Delete a user
// db.dropUser("rahul");

// 11. Check currently logged-in user and active roles
// db.runCommand({ connectionStatus: 1 });

