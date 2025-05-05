export interface PrescriptionMedicineDTO {
    name: string;
    dosage: string;
    duration: string;
    time_of_consumption: string;
    consumption_method: string;
  }
  
 export interface SubmitPrescriptionPayload {
    appointmentId: string;
    doctorId: string;
    patientId: string;
    medicines: PrescriptionMedicineDTO[];
  }
  