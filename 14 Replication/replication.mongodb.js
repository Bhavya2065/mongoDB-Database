 /*
  ============================================================
  COMPREHENSIVE NOTES: Replication in MongoDB
  Video Reference: https://youtu.be/gRfisNNUvG0
  ============================================================

  1. What is Replication?
     - Replication is synchronizing and maintaining identical copies of data
       across multiple MongoDB servers (called nodes or members).
     - A group of MongoDB instances hosting the same dataset is called a "Replica Set".

  2. Why Use Replication?
     - High Availability (HA): Zero downtime even if a server hardware crashes.
     - Automatic Failover: If Primary crashes, Secondaries automatically elect a new Primary.
     - Disaster Recovery: Keep copies of data in different physical locations or data centers.
     - Read Scaling: Offload read-heavy traffic from Primary to Secondary nodes.
     - Zero-Downtime Maintenance: Upgrade or back up nodes without taking down your app.

  3. Architecture of a Replica Set:
     - Primary Node (Leader):
       * Exactly ONE primary exists at any given time.
       * Handles ALL write operations (insert, update, delete).
       * Records all changes sequentially in a capped collection called the Oplog (`local.oplog.rs`).
     - Secondary Nodes (Followers):
       * Continuously tail/read the Primary's Oplog and apply changes locally.
       * Can serve read operations (with appropriate read preferences).
       * Vote in elections and can be promoted to Primary.
     - Arbiter Node (Optional):
       * Does NOT hold data; cannot become Primary.
       * Exists only to cast a vote in elections to break ties (prevents split-brain).
     - Recommended Size:
       * Odd number of voting members (minimum 3: 1 Primary + 2 Secondaries, or 1 Primary + 1 Secondary + 1 Arbiter).
       * Majority rule: Requires (n/2 + 1) healthy nodes to elect/maintain a Primary.

  4. Heartbeats & Automatic Election Workflow:
     - Nodes send heartbeats (ping) to each other every 2 seconds.
     - If the Primary fails to respond within 10 seconds (electionTimeoutMillis):
       1) Secondaries declare the Primary offline.
       2) An election is called.
       3) Secondaries vote; the node with the freshest Oplog and highest priority becomes new Primary.
       4) When the old Primary recovers, it rejoins the replica set as a Secondary.

  5. Read Preferences (Where Queries Go):
     - primary: (Default) All reads go to the Primary.
     - primaryPreferred: Reads from Primary; if unavailable, falls back to Secondary.
     - secondary: Reads go strictly to Secondary nodes.
     - secondaryPreferred: Reads from Secondary first; if all secondaries are down, falls back to Primary.
     - nearest: Reads from the member with the lowest network ping/latency.

  6. Write Concern & Read Concern:
     - Write Concern: How many members must acknowledge a write before returning success.
       * e.g., `{ w: "majority" }` ensures write is safely written to a majority of nodes.
     - Read Concern: Controls isolation level of data returned.
       * e.g., `"majority"` guarantees reading data committed to majority (prevents reading rollbacks).
  ============================================================
*/

// ============================================================
// STEP-BY-STEP SETUP COMMANDS (Run in Terminal / Command Prompt)
// ============================================================

/*
  STEP 1: Create 3 separate data folders on your disk:
    mkdir C:\data\db1 C:\data\db2 C:\data\db3
    (Or create DB1, DB2, DB3 inside your MongoDB data directory)

  STEP 2: Start 3 MongoDB instances in 3 separate Command Prompt windows:
    (Note: Remember the double dash '--' before replSet!)
    Window 1:
      mongod --replSet rs0 --port 27018 --dbpath "C:\data\db1"
    Window 2:
      mongod --replSet rs0 --port 27019 --dbpath "C:\data\db2"
    Window 3:
      mongod --replSet rs0 --port 27020 --dbpath "C:\data\db3"

  STEP 3: Connect mongosh to one of the nodes (e.g. port 27018):
    mongosh --port 27018
*/

// ============================================================
// EXAMPLES & EXECUTABLE COMMANDS (Run in mongosh)
// ============================================================

// 1. Initialize the Replica Set
// Option A: Quick initialize (makes the current node primary)
// rs.initiate();

// Option B: Initialize with all 3 members at once
/*
rs.initiate({
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27018" },
    { _id: 1, host: "localhost:27019" },
    { _id: 2, host: "localhost:27020" }
  ]
});
*/

// 2. Check the Status of the Replica Set
// Shows health, role (PRIMARY/SECONDARY), uptime, and syncSource for each member
// rs.status();

// 3. View Current Configuration
// rs.conf();

// 4. Add or Remove Members Dynamically
// rs.add("localhost:27021");          // Add a new secondary
// rs.addArb("localhost:27022");       // Add an arbiter
// rs.remove("localhost:27021");       // Remove a member

// 5. Change Member Priority (Make a specific node Primary)
// Run on current Primary:
/*
cfg = rs.conf();
cfg.members[0].priority = 2;          // Higher priority (default is 1)
rs.reconfig(cfg);
*/

// 6. Force Current Primary to Step Down (Triggers election)
// rs.stepDown(60);                    // Steps down for 60 seconds

// 7. Connect to the Full Replica Set via mongosh (Terminal command)
// mongosh "mongodb://localhost:27018,localhost:27019,localhost:27020/?replicaSet=rs0"

// 8. Configure Read Preference in mongosh Session
// db.getMongo().setReadPref("secondaryPreferred");

// 9. Verify Current Read Preference Setting
// db.getMongo().getReadPrefMode();    // Returns 'secondaryPreferred'

// 10. Verify Which Server Actually Executed Your Read Query
// db.users.find().explain().serverInfo.port; // Returns 27019 (Secondary port)

// 11. Read Preference for a Single Query
// db.users.find().readPref("secondaryPreferred");

// 12. Write with Majority Write Concern
/*
db.users.insertOne(
  { name: "Aman", role: "Developer" },
  { writeConcern: { w: "majority", wtimeout: 5000 } }
);
*/

// 13. View Summary of Members & Roles (Helpful Shortcut)
/*
rs.status().members.map(m => ({
  name: m.name,
  role: m.stateStr,
  health: m.health === 1 ? "UP" : "DOWN"
}));
*/

// ============================================================
// HOW TO IMPLEMENT A REPLICA SET FROM SCRATCH (STEP-BY-STEP)
// ============================================================

/*
  ============================================================
  STEP 1: Create 3 Separate Data Directories
  ============================================================
  Open Command Prompt (CMD) as Administrator:
    mkdir C:\data\db1
    mkdir C:\data\db2
    mkdir C:\data\db3

  ============================================================
  STEP 2: Start 3 MongoDB Instances in 3 Separate CMD Windows
  ============================================================
  Open Window 1 (Node 1 on port 27018):
    mongod --replSet rs0 --port 27018 --dbpath "C:\data\db1"

  Open Window 2 (Node 2 on port 27019):
    mongod --replSet rs0 --port 27019 --dbpath "C:\data\db2"

  Open Window 3 (Node 3 on port 27020):
    mongod --replSet rs0 --port 27020 --dbpath "C:\data\db3"

  (Keep all 3 terminal windows open and running!)

  ============================================================
  STEP 3: Connect to Any One Node Using mongosh
  ============================================================
  Open Window 4:
    mongosh --port 27018

  ============================================================
  STEP 4: Initiate the Replica Set
  ============================================================
  Inside the mongosh prompt, run:
    rs.initiate({
      _id: "rs0",
      members: [
        { _id: 0, host: "localhost:27018" },
        { _id: 1, host: "localhost:27019" },
        { _id: 2, host: "localhost:27020" }
      ]
    })

  ============================================================
  STEP 5: Verify the Replica Set is Ready
  ============================================================
  Wait 3-5 seconds, then check status:
    rs.status()
  You will see one member become "PRIMARY" and the other two become "SECONDARY".

  ============================================================
  STEP 6: Test Data Replication
  ============================================================
  1. Insert a document into the PRIMARY node:
     use('myDatabase')
     db.products.insertOne({ name: "Laptop", price: 50000 })

  2. Connect to a SECONDARY node in a new terminal:
     mongosh --port 27019
     use('myDatabase')
     db.getMongo().setReadPref("secondary")
     db.products.find()
     (You will see the Laptop document replicated automatically!)

  ============================================================
  STEP 7: Connect Your App / MongoDB Compass
  ============================================================
  Use the full replica set connection URI:
    mongodb://localhost:27018,localhost:27019,localhost:27020/?replicaSet=rs0
*/

