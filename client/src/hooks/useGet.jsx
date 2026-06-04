import { useState, useEffect } from "react";
import { get } from "../api/client";

const useGet = (endPoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    get(endPoint)
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [endPoint]);

  return { data, setData, loading, error };
};

export { useGet };
