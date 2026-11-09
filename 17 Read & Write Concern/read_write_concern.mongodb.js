/*
  ============================================================
  COMPREHENSIVE NOTES: Read & Write Concern in MongoDB
  Video Reference: https://youtu.be/8Z3phVIE2js
  ============================================================

  1. What is Write Concern?
     - Write Concern describes the level of acknowledgment requested from MongoDB
       for write operations (insert, update, delete) before returning success to the client.
     - It balances WRITE SPEED vs. DATA DURABILITY (safety against server crashes).

  2. Write Concern Options:
     Syntax: { writeConcern: { w: <value>, j: <boolean>, wtimeout: <number> } }

     a) 'w' (Acknowledgment Level):
        - w: 0 (Unacknowledged / Fire & Forget):
          * The client sends the write and does not wait for any response.
          * Fastest performance, but highest risk (you won't know if the write failed or crashed).
        - w: 1 (Primary Acknowledged):
          * Writes are acknowledged as soon as the PRIMARY node commits to memory.
          * Risk: If Primary crashes before replicating to Secondaries, this data can be ROLLED BACK.
        - w: "majority" (Default in modern MongoDB):
          * Acknowledged only after a calculated MAJORITY of voting nodes have written the data.
          * Guarantees data will NEVER be lost or rolled back, even if Primary fails!
        - w: <number> (e.g. w: 2, w: 3):
          * Waits for acknowledgment from a specific number of replica set members.

     b) 'j' (Journaling - Disk Durability):
        - j: true:
          * Forces MongoDB to write the operation to the on-disk journal file before returning success.
          * Protects against complete hardware/power failure.
        - j: false (or omitted):
          * Acknowledges after writing to in-memory storage engine (flushed to disk periodically).

     c) 'wtimeout' (Time Limit in milliseconds):
        - Prevents write operations from blocking indefinitely if replica nodes are offline or unreachable.
        - e.g., wtimeout: 5000 (aborts waiting after 5 seconds with a timeout error, but write may still apply).

  3. What is Read Concern?
     - Read Concern controls the level of consistency and isolation for data returned by read operations.
     - It determines whether your query reads the freshest data, data safe from rollbacks, or point-in-time snapshots.

  4. Read Concern Levels:
     - "local" (Default):
       * Returns the most recent data on the queried node.
       * Fast, but data is NOT guaranteed to be on a majority (vulnerable to rollbacks if Primary crashes).
     - "available":
       * Similar to "local", but optimized for sharded clusters (may return orphaned documents during chunk migrations).
     - "majority":
       * Returns only data that has been acknowledged by a MAJORITY of replica set members.
       * Guarantees data is committed and will NEVER be rolled back!
     - "linearizable":
       * Strongest consistency level.
       * The node confirms in real-time with the majority that it is still the true Primary before returning data.
       * Prevents "stale reads" in split-brain scenarios (slower, Primary only).
     - "snapshot":
       * Used inside multi-document transactions to provide a consistent point-in-time view of the database.

  5. Difference Between Key Terms:
     - Write Concern  = "How safely must data be written before confirming success?"
     - Read Preference = "WHICH node should execute the read query? (Primary vs Secondary)"
     - Read Concern   = "HOW CONSISTENT / DURABLE must the read data be?"
  ============================================================
*/

// ============================================================
// EXAMPLES & EXECUTABLE COMMANDS (Run in mongosh)
// ============================================================

use("bank");

// ------------------------------------------------------------
// PART 1: WRITE CONCERN EXAMPLES
// ------------------------------------------------------------

// 1. Fast & Unacknowledged Write (w: 0)
// Use Case: High-volume logs, temporary metrics where losing a record is acceptable
db.logs.insertOne(
  { event: "PAGE_VIEW", url: "/home", timestamp: new Date() },
  { writeConcern: { w: 0 } }
);

// 2. Primary Only Write (w: 1)
// Acknowledged by Primary only
db.accounts.insertOne(
  { name: "John", balance: 1000 },
  { writeConcern: { w: 1 } }
);

// 3. Majority Write with Journaling & Timeout (Recommended for Critical Data)
// Guarantees durability: written to majority nodes + written to disk journal
db.accounts.insertOne(
  { name: "Alice", balance: 5000 },
  {
    writeConcern: {
      w: "majority",
      j: true,
      wtimeout: 5000, // wait at most 5 seconds
    },
  }
);

// 4. Update with Write Concern
db.accounts.updateOne(
  { name: "Alice" },
  { $inc: { balance: -500 } },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);

// ------------------------------------------------------------
// PART 2: READ CONCERN EXAMPLES
// ------------------------------------------------------------

// 1. Default Read (local)
// Fastest read, but might read data that hasn't been replicated to majority
db.accounts.find({ name: "Alice" }).readConcern("local");

// 2. Majority Read Concern (Safe from Rollbacks)
// Guarantees you only read data confirmed by a majority of nodes
db.accounts.find({ name: "Alice" }).readConcern("majority");

// 3. Linearizable Read Concern (Strongest, Primary only)
// Guarantees the absolute freshest real-time data
db.accounts.find({ name: "Alice" }).readConcern("linearizable");

// ------------------------------------------------------------
// PART 3: COMBINING READ PREFERENCE & READ CONCERN
// ------------------------------------------------------------

// Read from a Secondary node, but ONLY read data committed by majority
db.accounts
  .find({ name: "Alice" })
  .readPref("secondaryPreferred")
  .readConcern("majority");

// ------------------------------------------------------------
// PART 4: SET DEFAULT WRITE CONCERN FOR THE WHOLE REPLICA SET
// ------------------------------------------------------------
/*
// Run on Primary node in mongosh:
cfg = rs.conf();
cfg.settings = cfg.settings || {};
cfg.settings.getLastErrorDefaults = {
  w: "majority",
  wtimeout: 5000
};
rs.reconfig(cfg);
*/
