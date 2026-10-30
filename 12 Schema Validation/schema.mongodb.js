/*
  ============================================================
  CONCEPTS: Schema Validation in MongoDB
  Video Reference: https://youtu.be/WPQ48xYbT2Y
  ============================================================

  1. What is Schema Validation?
     - MongoDB is flexible by default.
     - Schema validation enforces rules directly in the database to prevent bad or missing data.
     - Uses `$jsonSchema` to define types, required fields, and constraints.

  2. Key Keywords in $jsonSchema:
     - bsonType: Specifies the BSON type (e.g. "object", "string", "int", "number", "bool", "date").
       * Note: In MongoDB shell, plain numbers default to "double". For "int", use NumberInt().
     - required: Array of mandatory fields (e.g. ["name", "age"]).
     - properties: Object defining rules for each field.
     - description: Helpful message displayed when validation fails.
     - minimum / maximum: Range bounds for numbers.
     - pattern: Regular expression for string validation.

  3. Nested Object Validation:
     - To validate a child/nested object (like address):
       * Set parent field bsonType to "object".
       * Define its own nested `required` array.
       * Define its own nested `properties` object for the sub-fields.

  4. Key Controls:
     - validationAction:
       * "error" (Default): Rejects the insert/update if invalid.
       * "warn": Logs a warning to the server log but allows the insert/update.
     - validationLevel:
       * "strict" (Default): Validates all inserts and updates.
       * "moderate": Validates inserts and updates to valid documents only.

  5. Useful Commands:
     - Update validation on existing collection:
       db.runCommand({
         collMod: "users",
         validator: { $jsonSchema: { ... } },
         validationAction: "error"
       });
     - Find documents violating schema:
       db.users.find({ $nor: [{ $jsonSchema: { ... } }] });
  ============================================================
*/

// ============================================================
// EXAMPLES (Code Below)
// ============================================================

// 1. Create Collection with Schema Validation & Nested Object
db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "age", "address"],
      properties: {
        name: {
          bsonType: "string",
          description: "name must be a string and is required",
        },
        age: {
          bsonType: "int",
          description: "age must be an integer and is required",
        },
        address: {
          bsonType: "object",
          required: ["city", "pincode"],
          description: "address must be an object with city and pincode",
          properties: {
            city: {
              bsonType: "string",
              description: "city must be a string and is required",
            },
            pincode: {
              bsonType: "int",
              description: "pincode must be an integer and is required",
            },
          },
        },
      },
    },
  },
  validationAction: "error",
});

// 2. Valid Document Insertion (Success)
db.users.insertOne({
  name: "Rohit",
  age: NumberInt(21),
  address: {
    city: "Mumbai",
    pincode: NumberInt(400001),
  },
});

// 3. Invalid Document Insertion Example (Fails validation: age is string, pincode missing)
// db.users.insertOne({
//   name: "Manas",
//   age: "21",
//   address: {
//     city: "Pune",
//   },
// });
