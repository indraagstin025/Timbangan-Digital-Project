import { useState, useEffect } from 'react';
import { getCowPrediction, getCowWeights } from '../api/cowApi';

/**
 * Custom hook to fetch prediction data and weight history for a specific cow
 * @param {number|string} cowId - The database ID of the selected cow
 */
export function useCowDetail(cowId) {
  const [predictionData, setPredictionData] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [recentWeighings, setRecentWeighings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!cowId) {
      setPredictionData(null);
      setWeightHistory([]);
      setRecentWeighings([]);
      return;
    }

    setIsLoading(true);
    Promise.all([
      getCowPrediction(cowId, 30),
      getCowWeights(cowId)
    ])
    .then(([predRes, weightRes]) => {
      if (predRes.success) {
        setPredictionData(predRes.data);
      }
      if (weightRes.success) {
        // Sort weights by date descending to get the 3 most recent
        const sorted = [...weightRes.data].sort(
          (a, b) => new Date(b.measurement_date) - new Date(a.measurement_date)
        );
        setRecentWeighings(sorted.slice(0, 3));

        // Format weights for chart rendering
        const formatted = weightRes.data.map((w) => {
          const date = new Date(w.measurement_date);
          return {
            name: date.toLocaleDateString('id-ID', { month: 'short' }),
            weight: w.weight,
            isPrediction: false
          };
        });
        setWeightHistory(formatted);
      }
    })
    .catch((err) => console.error('Failed fetching detail data', err))
    .finally(() => setIsLoading(false));
  }, [cowId]);

  return {
    predictionData,
    weightHistory,
    recentWeighings,
    isLoading
  };
}
