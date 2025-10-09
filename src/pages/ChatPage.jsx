import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/chat.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);

  const questionsWithAnswers = [
    { q: "What is React?", a: "React is a JavaScript library for building user interfaces." },
    { q: "How to use useEffect hook?", a: "useEffect handles side effects like fetching data." },
    { q: "DSA Path: Arrays", a: "Start with traversal, searching, sorting, then 2D arrays." },
    { q: "DSA Path: Linked Lists", a: "Learn singly/doubly linked lists, insertion, deletion." },
    { q: "DSA Path: Trees", a: "Start with binary trees, traversal, then BSTs." },
  ];

  // ✅ Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/messages");
      setMessages(res.data || []);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
    }
  };

  const clearMessages = async () => {
  try {
    await axios.delete("http://localhost:5000/api/messages");
    setMessages([]); // clears UI
  } catch (err) {
    console.error("❌ Clear error:", err.message);
  }
};


  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    chatBoxRef.current?.scrollTo(0, chatBoxRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = async (text, answer = null) => {
    if (!text.trim()) return;

    try {
      // Student message
      await axios.post("http://localhost:5000/api/messages", { sender: "student", text });

      // Mentor reply if available
      if (answer) {
        await axios.post("http://localhost:5000/api/messages", { sender: "mentor", text: answer });
      }

      // Refresh messages after sending
      fetchMessages();
    } catch (err) {
      console.error("❌ Send error:", err.message);
    }
  };

  const handleSend = () => {
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">Mentor Chat</div>

        {/* Chat Messages */}
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, idx) => (
            <div
              key={msg._id || `msg-${idx}`}
              className={`chat-message ${msg.sender === "student" ? "student" : "mentor"}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Predefined Quick Questions */}
        <div className="question-list">
          <h4>Quick Questions / DSA Path:</h4>
          {questionsWithAnswers.map((item, idx) => (
            <button
              key={`q-${idx}`}
              onClick={() => sendMessage(item.q, item.a)}
              className="question-btn"
            >
              {item.q}
            </button>
          ))}
        </div>

        {/* Chat Input + Buttons */}
        <form
          className="chat-input-section"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="chat-buttons">
            <button type="submit" className="send-btn">Send</button>
            {/* ✅ Clear Chat Button */}
            <button type="button" className="clear-btn" onClick={clearMessages}>
              Clear Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
