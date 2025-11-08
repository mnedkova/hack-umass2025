import { useParams } from "react-router-dom";
import { useState } from "react";
import { courses } from "../data/courses";

export default function CourseChatPage() {
  const { courseId } = useParams(); // e.g. "CICS110"
  const course = courses.find((c) => c.slug === courseId);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!course) {
    return <div className="p-6 text-red-500">Course not found.</div>;
  }

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("http://localhost:8000/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: course.sagemakerEndpoint,
          prompt: input,
        }),
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let aiMessage = "";

      // Add an empty assistant message to start filling as stream comes in
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        aiMessage += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: aiMessage,
          };
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error contacting AI service." },
      ]);
    } finally {
      setLoading(false);
    }
  };
}
