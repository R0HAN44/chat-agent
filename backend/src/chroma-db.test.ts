// src/chroma-db.test.ts
import { ChromaClient } from "chromadb";

async function testChromaConnection() {
  const client = new ChromaClient({
    host: "localhost",
    port: 8001,
    ssl: false,
  });

  // Custom embedding function to avoid the default embedding dependency
  const customEmbeddingFunction = {
    generate: async (texts: string[]) => {
      // Simple dummy embeddings for testing (in production, use your actual embeddings)
      return texts.map(() => Array.from({ length: 384 }, () => Math.random() - 0.5));
    },
  };

  try {
    console.log("Testing ChromaDB connection on port 8001...");
    
    // Test 1: Heartbeat
    console.log("1. Testing heartbeat...");
    const heartbeat = await client.heartbeat();
    console.log("✅ Heartbeat successful:", heartbeat);

    // Test 2: Get version
    console.log("2. Getting version...");
    const version = await client.version();
    console.log("✅ ChromaDB version:", version);

    // Test 3: List collections
    console.log("3. Listing collections...");
    const collections = await client.listCollections();
    console.log("✅ Collections found:", collections.length);

    // Test 4: Create a test collection with custom embedding function
    console.log("4. Creating test collection...");
    const testCollectionName = "test_collection_" + Date.now();
    const testCollection = await client.getOrCreateCollection({
      name: testCollectionName,
      embeddingFunction: customEmbeddingFunction,
    });
    console.log("✅ Test collection created:", testCollection.name);

    // Test 5: Add a test document
    console.log("5. Adding test document...");
    await testCollection.add({
      ids: ["test1"],
      documents: ["This is a test document"],
      metadatas: [{ source: "test" }],
    });
    console.log("✅ Test document added");

    // Test 6: Query the collection
    console.log("6. Querying collection...");
    const results = await testCollection.query({
      queryTexts: ["test document"],
      nResults: 1,
    });
    console.log("✅ Query successful, found", results.documents[0]?.length || 0, "results");

    // Clean up
    console.log("7. Cleaning up test collection...");
    await client.deleteCollection({ name: testCollectionName });
    console.log("✅ Test collection deleted");

    console.log("\n🎉 All ChromaDB tests passed successfully!");
    return true;

  } catch (error: any) {
    console.error("❌ ChromaDB test failed:", error.message);
    console.error("Full error:", error);
    
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Check if ChromaDB is running: curl http://localhost:8001/api/v1/version");
    console.log("2. Start ChromaDB: docker-compose up -d");
    console.log("3. Check Docker logs: docker-compose logs chromadb");
    console.log("4. Check if port 8001 is available: lsof -i :8001");
    
    return false;
  }
}

// Run the test
console.log("🚀 Starting ChromaDB connection test...\n");
testChromaConnection()
  .then((success) => {
    console.log(success ? "\n✅ Test completed successfully" : "\n❌ Test failed");
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("\n💥 Unexpected error:", error);
    process.exit(1);
  });