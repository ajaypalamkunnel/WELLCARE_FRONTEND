'use client';

import React, { useRef, useState } from 'react';
import {Upload, Key, CreditCard } from 'lucide-react';

interface Step3DocumentsProps {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
}

const Step3Documents: React.FC<Step3DocumentsProps> = ({ register, errors, watch, setValue }) => {
  const licenseDocRef = useRef<HTMLInputElement>(null);
  const idProofRef = useRef<HTMLInputElement>(null);
  
  const [licenseDocName, setLicenseDocName] = useState<string>('');
  const [idProofName, setIdProofName] = useState<string>('');

  const handleLicenseDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is PDF or JPG
      if (file.type !== 'application/pdf' && file.type !== 'image/jpeg') {
        alert('Please upload a PDF or JPG file');
        return;
      }
      
      setValue('licenseDocument', file);
      setLicenseDocName(file.name);
    }
  };

  const handleIdProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check if file is PDF or JPG
      if (file.type !== 'application/pdf' && file.type !== 'image/jpeg') {
        alert('Please upload a PDF or JPG file');
        return;
      }
      
      setValue('IDProofDocument', file);
      setIdProofName(file.name);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="step-title mb-6">License & Document Upload</h2>
      
      <div className="space-y-8">
        <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">Medical License Details</h3>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="licenseNumber" className="form-label">Medical License Number</label>
              <div className="relative">
                <input
                  id="licenseNumber"
                  type="text"
                  className="form-input pl-10"
                  placeholder="ML12345678"
                  {...register('licenseNumber', { required: 'License number is required' })}
                />
                <Key className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.licenseNumber && <p className="error-text">{errors.licenseNumber.message}</p>}
            </div>
            
            <div>
              <label className="form-label">Upload License Document (PDF or JPG)</label>
              <div 
                onClick={() => licenseDocRef.current?.click()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-deep-blue transition-colors dark:border-gray-600 dark:hover:border-blue-500"
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label className="relative cursor-pointer rounded-md font-medium text-deep-blue hover:text-blue-700 focus-within:outline-none dark:text-blue-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        ref={licenseDocRef}
                        accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                        onChange={handleLicenseDocUpload}
                        {...register('licenseDocument', { required: 'License document is required' })}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PDF or JPG up to 10MB
                  </p>
                  {licenseDocName && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                      Selected: {licenseDocName}
                    </p>
                  )}
                </div>
              </div>
              {errors.licenseDocument && <p className="error-text mt-2">{errors.licenseDocument.message}</p>}
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 rounded-lg dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">ID Proof Upload</h3>
          
          <div>
            <label className="form-label">Upload ID Proof (PDF or JPG)</label>
            <div 
              onClick={() => idProofRef.current?.click()}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-deep-blue transition-colors dark:border-gray-600 dark:hover:border-blue-500"
            >
              <div className="space-y-1 text-center">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer rounded-md font-medium text-deep-blue hover:text-blue-700 focus-within:outline-none dark:text-blue-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      ref={idProofRef}
                      accept=".pdf,.jpg,.jpeg,application/pdf,image/jpeg"
                      onChange={handleIdProofUpload}
                      {...register('IDProofDocument', { required: 'ID proof is required' })}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF or JPG up to 10MB
                </p>
                {idProofName && (
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                    Selected: {idProofName}
                  </p>
                )}
              </div>
            </div>
            {errors.idProof && <p className="error-text mt-2">{errors.idProof.message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Documents;
