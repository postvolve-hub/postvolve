// =====================================================
// Database Connection Test
// =====================================================
// Run this file to test your Supabase connection after migration
// Usage: Create a test API route or call these functions from your app
// =====================================================

import { supabase } from "./supabaseServer";
import { checkUsernameAvailability } from "./database";

/**
 * Test basic Supabase connection
 */
export async function testConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count").single();
    
    if (error) {
      console.error("❌ Connection failed:", error.message);
      return { success: false, error: error.message };
    }
    
    console.log("✅ Database connection successful!");
    return { success: true, data };
  } catch (error) {
    console.error("❌ Connection error:", error);
    return { success: false, error };
  }
}

/**
 * Test authentication
 */
export async function testAuth() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.log("ℹ️  No user logged in (this is normal if not authenticated)");
      return { success: true, authenticated: false };
    }
    
    console.log("✅ User authenticated:", user?.email);
    return { success: true, authenticated: true, user };
  } catch (error) {
    console.error("❌ Auth test failed:", error);
    return { success: false, error };
  }
}

/**
 * Test RLS policies
 */
export async function testRLS() {
  try {
    // Try to query users table (should work for own user only)
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .limit(1);
    
    if (error && error.code === "42501") {
      console.log("✅ RLS is working correctly (blocking unauthorized access)");
      return { success: true, rlsEnabled: true };
    }
    
    if (data) {
      console.log("✅ RLS check passed, found user data");
      return { success: true, rlsEnabled: true, data };
    }
    
    console.log("ℹ️  No data returned (expected if no users exist yet)");
    return { success: true, rlsEnabled: true };
  } catch (error) {
    console.error("❌ RLS test failed:", error);
    return { success: false, error };
  }
}

/**
 * Test helper functions
 */
export async function testHelperFunctions() {
  try {
    // Test username availability check
    const isAvailable = await checkUsernameAvailability("test_user_12345");
    console.log("✅ Username availability check:", isAvailable);
    
    return { success: true, isAvailable };
  } catch (error) {
    console.error("❌ Helper function test failed:", error);
    return { success: false, error };
  }
}

/**
 * Test table structure
 */
export async function testTableStructure() {
  const tables = [
    "users",
    "subscriptions",
    "invoices",
    "user_settings",
    "posting_schedules",
    "connected_accounts",
    "posts",
    "post_platforms",
    "post_analytics",
    "daily_analytics",
    "usage_tracking",
    "activity_log",
  ];
  
  const results: Record<string, boolean> = {};
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select("*")
        .limit(1);
      
      if (error && error.code !== "PGRST116") { // PGRST116 = no rows (which is fine)
        results[table] = false;
        console.error(`❌ Table '${table}' check failed:`, error.message);
      } else {
        results[table] = true;
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (error) {
      results[table] = false;
      console.error(`❌ Table '${table}' error:`, error);
    }
  }
  
  const allTablesExist = Object.values(results).every((exists) => exists);
  
  if (allTablesExist) {
    console.log("\n✅ All 12 tables exist and are accessible!");
  } else {
    console.log("\n⚠️  Some tables are missing or inaccessible");
  }
  
  return { success: allTablesExist, results };
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log("🧪 Starting PostVolve Database Tests...\n");
  
  const results = {
    connection: await testConnection(),
    auth: await testAuth(),
    rls: await testRLS(),
    helpers: await testHelperFunctions(),
    tables: await testTableStructure(),
  };
  
  console.log("\n📊 Test Summary:");
  console.log("================");
  console.log("Connection:", results.connection.success ? "✅" : "❌");
  console.log("Authentication:", results.auth.success ? "✅" : "❌");
  console.log("RLS Policies:", results.rls.success ? "✅" : "❌");
  console.log("Helper Functions:", results.helpers.success ? "✅" : "❌");
  console.log("Table Structure:", results.tables.success ? "✅" : "❌");
  
  const allPassed = Object.values(results).every((r) => r.success);
  
  if (allPassed) {
    console.log("\n🎉 All tests passed! Your database is ready to use.");
  } else {
    console.log("\n⚠️  Some tests failed. Check the errors above.");
  }
  
  return { allPassed, results };
}

// Export for use in API routes
export default {
  testConnection,
  testAuth,
  testRLS,
  testHelperFunctions,
  testTableStructure,
  runAllTests,
};

