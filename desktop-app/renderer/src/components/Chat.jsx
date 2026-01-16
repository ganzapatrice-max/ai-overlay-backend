import { useState } from "react";
import { askAI } from "../utils/api";

export default function Chat() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await askAI(prompt);
      setAnswer(res.data.answer || "No response from AI.");
    } catch (err) {
      console.error(err);
      setAnswer("❌ Failed to contact AI service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Ask AI</h3>

      <textarea
        placeholder="Type your question here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={sendPrompt} disabled={loading}>
        {loading ? "Thinking..." : "Ask"}
      </button>

      {answer && (
        <>
          <h4>Answer:</h4>
          <textarea readOnly value={answer} />

          <button onClick={() => window.electron.insertText(answer)}>
            Insert into current app
          </button>

          <button onClick={() => window.electron.hideOverlay()}>
            Hide Overlay
          </button>
        </>
      )}
    </div>
  );
}
