import MessageItem from './MessageItem';

const MessageList = ({ messages, contactId }) => {
  // Group messages by date
  const groupedMessages = [];
  
  messages.forEach(message => {
    const messageDate = new Date(message.timestamp).toLocaleDateString();
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    
    if (lastGroup && lastGroup.date === messageDate) {
      lastGroup.messages.push(message);
    } else {
      groupedMessages.push({
        date: messageDate,
        messages: [message]
      });
    }
  });
  
  return (
    <div className="space-y-6">
      {groupedMessages.map((group, index) => (
        <div key={index} className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-600">
              {formatMessageDate(group.date)}
            </div>
          </div>
          {group.messages.map((message, i) => (
            <MessageItem 
              key={message.id} 
              message={message} 
              isSender={message.sender === 'me'}
              showAvatar={shouldShowAvatar(group.messages, i, message.sender)}
              contactId={contactId}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Format date to relative or absolute format
const formatMessageDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (dateStr === today.toLocaleDateString()) {
    return 'Today';
  } else if (dateStr === yesterday.toLocaleDateString()) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
};

// Determine if avatar should be shown for this message
const shouldShowAvatar = (messages, index, sender) => {
  // Always show avatar for the first message in a group
  if (index === 0) return true;
  
  // Show avatar if previous message was from a different sender
  const prevMessage = messages[index - 1];
  return prevMessage.sender !== sender;
};

export default MessageList;