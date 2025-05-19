
import DoctorListing from "@/components/userComponents/DoctorListing";
import React, { Suspense } from "react";

const BookingPage = () => {
  return (
    <Suspense
      fallback={<div className="p-8 text-center">Loading booking page...</div>}
    >
      <DoctorListing />
    </Suspense>
  );
};

export default BookingPage;
