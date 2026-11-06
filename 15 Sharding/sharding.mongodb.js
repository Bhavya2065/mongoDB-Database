/*
  ============================================================
  COMPREHENSIVE NOTES: Sharding in MongoDB
  Video Reference: https://youtu.be/DOXW8O3xJj0
  ============================================================

  1. What is Sharding?
     - Sharding is MongoDB's method for HORIZONTAL SCALING (scaling out).
     - It partitions large datasets and distributes them across multiple independent servers/clusters (shards).
     - Vertical Scaling (Scale Up): Adding more CPU, RAM, or SSD to a single server (has physical and cost limits).
     - Horizontal Scaling (Scale Out): Adding more machines to share the data and load.

  2. Core Architecture of a Sharded Cluster:
     A sharded cluster consists of 3 essential components:
     
     a) Shards (Data Nodes):
        - Each shard stores a subset of the sharded data.
        - In production, each shard MUST be deployed as a Replica Set for high availability and redundancy.
     
     b) Config Servers:
        - Store cluster metadata and configuration settings (which chunks live on which shard).
        - In production, config servers are deployed as a 3-member Replica Set.
        - Must be started with `--configsvr`.
     
     c) Query Router (mongos):
        - A lightweight proxy/routing service that acts as the entry point for applications.
        - Applications connect to `mongos` exactly like a standard `mongod` instance.
        - `mongos` consults the Config Server to route read/write operations to the correct shard(s).
        - No data is stored inside `mongos`.

  3. Shard Key (The Partitioning Strategy):
     - A field (or compound fields) indexed in the collection that MongoDB uses to divide documents into chunks.
     - Strategies:
       * Hashed Sharding:
         - MongoDB computes a hash of the shard key field (e.g. `{ _id: "hashed" }`).
         - Ensures completely even distribution across all shards.
         - Best for random writes and avoiding write hotspots.
       * Ranged Sharding:
         - Documents grouped by value ranges (e.g. `{ createdAt: 1 }` or `{ age: 1 }`).
         - Highly efficient for range queries (e.g. `createdAt >= '2026-01-01'`).
         - Risk: Monotonically increasing keys (like timestamps or auto IDs) cause all writes to hit only 1 shard (hotspot).

  4. Chunks and The Balancer:
     - Chunks: MongoDB divides sharded data into chunks (default chunk size is 64 MB, configurable).
     - Balancer: An internal background process running on the Config Server Primary that automatically
       migrates chunks from overloaded shards to underloaded shards to maintain balance.
  ============================================================
*/

// ============================================================
// PRACTICAL STEP-BY-STEP IMPLEMENTATION (Run in Terminal / CMD)
// ============================================================

/*
  ============================================================
  STEP 1: Create Directories for Config Server and 2 Shards
  ============================================================
  Open Command Prompt (CMD) as Administrator and run:
    mkdir C:\data\configdb
    mkdir C:\data\shard1
    mkdir C:\data\shard2

  ============================================================
  STEP 2: Start the Config Server (Window 1)
  ============================================================
  Open Command Prompt Window 1:
    mongod --configsvr --replSet cfgRS --port 27019 --dbpath "C:\data\configdb"

  ============================================================
  STEP 3: Initialize the Config Server Replica Set (Window 2)
  ============================================================
  Open Command Prompt Window 2:
    mongosh --port 27019
    > rs.initiate({ _id: "cfgRS", configsvr: true, members: [{ _id: 0, host: "localhost:27019" }] })
    > exit

  ============================================================
  STEP 4: Start Shard 1 (Window 3)
  ============================================================
  Open Command Prompt Window 3:
    mongod --shardsvr --replSet shard1RS --port 27018 --dbpath "C:\data\shard1"

  Initialize Shard 1:
  In another terminal:
    mongosh --port 27018
    > rs.initiate({ _id: "shard1RS", members: [{ _id: 0, host: "localhost:27018" }] })
    > exit

  ============================================================
  STEP 5: Start Shard 2 (Window 4)
  ============================================================
  Open Command Prompt Window 4:
    mongod --shardsvr --replSet shard2RS --port 27028 --dbpath "C:\data\shard2"

  Initialize Shard 2:
  In another terminal:
    mongosh --port 27028
    > rs.initiate({ _id: "shard2RS", members: [{ _id: 0, host: "localhost:27028" }] })
    > exit

  ============================================================
  STEP 6: Start the mongos Query Router (Window 5)
  ============================================================
  Open Command Prompt Window 5:
    mongos --configdb cfgRS/localhost:27019 --port 27017

  ============================================================
  STEP 7: Connect to the Sharded Cluster via mongos (Window 6)
  ============================================================
  Open Command Prompt Window 6:
    mongosh --port 27017
    (Now run the executable commands below!)
*/

// ============================================================
// EXECUTABLE COMMANDS (Run inside mongosh connected to mongos :27017)
// ============================================================

// 1. Add Shards to the Cluster
// sh.addShard("shard1RS/localhost:27018");
// sh.addShard("shard2RS/localhost:27028");

// 2. Verify Shards are Added Successfully
// sh.status();

// 3. Enable Sharding on a Database (e.g., 'ecommerce')
// sh.enableSharding("ecommerce");

// 4. Shard a Collection with Hashed Shard Key (Even Distribution)
// sh.shardCollection("ecommerce.users", { _id: "hashed" });

// 4b. Or Shard a Collection with Ranged Shard Key (e.g., on age or region)
// First create an index on the shard key:
// db.users.createIndex({ age: 1 });
// Then shard it:
// sh.shardCollection("ecommerce.users", { age: 1 });

// 5. Insert Sample Data to Test Distribution Across Shards
/*
use("ecommerce");
for (let i = 1; i <= 5000; i++) {
  db.users.insertOne({
    name: "User_" + i,
    age: Math.floor(Math.random() * 60) + 18,
    createdAt: new Date()
  });
}
*/

// 6. Check Data Distribution Across Shards
// Shows how many documents and chunks live on Shard 1 vs Shard 2
// db.users.getShardDistribution();

// 7. Check Cluster Status & Chunks
// sh.status();

// 8. Useful Balancer Management Commands
// sh.getBalancerState();  // Returns true if balancer is active
// sh.stopBalancer();      // Pause automatic migrations during maintenance
// sh.startBalancer();     // Resume automatic migrations
