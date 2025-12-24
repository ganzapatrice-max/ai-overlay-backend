export default function Overlay() {
  const askAI = () => {
    const answer = "Generated AI text";
    window.ai.paste(answer);
  };

  return <button onClick={askAI}>Insert AI</button>;
}
