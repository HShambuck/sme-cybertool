// src/services/security.js
import { securityAPI } from "./api";

/**
 * Analyze website security
 * @param {string} url - Website URL to analyze
 * @returns {Promise} Analysis results
 */
export const analyzeWebsite = async (url) => {
  try {
    console.log("🔍 Analyzing website:", url);
    const response = await securityAPI.analyzeWebsite(url);
    console.log("✅ Analysis complete:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Website analysis failed:", error);
    throw error;
  }
};

/**
 * Get scan history for current user
 * @param {number} limit - Number of scans to retrieve (default: 10)
 * @returns {Promise} Array of scan records
 */
export const getScanHistory = async (limit = 10) => {
  try {
    console.log(`📊 Fetching scan history (limit: ${limit})`);
    const response = await securityAPI.getScanHistory(limit);
    console.log(`✅ Retrieved ${response.data.scans.length} scans`);
    return response.data.scans;
  } catch (error) {
    console.error("❌ Failed to fetch scan history:", error);
    throw error;
  }
};

/**
 * Get scan statistics for current user
 * @returns {Promise} Scan statistics object
 */
export const getScanStats = async () => {
  try {
    console.log("📈 Fetching scan statistics");
    const response = await securityAPI.getScanStats();
    console.log("✅ Scan stats:", response.data.stats);
    return response.data.stats;
  } catch (error) {
    console.error("❌ Failed to fetch scan stats:", error);
    throw error;
  }
};
