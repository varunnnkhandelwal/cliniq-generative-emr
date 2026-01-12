/**
 * AI-Native EMR Template Generator
 * Generates EMR layouts on the fly based on doctor profile, specialty, and services
 * Similar to v0/Lovable but specialized for medical workflows
 */

import { ComponentType, CanvasComponentData } from "../types";

export interface DoctorProfileExtended {
  doctor_id: string;
  name: string;
  specialty: string;
  sub_specialty?: string;
  qualification: string;
  years_of_experience: number;
  clinic_name: string;
  services: string[];              // Services offered (Root Canal, Cataract Surgery, etc.)
  common_diagnoses: string[];
  common_procedures: string[];
  common_meds: string[];
  patient_demographics?: string;   // Adults, Pediatric, Geriatric
  practice_setting?: string;       // Clinic, Hospital, Multi-specialty
}

export interface GeneratedSection {
  order: number;
  type: string;
  title: string;
  description?: string;
  fields?: GeneratedField[];
  layout?: string;
  pre_filled?: string[];
}

export interface GeneratedField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  options?: string[];
  required?: boolean;
  width?: 'full' | 'half' | 'third';
  conditional?: string;
  placeholder?: string;
}

export interface GenerationPlan {
  template_name: string;
  specialty_analysis: string;
  service_analysis: string;
  data_requirements: string[];
  sections: GeneratedSection[];
  layout_rationale: string;
}

/**
 * Main AI Template Generator Class
 */
export class AITemplateGenerator {
  private apiKey: string;
  private modelName = 'gemini-1.5-flash';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate EMR template using AI reasoning chain
   */
  async generateTemplate(profile: DoctorProfileExtended): Promise<CanvasComponentData[]> {
    console.log('🤖 Starting AI-native template generation...');
    console.log(`📋 Profile: ${profile.specialty} - ${profile.services.join(', ')}`);

    try {
      // Step 1: Analyze profile and understand requirements
      console.log('🔍 Step 1: Analyzing doctor profile...');
      const analysis = await this.analyzeProfile(profile);
      
      // Step 2: Plan sections and fields
      console.log('📝 Step 2: Planning sections and fields...');
      const plan = await this.planSectionsAndFields(profile, analysis);
      
      // Step 3: Optimize layout
      console.log('🎨 Step 3: Optimizing layout...');
      const optimizedPlan = await this.optimizeLayout(plan);
      
      // Step 4: Convert to components
      console.log('⚙️ Step 4: Generating components...');
      const components = this.convertPlanToComponents(optimizedPlan, profile);
      
      console.log(`✅ Generated ${components.length} components for ${profile.specialty}`);
      return components;

    } catch (error) {
      console.error('❌ AI generation failed, using fallback:', error);
      return this.generateFallbackTemplate(profile);
    }
  }

  /**
   * Step 1: Analyze doctor profile to understand clinical needs
   */
  private async analyzeProfile(profile: DoctorProfileExtended): Promise<string> {
    const prompt = `You are a medical informatics expert. Analyze this doctor profile and identify what clinical data they need to capture.

DOCTOR PROFILE:
- Specialty: ${profile.specialty}
- Sub-specialty: ${profile.sub_specialty || 'General'}
- Services Offered: ${profile.services.join(', ') || 'General consultation'}
- Common Diagnoses: ${profile.common_diagnoses.join(', ') || 'Various'}
- Experience: ${profile.years_of_experience} years
- Setting: ${profile.practice_setting || 'Clinic'}

ANALYZE:
1. What are the ESSENTIAL clinical data points for this specialty?
2. What examination findings are CRITICAL for the services offered?
3. What specialty-specific assessments or tools are needed?
4. What workflow patterns are typical for this practice?

Provide a concise analysis (max 200 words) focusing on data capture needs.`;

    return await this.callGemini(prompt);
  }

  /**
   * Step 2: Plan sections and fields based on analysis
   */
  private async planSectionsAndFields(profile: DoctorProfileExtended, analysis: string): Promise<GenerationPlan> {
    const prompt = `You are an EMR designer. Based on this analysis, design the EMR sections and fields.

SPECIALTY: ${profile.specialty}
SERVICES: ${profile.services.join(', ') || 'General'}
ANALYSIS: ${analysis}

Design EMR sections in this EXACT JSON format:
{
  "template_name": "Name for this template",
  "specialty_analysis": "Brief specialty understanding",
  "service_analysis": "How services affect data needs",
  "data_requirements": ["requirement1", "requirement2"],
  "sections": [
    {
      "order": 1,
      "type": "chief_complaints",
      "title": "Chief Complaint",
      "fields": [
        {"id": "cc1", "label": "Primary Complaint", "type": "text", "required": true, "width": "full"}
      ]
    },
    {
      "order": 2,
      "type": "form",
      "title": "Section Name",
      "fields": [
        {"id": "f1", "label": "Field Label", "type": "select", "options": ["Option1", "Option2"], "width": "half"}
      ]
    }
  ],
  "layout_rationale": "Why this order and structure"
}

RULES:
- Include 5-8 sections appropriate for the specialty
- Each section should have 2-6 relevant fields
- Use appropriate field types: text, number, select, checkbox, textarea, date
- Include specialty-specific examination sections
- Always include: chief_complaints, prescription, follow-up
- For ${profile.specialty}, include specialty-specific sections

Return ONLY valid JSON, no markdown or explanation.`;

    const response = await this.callGemini(prompt);
    
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanJson = response.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.slice(7);
      }
      if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.slice(3);
      }
      if (cleanJson.endsWith('```')) {
        cleanJson = cleanJson.slice(0, -3);
      }
      cleanJson = cleanJson.trim();
      
      return JSON.parse(cleanJson);
    } catch (e) {
      console.error('Failed to parse AI response:', response);
      // Return a basic plan if parsing fails
      return this.getBasicPlan(profile);
    }
  }

  /**
   * Step 3: Optimize layout for clinical workflow
   */
  private async optimizeLayout(plan: GenerationPlan): Promise<GenerationPlan> {
    // For now, we trust the AI's initial ordering
    // Could add another prompt to refine layout if needed
    
    // Ensure sections are properly ordered
    plan.sections.sort((a, b) => a.order - b.order);
    
    return plan;
  }

  /**
   * Step 4: Convert plan to actual component data
   */
  private convertPlanToComponents(plan: GenerationPlan, profile: DoctorProfileExtended): CanvasComponentData[] {
    const components: CanvasComponentData[] = [];
    const timestamp = Date.now();

    plan.sections.forEach((section, idx) => {
      const componentType = this.mapSectionTypeToComponentType(section.type);
      
      let data: any = {};
      
      switch (componentType) {
        case ComponentType.CHIEF_COMPLAINTS:
          data = { tags: profile.common_diagnoses || [] };
          break;
          
        case ComponentType.PRESCRIPTION:
          data = { 
            medications: (profile.common_meds || []).map(m => ({
              id: Math.random().toString(),
              name: m,
              frequency: "1-0-1",
              duration: "5 days"
            }))
          };
          break;
          
        case ComponentType.FORM:
          data = { 
            fields: (section.fields || []).map(f => ({
              id: f.id,
              label: f.label,
              type: f.type,
              options: f.options,
              value: '',
              width: f.width || 'full',
              required: f.required
            }))
          };
          break;
          
        case ComponentType.CHECKLIST:
          data = {
            items: (section.fields || []).map(f => ({
              id: f.id,
              label: f.label,
              checked: false
            }))
          };
          break;
          
        case ComponentType.VITALS:
          // Map fields to vitals data structure
          const vitalsData: any = {};
          (section.fields || []).forEach(f => {
            vitalsData[f.id] = '';
          });
          data = Object.keys(vitalsData).length > 0 ? vitalsData : { bp: '', pulse: '', temp: '', spo2: '' };
          break;
          
        default:
          data = section.fields ? { fields: section.fields } : {};
      }

      components.push({
        id: `ai-${idx}-${timestamp}`,
        type: componentType,
        title: section.title,
        data,
        isEditable: true
      });
    });

    return components;
  }

  /**
   * Map section type string to ComponentType enum
   */
  private mapSectionTypeToComponentType(type: string): ComponentType {
    const typeMap: Record<string, ComponentType> = {
      'chief_complaints': ComponentType.CHIEF_COMPLAINTS,
      'vitals': ComponentType.VITALS,
      'prescription': ComponentType.PRESCRIPTION,
      'medications': ComponentType.PRESCRIPTION,
      'form': ComponentType.FORM,
      'examination': ComponentType.FORM,
      'checklist': ComponentType.CHECKLIST,
      'dental_chart': ComponentType.DENTAL_CHART,
      'body_map': ComponentType.BODY_MAP,
      'notes': ComponentType.NOTES,
      'diagnosis': ComponentType.DIAGNOSIS,
      'lab_order': ComponentType.LAB_ORDER
    };
    
    return typeMap[type.toLowerCase()] || ComponentType.FORM;
  }

  /**
   * Call Gemini API
   */
  private async callGemini(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 4096,
        }
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(JSON.stringify(data.error || data));
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Get basic plan when AI fails
   */
  private getBasicPlan(profile: DoctorProfileExtended): GenerationPlan {
    return {
      template_name: `${profile.specialty} Template`,
      specialty_analysis: `Basic template for ${profile.specialty}`,
      service_analysis: 'Using default structure',
      data_requirements: ['Chief complaint', 'Vitals', 'Examination', 'Diagnosis', 'Treatment'],
      sections: [
        {
          order: 1,
          type: 'chief_complaints',
          title: 'Chief Complaint',
          fields: [{ id: 'cc', label: 'Primary Complaint', type: 'text', width: 'full' }]
        },
        {
          order: 2,
          type: 'vitals',
          title: 'Vital Signs',
          fields: [
            { id: 'bp', label: 'Blood Pressure', type: 'text', width: 'half' },
            { id: 'pulse', label: 'Pulse', type: 'text', width: 'half' },
            { id: 'temp', label: 'Temperature', type: 'text', width: 'half' },
            { id: 'spo2', label: 'SpO2', type: 'text', width: 'half' }
          ]
        },
        {
          order: 3,
          type: 'form',
          title: 'Examination',
          fields: [{ id: 'exam', label: 'Examination Findings', type: 'textarea', width: 'full' }]
        },
        {
          order: 4,
          type: 'prescription',
          title: 'Medications'
        },
        {
          order: 5,
          type: 'form',
          title: 'Follow-up',
          fields: [
            { id: 'next_visit', label: 'Next Visit', type: 'date', width: 'half' },
            { id: 'instructions', label: 'Instructions', type: 'textarea', width: 'full' }
          ]
        }
      ],
      layout_rationale: 'Standard clinical workflow'
    };
  }

  /**
   * Fallback template when AI generation completely fails
   */
  private generateFallbackTemplate(profile: DoctorProfileExtended): CanvasComponentData[] {
    const timestamp = Date.now();
    
    return [
      {
        id: `fb-0-${timestamp}`,
        type: ComponentType.CHIEF_COMPLAINTS,
        title: 'Chief Complaint',
        data: { tags: profile.common_diagnoses || [] },
        isEditable: true
      },
      {
        id: `fb-1-${timestamp}`,
        type: ComponentType.VITALS,
        title: 'Vital Signs',
        data: { bp: '', pulse: '', temp: '', spo2: '' },
        isEditable: true
      },
      {
        id: `fb-2-${timestamp}`,
        type: ComponentType.FORM,
        title: 'Examination',
        data: { fields: [{ id: 'exam', label: 'Findings', type: 'textarea', width: 'full' }] },
        isEditable: true
      },
      {
        id: `fb-3-${timestamp}`,
        type: ComponentType.PRESCRIPTION,
        title: 'Medications',
        data: { medications: (profile.common_meds || []).map(m => ({ id: Math.random().toString(), name: m, frequency: '1-0-1', duration: '5 days' })) },
        isEditable: true
      }
    ];
  }
}

/**
 * Extended Doctor Database with services
 */
export const EXTENDED_DOCTOR_DATABASE: DoctorProfileExtended[] = [
  {
    doctor_id: "DOC001",
    name: "Dr. Rajesh Kumar",
    specialty: "Cardiologist",
    sub_specialty: "Interventional Cardiology",
    qualification: "MBBS, MD (Cardiology), DM (Cardiology)",
    years_of_experience: 15,
    clinic_name: "HeartCare Cardiac Center",
    services: ["ECG", "Echocardiography", "Stress Test", "Angiography", "Angioplasty"],
    common_diagnoses: ["Hypertension", "Coronary Artery Disease", "Heart Failure", "Arrhythmia"],
    common_procedures: ["Coronary Angiography", "PCI", "Pacemaker Implantation"],
    common_meds: ["Aspirin 75mg", "Metoprolol 50mg", "Atorvastatin 20mg", "Clopidogrel 75mg"],
    practice_setting: "Hospital"
  },
  {
    doctor_id: "DOC002",
    name: "Dr. Priya Sharma",
    specialty: "General Practitioner",
    qualification: "MBBS",
    years_of_experience: 8,
    clinic_name: "City General Clinic",
    services: ["General Consultation", "Health Checkup", "Vaccination", "Minor Procedures"],
    common_diagnoses: ["Upper Respiratory Infection", "Fever", "Hypertension", "Diabetes"],
    common_procedures: ["Wound Dressing", "Injections", "Minor Suturing"],
    common_meds: ["Paracetamol 500mg", "Amoxicillin 500mg", "Omeprazole 20mg"]
  },
  {
    doctor_id: "DOC003",
    name: "Dr. Amit Desai",
    specialty: "Dentist",
    sub_specialty: "Endodontist",
    qualification: "BDS, MDS (Conservative Dentistry & Endodontics)",
    years_of_experience: 12,
    clinic_name: "SmileCare Dental Clinic",
    services: ["Root Canal Treatment", "Dental Extraction", "Filling", "Crown & Bridge", "Teeth Cleaning"],
    common_diagnoses: ["Dental Caries", "Pulpitis", "Periapical Abscess", "Gingivitis"],
    common_procedures: ["RCT", "Extraction", "Composite Restoration", "Scaling"],
    common_meds: ["Amoxicillin 500mg", "Ibuprofen 400mg", "Metronidazole 400mg"]
  },
  {
    doctor_id: "DOC004",
    name: "Dr. Meera Patel",
    specialty: "Ophthalmologist",
    sub_specialty: "Cataract & Refractive Surgery",
    qualification: "MBBS, MS (Ophthalmology)",
    years_of_experience: 14,
    clinic_name: "ClearVision Eye Center",
    services: ["Cataract Surgery", "LASIK", "Glaucoma Management", "Retina Screening", "Refraction"],
    common_diagnoses: ["Cataract", "Glaucoma", "Diabetic Retinopathy", "Refractive Error", "Dry Eye"],
    common_procedures: ["Phacoemulsification", "LASIK", "YAG Laser", "Intravitreal Injection"],
    common_meds: ["Moxifloxacin Eye Drops", "Prednisolone Eye Drops", "Timolol Eye Drops"]
  },
  {
    doctor_id: "DOC005",
    name: "Dr. Anita Verma",
    specialty: "Pediatrician",
    qualification: "MBBS, MD (Pediatrics), DCH",
    years_of_experience: 10,
    clinic_name: "Little Angels Child Care",
    services: ["Well Baby Checkup", "Vaccination", "Growth Monitoring", "Acute Care", "Developmental Assessment"],
    common_diagnoses: ["URI", "Fever", "Diarrhea", "Growth Concerns", "Vaccination"],
    common_procedures: ["Vaccination", "Nebulization", "Growth Assessment"],
    common_meds: ["Paracetamol Syrup", "Amoxicillin Suspension", "ORS", "Zinc Syrup"],
    patient_demographics: "Pediatric"
  },
  {
    doctor_id: "DOC006",
    name: "Dr. Kavita Menon",
    specialty: "Dermatologist",
    qualification: "MBBS, MD (Dermatology)",
    years_of_experience: 9,
    clinic_name: "Glow Dermatology Clinic",
    services: ["Acne Treatment", "Skin Biopsy", "Laser Treatment", "Chemical Peel", "Hair Treatment"],
    common_diagnoses: ["Acne Vulgaris", "Atopic Dermatitis", "Psoriasis", "Fungal Infection", "Hair Loss"],
    common_procedures: ["Skin Biopsy", "Cryotherapy", "Laser Therapy", "Chemical Peel"],
    common_meds: ["Tretinoin Cream", "Clindamycin Gel", "Ketoconazole Shampoo", "Minoxidil"]
  },
  {
    doctor_id: "DOC007",
    name: "Dr. Suresh Nair",
    specialty: "Physiotherapist",
    qualification: "BPT, MPT (Orthopedics)",
    years_of_experience: 11,
    clinic_name: "PhysioFit Rehabilitation Center",
    services: ["Orthopedic Rehab", "Sports Injury", "Post-Surgical Rehab", "Spine Care", "Geriatric Physio"],
    common_diagnoses: ["Low Back Pain", "Frozen Shoulder", "Knee Osteoarthritis", "Cervical Spondylosis", "Sports Injury"],
    common_procedures: ["Manual Therapy", "Electrotherapy", "Exercise Therapy", "Taping"],
    common_meds: []
  },
  {
    doctor_id: "DOC008",
    name: "Dr. Rahul Joshi",
    specialty: "Orthopedic Surgeon",
    qualification: "MBBS, MS (Orthopedics)",
    years_of_experience: 14,
    clinic_name: "BoneHealth Orthopedic Center",
    services: ["Joint Replacement", "Fracture Management", "Arthroscopy", "Spine Surgery", "Sports Medicine"],
    common_diagnoses: ["Osteoarthritis", "Fracture", "Low Back Pain", "Ligament Injury", "Disc Prolapse"],
    common_procedures: ["Total Knee Replacement", "Hip Replacement", "ACL Reconstruction", "Spine Fixation"],
    common_meds: ["Diclofenac 50mg", "Calcium + Vitamin D3", "Etoricoxib 90mg"]
  }
];

