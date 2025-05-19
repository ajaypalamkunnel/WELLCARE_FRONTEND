import React, { Suspense } from "react";
import AuthSuccess from "../../components/userComponents/AuthSuccess";

const Page = () => {
  return (
    <Suspense fallback={<div className="p-6 text-center">Logging in...</div>}>
      <AuthSuccess />
    </Suspense>
  );
};

export default Page;
