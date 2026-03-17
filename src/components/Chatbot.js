import React, { useState, useRef, useEffect } from 'react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your MakeMyTrip assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Predefined responses based on keywords
    if (message.includes('hotel') || message.includes('booking')) {
      return "I can help you with hotel bookings! You can browse available hotels on our Hotels page. Would you like me to guide you there?";
    }

    if (message.includes('flight') || message.includes('fly')) {
      return "For flight bookings, head to our Flights page where you can search and book flights. Do you need help finding a specific route?";
    }

    if (message.includes('visa') || message.includes('application')) {
      return "Need help with visa applications? Visit our Visa page to apply for various visa types. I can help you understand the requirements!";
    }

    if (message.includes('cancel') || message.includes('refund')) {
      return "For cancellations or refunds, please check your booking dashboard. You can cancel most bookings up to 24 hours before the check-in/flight time.";
    }

    if (message.includes('price') || message.includes('cost') || message.includes('rate')) {
      return "Prices vary based on season, location, and availability. You can see current rates when you search for hotels or flights on our platform.";
    }

    if (message.includes('help') || message.includes('support')) {
      return "I'm here to help! I can assist with:\n• Hotel bookings\n• Flight reservations\n• Visa applications\n• General inquiries\n• Cancellation policies\n\nWhat would you like to know about?";
    }

    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! Welcome to MakeMyTrip. I'm here to help you plan your perfect trip. What can I assist you with today?";
    }

    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! If you have any other questions about your travel plans, feel free to ask. Safe travels! ✈️";
    }

    // Default response
    return "I'm not sure about that specific question. For detailed assistance, you can:\n• Browse our Hotels page for accommodations\n• Check Flights for travel options\n• Visit Visa page for travel documents\n• Contact our support team for complex inquiries";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col">
        {/* Header */}
        <div className="bg-orange-500 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
              <span className="text-orange-500 font-bold text-sm">MT</span>
            </div>
            <div>
              <h3 className="font-semibold">MakeMyTrip Assistant</h3>
              <p className="text-xs opacity-90">Online</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-3 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
            >
              <div
                className={`inline-block max-w-xs px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-800 border'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-orange-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <div className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-r-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}