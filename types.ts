export interface CSVRow {
  "WO #"?: string;
  "Event/Activity"?: string;
  "Problem Description"?: string;
  "Status"?: string;
  "Site No."?: string;
  "Site Type"?: string;
  "Site Name"?: string;
  "Contractor"?: string;
  "Priority"?: string;
  "Date/Time Created"?: string;
  "Date Completed"?: string;
  // Add other loose fields if necessary
  [key: string]: any;
}

export interface FormState {
  ednNumber: string;
  storeNumberName: string;
  dbId: string;
  description: string;
  
  // Protective Device
  bsEn: string;
  type: string;
  rating: string;
  
  // Conductor
  csaLive: string;
  csaCpc: string;
  
  // Test Results
  ze: string;
  zs: string;
  r1r2: string;
  rcd: string;
  
  dateCompleted: string;
  won: string;
  technicianName: string;
  supervisorName: string;

  // Images
  image1: string | null;
  image2: string | null;
}

export const INITIAL_FORM_STATE: FormState = {
  ednNumber: "",
  storeNumberName: "",
  dbId: "",
  description: "",
  bsEn: "",
  type: "",
  rating: "",
  csaLive: "",
  csaCpc: "",
  ze: "",
  zs: "",
  r1r2: "",
  rcd: "",
  dateCompleted: "",
  won: "",
  technicianName: "",
  supervisorName: "",
  image1: null,
  image2: null,
};