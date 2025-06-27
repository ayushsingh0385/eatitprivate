import React from 'react';
import { useHealthProfileStore } from "../store/useUserInformationStore";

const Profile = () => {
    const { profile } = useHealthProfileStore();

    if (!profile) return (
        <div className="flex justify-center items-center h-64 bg-gray-50 rounded-xl p-4">
            <div className="animate-pulse text-gray-500 flex flex-col items-center">
                <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    // Function to handle image download
    const handleDownload = () => {
        // Get the image URL
        const imageUrl = profile.image?.url || "/api/placeholder/150/150";
        
        // Create a link element
        const downloadLink = document.createElement('a');
        downloadLink.href = imageUrl;
        downloadLink.download = `${profile.fullName || 'profile'}-image.jpg`;
        
        // Append to the document, click it, and remove it
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50">
            {/* Profile Header - Name only */}
            <div className="flex flex-col items-center mb-10 bg-gradient-to-b from-blue-50 to-white rounded-2xl p-8 shadow-md">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.fullName}</h1>
                <p className="text-blue-600 font-medium bg-blue-50 px-4 py-1 rounded-full shadow-sm">{profile.healthGoal}</p>
            </div>

            {/* Basic Information Grid - Enhanced with better visual styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                        <span className="bg-blue-100 p-2 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Personal Details
                    </h2>
                    <div className="space-y-4">
                        <DetailItem label="Gender" value={profile.gender} icon="👤" />
                        <DetailItem label="Date of Birth" value={new Date(profile.dateOfBirth).toLocaleDateString()} icon="📅" />
                        <DetailItem label="Height" value={`${profile.heightCm} cm`} icon="📏" />
                        <DetailItem label="Weight" value={`${profile.weightKg} kg`} icon="⚖️" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                        <span className="bg-green-100 p-2 rounded-lg mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Health Information
                    </h2>
                    <div className="space-y-4">
                        <DetailItem label="Diet Preference" value={profile.dietPreference || 'Not specified'} icon="🍎" />
                        <div>
                            <p className="text-gray-600 mb-2 flex items-center gap-2">
                                <span className="bg-red-100 p-1 rounded-md">
                                    <span className="text-lg">💊</span>
                                </span>
                                <span>Diseases</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {profile.diseases.length === 0 || (profile.diseases.length === 1 && profile.diseases[0] === 'None') ? (
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">None reported</span>
                                ) : (
                                    profile.diseases.map((disease, index) => (
                                        disease !== 'None' && (
                                            <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                                {disease}
                                            </span>
                                        )
                                    ))
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-600 mb-2 flex items-center gap-2">
                                <span className="bg-yellow-100 p-1 rounded-md">
                                    <span className="text-lg">⚠️</span>
                                </span>
                                <span>Allergies</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {profile.allergies.length === 0 || (profile.allergies.length === 1 && profile.allergies[0] === 'None') ? (
                                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">None reported</span>
                                ) : (
                                    profile.allergies.map((allergy, index) => (
                                        allergy !== 'None' && (
                                            <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                                {allergy}
                                            </span>
                                        )
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* UPDATED SECTION: Medical Reports with square image */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                    <span className="bg-red-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                    </span>
                    Medical Reports
                </h2>
                <div className="flex flex-col items-center mb-4">
                    <div className="relative mb-4">
                        {/* Changed from rounded-full to rounded-lg for square image */}
                        <img
                            src={profile.image?.url || "/api/placeholder/150/150"}
                            alt="Profile"
                            className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-red-500 rounded-md p-2 border-2 border-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-gray-600 text-sm">Last updated</p>
                        <p className="text-gray-800 font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex justify-center mt-4">
                    {/* Added onClick handler to download button */}
                    <button 
                        onClick={handleDownload}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        View Report
                    </button>
                </div>
            </div>

            {/* Health Goals Section - Enhanced with progress indicators */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                    <span className="bg-purple-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                    </span>
                    Health Goals
                </h2>
                <div className="flex flex-wrap gap-3">
                    {profile.purposes.length === 0 ? (
                        <p className="text-gray-500 italic">No goals specified yet</p>
                    ) : (
                        profile.purposes.map((purpose, index) => (
                            <span key={index} className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {purpose}
                            </span>
                        ))
                    )}
                </div>
            </div>

            {/* Additional Info - Enhanced with card styling and activity indicator */}
            <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100 flex items-center">
                    <span className="bg-indigo-100 p-2 rounded-lg mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </span>
                    Additional Information
                </h2>
                <div className="bg-indigo-50 p-4 rounded-lg flex items-center justify-between">
                    <div>
                        <p className="text-gray-600 text-sm">Member since</p>
                        <p className="text-gray-800 font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white p-2 rounded-full shadow">
                        <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced DetailItem component with better styling
const DetailItem = ({ label, value, icon }) => (
    <div className="flex items-start">
        <div className="bg-gray-100 p-2 rounded-md mr-3">
            <span className="text-lg">{icon}</span>
        </div>
        <div>
            <p className="text-gray-500 text-sm">{label}</p>
            <p className="text-gray-800 font-medium">{value}</p>
        </div>
    </div>
);

export default Profile;