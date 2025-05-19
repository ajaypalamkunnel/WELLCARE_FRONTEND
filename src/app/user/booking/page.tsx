import React, { Suspense } from "react";
import DoctorSchedule from "../../../components/userComponents/DoctorSchedule";

const BookingPage = () => {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading booking page...</div>}>
      <DoctorSchedule />
    </Suspense>
  );
};

export default BookingPage;
