import { Stethoscope } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
interface WelcomeDoctorProps {
  doctorName: string;
  isVerified: boolean;
  status: number;
  rejectReason?: string;
}
const WelcomeDoctor: React.FC<WelcomeDoctorProps> = ({
  doctorName,
  isVerified,
  status,
  rejectReason,
}) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push("/doctordashboard/registration");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center max-w-md w-full">
        {/* Icon */}

        {/* Welcome Text */}
        <div className="mb-2 text-sm text-gray-600 font-medium">
          <Stethoscope className="mx-auto mb-8" size={40} color="#03045e" />
          WELCOME TO WELL CARE
        </div>

        {/* Doctor Name */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-[#03045e]">
          Welcome, Dr. {doctorName}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8 text-sm md:text-base">
          {`We're excited to have you on board. Complete your registration to
          start providing quality care.`}
        </p>

        {/* Button */}
        {!isVerified && status !== 2 && (
          <button
            onClick={handleNavigate}
            className="bg-[#03045e] text-white px-6 py-3 rounded-md font-medium 
        hover:bg-[#02034d] transition-colors duration-200 text-sm md:text-base
        focus:outline-none focus:ring-2 focus:ring-[#03045e] focus:ring-offset-2"
          >
            Complete Your Registration
          </button>
        )}
        {status === 2 && (
          <h3 className="font-semibold text-[#03045e]">
            You have already completed your registration it will verify by
            Administrative team
          </h3>
        )}

        {status === -2 && (
          <div>
            <h3 className="font-semibold text-[#03045e]">
              Your Application rejected contact administarative team{" "}
            </h3>
            {rejectReason && (
              <h3 className="font-semibold text-[#03045e]">
                Reason: {rejectReason}
              </h3>
            )}

            <a href="wellcareservice@gmail.com">wellcareservice@gmail.com</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeDoctor;
