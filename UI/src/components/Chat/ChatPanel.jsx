import { useRef, useEffect } from 'react';
import { useContacts } from '../../context/ContactContext';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatPanel = () => {
  const { activeContactId, contacts, messages, sendMessage } = useContacts();
  const messagesEndRef = useRef(null);
  
  // Find active contact
  const activeContact = activeContactId 
    ? contacts.find(c => c.id === activeContactId) 
    : null;
    
  // Get messages for active contact
  const activeMessages = activeContactId 
    ? messages[activeContactId] || []
    : [];
    
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeMessages]);
  
  if (!activeContact) return null;
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <ChatHeader contact={activeContact} />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList messages={activeMessages} contactId={activeContact.id} />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatPanel;