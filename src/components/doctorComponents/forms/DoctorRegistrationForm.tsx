"use client"

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { toast } from 'sonner';

// Import Steps Components
import FormProgress from '../forms/steps/FormProgress';
import Step1Profile from '../forms/steps/Step1Profile';
import Step2Education from '../forms/steps/Step2Education';
import Step3Documents from '../forms/steps/Step3Documents';
import Step4Review from '../forms/steps/Step4Review';

const steps = [
  { id: 1, name: 'Profile' },
  { id: 2, name: 'Education' },
  { id: 3, name: 'Documents' },
  { id: 4, name: 'Review' }
];

const DoctorRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  
  const { register, handleSubmit, formState: { errors, isValid }, watch, setValue, getValues, control } = useForm({
    mode: 'all', // Validate form on change
    defaultValues: {
      education: [{ degree: '', institution: '', yearOfCompletion: '' }],
      certifications: [{ name: '', issuedBy: '', yearOfIssue: '' }]
    }
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log('Form submitted with data:', data);
    toast.success('Registration submitted successfully!', {
      description: 'Your application has been sent for review.',
      duration: 5000,
    });
    // Here you would typically send the data to an API
  };

  // Navigate to next step
  const goToNextStep = async () => {
    // Check if current step is valid
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const stepValid = await validateFields(fieldsToValidate);
    
    if (!stepValid) {
      toast.error('Please fill all required fields correctly', {
        description: 'Please check the form for errors.',
      });
      return;
    }
    
    if (currentStep < steps.length) {
      animateStepChange(() => {
        setCurrentStep(prev => prev + 1);
      });
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      animateStepChange(() => {
        setCurrentStep(prev => prev - 1);
      });
    }
  };

  // Handle step editing in review
  const handleEditStep = (step: number) => {
    animateStepChange(() => {
      setCurrentStep(step);
    });
  };

  // Animate step changes
  const animateStepChange = (callback: () => void) => {
    setAnimating(true);
    setTimeout(() => {
      callback();
      setAnimating(false);
    }, 300);
  };

  // Validate specific fields based on current step
  const getFieldsToValidate = (step: number) => {
    switch (step) {
      case 1:
        return ['fullName', 'gender', 'email', 'phoneNumber', 'department', 'experience', 'profilePicture'];
      case 2:
        return ['education', 'certifications'];
      case 3:
        return ['licenseNumber', 'licenseDocument', 'idProof'];
      default:
        return [];
    }
  };

  // Validate specific fields
  const validateFields = async (fields: string[]) => {
    const result = await handleSubmit(() => {})();
    if (fields.length === 0) return true;
    
    const hasErrors = fields.some(field => {
      if (field === 'education') {
        const education = watch('education');
        return education.some((edu: any, index: number) => 
          errors.education && errors.education[index]
        );
      }
      if (field === 'certifications') {
        const certifications = watch('certifications');
        return certifications.some((cert: any, index: number) => 
          errors.certifications && errors.certifications[index]
        );
      }
      return;
      //issue
    });
    
    return !hasErrors;
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Profile register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 2:
        return <Step2Education register={register} errors={errors} watch={watch} setValue={setValue} getValues={getValues} control={control} />;
      case 3:
        return <Step3Documents register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 4:
        return <Step4Review formData={watch()} onEdit={handleEditStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-container">
          <FormProgress currentStep={currentStep} steps={steps} />
          
          <div className={`transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
            {renderStep()}
          </div>
          
          <div className="mt-10 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={goToPreviousStep}
                className="btn-secondary flex items-center"
                disabled={animating}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="btn-primary flex items-center"
                disabled={animating}
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary flex items-center bg-gradient-to-r from-deep-blue to-blue-700"
                disabled={animating}
              >
                Submit Registration
                <Rocket className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorRegistrationForm;
