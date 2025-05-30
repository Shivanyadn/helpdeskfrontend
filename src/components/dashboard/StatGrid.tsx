// src/components/dashboard/StatGrid.tsx
import React from "react";
import WidgetCard from "./WidgetCard";

interface StatItem {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface StatGridProps {
  data: StatItem[];
}

const StatGrid: React.FC<StatGridProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((item, index) => (
        <WidgetCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
        />
      ))}
    </div>
  );
};

export default StatGrid;
