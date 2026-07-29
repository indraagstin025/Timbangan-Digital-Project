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

  const fetchData = () => {
    if (!cowId) {
      setPredictionData(null);
      setWeightHistory([]);
      setRecentWeighings([]);
      return;
    }

    setIsLoading(true);
    Promise.all([
      getCowPrediction(cowId, 90),
      getCowWeights(cowId)
    ])
    .then(([predRes, weightRes]) => {
      if (predRes.success) {
        setPredictionData(predRes.data);
      } else {
        setPredictionData(null);
      }
      if (weightRes.success) {
        const sorted = [...weightRes.data].sort(
          (a, b) => new Date(b.measurement_date) - new Date(a.measurement_date)
        );
        setRecentWeighings(sorted.slice(0, 3));

        const formatted = weightRes.data.map((w) => {
          const date = new Date(w.measurement_date);
          return {
            name: date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
            weight: w.weight,
            isPrediction: false
          };
        });
        setWeightHistory(formatted);
      }
    })
    .catch((err) => console.error('Failed fetching detail data', err))
    .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [cowId]);

  return {
    predictionData,
    weightHistory,
    recentWeighings,
    isLoading,
    refetchData: fetchData
  };
}
