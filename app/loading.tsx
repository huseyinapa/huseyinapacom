"use client";

import axios from 'axios';
import React, { useEffect } from 'react';

const Loading: React.FC = () => {
    useEffect(() => {
        const initializeServices = async () => {
            try {
                await axios.post('/api/updateServiceStatus');
                await axios.get("/api/system");
                await axios.get("/api/cronJob");

                console.log("Servis kurulumu eklendi.");
            } catch (error) {
                console.error("Failed to initialize service data:", error);
            }
        };
        initializeServices();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-lg">Loading...</p>
        </div>
    );
};

export default Loading;
