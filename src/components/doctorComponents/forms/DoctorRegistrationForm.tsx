"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Rocket, Loader } from "lucide-react";

import { useRouter } from "next/navigation";
// Import Steps Components
import FormProgress from "../forms/steps/FormProgress";
import Step1Profile from "../forms/steps/Step1Profile";
import Step2Education from "../forms/steps/Step2Education";
import Step3Documents from "../forms/steps/Step3Documents";
import Step4Review from "../forms/steps/Step4Review";
import axios from "axios";
import { doctorRegistration } from "@/services/doctor/doctorService";
import toast from "react-hot-toast";
import { DoctorFormValues, ICertificate, IEducation } from "@/types/doctorRegistrationFormTypes";


const steps = [
  { id: 1, name: "Profile" },
  { id: 2, name: "Education" },
  { id: 3, name: "Documents" },
  { id: 4, name: "Review" },
];

const DoctorRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    getValues,
  } = useForm<DoctorFormValues>({
    mode: "all", // Validate form on change
    defaultValues: {
      education: [{ degree: "", institution: "", yearOfCompletion: "" }],
      certifications: [{ name: "", issuedBy: "", yearOfIssue: "" }],
    },
  });

  //------------------------------ cloudinary uploading-------------------------------------

  const uploadToCloudinary = async (file: File | string) => {
    if (typeof file === "string") return file;
    console.log(typeof file);

    if (!(file instanceof File)) {
      console.error("Invalid file format for Cloudinary upload.");
      toast.error("Invalid file format.");
      return null;
    }

    
    const CLOUDINARY_CLOUD_NAME = "dy3yrxbmg";
    const CLOUDINARY_UPLOAD_PRESET = "doctor-documents";

    const isImage = file.type.startsWith("image/");
    const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${
      isImage ? "image/upload" : "raw/upload"
    }`;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      toast.error("Failed to upload document to Cloudinary.");
      return null;
    }
  };
  const router = useRouter();
  //--------------------------------- Handle form submission--------------------------------
  const onSubmit = async (data: DoctorFormValues) => {
    
    

    setLoading(true);

    if (!data.licenseDocument) {
    setError("licenseDocument", {
      type: "manual",
      message: "Please upload license document",
    });
    setLoading(false);
    return;
  }

  if (!data.IDProofDocument) {
    setError("IDProofDocument", {
      type: "manual",
      message: "Please upload ID proof document",
    });
    setLoading(false);
    return;
  }


    // Extract the first file from FileList using type guard
    const isFileList = (value: unknown): value is FileList => {
      return (
        value instanceof FileList ||
        (typeof value === "object" &&
          value !== null &&
          "length" in value &&
          typeof (value as FileList).item === "function")
      );
    };

    const licenseDocFile = isFileList(data.licenseDocument)
      ? data.licenseDocument[0]
      : data.licenseDocument;
    const idProofFile = isFileList(data.IDProofDocument)
      ? data.IDProofDocument[0]
      : data.IDProofDocument;

    // Upload files
    const avatarUrl = data.profileImage
      ? await uploadToCloudinary(data.profileImage)
      : null;
    const licenseDocUrl = licenseDocFile
      ? await uploadToCloudinary(licenseDocFile)
      : null;
    const idProofUrl = idProofFile
      ? await uploadToCloudinary(idProofFile)
      : null;
    

    if (!avatarUrl || !licenseDocUrl || !idProofUrl) {
      toast.error("File upload failed. Please try again.");
      return;
    }

   
    const doctorProfileData = {
      ...data,
      profileImage: avatarUrl,
      licenseDocument: licenseDocUrl,
      IDProofDocument: idProofUrl,
    };
    console.log("Final Payload Sent to API:", doctorProfileData);
    try {
      const responseData = await doctorRegistration({ ...doctorProfileData });
      console.log("Form response : ",responseData);
      
      if(responseData && responseData.success){

        toast.success("Registration Successfull it will verified by Administarative Team");

        setTimeout(()=>{
          router.push("/doctordashboard/home")
        },3000)


      }
    } catch (error) {
      toast.error("Failed to submit registration. Please try again.");
      console.error("Error submitting registration:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  //-------------------------- Navigate to next step-------------------------------------
  const goToNextStep = async () => {
    // Check if current step is valid
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const stepValid = await validateFields(fieldsToValidate);

    if (!stepValid) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    if (currentStep < steps.length) {
      animateStepChange(() => {
        setCurrentStep((prev) => prev + 1);
      });
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      animateStepChange(() => {
        setCurrentStep((prev) => prev - 1);
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
        return [
          "fullName",
          "gender",
          "email",
          "phoneNumber",
          "departmentId",
          "experience",
          "profileImage",
        ];
      case 2:
        return ["education", "certifications"];
      case 3:
        return ["licenseNumber", "licenseDocument", "IDProofDocument"];
      default:
        return [];
    }
  };

  // Validate specific fields
  const validateFields = async (fields: string[]) => {
    handleSubmit(() => {})();
    if (fields.length === 0) return true;

    const hasErrors = fields.some((field) => {
      if (field === "education") {
        const education = watch("education");
        return education.some(
          (edu:IEducation, index: number) =>
            errors.education && errors.education[index]
        );
      }
      if (field === "certifications") {
        const certifications = watch("certifications");
        return certifications.some(
          (cert: ICertificate, index: number) =>
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
        return (
          <Step1Profile
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        );
      case 2:
        return (
          <Step2Education
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            getValues={getValues}
            
          />
        );
      case 3:
        return (
          <Step3Documents
            register={register}
            errors={errors}
            setValue={setValue}
          />
        );
      case 4:
        return <Step4Review formData={watch()} onEdit={handleEditStep} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mt-5 mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-container">
          <FormProgress currentStep={currentStep} steps={steps} />

          <div
            className={`transition-opacity duration-300 ${
              animating ? "opacity-0" : "opacity-100"
            }`}
          >
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
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>
                    <Rocket className="w-5 h-5 mr-2" />
                    Submit Registration
                  </>
                )}

                {/* <Rocket className="w-5 h-5 ml-2" /> */}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DoctorRegistrationForm;
