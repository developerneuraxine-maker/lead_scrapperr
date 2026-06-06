import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  // 6 minutes — Apify scraping takes 2-4 minutes to complete
  timeout: 360000,
});

// Search for real businesses via Apify
export async function searchLeads(keyword, city) {
  try {
    const res = await API.post("/api/search", { keyword, city });
    return res.data;
  } catch (err) {
    if (
      err.code === "ECONNABORTED" ||
      err.code === "ERR_NETWORK" ||
      err.message?.includes("timeout") ||
      err.message?.includes("Network Error")
    ) {
      throw new Error(
        "Server is waking up from sleep. Please wait 30 seconds and try again. This only happens on the first search after a long break."
      );
    }
    throw err;
  }
}

// Export results to Excel
export async function exportLeads(results, keyword, city) {
  const res = await API.post(
    "/api/export",
    { results, keyword, city },
    { responseType: "blob", timeout: 30000 }
  );
  const url  = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href  = url;
  link.setAttribute("download", `LeadFinder_${keyword}_${city}_${Date.now()}.xlsx`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// Get analytics
export async function getAnalytics() {
  const res = await API.get("/api/analytics", { timeout: 15000 });
  return res.data;
}

export default API;
