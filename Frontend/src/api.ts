import axios from "axios";

export const analyzeComplaint = async (description: string) => {
  const res = await axios.post("http://localhost:5000/api/ai/analyze", {
    description,
  });

  return res.data;
};