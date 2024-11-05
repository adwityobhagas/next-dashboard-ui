const Announcement = () => {
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span className="text-xs text-gray-400">View All</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-lightSky rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem Ipsum is</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-11-06
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam iure
            atque ut harum
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-purpleLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem Ipsum is</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-11-06
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam iure
            atque ut harum
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <div className="bg-yellowLight rounded-md p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Lorem Ipsum is</h2>
            <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
              2024-11-06
            </span>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam iure
            atque ut harum
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
