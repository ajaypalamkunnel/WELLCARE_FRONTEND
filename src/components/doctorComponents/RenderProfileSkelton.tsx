const RenderProfileSkeleton = () => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-3xl mx-auto">
        {/* Avatar skeleton */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse mb-4"></div>
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Contact info skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-center">
            <div className="h-5 w-5 bg-gray-200 animate-pulse mr-2 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-5 w-5 bg-gray-200 animate-pulse mr-2 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        {/* Department/specialization skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-start">
            <div className="h-6 w-6 bg-gray-200 animate-pulse mr-2 rounded mt-1"></div>
            <div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="h-6 w-6 bg-gray-200 animate-pulse mr-2 rounded mt-1"></div>
            <div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* Experience/license skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-start">
            <div className="h-6 w-6 bg-gray-200 animate-pulse mr-2 rounded mt-1"></div>
            <div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="flex items-start">
            <div className="h-6 w-6 bg-gray-200 animate-pulse mr-2 rounded mt-1"></div>
            <div>
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded mb-2"></div>
              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>

        {/* Button skeleton */}
        <div className="mt-8 flex justify-center">
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    );
  };


export default RenderProfileSkeleton