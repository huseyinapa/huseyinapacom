import React from "react";

interface StatusDay {
  date: string;
  status: "Operational" | "Partial Outage" | "Major Outage";
}

interface ServiceTimelineProps {
  serviceName: string;
  uptimePercentage: string;
  statusDays: StatusDay[];
}

const ServiceTimeline: React.FC<ServiceTimelineProps> = ({
  serviceName,
  uptimePercentage,
  statusDays,
}) => {
  return (
    <div className="service-timeline mb-4">
      <h3 className="font-bold text-lg">{serviceName}</h3>
      <div className="flex items-center gap-1 mt-2">
        {statusDays.map((day, index) => (
          <div
            key={index}
            title={`${day.date} - ${day.status}`}
            className={`w-2 h-6 rounded ${
              day.status === "Operational"
                ? "bg-green-500"
                : day.status === "Partial Outage"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          ></div>
        ))}
      </div>
      <p className="text-sm mt-1">{uptimePercentage} uptime</p>
    </div>
  );
};

export default ServiceTimeline;
