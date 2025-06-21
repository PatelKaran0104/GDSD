const ProfileHeader = () => {
  return (
    <div className="py-4 px-4 flex items-center justify-between bg-white border-b border-gray-200">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
          ME
        </div>
        <div className="ml-3">
          <h2 className="font-semibold text-gray-800">My Chat</h2>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;