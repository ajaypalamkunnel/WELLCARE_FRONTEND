import PatientInformationForm from "@/components/userComponents/PatientInformationForm";
import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <PatientInformationForm />
    </Suspense>
  );
};

export default Page;
