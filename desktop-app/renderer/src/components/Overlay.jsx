import { useState } from "react";
import { askAI } from "../utils/api";

export default function Chat() {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk() {
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");

    try {
      const res = await askAI(text);
      setAnswer(res.data.reply);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to get AI response"
      );
    } finally {
      setLoading(false);
    }
  }

  function insertToApp() {
    if (!answer) return;
    window.electron.insertText(answer);
  }

  return (
    <div style={{ padding: 10 }}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask AI…"
        rows={4}
        style={{ width: "100%" }}
      />

      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Thinking..." : "Ask AI"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {answer && (
        <>
          <pre style={{ whiteSpace: "pre-wrap" }}>{answer}</pre>
          <button onClick={insertToApp}>
            Insert into active window
          </button>
        </>
      )}
    </div>
  );
}
