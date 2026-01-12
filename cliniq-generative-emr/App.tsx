
import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { ChatPanel } from './components/ChatPanel';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { TutorialOverlay } from './components/TutorialOverlay';
import { AppState, ComponentType, Patient, ChatMessage, ComponentToolArgs, CanvasComponentData, MedicalTemplate } from './types';
import { geminiService } from './services/geminiService';
import { AITemplateGenerator, DoctorProfileExtended } from './services/aiTemplateGenerator';
import { Settings, Bell, Layout, Edit3, Check, ChevronLeft, ChevronRight, Menu, Sparkles } from 'lucide-react';

const INITIAL_PATIENT: Patient = {
  id: 'PT1001',
  name: 'Sarah Johnson',
  age: 34,
  gender: 'Female',
  email: 'sarah.j@email.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  bloodGroup: '+O +VE'
};

export default function App() {
  const [state, setState] = useState<AppState>({
    patient: INITIAL_PATIENT,
    specialtyContext: 'General',
    flowStep: 'onboarding',
    viewMode: 'template_builder',
    isChatOpen: true,
    tutorialStep: null,
    
    activeComponents: [],
    patientChatHistory: [],

    templateComponents: [],
    builderChatHistory: [],
    
    savedTemplates: [],
    activeTemplateId: undefined
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState("");

  // Handle doctor selection with AI-native template generation
  const handleSelectDoctor = async (doctorId: string, profile: DoctorProfileExtended) => {
    setIsGenerating(true);
    setGenerationStatus("Analyzing doctor profile...");
    
    try {
      // Get API key from localStorage
      const apiKey = localStorage.getItem('gemini_api_key') || '';
      
      if (!apiKey) {
        throw new Error('API key not found');
      }

      // Create AI template generator
      const generator = new AITemplateGenerator(apiKey);
      
      // Generate template using AI
      setGenerationStatus("AI analyzing specialty and services...");
      await new Promise(r => setTimeout(r, 500)); // Small delay for UX
      
      setGenerationStatus("Planning EMR sections and fields...");
      const initialComponents = await generator.generateTemplate(profile);
      
      setGenerationStatus("Optimizing layout for clinical workflow...");
      await new Promise(r => setTimeout(r, 300));

      // Build welcome message with generation details
      const welcomeMessage = `🎉 **AI-Generated EMR Template Ready!**

Hi ${profile.name}! I've analyzed your profile and created a custom EMR template:

**Specialty:** ${profile.specialty}${profile.sub_specialty ? ` (${profile.sub_specialty})` : ''}
**Services:** ${profile.services.slice(0, 3).join(', ')}${profile.services.length > 3 ? '...' : ''}
**Generated Sections:** ${initialComponents.length}

The template includes specialty-specific sections optimized for your clinical workflow. You can:
- ✏️ Edit any field or section
- ➕ Add new sections via chat
- 💬 Say "BP is 120/80" for Chat-to-Form sync
- 🔧 Use /commands for quick actions

How can I help you customize further?`;

      setState(prev => ({
        ...prev,
        doctorId: doctorId,
        specialtyContext: profile.specialty,
        flowStep: 'builder',
        viewMode: 'template_builder',
        templateComponents: initialComponents,
        builderChatHistory: [{
          id: 'welcome',
          role: 'model',
          text: welcomeMessage,
          timestamp: new Date()
        }]
      }));
      
      setTempName(`${profile.name}'s ${profile.specialty} Template`);
      
    } catch (error) {
      console.error('AI generation failed:', error);
      
      // Fallback message
      setState(prev => ({
        ...prev,
        doctorId: doctorId,
        specialtyContext: profile.specialty,
        flowStep: 'builder',
        viewMode: 'template_builder',
        templateComponents: [],
        builderChatHistory: [{
          id: 'welcome',
          role: 'model',
          text: `Hi ${profile.name}! There was an issue generating your template. Please try adding sections manually using the chat or /commands.`,
          timestamp: new Date()
        }]
      }));
      setTempName(`${profile.name}'s Template`);
    } finally {
      setIsGenerating(false);
      setGenerationStatus("");
    }
  };

  const handleFinishBuilding = () => {
    setState(prev => ({
        ...prev,
        tutorialStep: 0, 
        activeComponents: JSON.parse(JSON.stringify(prev.templateComponents)),
    }));
  };

  const handleSendMessage = async (text: string) => {
    const isBuilder = state.viewMode === 'template_builder';
    const historyKey = isBuilder ? 'builderChatHistory' : 'patientChatHistory';
    const componentList = isBuilder ? state.templateComponents : state.activeComponents;

    const newUserMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text, timestamp: new Date() };
    setState(prev => ({ ...prev, [historyKey]: [...prev[historyKey], newUserMsg] }));
    setIsTyping(true);

    try {
      const canvasSummary = JSON.stringify(componentList.map(c => ({ 
        type: c.type, 
        title: c.title,
        data: c.data
      })));
      
      const response = await geminiService.sendMessage(
        state[historyKey], text, state.specialtyContext, canvasSummary, state.viewMode
      );

      const newModelMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response.text, timestamp: new Date() };
      setState(prev => ({ ...prev, [historyKey]: [...prev[historyKey], newModelMsg] }));

      if (response.toolCalls && response.toolCalls.length > 0) {
        handleToolCalls(response.toolCalls);
      }
    } catch (error) {
      console.error("Gemini Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToolCalls = (toolCalls: any[]) => {
    toolCalls.forEach(call => {
      if (call.name === 'manageCanvas') {
        const { action, type, title, data } = call.args as ComponentToolArgs;
        const listKey = state.viewMode === 'patient_session' ? 'activeComponents' : 'templateComponents';

        setState(prev => {
            let newList = [...prev[listKey]];
            if (action === 'add') {
                newList.push({ id: `c-${Date.now()}`, type, title: title || type, data: data || {}, isEditable: true });
            } else if (action === 'update') {
                const idx = newList.findIndex(c => c.type === type);
                if (idx !== -1) {
                  const comp = { ...newList[idx], isHighlighted: true };
                  // Handle partial data updates (merge)
                  if (type === ComponentType.FORM && data?.fields) {
                    const existingFields = comp.data.fields || [];
                    data.fields.forEach((f: any) => {
                      const fIdx = existingFields.findIndex((ef: any) => ef.id === f.id);
                      if (fIdx !== -1) existingFields[fIdx] = { ...existingFields[fIdx], ...f };
                    });
                    comp.data = { ...comp.data, fields: existingFields };
                  } else {
                    comp.data = { ...comp.data, ...data };
                  }
                  newList[idx] = comp;
                  
                  // Auto-remove highlight after 3 seconds
                  setTimeout(() => {
                    setState(p => ({
                      ...p,
                      [listKey]: p[listKey].map(c => c.id === comp.id ? { ...c, isHighlighted: false } : c)
                    }));
                  }, 3000);
                }
            } else if (action === 'remove') {
                newList = newList.filter(c => c.type !== type);
            }
            return { ...prev, [listKey]: newList };
        });
      }
    });
  };

  // Show generation loading screen
  if (isGenerating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#f0f4f8] min-h-screen">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-indigo-200 animate-pulse">
            <Sparkles size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">AI Generating Your EMR Template</h2>
          <p className="text-slate-500 mb-8">{generationStatus}</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (state.flowStep === 'onboarding') return <Onboarding onSelectDoctor={handleSelectDoctor} />;
  
  if (state.flowStep === 'dashboard' && state.tutorialStep === null && state.viewMode !== 'patient_session') {
    return <Dashboard specialty={state.specialtyContext} onEditTemplate={() => setState(p => ({...p, flowStep: 'builder'}))} onStartSession={() => setState(p => ({...p, flowStep: 'dashboard', viewMode: 'patient_session'}))} savedTemplates={state.savedTemplates} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {state.tutorialStep !== null && (
        <TutorialOverlay 
            step={state.tutorialStep} 
            onNext={() => setState(p => ({ ...p, tutorialStep: p.tutorialStep === 4 ? null : p.tutorialStep! + 1, flowStep: p.tutorialStep === 4 ? 'dashboard' : p.flowStep }))} 
            onClose={() => setState(p => ({ ...p, tutorialStep: null, flowStep: 'dashboard' }))}
        />
      )}

      <Sidebar viewMode={state.viewMode} onAddComponent={() => {}} specialty={state.specialtyContext} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: EMR Form (70% or 95%) */}
        <div className={`flex flex-col h-full bg-[#f0f2f5] transition-all duration-500 ease-in-out ${state.isChatOpen ? 'w-[70%]' : 'w-full'}`}>
          <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 z-20">
             <div className="flex items-center gap-4">
                <button onClick={() => setState(p => ({...p, flowStep: 'dashboard'}))} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Sparkles size={10} className="text-purple-500" />
                      AI-Generated • {state.specialtyContext} {state.viewMode === 'template_builder' ? 'Builder' : 'Consultation'}
                    </span>
                    <h2 className="text-sm font-bold text-slate-700 leading-none">{tempName || 'Consultation'}</h2>
                </div>
             </div>
             {!state.isChatOpen && (
                <button 
                    onClick={() => setState(p => ({...p, isChatOpen: true}))}
                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 animate-in slide-in-from-right"
                >
                    <Menu size={14} /> Open AI Assistant
                </button>
             )}
          </div>
          <Canvas 
            state={state} 
            removeComponent={(id) => setState(p => ({...p, templateComponents: p.templateComponents.filter(c => c.id !== id)}))}
            updateComponent={(id, data) => setState(p => ({...p, templateComponents: p.templateComponents.map(c => c.id === id ? {...c, data: {...c.data, ...data}} : c)}))}
            addComponent={(t, title) => setState(p => ({...p, templateComponents: [...p.templateComponents, {id: `c-${Date.now()}`, type: t, title: title || t, data: {}, isEditable: true}]}))}
            reorderComponent={() => {}}
            isBuilderMode={state.viewMode === 'template_builder'}
            onFinishBuilding={handleFinishBuilding}
          />
        </div>

        {/* Right Side: Collapsible Chat (30%) */}
        {state.isChatOpen && (
          <div className="w-[30%] h-full bg-white border-l border-slate-200 z-30 animate-in slide-in-from-right duration-500 ease-out">
            <ChatPanel 
              history={state.viewMode === 'template_builder' ? state.builderChatHistory : state.patientChatHistory} 
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              onQuickAction={(type) => handleSendMessage(`Add ${type}`)}
              viewMode={state.viewMode}
              specialty={state.specialtyContext}
              onAddComponent={(t) => setState(p => ({...p, templateComponents: [...p.templateComponents, {id: `c-${Date.now()}`, type: t, title: t, data: {}, isEditable: true}]}))}
              onCollapse={() => setState(p => ({...p, isChatOpen: false}))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
