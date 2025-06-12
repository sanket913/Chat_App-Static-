'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Search, Menu, X, Phone, Video, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data
const contacts = [
  {
    id: 1,
    name: 'Dev Mer',
    lastMessage: 'The new update looks great! I especially love the new features. Looking forward to it',
    time: '12:30 PM',
    avatar: 'DM',
    online: true,
    unread: 2
  },
  {
    id: 2,
    name: 'Reyan Vaghela',
    lastMessage: 'Hi, I almost forgot - do you have the latest version of the client requirements? I want to make sure we\'re on the same page for tomorrow.',
    time: '11:45 AM',
    avatar: 'RV',
    online: false,
    unread: 0
  },
  {
    id: 3,
    name: 'Mann Patel',
    lastMessage: 'Thanks! See you soon',
    time: '10:30 AM',
    avatar: 'MP',
    online: true,
    unread: 0
  },
  {
    id: 4,
    name: 'Ronak Kumavat',
    lastMessage: 'Perfect! The presentation went really well today',
    time: '9:15 AM',
    avatar: 'RK',
    online: false,
    unread: 1
  },
  {
    id: 5,
    name: 'Amelia Wilson',
    lastMessage: 'Got it! Thanks! It\'s really been exciting working on this project',
    time: '8:45 AM',
    avatar: 'AW',
    online: true,
    unread: 0
  },
  {
    id: 6,
    name: 'Daniel Martinez',
    lastMessage: 'Let\'s schedule a video meeting?',
    time: 'Yesterday',
    avatar: 'DM',
    online: false,
    unread: 0
  }
];

const mockMessages: { [key: number]: any[] } = {
  1: [
    { id: 1, text: 'The new update looks great! I especially love the new features. Looking forward to it', sender: 'contact', time: '12:30 PM', status: 'received' },
    { id: 2, text: 'Oh, I almost forgot - do you have the latest version of the client requirements? I want to make sure we\'re on the same page for tomorrow.', sender: 'contact', time: '12:31 PM', status: 'received' },
    { id: 3, text: 'I\'ll make sure to send you everything. It includes all the guidelines we discussed in the last meeting. Let me know if you have anything else.', sender: 'me', time: '12:32 PM', status: 'sent' },
    { id: 4, text: 'Got it thanks! I\'ll review it before the lunch. See you soon!', sender: 'contact', time: '12:33 PM', status: 'received' }
  ],
  2: [
    { id: 1, text: 'Hi, I almost forgot - do you have the latest version of the client requirements?', sender: 'contact', time: '11:45 AM', status: 'received' },
    { id: 2, text: 'Yes, I can send it over right now. Give me a moment to find the latest version.', sender: 'me', time: '11:46 AM', status: 'sent' }
  ],
  3: [
    { id: 1, text: 'Thanks! See you soon', sender: 'contact', time: '10:30 AM', status: 'received' },
    { id: 2, text: 'Looking forward to it! 👍', sender: 'me', time: '10:31 AM', status: 'sent' }
  ]
};

const botResponses = [
  "That's a great point! Let me think about that.",
  "I completely agree with you on this.",
  "Thanks for sharing that information.",
  "That sounds like a solid plan to me.",
  "I'll get back to you on that shortly.",
  "Perfect! That works well for me.",
  "Let me check on that and get back to you.",
  "Great idea! I think that could work really well.",
  "Thanks for the update. Much appreciated!",
  "That's exactly what I was thinking too."
];

export default function ChatApp() {
  const [selectedContact, setSelectedContact] = useState<number>(1);
  const [messages, setMessages] = useState<{ [key: number]: any[] }>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageId = Date.now();
    const newMsg = {
      id: messageId,
      text: newMessage,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMsg]
    }));

    setNewMessage('');

    // bot response
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        sender: 'contact',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'received'
      };

      setMessages(prev => ({
        ...prev,
        [selectedContact]: [...(prev[selectedContact] || []), botResponse]
      }));
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedContactInfo = contacts.find(c => c.id === selectedContact);
  const currentMessages = messages[selectedContact] || [];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Chats</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => {
                setSelectedContact(contact.id);
                setSidebarOpen(false);
              }}
              className={cn(
                "flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200",
                selectedContact === contact.id && "bg-blue-50 border-r-2 border-blue-500"
              )}
            >
              <div className="relative">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-medium text-sm",
                  contact.online ? "bg-blue-500" : "bg-gray-400"
                )}>
                  {contact.avatar}
                </div>
                {contact.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <div className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {contact.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            {selectedContactInfo && (
              <>
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                    {selectedContactInfo.avatar}
                  </div>
                  {selectedContactInfo.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedContactInfo.name}</h2>
                  <p className="text-sm text-green-500">{selectedContactInfo.online ? 'Online' : 'Offline'}</p>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            
            <button className="p-2 rounded-md hover:bg-gray-100">
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === 'me' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm",
                  message.sender === 'me'
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p className={cn(
                  "text-xs mt-1",
                  message.sender === 'me' ? 'text-blue-100' : 'text-gray-500'
                )}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg rounded-bl-sm px-4 py-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={cn(
                "p-3 rounded-full transition-colors duration-200",
                newMessage.trim()
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/*for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}