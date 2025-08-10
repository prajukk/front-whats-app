import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [sender, setSender] = useState("User");

    useEffect(() => {
        axios.get("http://localhost:5000/messages")
            .then(res => setMessages(res.data))
            .catch(err => console.log(err));

        socket.on("newMessage", (message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => socket.off("newMessage");
    }, []);

    const sendMessage = async () => {
        if (!newMessage) return;
        await axios.post("http://localhost:5000/messages", { sender, message: newMessage });
        setNewMessage("");
    };

    return (
        <div style={{ maxWidth: "600px", margin: "auto", padding: "20px", textAlign: "center" }}>
            <h2>WhatsApp Clone</h2>
            <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
                {messages.map((msg, index) => (
                    <p key={index}><strong>{msg.sender}:</strong> {msg.message}</p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Enter your name"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                style={{ marginBottom: "10px", width: "100%", padding: "5px" }}
            />
            <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                style={{ width: "80%", padding: "5px" }}
            />
            <button onClick={sendMessage} style={{ padding: "5px 10px", marginLeft: "5px" }}>Send</button>
        </div>
    );
}

export default App;
