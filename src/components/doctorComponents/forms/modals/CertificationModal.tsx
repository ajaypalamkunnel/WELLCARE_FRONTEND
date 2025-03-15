// CertificationModal.tsx
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X } from 'lucide-react';
import { CertificationData, CertificationFormData } from '../qualification/QualificationManagement'
import { ICertificate } from '@/types/doctorFullDataType';

interface CertificationModalProps {
  onClose: () => void;
  onSave: SubmitHandler<CertificationFormData>;
  defaultValues?: ICertificate;
}

const CertificationModal: React.FC<CertificationModalProps> = ({ onClose, onSave, defaultValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<CertificationFormData>({
    defaultValues: defaultValues ? {
      name: defaultValues.name,
      issuedBy: defaultValues.issuedBy,
      year: defaultValues.yearOfIssue
    } : undefined
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {defaultValues ? 'Edit Certification' : 'Add Certification'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certification Name
            </label>
            <input
              {...register('name', { required: 'Certification name is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Board Certification in Cardiology"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issued By
            </label>
            <input
              {...register('issuedBy', { required: 'Issuing organization is required' })}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., American Board of Internal Medicine"
            />
            {errors.issuedBy && <p className="mt-1 text-sm text-red-600">{errors.issuedBy.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year of Issue
            </label>
            <input
              {...register('year', { 
                required: 'Year is required',
                pattern: {
                  value: /^\d{4}$/,
                  message: 'Please enter a valid year (YYYY)'
                }
              })}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 2021"
            />
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#02045e] text-white rounded-md hover:bg-blue-900"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationModal;