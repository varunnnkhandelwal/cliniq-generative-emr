
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ChatMessage, ComponentType, ViewMode, CanvasComponentData } from "../types";
import { analyzeDatabaseStructure, mapDatabaseToComponents, DatabaseSchema } from "./databaseAnalysis";

/**
 * Phase 2 Component Library Config
 */
export const COMPONENT_LIBRARY = [
  { id: ComponentType.VITALS, label: 'Basic Vitals', icon: 'Activity' },
  { id: ComponentType.CARDIAC_EXAM, label: 'Cardiac Exam', icon: 'Heart' },
  { id: ComponentType.PRESCRIPTION, label: 'Medications', icon: 'Pill' },
  { id: ComponentType.RISK_CALC, label: 'Risk Calculators', icon: 'Calculator' },
  { id: ComponentType.DENTAL_CHART, label: 'Dental Chart', icon: 'Smile' },
  { id: ComponentType.CHIEF_COMPLAINTS, label: 'Complaints', icon: 'Stethoscope' },
  { id: ComponentType.BODY_MAP, label: 'Body Map', icon: 'Map' },
];

export const DOCTOR_DATABASE = [
  {
    "doctor_id": "DOC001",
    "name": "Dr. Rajesh Kumar",
    "specialty": "Cardiologist",
    "qualification": "MBBS, MD (Cardiology), DM (Cardiology)",
    "years_of_experience": 15,
    "clinic_name": "HeartCare Cardiac Center",
    "common_diagnoses": ["Hypertension", "Coronary Artery Disease", "Heart Failure"],
    "common_meds": ["Aspirin 75mg", "Metoprolol 50mg", "Atorvastatin 20mg"]
  },
  {
    "doctor_id": "DOC002",
    "name": "Dr. Priya Sharma",
    "specialty": "General Practitioner",
    "qualification": "MBBS",
    "years_of_experience": 8,
    "clinic_name": "City General Clinic",
    "common_diagnoses": ["Upper Respiratory Infection", "Fever", "Hypertension"],
    "common_meds": ["Paracetamol 500mg", "Amoxicillin 500mg"]
  },
  {
    "doctor_id": "DOC003",
    "name": "Dr. Amit Desai",
    "specialty": "Dentist",
    "qualification": "BDS, MDS (Conservative Dentistry & Endodontics)",
    "years_of_experience": 12,
    "clinic_name": "SmileCare Dental Clinic",
    "common_diagnoses": ["Dental Caries", "Pulpitis", "Gingivitis"],
    "common_meds": ["Amoxicillin 500mg", "Ibuprofen 400mg"]
  },
  {
    "doctor_id": "DOC004",
    "name": "Dr. Sneha Reddy",
    "specialty": "General Practitioner",
    "qualification": "MBBS",
    "years_of_experience": 0,
    "clinic_name": "Community Health Center",
    "common_diagnoses": [],
    "common_meds": []
  },
  {
    "doctor_id": "DOC005",
    "name": "Dr. Anita Verma",
    "specialty": "Pediatrician",
    "qualification": "MBBS, MD (Pediatrics), DCH",
    "years_of_experience": 10,
    "clinic_name": "Little Angels Child Care",
    "common_diagnoses": ["URI", "Fever", "Vaccination"],
    "common_meds": ["Paracetamol Syrup", "Amoxicillin Suspension"]
  },
  {
    "doctor_id": "DOC006",
    "name": "Dr. Vikram Singh",
    "specialty": "Internal Medicine",
    "qualification": "MBBS, MD (Internal Medicine)",
    "years_of_experience": 18,
    "clinic_name": "Metro City Hospital",
    "common_diagnoses": ["Diabetes Mellitus Type 2", "Hypertension", "Hypothyroidism"],
    "common_meds": ["Metformin 500mg", "Atorvastatin 20mg"]
  },
  {
    "doctor_id": "DOC007",
    "name": "Dr. Kavita Menon",
    "specialty": "Dermatologist",
    "qualification": "MBBS, MD (Dermatology)",
    "years_of_experience": 9,
    "clinic_name": "Glow Dermatology Clinic",
    "common_diagnoses": ["Acne Vulgaris", "Atopic Dermatitis", "Psoriasis"],
    "common_meds": ["Tretinoin Cream", "Clindamycin Gel"]
  },
  {
    "doctor_id": "DOC008",
    "name": "Dr. Rahul Joshi",
    "specialty": "Orthopedic Surgeon",
    "qualification": "MBBS, MS (Orthopedics)",
    "years_of_experience": 14,
    "clinic_name": "BoneHealth Orthopedic Center",
    "common_diagnoses": ["Osteoarthritis", "Fracture", "Low Back Pain"],
    "common_meds": ["Diclofenac 50mg", "Calcium + Vitamin D3"]
  }
];

const manageCanvasFunction: FunctionDeclaration = {
  name: "manageCanvas",
  description: "Adds, updates, or removes medical UI components. Use 'update' for Chat-to-Form synchronization (filling values like BP or symptoms).",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: { type: Type.STRING, enum: ["add", "remove", "update"] },
      type: { type: Type.STRING, enum: ["vitals", "diagnosis", "prescription", "notes", "lab_order", "form", "checklist", "chief_complaints", "dental_chart", "body_map"] },
      title: { type: Type.STRING },
      data: { 
        type: Type.OBJECT, 
        nullable: true,
        description: "For 'vitals', pass {bp: '120/80'}. For 'form', pass {fields: [{id: 'f1', value: 'New Val'}]}. For 'chief_complaints', pass {tags: ['Tag1']}."
      }
    },
    required: ["action", "type"]
  }
};

class GeminiService {
  private ai: GoogleGenAI | null = null;
  private modelName = 'gemini-1.5-flash'; // Using 1.5-flash for better free tier limits
  private apiKey: string = '';

  constructor() {
    // Try to get API key from environment or localStorage
    const envKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
    const key = envKey || storedKey || '';
    
    if (key) {
      this.setApiKey(key);
    }
  }

  setApiKey(key: string) {
    this.apiKey = key;
    if (key) {
      try {
        this.ai = new GoogleGenAI({ apiKey: key });
        console.log('✅ Gemini API key configured');
      } catch (e) {
        console.error('Error initializing Gemini:', e);
      }
    }
  }

  hasApiKey(): boolean {
    return !!this.apiKey;
  }

  // Fallback method using direct fetch API
  async sendMessageDirect(prompt: string, systemPrompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
  }

  getDoctorById(id: string) {
    return DOCTOR_DATABASE.find(d => d.doctor_id === id) || DOCTOR_DATABASE[0];
  }

  async getInitialTemplateForDoctor(doctorId: string): Promise<CanvasComponentData[]> {
    const doctor = this.getDoctorById(doctorId);
    const specialty = doctor.specialty || 'General Practitioner';
    
    const components: any[] = [];
    const timestamp = Date.now();

    // Step 1: Analyze database structure (multi-source analysis)
    console.log('🔍 Analyzing database structure...');
    const dbAnalysis = await analyzeDatabaseStructure();
    console.log(`📊 Database analysis confidence: ${(dbAnalysis.overall_confidence * 100).toFixed(1)}%`);
    
    // Step 2: Determine component requirements based on database analysis + specialty
    const dbComponents = dbAnalysis.recommended_components;
    
    // Step 3: Merge database requirements with specialty-specific requirements
    // Always add Chief Complaints (pre-filled)
    components.push({ 
      type: ComponentType.CHIEF_COMPLAINTS, 
      title: "Chief Complaints", 
      data: { tags: doctor.common_diagnoses || [] }
    });

    // Add components based on database analysis confidence
    if (dbAnalysis.overall_confidence > 0.5) {
      // High/Medium confidence - use database-driven components
      dbComponents.forEach(dbComp => {
        if (dbComp.type === 'vitals') {
          // Map database vitals to component
          if (specialty.includes('Cardio')) {
            components.push({ 
              type: ComponentType.VITALS, 
              title: "Cardiac Vitals", 
              data: { bp: "", pulse: "", spo2: "", jvp: "" }
            });
          } else if (specialty.includes('Pediatric')) {
            components.push({ 
              type: ComponentType.VITALS, 
              title: "Pediatric Vitals", 
              data: { weight: "", height: "", head: "", temp: "" }
            });
          } else {
            components.push({ 
              type: ComponentType.VITALS, 
              title: "Vital Signs", 
              data: { bp: "", pulse: "", temp: "" }
            });
          }
        }
        
        if (dbComp.type === 'prescription') {
          components.push({ 
            type: ComponentType.PRESCRIPTION, 
            title: "Medications", 
            data: { medications: (doctor.common_meds || []).map(m => ({ 
              id: Math.random().toString(), 
              name: m, 
              frequency: "1-0-1", 
              duration: "5 days" 
            })) }
          });
        }
      });
    } else {
      // Low confidence - fallback to specialty-based logic
      console.log('⚠️ Low database confidence, using specialty-based fallback');
    }

    // Step 4: Add specialty-specific components (regardless of DB confidence)
    if (specialty.includes('Cardio')) {
      components.push({ 
        type: ComponentType.FORM, 
        title: "Cardiac Examination", 
        data: { fields: [
          { id: 'h1', label: 'Heart Sounds', type: 'select', options: ['Normal', 'Murmur'], width: 'half' }, 
          { id: 'edema', label: 'Pedal Edema', type: 'checkbox', width: 'half' }
        ] }
      });
      components.push({ 
        type: ComponentType.CHECKLIST, 
        title: "Risk Calculators", 
        data: { items: [
          { id: 'ascvd', label: 'ASCVD Risk', checked: false }, 
          { id: 'vasc', label: 'CHA2DS2-VASc', checked: false }
        ] }
      });
    } else if (specialty.includes('Dentist')) {
      components.push({ 
        type: ComponentType.DENTAL_CHART, 
        title: "Dental Charting", 
        data: {}
      });
      components.push({ 
        type: ComponentType.FORM, 
        title: "Oral Hygiene", 
        data: { fields: [
          { id: 'oh1', label: 'Gingival Status', type: 'select', options: ['Healthy', 'Gingivitis'], width: 'full' }
        ] }
      });
    } else if (specialty.includes('Pediatric')) {
      components.push({ 
        type: ComponentType.FORM, 
        title: "Growth Chart", 
        data: { fields: [
          { id: 'pct', label: 'Weight Percentile', type: 'number', width: 'half' }
        ] }
      });
    } else if (specialty.includes('Derm')) {
      components.push({ 
        type: ComponentType.BODY_MAP, 
        title: "Skin Lesion Map", 
        data: {}
      });
      components.push({ 
        type: ComponentType.FORM, 
        title: "Dermatological Exam", 
        data: { fields: [
          { id: 'd1', label: 'Primary Lesion', type: 'text', width: 'full' }
        ] }
      });
    }

    // Ensure prescription is added if not already from DB analysis
    if (!components.some(c => c.type === ComponentType.PRESCRIPTION)) {
      components.push({ 
        type: ComponentType.PRESCRIPTION, 
        title: "Medications", 
        data: { medications: (doctor.common_meds || []).map(m => ({ 
          id: Math.random().toString(), 
          name: m, 
          frequency: "1-0-1", 
          duration: "5 days" 
        })) }
      });
    }

    console.log(`✅ Generated ${components.length} components with confidence: ${dbAnalysis.overall_confidence.toFixed(2)}`);

    return components.map((c, idx) => ({
      id: `init-${idx}-${timestamp}`,
      type: c.type,
      title: c.title,
      data: c.data,
      isEditable: true
    }));
  }

  async sendMessage(
    history: ChatMessage[], 
    newMessage: string, 
    specialty: string,
    currentCanvasState: string,
    mode: ViewMode
  ): Promise<{ text: string; toolCalls?: any[] }> {
    
    const doctor = DOCTOR_DATABASE.find(d => 
        (d.specialty || '').toLowerCase().includes(specialty.toLowerCase())
    ) || DOCTOR_DATABASE[0];
    
    // Get database analysis for context
    const dbAnalysis = await analyzeDatabaseStructure();
    
    const systemInstruction = `
      You are CliniQ Phase 2 Intelligent Scribe for ${doctor.name}, a ${doctor.specialty}.
      
      CRITICAL INSTRUCTION: You MUST ALWAYS provide a text response for every user message. 
      Even if you call 'manageCanvas' to update the UI, you MUST verbally confirm what you did in the chat.
      
      DATABASE ANALYSIS CONTEXT:
      - Overall Confidence: ${(dbAnalysis.overall_confidence * 100).toFixed(1)}%
      - Analysis Methods Used: ${Object.keys(dbAnalysis.methods).join(', ')}
      - Recommended Components from DB: ${dbAnalysis.recommended_components.map(c => c.type).join(', ')}
      
      PHASE 2 FEATURE: CHAT-TO-FORM SYNC
      When a doctor mentions clinical values (e.g. "BP is 120/80"), trigger 'manageCanvas' with action 'update'.
      
      Doctor Context:
      - Qualification: ${doctor.qualification}
      - Experience: ${doctor.years_of_experience} years
      - Common Diagnoses: ${doctor.common_diagnoses.join(', ')}
      - Common Medications: ${doctor.common_meds.join(', ')}
      
      Canvas Context: ${currentCanvasState}

      1. Identify clinical parameters and map them to existing components.
      2. If a new section is requested, use action 'add'.
      3. Consider database structure when suggesting components.
      4. Use slash commands knowledge if the user starts with '/'.
      
      Keep responses concise and clinical. Reference database analysis when relevant.
    `;

    if (!this.apiKey) {
      return { 
        text: "⚠️ API key not configured. Please add your Gemini API key in the login screen.", 
        toolCalls: [] 
      };
    }

    try {
      console.log('📤 Sending message to Gemini API...');
      console.log('Model:', this.modelName);
      
      // Use direct fetch API for more reliable connection
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      
      // Build conversation for context
      const conversationContext = history
        .filter(h => h.role !== 'system')
        .map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
        .join('\n');
      
      const fullPrompt = conversationContext 
        ? `Previous conversation:\n${conversationContext}\n\nUser: ${newMessage}`
        : newMessage;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ 
            role: 'user',
            parts: [{ text: fullPrompt }] 
          }],
          systemInstruction: { 
            parts: [{ text: systemInstruction }] 
          },
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
          },
          tools: [{
            functionDeclarations: [{
              name: "manageCanvas",
              description: "Adds, updates, or removes medical UI components. Use 'update' for Chat-to-Form synchronization.",
              parameters: {
                type: "OBJECT",
                properties: {
                  action: { type: "STRING", enum: ["add", "remove", "update"] },
                  type: { type: "STRING", enum: ["vitals", "diagnosis", "prescription", "notes", "lab_order", "form", "checklist", "chief_complaints", "dental_chart", "body_map"] },
                  title: { type: "STRING" },
                  data: { type: "OBJECT" }
                },
                required: ["action", "type"]
              }
            }]
          }]
        })
      });

      const data = await response.json();
      console.log('📥 Response received:', data);

      if (!response.ok) {
        throw new Error(JSON.stringify(data.error || data));
      }

      const candidate = data.candidates?.[0];
      const textPart = candidate?.content?.parts?.find((p: any) => p.text);
      const functionCallPart = candidate?.content?.parts?.find((p: any) => p.functionCall);
      
      const toolCalls = functionCallPart ? [{
        name: functionCallPart.functionCall.name,
        args: functionCallPart.functionCall.args
      }] : undefined;

      return { 
        text: textPart?.text || "I've processed your request. Please check the clinical workspace for updates.", 
        toolCalls 
      };
    } catch (error: any) {
      console.error('❌ Gemini API Error:', error);
      
      const errorStr = String(error?.message || '');
      
      // Rate limit error
      if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED') || errorStr.includes('quota') || errorStr.includes('rate')) {
        return { 
          text: "⏳ **Rate limit reached.** Please wait 60 seconds and try again.\n\nTip: Get a new API key from [Google AI Studio](https://aistudio.google.com/app/apikey) if this persists.", 
          toolCalls: [] 
        };
      }
      
      // Invalid API key
      if (errorStr.includes('API_KEY') || errorStr.includes('401') || errorStr.includes('403') || errorStr.includes('INVALID')) {
        return { text: "⚠️ Invalid API key. Please check your Gemini API key.", toolCalls: [] };
      }

      // Model not found
      if (errorStr.includes('not found') || errorStr.includes('404')) {
        return { text: "⚠️ Model not available. Trying different model...", toolCalls: [] };
      }
      
      return { text: `⚠️ Error: ${error?.message || 'Connection failed'}. Check browser console (F12) for details.`, toolCalls: [] };
    }
  }
}

export const geminiService = new GeminiService();
