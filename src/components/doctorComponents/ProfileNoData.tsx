const ProfileRenderNoDataMessage = () => {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-3xl mx-auto text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 mx-auto text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Profile Data Available</h2>
        <p className="text-gray-500 mb-6">{"We couldn't find your profile information."}</p>
        <button
          className="px-4 py-2 bg-blue-900 text-white rounded-md flex items-center hover:bg-blue-800 transition duration-200 mx-auto"
          style={{ backgroundColor: "#03045e" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Sign in
        </button>
      </div>
    );
  };

export default ProfileRenderNoDataMessage