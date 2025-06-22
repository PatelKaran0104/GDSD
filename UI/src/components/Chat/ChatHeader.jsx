import { MoreVertical, Flag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useContacts } from '../../context/ContactContext';
import { useNavigate } from 'react-router-dom';

const ChatHeader = ({ contact }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { contacts } = useContacts();
  const navigate = useNavigate();
  
  // Get the full contact data including original chat info
  const fullContact = contacts.find(c => c.id === contact.id);
  const originalChat = fullContact?._originalChat;
  const productImage = originalChat?.product?.image_url;
  const productTitle = originalChat?.product?.title;

  const handleReportUser = () => {
    console.log('Report user:', contact.id);
    setIsMenuOpen(false);
  };

  const handleDeleteChat = () => {
    console.log('Delete chat:', contact.id);
    setIsMenuOpen(false);
  };

  const handleProductClick = () => {
    if (originalChat?.product?.id) {
      navigate(`/product/${originalChat.product.id}`);
    }
  };

  return (
    <div className="py-3 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <div className="relative">
            <img
              src={contact.avatar}
              alt={contact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          
          {/* Product Image if available */}
          {productImage && (
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-md border-2 border-white">
              <img 
                src={productImage} 
                alt={productTitle || 'Product'} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
          <div className="ml-3">
          <h2 className="font-medium text-gray-900">{contact.name}</h2>
          {productTitle && (
            <button 
              onClick={handleProductClick}
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
            >
              {productTitle}
            </button>
          )}
        </div>
      </div>
      <div className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <MoreVertical size={20} />
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={handleReportUser}
              className="w-full px-4 py-2 text-left flex items-center gap-2 text-gray-700 hover:bg-gray-100"
            >
              <Flag size={16} />
              Report User
            </button>
            <button
              onClick={handleDeleteChat}
              className="w-full px-4 py-2 text-left flex items-center gap-2 text-red-600 hover:bg-gray-100"
            >
              <Trash2 size={16} />
              Delete Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;