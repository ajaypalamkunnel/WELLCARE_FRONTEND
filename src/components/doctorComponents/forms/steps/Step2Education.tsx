"use client"
import React from 'react';
import { GraduationCap, Award, Calendar, Building, Plus, Trash2 } from 'lucide-react';
import { ICertificate, IEducation } from '@/types/doctorFullDataType';

interface Step2EducationProps {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
  getValues: any;
  control: any;
}

const Step2Education: React.FC<Step2EducationProps> = ({ 
  register, errors, watch, setValue, getValues, control 
}) => {
  // Get education fields from form
  const educationFields = watch('education') || [];
  const certificationFields = watch('certifications') || [];

  const addEducation = () => {
    const currentEducation = getValues('education') || [];
    setValue('education', [
      ...currentEducation, 
      { degree: '', institution: '', yearOfCompletion: '' }
    ]);
  };

  const removeEducation = (index: number) => {
    const currentEducation = getValues('education') || [];
    setValue('education', currentEducation.filter((_: IEducation, i: number) => i !== index));
  };

  const addCertification = () => {
    const currentCertifications = getValues('certifications') || [];
    setValue('certifications', [
      ...currentCertifications, 
      { name: '', issuedBy: '', yearOfIssue: '' }
    ]);
  };

  const removeCertification = (index: number) => {
    const currentCertifications = getValues('certifications') || [];
    setValue('certifications', currentCertifications.filter((_: ICertificate, i: number) => i !== index));
  };

  // Initialize with empty arrays if not already set
  React.useEffect(() => {
    if (!getValues('education')) {
      setValue('education', [{ degree: '', institution: '', yearOfCompletion: '' }]);
    }
    if (!getValues('certifications')) {
      setValue('certifications', [{ name: '', issuedBy: '', yearOfIssue: '' }]);
    }
  }, [getValues, setValue]);

  return (
    <div className="animate-fade-in">
      <h2 className="step-title mb-6">Education & Certification Details</h2>
      
      <div className="space-y-8">
        {/* Education Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Education</h3>
            <button
              type="button"
              onClick={addEducation}
              className="inline-flex items-center px-3 py-1.5 bg-deep-blue text-white text-sm font-medium rounded-md hover:bg-opacity-90 transition-all"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </button>
          </div>
          
          <div className="space-y-4">
            {educationFields.map((field: IEducation, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Education #{index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Degree Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="MD, MBBS, PhD"
                        {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                      />
                      <GraduationCap className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.education?.[index]?.degree && (
                      <p className="error-text">{errors.education[index].degree.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Institution Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Harvard Medical School"
                        {...register(`education.${index}.institution`, { required: 'Institution is required' })}
                      />
                      <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.education?.[index]?.institution && (
                      <p className="error-text">{errors.education[index].institution.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Year of Completion</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="form-input pl-10"
                        placeholder="2020"
                        min="1950"
                        max={new Date().getFullYear()}
                        {...register(`education.${index}.yearOfCompletion`, { 
                          required: 'Year is required',
                          valueAsNumber: true,
                          min: {
                            value: 1950,
                            message: 'Year must be 1950 or later'
                          },
                          max: {
                            value: new Date().getFullYear(),
                            message: 'Year cannot be in the future'
                          }
                        })}
                      />
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.education?.[index]?.yearOfCompletion && (
                      <p className="error-text">{errors.education[index].yearOfCompletion.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Certifications</h3>
            <button
              type="button"
              onClick={addCertification}
              className="inline-flex items-center px-3 py-1.5 bg-deep-blue text-white text-sm font-medium rounded-md hover:bg-opacity-90 transition-all"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Certification
            </button>
          </div>
          
          <div className="space-y-4">
            {certificationFields.map((field: ICertificate, index: number) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Certification #{index + 1}</h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeCertification(index)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Certification Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="Board Certification"
                        {...register(`certifications.${index}.name`, { required: 'Certification name is required' })}
                      />
                      <Award className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.certifications?.[index]?.name && (
                      <p className="error-text">{errors.certifications[index].name.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Issued By</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="form-input pl-10"
                        placeholder="American Board of Medicine"
                        {...register(`certifications.${index}.issuedBy`, { required: 'Issuer is required' })}
                      />
                      <Building className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.certifications?.[index]?.issuedBy && (
                      <p className="error-text">{errors.certifications[index].issuedBy.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="form-label">Year of Issue</label>
                    <div className="relative">
                      <input
                        type="number"
                        className="form-input pl-10"
                        placeholder="2021"
                        min="1950"
                        max={new Date().getFullYear()}
                        {...register(`certifications.${index}.yearOfIssue`, { 
                          required: 'Year is required',
                          valueAsNumber: true,
                          min: {
                            value: 1950,
                            message: 'Year must be 1950 or later'
                          },
                          max: {
                            value: new Date().getFullYear(),
                            message: 'Year cannot be in the future'
                          }
                        })}
                      />
                      <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                    {errors.certifications?.[index]?.yearOfIssue && (
                      <p className="error-text">{errors.certifications[index].yearOfIssue.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2Education;
