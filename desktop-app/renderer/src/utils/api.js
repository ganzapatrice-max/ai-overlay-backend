const API = "http://localhost:5000/api";

export const askAI = async (prompt, token) => {
  const res = await fetch(`${API}/ai/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt }),
  });

  return res.json();
};
