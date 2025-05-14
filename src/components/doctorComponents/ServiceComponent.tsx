import React, { useState, useEffect } from 'react';
import { Edit, PlayCircle, StopCircle, X, Plus } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { createService, getServices, updateService } from '@/services/doctor/doctorService';
import { useAuthStoreDoctor } from '@/store/doctor/authStore';
import toast from 'react-hot-toast';

// Type definitions
export interface ServiceData {
  _id?: string;
  name: string;
  mode: 'Online' | 'In-Person' | 'Both';
  fee: number;
  description: string;
  doctorId?: string;
  createdAt?: Date;
  isActive?: boolean;
}

const DoctorServiceListing: React.FC = () => {
  // Auth store for doctor ID
  const { user } = useAuthStoreDoctor();
  const doctorId = user?.id;
  
  // States
  const [services, setServices] = useState<ServiceData[]>([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<ServiceData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // React Hook Form setup
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<ServiceData>({
    defaultValues: {
      name: '',
      mode: 'Online',
      fee: 0,
      description: '',
      isActive: true
    }
  });

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, [doctorId]);

  // Fetch services from API
  const fetchServices = async () => {
    setFetchLoading(true);
    try {
      const response = await getServices(doctorId!);
      if (response.success) {
        setServices(response.data || []);
      } else {
        toast.error(response.message || 'Failed to fetch services');
      }
    } catch (error) {
      toast.error('An error occurred while fetching services');
      console.error('Error fetching services:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Handlers
  const handleViewDetails = (service: ServiceData) => {
    setCurrentService(service);
    setViewModalOpen(true);
  };

  const handleEditService = (service: ServiceData) => {
    setCurrentService(service);
    reset({
      name: service.name,
      mode: service.mode,
      fee: service.fee,
      description: service.description,
      isActive: service.isActive
    });
    setEditModalOpen(true);
  };

  const handleAddNewService = () => {
    setCurrentService(null);
    reset({
      name: '',
      mode: 'Online',
      fee: 0,
      description: '',
      isActive: true
    });
    setEditModalOpen(true);
  };

  const handleToggleActive = async (service: ServiceData) => {
    if (!service._id) {
      toast.error("Service ID is missing");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedService = {
        ...service,
        isActive: !service.isActive
      };
      
      const response = await updateService(updatedService);
      
      if (response.success) {
        // Update local state on success
        setServices(services.map(s => 
          s._id === service._id ? { ...s, isActive: !s.isActive } : s
        ));
        toast.success(`Service ${updatedService.isActive ? 'activated' : 'deactivated'} successfully`);
      } else {
        toast.error(response.message || 'Failed to update service status');
      }
    } catch (error) {
      toast.error('An error occurred while updating service status');
      console.error('Error toggling service status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ServiceData) => {
    if (!doctorId) {
      toast.error("Doctor ID is missing");
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare data with doctorId
      const serviceData = {
        ...data,
        doctorId
      };
      
      
      
      if (currentService?._id) {
        // Update existing service
       const response = await updateService({
          ...serviceData,
          _id: currentService._id,
          doctorId
        });
        
        if (response.success) {
          // Update local state
          setServices(services.map(service => 
            service._id === currentService._id ? { ...response.data } : service
          ));
          toast.success('Service updated successfully') ;
        } else {
          toast.error(response.message || 'Failed to update service');
        }
      } else {
        // Create new service
        const newData = {...data,doctorId}
        console.log("----->",newData);
        
       const response = await createService(newData);
        
        if (response.success) {
          // Add new service to state
          setServices([...services, response.data]);
          toast.success('Service created successfully');
        } else {
          toast.error(response.message || 'Failed to create service');
        }
      }
      
      // Close modal after successful submit
      setEditModalOpen(false);
    } catch (error) {
      toast.error('An error occurred while saving the service');
      console.error('Error submitting service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Schedule & Service Management</h1>
          <div className="flex-grow"></div>
          <button 
            onClick={handleAddNewService}
            className="flex items-center gap-1 bg-[#03045e] text-white px-3 py-2 rounded-md text-sm"
            disabled={isLoading || fetchLoading}
          >
            <Plus size={16} />
            <span className="hidden md:inline">Add Service</span>
          </button>
        </div>

        {/* Service Listing */}
        {fetchLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#03045e]"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-medium text-gray-600">No services available</h3>
            <p className="text-gray-500 mt-2">{"Click 'Add Service' to create your first service"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map(service => (
              <div 
                key={service._id} 
                className={`bg-white rounded-lg shadow-sm border p-4 transition ${!service.isActive ? 'opacity-70' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-lg font-semibold text-[#03045e]">{service.name}</h2>
                  <div className="flex items-center justify-center px-2 py-1 bg-blue-50 rounded-md">
                    <span className="text-xs text-blue-900">{service.mode}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium text-gray-800">₹ {service.fee}</span>
                  </p>
                </div>
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleViewDetails(service)}
                    className="px-4 py-2 bg-[#03045e] text-white rounded-md text-sm w-full mr-2"
                    disabled={isLoading}
                  >
                    View Details
                  </button>
                  
                  <div className="flex items-center">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-2 text-gray-500 hover:text-blue-900"
                      disabled={isLoading}
                    >
                      <Edit size={18} />
                    </button>
                    
                    <button
                      onClick={() => handleToggleActive(service)}
                      className={`p-2 ${service.isActive ? 'text-red-500 hover:text-red-600' : 'text-green-500 hover:text-green-600'}`}
                      disabled={isLoading}
                    >
                      {service.isActive ? <StopCircle size={18} /> : <PlayCircle size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View Details Modal */}
        {viewModalOpen && currentService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Service Details</h2>
                <button onClick={() => setViewModalOpen(false)} className="text-gray-500">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Service Name</h3>
                  <p className="text-gray-800">{currentService.name}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Mode</h3>
                  <p className="text-gray-800">{currentService.mode}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Service Fee</h3>
                  <p className="text-gray-800">₹ {currentService.fee}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="text-gray-800">{currentService.description || 'No description provided'}</p>
                </div>
                
                {currentService.createdAt && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="text-gray-800">
                      {new Date(currentService.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t flex justify-end">
                <button 
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Service Modal with React Hook Form */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  {currentService ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button onClick={() => setEditModalOpen(false)} className="text-gray-500">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Name
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      rules={{ 
                        required: "Service name is required",
                        minLength: { value: 3, message: "Name must be at least 3 characters" }
                      }}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            type="text"
                            placeholder="Enter service name"
                            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Mode
                    </label>
                    <Controller
                      name="mode"
                      control={control}
                      rules={{ required: "Mode is required" }}
                      render={({ field }) => (
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                            <label className="flex items-center mb-2 sm:mb-0">
                              <input
                                type="radio"
                                value="Online"
                                checked={field.value === 'Online'}
                                onChange={() => field.onChange('Online')}
                                className="mr-1"
                              />
                              <span>Online Consultation</span>
                            </label>
                            
                            <label className="flex items-center mb-2 sm:mb-0">
                              <input
                                type="radio"
                                value="In-Person"
                                checked={field.value === 'In-Person'}
                                onChange={() => field.onChange('In-Person')}
                                className="mr-1"
                              />
                              <span>In-Person Visit</span>
                            </label>
                            
                            <label className="flex items-center">
                              <input
                                type="radio"
                                value="Both"
                                checked={field.value === 'Both'}
                                onChange={() => field.onChange('Both')}
                                className="mr-1"
                              />
                              <span>Both</span>
                            </label>
                          </div>
                          {errors.mode && (
                            <p className="mt-1 text-xs text-red-500">{errors.mode.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Fee (₹)
                    </label>
                    <Controller
                      name="fee"
                      control={control}
                      rules={{ 
                        required: "Fee is required",
                        min: { value: 10, message: "Fee must be greater than 10" }
                      }}
                      render={({ field }) => (
                        <div>
                          <input
                            {...field}
                            type="number"
                            placeholder="0"
                            className={`w-full p-2 border ${errors.fee ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {errors.fee && (
                            <p className="mt-1 text-xs text-red-500">{errors.fee.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Controller
                      name="description"
                      control={control}
                      rules={{ 
                        required: "Description is required",
                        maxLength: { value: 500, message: "Description cannot exceed 500 characters" }
                      }}
                      render={({ field }) => (
                        <div>
                          <textarea
                            {...field}
                            placeholder="Enter service description"
                            rows={3}
                            className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {errors.description && (
                            <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <Controller
                      name="isActive"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="mr-2 h-4 w-4 text-blue-600"
                          />
                          <span className="text-sm font-medium text-gray-700">Active Service</span>
                        </label>
                      )}
                    />
                  </div>
                </div>
                
                <div className="p-4 border-t flex justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-[#03045e] text-white rounded-md hover:bg-blue-800 flex items-center"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {currentService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorServiceListing;