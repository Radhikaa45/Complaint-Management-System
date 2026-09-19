import { useCallback, useEffect, useState } from "react";
import { getComplaints, errorMessage } from "../api";

// Loads all complaints for admin pages; `refresh` refetches, `replace` patches one locally.
export default function useComplaints() {

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      const data = await getComplaints();
      setComplaints(data);
      setError("");
    } catch (err) {
      setError(errorMessage(err, "Could not load complaints"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const replace = useCallback((updated) => {
    setComplaints((list) => list.map((c) => (c._id === updated._id ? updated : c)));
  }, []);

  const remove = useCallback((id) => {
    setComplaints((list) => list.filter((c) => c._id !== id));
  }, []);

  return { complaints, loading, error, refresh, replace, remove };
}
