"use client"

import React from 'react';
import { Check } from 'lucide-react';

interface FormProgressProps {
  currentStep: number;
  steps: {
    id: number;
    name: string;
  }[];
}

const FormProgress: React.FC<FormProgressProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step) => (
          <React.Fragment key={step.id}>
            {/* Step Indicator */}
            <div className="flex flex-col items-center">
              <div 
                className={`step-indicator ${
                  step.id < currentStep ? 'completed' : 
                  step.id === currentStep ? 'active' : ''
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                {step.name}
              </div>
            </div>

            {/* Connector */}
            {step.id !== steps.length && (
              <div 
                className={`flex-1 h-1 mx-4 rounded ${
                  step.id < currentStep ? 'bg-deep-blue' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default FormProgress;