import React from 'react';
import { useHealthProfileStore } from "../store/useUserInformationStore";
import { useNavigate } from "react-router-dom";

function Home() {
    const { profile } = useHealthProfileStore();
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section with improved mobile spacing */}
            <div className="pt-4 md:pt-10 pb-8 md:pb-20 px-3 md:px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-6 md:mb-16">
                        <h1 className="text-3xl md:text-7xl font-bold mb-2 md:mb-6">
                            <span className="text-blue-600">Eat</span>
                            <span className="text-green-600">iT</span>
                        </h1>
                        <p className="text-base md:text-2xl text-gray-600 max-w-3xl mx-auto px-2 md:px-4">
                            Discover healthy food options, track your nutrition, and connect with our community.
                        </p>
                        {profile?.fullName && (
                            <div className="mt-3 md:mt-6 inline-block px-3 md:px-6 py-1.5 md:py-2 bg-blue-50 rounded-full text-blue-700 font-medium text-sm md:text-base">
                                Welcome back, {profile.fullName}!
                            </div>
                        )}
                    </div>
                    
                    {/* Feature Cards with improved mobile layout - removed Profile card */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8 mb-8 md:mb-16 px-2 md:px-0">
                        {/* Scan Card */}
                        <div 
                            onClick={() => navigate('/scan')}
                            className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-md md:shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                        >
                            <div className="h-10 w-10 md:h-14 md:w-14 bg-green-100 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-6 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-base md:text-xl font-bold text-gray-800 mb-1 md:mb-3 text-center">Scan Food</h2>
                            <p className="text-xs md:text-base text-gray-600 text-center">Identify nutrition instantly</p>
                        </div>
                        
                        {/* Community Card */}
                        <div 
                            onClick={() => navigate('/posts')}
                            className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-md md:shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                        >
                            <div className="h-10 w-10 md:h-14 md:w-14 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-6 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                            </div>
                            <h2 className="text-base md:text-xl font-bold text-gray-800 mb-1 md:mb-3 text-center">Community</h2>
                            <p className="text-xs md:text-base text-gray-600 text-center">Share healthy recipes</p>
                        </div>
                        
                        {/* Chat Card */}
                        <div 
                            onClick={() => navigate('/chat')}
                            className="bg-white rounded-xl md:rounded-2xl p-3 md:p-6 shadow-md md:shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer border border-gray-100"
                        >
                            <div className="h-10 w-10 md:h-14 md:w-14 bg-orange-100 rounded-lg md:rounded-xl flex items-center justify-center mb-2 md:mb-6 mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-8 md:w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <h2 className="text-base md:text-xl font-bold text-gray-800 mb-1 md:mb-3 text-center">Chat</h2>
                            <p className="text-xs md:text-base text-gray-600 text-center">Get nutrition advice</p>
                        </div>
                    </div>
                    
                    {/* Health Stats Section - Mobile Optimized */}
                    {profile && (
                        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-md md:shadow-lg border border-gray-100 max-w-5xl mx-auto mb-6">
                            <h2 className="text-lg md:text-2xl font-bold text-gray-800 mb-3 md:mb-6 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 mr-1 md:mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Health Summary
                            </h2>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6">
                                {profile.heightCm && (
                                    <div className="bg-blue-50 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
                                        <p className="text-xs text-blue-600 font-medium">Height</p>
                                        <p className="text-base md:text-2xl font-bold text-gray-900">{profile.heightCm} cm</p>
                                    </div>
                                )}
                                
                                {profile.weightKg && (
                                    <div className="bg-green-50 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
                                        <p className="text-xs text-green-600 font-medium">Weight</p>
                                        <p className="text-base md:text-2xl font-bold text-gray-900">{profile.weightKg} kg</p>
                                    </div>
                                )}
                                
                                {profile.healthGoal && (
                                    <div className="bg-purple-50 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
                                        <p className="text-xs text-purple-600 font-medium">Goal</p>
                                        <p className="text-sm md:text-xl font-bold text-gray-900 truncate">{profile.healthGoal}</p>
                                    </div>
                                )}
                                
                                {profile.dietPreference && (
                                    <div className="bg-orange-50 rounded-lg md:rounded-xl p-2 md:p-4 text-center">
                                        <p className="text-xs text-orange-600 font-medium">Diet</p>
                                        <p className="text-sm md:text-xl font-bold text-gray-900 truncate">{profile.dietPreference}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
