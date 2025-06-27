import { useState, useRef, useEffect } from 'react';
import './Chat.css';
import { Image, Send, ArrowLeft } from 'lucide-react';

// Improved formatText: handles *, **, ***, newlines, and paragraphs
const formatText = (text) => {
  if (!text) return "";
  let formatted = text
    .replace(/\*\*\*(.*?)\*\*\*/g, '<b><i>$1</i></b>') // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Bold
    .replace(/\*(.*?)\*/g, '<i>$1</i>'); // Italic

  // Split into paragraphs by double newlines, then replace single newlines with <br>
  formatted = formatted
    .split(/\n{2,}/)
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('');
  return formatted;
};

function Chat({ onBackToHome }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const userMessage = { sender: 'user', text: input, file: file?.name || null, time: formatTime() };
    setMessages((prev) => [...prev, userMessage]);

    const formData = new FormData();
    formData.append('message', input);
    if (file) formData.append('file', file);

    setInput('');
    setFile(null);
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_URL || 'http://localhost:3000'}/chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        sender: 'gemini',
        text: formatText(data.reply),
        time: formatTime(),
        isFormatted: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { sender: 'gemini', text: formatText('Error: Unable to get a response.'), time: formatTime(), isFormatted: true };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Chat Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">
            <span className="text-blue-600">Nutrition</span>
            <span className="text-green-600">Assistant</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Ask any nutrition or health questions and get personalized advice
          </p>
        </div>
        
        {/* Chat Container */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6 overflow-hidden">
          {/* Messages Area */}
          <div className="chat-messages h-[60vh] overflow-y-auto p-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-2xl px-4 py-3 shadow-sm`}>
                  {msg.isFormatted ? (
                    <div
                      className="formatted-text"
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    />
                  ) : (
                    <div>{msg.text}</div>
                  )}
                  {msg.file && (
                    <div className="text-xs opacity-80 mt-1 flex items-center">
                      <span className="mr-1">📎</span>
                      {msg.file}
                    </div>
                  )}
                  <div className={`text-xs ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'} mt-1 text-right`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            {file && (
              <div className="mb-2 py-1 px-3 bg-blue-50 text-blue-600 rounded-full text-sm inline-flex items-center">
                <span className="mr-1">📎</span>
                {file.name}
                <button 
                  onClick={() => setFile(null)} 
                  className="ml-2 text-blue-400 hover:text-blue-600"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="w-full px-4 py-3 rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              
              <label className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full cursor-pointer transition-colors">
                <Image className="w-5 h-5" />
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              
              <button 
                onClick={sendMessage}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Tips Section */}
        <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800 mb-6">
          <h3 className="font-medium mb-2">💡 Tips for better responses:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Be specific about your health goals or diet restrictions</li>
            <li>Upload food photos for personalized nutrition advice</li>
            <li>Ask about meal alternatives for specific dietary needs</li>
            <li>Request weekly meal plans based on your preferences</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Chat;
