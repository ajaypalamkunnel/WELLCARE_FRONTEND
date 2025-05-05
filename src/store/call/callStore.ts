import { create } from 'zustand'


interface CallState {
    incomingCallFrom: string | null;
    callerName: string | null;  
    showCallModal: boolean;
    remoteUserName: string | null;
    appointmentId:string|null;
    patientId:string|null
    prescriptionSubmitted: boolean,
    setPrescriptionSubmitted:(submitted:boolean) =>void 
    setIncomingCall: (callerId: string,name:string) => void
    clearCall: () => void;
    setCallerDetails:(name:string,appointmentId:string,patientId:string)=>void
}


export const useCallStore = create<CallState>((set) => ({
    incomingCallFrom: null,
    callerName: null,
    showCallModal: false,
    remoteUserName: null,
    appointmentId:null,
    patientId:null,
    prescriptionSubmitted:false,
    setPrescriptionSubmitted: (submitted) => set({ prescriptionSubmitted: submitted }),
    setIncomingCall: (callerId, name) =>
        set({ incomingCallFrom: callerId,callerName:name, showCallModal: true }),
    clearCall: () => set({ incomingCallFrom: null, showCallModal: false,remoteUserName:null,appointmentId:null,patientId:null,prescriptionSubmitted:false }),
    setCallerDetails:(name,appointmentId,patientId)=>set({remoteUserName:name,appointmentId:appointmentId,patientId:patientId})

}))