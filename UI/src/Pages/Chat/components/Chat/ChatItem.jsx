
const AvatarStack = ({ productUrl, productAlt, userUrl, userName }) => {
    const initial = userName?.charAt(0).toUpperCase() ?? '?'

    return (
        <div className="relative w-12 h-12 flex-shrink-0">
            {/* Product */}
            <img
                src={productUrl}
                alt={productAlt}
                className="absolute left-0 top-0 w-8 h-8 rounded-full object-cover border-2 border-white z-10"
            />

            {/* User or initial */}
            {userUrl ? (
                <img
                    src={userUrl}
                    alt={userName}
                    className="absolute right-0 top-0 w-8 h-8 rounded-full object-cover border-2 border-white z-20"
                />
            ) : (
                <div className="absolute right-0 top-0 w-8 h-8 rounded-full bg-gray-500 text-white font-semibold flex items-center justify-center z-20">
                    {initial}
                </div>
            )}
        </div>
    )
}

const ChatItem = ({ chat, currentUserId, onSelect, isSelected }) => {
    const isOwner = chat.owner.id === currentUserId
    const otherUser = isOwner ? chat.otherPerson : chat.owner

    return (
        <button
            type="button"
            onClick={onSelect}
            className={`flex items-center w-full p-4 text-left hover:bg-gray-100 transition-colors ${isSelected ? 'bg-gray-200' : ''
                }`}
        >
            <AvatarStack
                productUrl={chat.product.image_url}
                productAlt={chat.product.title}
                userUrl={otherUser.image_url}
                userName={otherUser.username}
            />

            <div className="ml-4 flex-1 overflow-hidden">
                <p className="font-medium text-gray-900 truncate">
                    {otherUser.username}
                </p>
                <p className="text-sm text-gray-600 truncate">
                    {chat.lastMessage?.content ?? '—'}
                </p>
            </div>
        </button>
    )
}

export default ChatItem
