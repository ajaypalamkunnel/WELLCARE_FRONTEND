"use client";
import WelcomeDoctor from "@/components/doctorComponents/WelcomeDoctor";
import Loader from "@/components/commonUIElements/Loader";
import { capitalizeFirstLetter } from "@/utils/Naming";
import { fetchDoctorProfile } from "@/services/doctor/authService";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import IDoctorProfileDataType from "@/types/doctorFullDataType";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DoctorAppointmentsPage from "@/components/doctorComponents/AppointmentListing";
export default function DoctorHome() {
  const user = useAuthStoreDoctor((state) => state.user);
  const [doctorData, setDoctorData] = useState<IDoctorProfileDataType>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const getDoctorProfile = async () => {
      setLoading(true);
      try {
        const doctorData = await fetchDoctorProfile();
        setDoctorData(doctorData!);
      } catch (error) {
        toast.error("Error fetching profile");
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    getDoctorProfile();
  }, []);

  const fullName: string = capitalizeFirstLetter(user?.fullName|| "Doctor");

  return (
    <>
      {user?.isSubscribed ? (
        <DoctorAppointmentsPage />
      ) : (
        <div>
          {loading ? (
            <Loader />
          ) : (
            <WelcomeDoctor
              doctorName={fullName}
              isVerified={doctorData?.isVerified?? false}
              status={doctorData?.status ?? 0}
              rejectReason={doctorData?.rejectReason}
            />
          )}
        </div>
      )}
    </>
  );
}
