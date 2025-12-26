import { useState } from "react";
import { askAI } from "../utils/api";

export default function Chat({ token }) {
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");

  async function handleAsk() {
    const res = await askAI(text, token);
    setAnswer(res.reply);
  }

  function insertToApp() {
    window.electron.insertText(answer);
  }

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ask AI…"
      />
      <button onClick={handleAsk}>Ask</button>

      {answer && (
        <>
          <pre>{answer}</pre>
          <button onClick={insertToApp}>Insert into app</button>
        </>
      )}
    </div>
  );
}
