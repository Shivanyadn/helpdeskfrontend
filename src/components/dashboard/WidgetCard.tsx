import React, { ReactNode } from "react";

export interface WidgetCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  onClick?: () => void;
  className?: string;
}

const WidgetCard: React.FC<WidgetCardProps> = ({ 
  icon, 
  title, 
  value, 
  onClick, 
  className = "" 
}) => {
  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        <div className="text-blue-500 mr-2">{icon}</div>
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>
      <p className="text-lg font-bold text-gray-800">{value}</p>
    </div>
  );
};

export default WidgetCard;
