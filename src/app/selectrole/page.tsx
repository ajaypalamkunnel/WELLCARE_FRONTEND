"use client"
import { useState } from "react";
import { RoleCard } from "../../components/selectRole/RoleCard";
import { useRouter } from "next/navigation";
const Page = () =>{
    const router = useRouter()
    const [selectedRole, setSelectedRole] = useState<"patient" | "doctor" | null>(null);
  
    const handleJoin = () => {
      if (selectedRole==="patient") {
        console.log(`Joining as ${selectedRole}`);
        router.push("/signup")
      }else{
        router.push('/doctor/signup')
      }
    };
  
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join as a Doctor or Patient</h1>
            <p className="text-gray-600">Select your role to get started</p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <RoleCard
              type="patient"
              selected={selectedRole === "patient"}
              onSelect={() => setSelectedRole("patient")}
            />
            <RoleCard
              type="doctor"
              selected={selectedRole === "doctor"}
              onSelect={() => setSelectedRole("doctor")}
            />
          </div>
  
          <div className="space-y-4 max-w-xl mx-auto">
            <button
              onClick={handleJoin}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300
                ${
                  selectedRole
                    ? "bg-medical-green text-white shadow-lg hover:bg-opacity-90"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              disabled={!selectedRole}
            >
              Join
            </button>
  
            <div className="text-center">
              <a
                href="/login"
                className="text-gray-600 hover:text-medical-green transition-colors duration-200"
              >
                Already have an account? Log In
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Page