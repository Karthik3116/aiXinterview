// src/components/SectionCard.jsx
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const SectionCard = ({
  title,
  icon,
  isOpen,
  onToggle,
  headerBg = 'bg-white',
  contentBg = 'bg-gray-50',
  children,
}) => {
  return (
    <div className={`rounded-3xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-500 ease-in-out ${headerBg}`}>
      <div
        onClick={onToggle}
        className="flex items-center justify-between cursor-pointer px-6 py-4 sm:py-5 group"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="transform transition-transform duration-300 ease-in-out group-hover:scale-110">
          {isOpen ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </div>
      </div>
      {isOpen && (
        <div className={`p-6 sm:p-8 text-gray-800 text-base sm:text-lg leading-relaxed ${contentBg}`}>
          {children}
        </div>
      )}
    </div>
  );
};

export default SectionCard;
