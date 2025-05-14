import { submitPrescription } from "@/services/doctor/doctorService";
import { useCallStore } from "@/store/call/callStore";
import { useAuthStoreDoctor } from "@/store/doctor/authStore";
import { Dialog } from "@headlessui/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface PrescriptionMedicine {
  name: string;
  dosage: string;
  duration: string;
  timesOfConsumption: string;
  consuptionMethod: string;
}
const PrescriptionForm: React.FC = () => {
  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      name: "",
      dosage: "",
      duration: "",
      timesOfConsumption: "",
      consuptionMethod: "",
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const appointmentId = useCallStore((state) => state.appointmentId);
  const doctorId = useAuthStoreDoctor().user?.id;
  const patientId = useCallStore((state) => state.patientId);

  const addMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: "",
        dosage: "",
        duration: "",
        timesOfConsumption: "",
        consuptionMethod: "",
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle prescription submission
    console.log("Prescription submitted:", medicines);
    setShowModal(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);

    try {
      const formattedMedicines = medicines.map((m) => ({
        name: m.name,
        dosage: m.dosage,
        duration: m.duration,
        time_of_consumption: m.timesOfConsumption,
        consumption_method: m.consuptionMethod,
      }));


      await submitPrescription({
        appointmentId: appointmentId!,
      doctorId: doctorId!,
      patientId: patientId!,
      medicines: formattedMedicines,
      })
      toast.success("Prescription submitted and emailed successfully.");
      useCallStore.getState().setPrescriptionSubmitted(true);
    
    setMedicines([{ name: '', dosage: '', duration: '', timesOfConsumption: '', consuptionMethod: '' }]);
    setShowModal(false);
    } catch (error) {
      console.log("Failed to submit prescription.",error);
      toast.error("Failed to submit prescription.");
    }finally{
      setLoading(false)
    }
  };

  const updateMedicine = (
    index: number,
    field: keyof PrescriptionMedicine,
    value: string
  ) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-1">
        Prescription & Treatment Plan
      </h2>
      <p className="text-sm text-gray-400 mb-4">
        Fill in the prescription details below
      </p>

      <form onSubmit={handleSubmit}>
        {medicines.map((medicine, index) => (
          <div key={index} className="mb-6 p-3 bg-gray-900 rounded-lg">
            <div className="mb-3">
              <label className="block text-sm mb-1">Medicine name</label>
              <input
                type="text"
                placeholder="Enter medicine name"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={medicine.name}
                onChange={(e) => updateMedicine(index, "name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm mb-1">Dosage</label>
                <input
                  type="text"
                  placeholder="e.g., 500mg"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={medicine.dosage}
                  onChange={(e) =>
                    updateMedicine(index, "dosage", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 7 days"
                  className="w-full p-2 rounded bg-gray-700 text-white"
                  value={medicine.duration}
                  onChange={(e) =>
                    updateMedicine(index, "duration", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="mb-2">
              <label className="block text-sm mb-1">Times of consumption</label>
              <input
                type="text"
                placeholder="e.g., Morning/night"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={medicine.timesOfConsumption}
                onChange={(e) =>
                  updateMedicine(index, "timesOfConsumption", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">consumption Method</label>
              <input
                type="text"
                placeholder="e.g., before food/after food"
                className="w-full p-2 rounded bg-gray-700 text-white"
                value={medicine.consuptionMethod}
                onChange={(e) =>
                  updateMedicine(index, "consuptionMethod", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addMedicine}
          className="mb-4 flex items-center gap-2 text-blue-400 font-medium"
        >
          <Plus size={18} /> Add Medicine
        </button>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 rounded-md font-medium"
        >
          Submit Prescription
        </button>
      </form>

      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        className="fixed z-50 inset-0"
      >
        <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <Dialog.Title className="text-lg font-semibold">
              Confirm Submission
            </Dialog.Title>
            <p className="mt-2 text-sm text-gray-600">
              Please review the prescription carefully before submitting. Once
              submitted, a PDF will be emailed to the patient.
            </p>

            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSubmit}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md"
              >
                {loading ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PrescriptionForm;
