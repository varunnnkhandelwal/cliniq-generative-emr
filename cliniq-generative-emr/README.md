# CliniQ - Generative EMR Platform

CliniQ is an AI-native Electronic Medical Record (EMR) system that dynamically generates its user interface based on a doctor's specific clinical profile and real-time interaction.

## 🚀 Core Concept: Data-Driven EMR

Unlike traditional EMRs with fixed layouts, CliniQ is **strictly data-driven**. The workspace is generated from a configuration database.

### 🧠 The Intelligence Engine

All dynamic behaviors—including the initial layout and how the AI assistant interprets clinical findings—are governed by the **Doctor Database** and the **System Prompt**.

#### **File: `services/geminiService.ts`**

1.  **Doctor Database (`DOCTOR_DATABASE`)**: 
    Each entry contains a `template_config`. This is the **Source of Truth**. When a doctor logs in, the system renders exactly what is defined in this JSON block. No heuristics or assumptions are made based on the specialty name alone.
    
2.  **Prefill Logic (`getInitialTemplateForDoctor`)**: 
    This function simply maps the database config to UI components. It is a pure function that respects the doctor's defined workspace blocks.

3.  **The Dynamic Prompt (`systemInstruction`)**: 
    The AI assistant's personality and logic are dynamically generated using variables from the doctor's profile (Note Style, Detail Level, Preferred Sections). This ensures that if you change a doctor's "Note Style" in the database, the AI automatically adjusts its responses to match.

---

## 📁 Key File Locations

*   `services/geminiService.ts`: **The Brain.** Contains the doctor database, AI tool definitions, and system prompts.
*   `types.ts`: **The Schema.** Defines component types like `VITALS`, `PRESCRIPTION`, `FORM`, and `CHECKLIST`.
*   `App.tsx`: **The Orchestrator.** Manages the state and handles "Tool Calls" from the AI to add/remove UI blocks.
*   `components/Canvas.tsx`: **The Canvas.** Renders the dynamic list of widgets in the middle of the screen.
*   `components/ChatPanel.tsx`: **The Assistant.** The left-side interface for interacting with the Gemini engine.

---

## 👨‍⚕️ Adding a New Doctor
To add a doctor (e.g., from a practice like Spark Skin Doctor), simply add a new object to the `DOCTOR_DATABASE` array in `services/geminiService.ts` with their specific `template_config`. The app will automatically handle the login, prefill, and AI tailoring without requiring any new CSS or UI logic.

## 🛠 Tech Stack
*   **React 19**
*   **Google Gemini API (@google/genai)**
*   **Tailwind CSS**
*   **Lucide React**
