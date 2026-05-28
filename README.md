# Aura Engine v2.0 - AI Health Triage Assistant

Aura Engine v2.0 is an advanced, high-performance, web-based clinical triage and health assistant optimized specifically for women in rural India. The system provides comforting, localized, and clinical guidance to bridge the gap between rural patients, ASHA (Accredited Social Health Activist) workers, and healthcare professionals. 

It functions in a hybrid online/offline model, ensuring reliability even in remote regions with low or no internet access.

---

## 🌟 Key Features

1. **Dual-Language & Script Localization**
   - Seamless dynamic toggling between **Hindi (Devanagari)** and **English**.
   - Language configurations adjust all system components including labels, placeholders, fallback advice, and speech voice-profiles.

2. **Voice-First Input (STT) & Speech Output (TTS)**
   - **Speech-to-Text (STT):** Integrated Web Speech API allows users to speak their symptoms.
   - **Text-to-Speech (TTS):** Generates oral readings of health advice at a slower speed (0.85x) to optimize auditory comprehension for rural patients.

3. **Hybrid AI & Local Processing**
   - **Offline Mode:** Uses a custom-built fuzzy matching NLP engine utilizing the **Levenshtein Distance Algorithm** to map Hinglish and Hindi text to local clinical guides for five major conditions:
     - *Leukorrhea (Abnormal Vaginal Discharge)*
     - *UTI (Urinary Tract Infection)*
     - *Dysmenorrhea (Severe Period Pain)*
     - *Anemia (Iron/Nutritional Deficiency)*
     - *Mastitis (Breast Pain / Lump / Suspected Infections)*
   - **Online Mode:** Integrates directly with the **Google Gemini API** (using models like `gemini-1.5-flash`, `gemini-2.5-flash`, and `gemini-1.5-pro`) to provide tailored clinical summaries and advice.

4. **ASHA Worker Consultation Card (Digital Triage Ticket)**
   - Generates a clinical dashboard mapping colloquial symptoms to formal medical terminology, potential conditions, specific vital signs to check, a primary action plan, and 3 clinical triage questions.

5. **100% Offline SVG QR Code Data Sync**
   - Incorporates a pure-JavaScript custom QR Code encoder (supporting Version 10, Medium Level Error Correction). It generates a compact SVG QR code containing the full triage ticket directly in the browser. 
   - ASHA workers and local doctors can scan this QR code to transfer clinical records instantly to another device, requiring **zero internet connectivity**.

6. **Local EHR History Journal**
   - Local patient records (up to 15 entries) are persisted in the browser's `localStorage` as a simple, offline-accessible Electronic Health Record (EHR) log.

7. **Aesthetic & Accessible UI**
   - Features responsive layouts, elegant gradient blur overlays, modern typography (Outfit and Noto Sans Devanagari), clean micro-animations, a rotating lotus mandala loading state, and native accessibility font-scaling options (A-, A, A+).

---

## 📂 Project Structure

```bash
lnct/
├── index.html     # Entry point containing layout structure, results panel, and settings modal.
├── style.css      # Core style sheet containing modern styling, micro-animations, and print-layout rules.
├── app.js         # Core application logic, offline clinical DB, fuzzy matcher, custom QR encoder, and API connections.
└── package.json   # Project dependencies (Vite setup) and command scripts.
```

---

## 🛠️ Technology Stack

- **Core Frontend:** HTML5, CSS3, ES6+ Javascript (Vanilla)
- **Web API Services:** Browser Web Speech API, Google Gemini Developer API
- **Build System:** Vite (v5.0.0+)
- **Algorithms:** Levenshtein Distance (for NLP fuzzy matching), QR Code Matrix Mapping

---

## 🚀 Installation & Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Setup Instructions

1. **Clone or Open the Project Directory**
   Ensure your terminal is in the project root:
   ```bash
   cd c:\Users\hp\Desktop\lnct
   ```

2. **Install Dependencies**
   Install the Vite build utility:
   ```bash
   npm install
   ```

3. **Run the Development Server**
   Start the local preview:
   ```bash
   npm run dev
   ```
   Open your browser to the local URL (usually `http://localhost:5173`).

4. **Build for Production**
   Generate the optimized static build folder (`dist/`):
   ```bash
   npm run build
   ```

---

## 📖 How to Run the App & Configuration

1. **Open Settings (Gear Icon):**
   - Choose **AI Processing Source**. Select either the **Offline Local Clinical Engine** (default) or the **Online Gemini Live AI**.
   - If using **Gemini**, input your Gemini API Key, choose a preferred model, and adjust the temperature setting. Low temperatures (e.g., `0.2`) are recommended for clinical consistency.
2. **Select Symptoms:**
   - Click one of the quick symptom chips (e.g., `🌸 सफेद पानी आना`).
   - Alternatively, type your symptoms in Hinglish/Hindi or click the **Speak** button to record your voice.
3. **Analyze:**
   - Click **Analyze Symptoms**.
   - Read the comforting guidance on the **Advice** tab or listen to it by clicking **Listen**.
   - Open the **ASHA Card** tab to view clinical translations, check recommended vitals, and view/scan the offline QR code.
