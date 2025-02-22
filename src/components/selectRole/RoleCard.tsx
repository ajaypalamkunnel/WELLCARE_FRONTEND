import { useState } from "react";
import { Hospital, Stethoscope } from "lucide-react";

interface RoleCardProps {
  type: "patient" | "doctor";
  selected: boolean;
  onSelect: () => void;
}

export const RoleCard = ({ type, selected, onSelect }: RoleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const content = {
    patient: {
      icon: (
        <Hospital
          className={`w-8 h-8 ${
            selected ? "text-medical-green" : "text-gray-600"
          }`}
        />
      ),
      title: "I'm a Patient",
      description: "looking for a Doctor",
    },
    doctor: {
      icon: (
        <Stethoscope
          className={`w-8 h-8 ${
            selected ? "text-medical-green" : "text-gray-600"
          }`}
        />
      ),
      title: "I'm a Doctor",
      description: "providing medical care",
    },
  };

  return (
    <div
      className={`role-card border rounded-lg p-4 transition-all duration-300 cursor-pointer ${
        selected ? "border-medical-green shadow-md" : "border-gray-300"
      } ${isHovered ? "shadow-lg transform scale-105" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`custom-radio w-5 h-5 border-2 rounded-full flex items-center justify-center ${
            selected ? "border-medical-green" : "border-gray-400"
          }`}
        >
          {selected && <div className="w-3 h-3 bg-medical-green rounded-full"  />}
        </div>
        <div className="flex-1">
          <div className="mb-2">{content[type].icon}</div>
          <h3 className="text-lg font-semibold text-gray-900">
            {content[type].title}
          </h3>
          <p className="text-gray-600">{content[type].description}</p>
        </div>
      </div>
    </div>
  );
};
