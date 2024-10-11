import React, { useEffect, useState } from "react";
import axios from "axios";

interface PM2Metric {
  name: string;
  pm_id: number;
  monit: {
    cpu: number;
    memory: number;
  };
  pm2_env: {
    status: string;
    restart_time: number;
    uptime: number;
  };
}

const PM2Metrics: React.FC = () => {
  const [metrics, setMetrics] = useState<PM2Metric[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get("/api/metrics");
        setMetrics(response.data);
      } catch (error) {
        console.error("Metrics could not be retrieved:", error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">PM2 Metrics</h2>
      {metrics.length === 0 ? (
        <p>Metrics loading...</p>
      ) : (
        <div>
          {metrics.map((metric) => (
            <div
              key={metric.pm_id}
              className="p-4 mb-4 border rounded-lg shadow-md"
            >
              <h3 className="font-bold text-lg">{metric.name}</h3>
              <p>Status: {metric.pm2_env.status}</p>
              <p>CPU Usage: {metric.monit.cpu}%</p>
              <p>
                Memory Usage: {(metric.monit.memory / 1024 / 1024).toFixed(2)}{" "}
                MB
              </p>
              <p>
                Uptime: {Math.floor(metric.pm2_env.uptime / 1000 / 60)} minutes
              </p>
              <p>Restart Count: {metric.pm2_env.restart_time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PM2Metrics;
