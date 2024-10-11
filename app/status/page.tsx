"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceTimeline from "@/app/status/_components/statusTimeLine";
import PM2Metrics from "./_components/pm2Metrics";

interface StatusDay {
    date: string;
    status: "Operational" | "Partial Outage" | "Major Outage";
}

interface ServiceTimelineData {
    serviceName: string;
    uptimePercentage: string;
    statusDays: StatusDay[];
}

const StatusPage: React.FC = () => {
    const [serviceTimelines, setServiceTimelines] = useState<ServiceTimelineData[]>([]);

    useEffect(() => {
        const fetchServiceStatuses = async () => {
            try {
                const response = await axios.get("/api/statusLogs", {
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                setServiceTimelines(response.data);
            } catch (error) {
                console.error("Veriler alınamadı:", error);
            }
        };


        fetchServiceStatuses();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-6">Hizmet Durumları</h1>
            {serviceTimelines.map((service, index) => (
                <ServiceTimeline
                    key={index}
                    serviceName={service.serviceName}
                    uptimePercentage={service.uptimePercentage}
                    statusDays={service.statusDays}
                />
            ))}

            <h1 className="text-3xl font-bold mb-6">PM2 Bilgi Konsolu</h1>
            <PM2Metrics />
        </div>
    );
};

export default StatusPage;
