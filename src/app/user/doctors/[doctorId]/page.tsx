"use client"
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getDoctorById } from "@/services/user/auth/authService"; 
import Image from "next/image";
import { CalendarDays, MapPin, MessageCircle, Star, Award, ChevronRight, Clock, User } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useAuthStore } from "@/store/user/authStore";
import { useRouter } from "next/navigation";
// Import types
import { IDoctor, IReview, IEducation, ICertification } from "@/types/IDoctor";
import Header from "@/components/homeComponents/Header";

const DoctorProfile = () => {
  const params = useParams();
  const doctorId = params?.doctorId as string; // Get doctorId from URL
  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleReviews, setVisibleReviews] = useState<number>(3);
  const user = useAuthStore((state)=>state.user)
  const isVerified = useAuthStore((state)=>state.isVerified)
  const router = useRouter()
  

  useEffect(() => {
    if (!doctorId) return;
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const response = await getDoctorById(doctorId as string);
        console.log("data===>",response);
        
        setDoctor(response);
      } catch (err) {
        console.log("Failed to load doctor profile.",err);
        setError("Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorProfile();
  }, [doctorId]);

  const loadMoreReviews = () => {
    setVisibleReviews((prev) => prev + 3);
  };

  const handleBooking = (doctorId:string)=>{
    console.log("handle booking");
    
    console.log(user?.isVerified);
    
    console.log("-->",user);
    
    if(isVerified){
      console.log("hi booking");
      
      router.push(`/user/booking?doctorId=${doctorId}`)
    }else{

      if(user){
        router.push(`/user/completeregistration?doctorId=${doctorId}`)
      }else{
        router.push('/login')
      }
    }

  }

  

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medical-green"></div>
    </div>
  );
  
  if (error) return <p className="text-red-500 text-center p-6">{error}</p>;
  if (!doctor) return <p className="text-center p-6">No doctor information found.</p>;

  // Calculate average rating if available
  const averageRating = doctor.rating && doctor.rating.length > 0 
    ? doctor.rating[0].averageRating 
    : 0;

  const totalReviews = doctor.rating && doctor.rating.length > 0 
    ? doctor.rating[0].totalReviews 
    : 0;

  return (
    <>
    <Header/>
    <div className="max-w-4xl mx-auto p-4 bg-gray-50">
      {/* Doctor Header Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="relative h-24 w-24 rounded-full overflow-hidden">
                {doctor.profileImage ? (
                  <Image
                  src={doctor.profileImage || "/default-doctor.jpg"}
                  alt={doctor.fullName || "Doctor"}
                  fill  //  Automatically replaces layout="fill"
                  className="object-cover" // Replaces objectFit="cover"
                />
                 
                      
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <User size={40} className="text-gray-400" />
                  </div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            {/* Doctor Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{doctor.fullName}</h1>
                  <div className="flex items-center mt-1">
                    <span className="bg-medical-green text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      {doctor.specialization}
                    </span>
                    {doctor.departmentId && (
                      <span className="ml-2 text-sm text-gray-600">
                        {doctor.departmentId.name}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{doctor.experience} years experience</p>
                  
                  {/* Rating */}
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(averageRating)
                              ? "text-yellow-400 fill-yellow-400"
                              : i < averageRating
                              ? "text-yellow-400 fill-yellow-400 opacity-50"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-medium">
                      {averageRating.toFixed(1)}/5
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({totalReviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Location */}
                {doctor.clinicAddress && (
                  <div className="mt-4 md:mt-0 flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="text-medical-green mr-1" />
                    <span>{doctor.clinicAddress.city}, {doctor.clinicAddress.state}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
            onClick={
              ()=>{
                router.push(`/user/chat/${doctorId}`)
              }
            }
             className="flex-1 bg-medical-green hover:bg-medical-green-light text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center">
              <MessageCircle size={18} className="mr-2" />
              Message
            </button>
            <button onClick={()=>handleBooking(doctor._id)} className="flex-1 border border-medical-green text-medical-green hover:bg-medical-green hover:text-white font-medium py-2 px-4 rounded-md transition flex items-center justify-center">
              <CalendarDays size={18} className="mr-2" />
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="col-span-2">
          {/* Education Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Award size={20} className="text-medical-green mr-2" />
              Education
            </h2>
            {doctor.education && doctor.education.length > 0 ? (
              <div className="space-y-4">
                {doctor.education.map((edu: IEducation, index: number) => (
                  <div key={index} className="border-l-2 border-medical-green pl-4 ml-2">
                    <h3 className="font-medium text-gray-800">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                    <p className="text-xs text-gray-500">Completed in {edu.yearOfCompletion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No education information available</p>
            )}
          </div>

          {/* Certifications Section (if available) */}
          {doctor.certifications && doctor.certifications.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Award size={20} className="text-medical-green mr-2" />
                Certifications
              </h2>
              <div className="space-y-4">
                {doctor.certifications.map((cert: ICertification, index: number) => (
                  <div key={index} className="border-l-2 border-gray-200 pl-4 ml-2">
                    <h3 className="font-medium text-gray-800">{cert.name}</h3>
                    <p className="text-sm text-gray-600">Issued by {cert.issuedBy}</p>
                    <p className="text-xs text-gray-500">Year: {cert.yearOfIssue}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Reviews Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Star size={20} className="text-medical-green mr-2" />
                Patient Reviews
              </h2>
              {totalReviews > 0 && (
                <span className="text-sm text-gray-500">{totalReviews} reviews</span>
              )}
            </div>

            {doctor.reviews && doctor.reviews.length > 0 ? (
              <div className="space-y-6">
                {doctor.reviews.slice(0, visibleReviews).map((review: IReview, index: number) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {review.patientId.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">Patient #{review.patientId.substring(0, 6)}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{review.reviewText}</p>
                  </div>
                ))}

                {doctor.reviews.length > visibleReviews && (
                  <button
                    onClick={loadMoreReviews}
                    className="w-full py-2 text-medical-green hover:text-medical-green-light font-medium flex items-center justify-center"
                  >
                    View More Reviews
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-span-1">
          {/* Clinic Information (if available) */}
          {doctor.clinicAddress && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <MapPin size={18} className="text-medical-green mr-2" />
                Clinic Address
              </h2>
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">{doctor.clinicAddress.clinicName}</p>
                <p>{doctor.clinicAddress.street}</p>
                <p>
                  {doctor.clinicAddress.city}, {doctor.clinicAddress.state}{" "}
                  {doctor.clinicAddress.postalCode}
                </p>
                <p>{doctor.clinicAddress.country}</p>
              </div>
            </div>
          )}

          {/* Availability */}
          {doctor.availability && doctor.availability.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold mb-3 flex items-center">
                <Clock size={18} className="text-medical-green mr-2" />
                Availability
              </h2>
              <div className="space-y-2 text-sm">
                {doctor.availability.map((time, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-medical-green mr-2"></div>
                    <span>{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${doctor.isVerified ? "bg-green-500" : "bg-yellow-500"}`}></div>
              <span className={`text-sm font-medium ${doctor.isVerified ? "text-green-500" : "text-yellow-500"}`}>
                {doctor.isVerified ? "Verified Professional" : "Verification Pending"}
              </span>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Member since {format(new Date(doctor.createdAt), "MMMM yyyy")}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorProfile;