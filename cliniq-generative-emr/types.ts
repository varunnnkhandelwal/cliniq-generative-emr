
// Data Models
export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  avatar: string;
  bloodGroup?: string;
  phone?: string;
  lastVisit?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage?: string;
  frequency: string;
  duration: string;
  quantity?: string;
  timing?: string;
  instruction?: string;
}

export enum ComponentType {
  VITALS = 'vitals',
  DIAGNOSIS = 'diagnosis',
  PRESCRIPTION = 'prescription',
  NOTES = 'notes',
  LAB_ORDER = 'lab_order',
  DENTAL_CHART = 'dental_chart',
  FORM = 'form',
  CHECKLIST = 'checklist',
  CHIEF_COMPLAINTS = 'chief_complaints',
  // Phase 2 New Types
  CARDIAC_VITAL = 'cardiac_vitals',
  PEDIATRIC_VITAL = 'pediatric_vitals',
  OBSTETRIC_VITAL = 'obstetric_vitals',
  CARDIAC_EXAM = 'cardiac_examination',
  RESPIRATORY_EXAM = 'respiratory_examination',
  ABDOMINAL_EXAM = 'abdominal_examination',
  NEURO_EXAM = 'neurological_examination',
  MSK_EXAM = 'musculoskeletal_examination',
  DERM_EXAM = 'dermatological_examination',
  EYE_EXAM = 'ophthalmic_examination',
  ENT_EXAM = 'ent_examination',
  RISK_CALC = 'risk_calculator',
  BODY_MAP = 'body_map'
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
  value?: any;
  placeholder?: string;
  width?: 'full' | 'half' | 'third' | 'quarter';
  required?: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface CanvasComponentData {
  id: string;
  type: ComponentType;
  title?: string;
  data: any;
  isEditable: boolean;
  isHighlighted?: boolean; // For sync feedback
}

export interface MedicalTemplate {
  id: string;
  name: string;
  specialty: string;
  components: CanvasComponentData[];
  lastModified: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export type ViewMode = 'patient_session' | 'template_builder';
export type AppFlowStep = 'onboarding' | 'builder' | 'dashboard';

export interface AppState {
  patient: Patient;
  doctorId?: string;
  specialtyContext: string; 
  
  flowStep: AppFlowStep;
  viewMode: ViewMode;
  isChatOpen: boolean;
  tutorialStep: number | null; // 0-4, or null if inactive

  activeComponents: CanvasComponentData[];
  patientChatHistory: ChatMessage[];

  templateComponents: CanvasComponentData[];
  builderChatHistory: ChatMessage[];
  
  savedTemplates: MedicalTemplate[];
  activeTemplateId?: string;
}

export interface ComponentToolArgs {
  action: 'add' | 'remove' | 'update';
  type: ComponentType;
  data?: any;
  title?: string;
}
