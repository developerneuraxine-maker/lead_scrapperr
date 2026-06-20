import { useState, useCallback } from "react";
import { searchLeads } from "../services/api";

export function useSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastSearch, setLastSearch] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const search = useCallback(async (keyword, city, forceRefresh = false) => {
    if (!keyword.trim() || !city.trim()) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setLoadingStep(0);

    // Animate loading steps
    const stepTimings = [300, 800, 1400, 2000, 2600, 3000];
    const timers = stepTimings.map((t, i) =>
      setTimeout(() => setLoadingStep(i + 1), t)
    );

    try {
      const data = await searchLeads(keyword.trim(), city.trim(), forceRefresh);
      timers.forEach(clearTimeout);
      setResults(data.results || []);
      setLastSearch({ keyword: keyword.trim(), city: city.trim(), total: data.total });
    } catch (err) {
      timers.forEach(clearTimeout);
      let errorMsg = "Search failed. Please check your connection and try again.";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data.error === "string") {
          errorMsg = data.error;
        } else if (data.error && typeof data.error === "object") {
          errorMsg = data.error.message || data.error.error || JSON.stringify(data.error);
        } else if (typeof data === "string") {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        }
      } else if (err.message) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  }, []);

  return { results, loading, error, lastSearch, loadingStep, search };
}
