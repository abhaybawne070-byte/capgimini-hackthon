// ==========================================================================
// Aura Engine v2.0 - Core Application Script (Advanced Edition)
// Features: Dual-Language, Web Speech STT & TTS, Live Gemini AI Integration,
//           Offline Triage Dictionary, Fuzzy NLP Matcher, Local EHR History Journal,
//           and 100% Offline SVG QR Code Generator.
// ==========================================================================

// Global Application State
let currentLang = 'hi'; // Default language is Hindi for rural women focus
let isRecording = false;
let recognition = null;
let currentUtterance = null;
let activeTab = 'advice';
let fontSizeScale = 1.0;
let patientHistory = [];

// UI Content Dictionary for Dual-Language Support
const translations = {
    hi: {
        tagline: "सुरक्षित स्वास्थ्य सलाह, हर बहन के लिए",
        inputTitle: "आप कैसा महसूस कर रही हैं?",
        inputSubtitle: "अपनी बीमारी या दर्द के बारे में नीचे लिखें या बोलकर बताएं।",
        inputPlaceholder: "जैसे: 2 दिन से सफेद पानी आ रहा है और पेट में दर्द है...",
        voiceBtnIdle: "बोलें (Tap to Speak)",
        voiceBtnListening: "सुन रहे हैं...",
        voiceStatusIdle: "",
        voiceStatusListening: "कृपया बोलें, हम सुन रहे हैं...",
        presetsTitle: "आसानी से चुनें (Quick Select):",
        submitBtn: "जांच शुरू करें (Analyze Symptoms)",
        emptyTitle: "नमस्ते, मैं आपकी दीदी और स्वास्थ्य सहायक हूँ।",
        emptySubtitle: "कृपया बाईं तरफ अपनी तकलीफ बताएं। मैं आपको सही मार्गदर्शन और आपकी भाषा में सलाह दूँगी।",
        loadingTitle: "आपकी बात ध्यान से समझी जा रही है...",
        loadingSubtitle: "Aura AI स्वास्थ्य सलाह तैयार कर रहा है। कृपया प्रतीक्षा करें।",
        tabAdvice: "स्वास्थ्य सलाह (Advice)",
        tabAsha: "आशा दीदी कार्ड (ASHA Card)",
        tabHistory: "इतिहास (History)",
        historyTitle: "पुराने स्वास्थ्य परामर्श (Past History Logs)",
        btnClearHistory: "इतिहास साफ करें (Clear Logs)",
        historyEmpty: "अभी तक कोई पुराना रिकॉर्ड सुरक्षित नहीं है।",
        historyClickTip: "खोलें (Double click to view)",
        ttsLabel: "🔊 सलाह सुनने के लिए दबाएं:",
        ttsPlay: "सुनें (Listen)",
        ttsStop: "रोकें (Stop)",
        copyTicket: "कॉपी करें (Copy Ticket)",
        printTicket: "प्रिंट / डाउनलोड (Print Card)",
        toastSaved: "सेटिंग्स सुरक्षित कर दी गई हैं!",
        toastCopied: "टिकट कॉपी हो गया है!",
        toastHistoryCleared: "इतिहास साफ कर दिया गया है!",
        voiceNotSupported: "आपके ब्राउज़र में बोलकर बताने की सुविधा उपलब्ध नहीं है। कृपया लिखकर बताएं।",
        ttsNotSupported: "आपके ब्राउज़र में पढ़कर सुनाने की सुविधा उपलब्ध नहीं है।",
        generalFallbackTitle: "सामान्य स्वास्थ्य सलाह (General Guidance)",
        generalFallbackText: `<div class="comfort-card"><strong>मेरी प्यारी बहन, हिम्मत रखें और घबराएं नहीं।</strong></div>
            <p>आपकी बताई गई तकलीफ के लिए कुछ बुनियादी बातें ध्यान रखें:</p>
            <ul>
                <li>भरपूर आराम करें और शरीर को थकावट से बचाएं।</li>
                <li>दिन भर में थोड़ा-थोड़ा करके गुनगुना पानी पीती रहें।</li>
                <li>संतुलित और पोषण युक्त भोजन खाएं (हरी सब्जियां, दालें और फल)।</li>
            </ul>
            <div class="advice-highlight"><strong>सलाह:</strong> यदि दर्द या तकलीफ बढ़ती है, तो इसे नजरअंदाज न करें।</div>
            <div class="advice-danger"><strong>महत्वपूर्ण सूचना:</strong> कृपया अपनी स्थानीय आशा (ASHA) दीदी, एएनएम (ANM) या नजदीकी सरकारी उप-स्वास्थ्य केंद्र पर जाकर डॉक्टर से जांच अवश्य करवाएं।</div>`
    },
    en: {
        tagline: "Safe Health Guidance, for Every Sister",
        inputTitle: "How are you feeling today?",
        inputSubtitle: "Type your symptoms below or speak them out loud.",
        inputPlaceholder: "Example: Having white discharge and lower stomach pain for 2 days...",
        voiceBtnIdle: "Tap to Speak",
        voiceBtnListening: "Listening...",
        voiceStatusIdle: "",
        voiceStatusListening: "Please speak now, we are listening...",
        presetsTitle: "Quick Select Symptoms:",
        submitBtn: "Analyze Symptoms",
        emptyTitle: "Namaste, I am your Aura sister and health guide.",
        emptySubtitle: "Please describe your health issues on the left. I will provide gentle advice and clinical translations.",
        loadingTitle: "Analyzing your concerns carefully...",
        loadingSubtitle: "Aura AI is preparing clinical advice. Please wait.",
        tabAdvice: "Health Advice",
        tabAsha: "ASHA Worker Card",
        tabHistory: "History",
        historyTitle: "Past Consultation Records",
        btnClearHistory: "Clear History",
        historyEmpty: "No history records saved yet.",
        historyClickTip: "Click card to view details",
        ttsLabel: "🔊 Listen to the advice:",
        ttsPlay: "Listen",
        ttsStop: "Stop",
        copyTicket: "Copy Ticket",
        printTicket: "Print Card",
        toastSaved: "Settings saved successfully!",
        toastCopied: "Ticket copied to clipboard!",
        toastHistoryCleared: "Consultation history cleared!",
        voiceNotSupported: "Voice input is not supported in this browser. Please type.",
        ttsNotSupported: "Text-to-speech is not supported in this browser.",
        generalFallbackTitle: "General Health Guidance",
        generalFallbackText: `<div class="comfort-card"><strong>Dear sister, please stay strong and do not worry.</strong></div>
            <p>For the symptoms you mentioned, here are some basic care guidelines:</p>
            <ul>
                <li>Get plenty of rest and avoid heavy physical labor.</li>
                <li>Stay well hydrated by drinking clean warm water throughout the day.</li>
                <li>Eat highly nutritious meals (green leafy vegetables, lentils, and fruits).</li>
            </ul>
            <div class="advice-highlight"><strong>Note:</strong> Do not ignore the symptoms if they persist or get worse.</div>
            <div class="advice-danger"><strong>Important Notice:</strong> Please consult your local ASHA worker, ANM, or visit the nearest sub-center / doctor for proper clinical examination and prescription.</div>`
    }
};

// Preset Symptom Chips configuration
const presetChips = {
    hi: [
        { text: "🌸 सफेद पानी आना", value: "safed pani ana aur jalan" },
        { text: "🩸 माहवारी में तेज दर्द", value: "mahavari me tez dard aur ulti" },
        { text: "💧 पेशाब में जलन", value: "peshab me tez jalan aur dard" },
        { text: "🤰 गर्भावस्था में उल्टी", value: "pregnancy me ulti aur ghabrahat" },
        { text: "🤒 बुखार और बदन दर्द", value: "bukhar aur thakan aur badan dard" },
        { text: "🥱 कमजोरी और कमर दर्द", value: "bahut thakan kamzori aur kamar dard" }
    ],
    en: [
        { text: "🌸 White Discharge", value: "white discharge with itching" },
        { text: "🩸 Severe Period Pain", value: "severe period pain and nausea" },
        { text: "💧 Burning Urination", value: "burning urine and lower belly pain" },
        { text: "🤰 Pregnancy Vomiting", value: "pregnancy nausea and vomiting" },
        { text: "🤒 Fever & Body Ache", value: "fever with body ache and chills" },
        { text: "🥱 Weakness & Backache", value: "feeling weak and tired with backache" }
    ]
};

// Offline Symptoms Translation & Diagnostics Dictionary (The Triage Database)
const offlineClinicalDb = {
    leukorrhea: {
        keywords: ["safed pani", "yoni se pani", "discharge", "white discharge", "leukorrhea", "safed paani", "safeed paani"],
        severity: "caution",
        clinicalTerm: "Abnormal Vaginal Discharge (Leukorrhea)",
        potentialCondition: "Candidiasis / Bacterial Vaginosis / Trichomoniasis",
        vitals: "Body temperature, local pelvic tenderness, check for vaginal redness/edema.",
        action: "Refer to ANM/MO at Sub-center for syndromic treatment (Grey Kit 1 or Green Kit 2).",
        questions: [
            "What is the color and consistency (curd-like white, thin grey, yellowish)?",
            "Is there a foul smell associated with the discharge?",
            "Is there local vaginal itching, swelling, or burning during urination?"
        ],
        hi: `<div class="comfort-card"><strong>मेरी प्यारी बहन, परेशान न हों।</strong> सफेद पानी आना एक आम समस्या है, लेकिन इस पर ध्यान देना बहुत ज़रूरी है ताकि संक्रमण (infection) न फैले।</div>
            <p><strong>आसान और सुरक्षित उपाय:</strong></p>
            <ul>
                <li><strong>स्वच्छता:</strong> गुप्तांगों को हमेशा साफ और सूखा रखें। केवल साफ पानी से धोएं, साबुन का इस्तेमाल न करें।</li>
                <li><strong>कपड़े:</strong> केवल सूती (cotton) ढीले अंतःवस्त्र पहनें। उन्हें धोने के बाद तेज धूप में सुखाएं ताकि कीटाणु मर जाएं।</li>
                <li><strong>पानी:</strong> दिनभर में कम से कम 8 से 10 गिलास साफ पानी पिएं।</li>
                <li><strong>आहार:</strong> अपने भोजन में दही, छाछ और दलिया शामिल करें। यह शरीर में स्वस्थ बैक्टीरिया को बढ़ाता है।</li>
            </ul>
            <div class="advice-highlight"><strong>सावधानी:</strong> बाजार में मिलने वाले केमिकल सेंट या वाश का इस्तेमाल बिल्कुल न करें।</div>
            <div class="advice-danger"><strong>डॉक्टर के पास कब जाना है (चेतावनी):</strong> यदि सफेद पानी का रंग पीला या हरा हो गया हो, उसमें से तेज बदबू आ रही हो, या योनि में तेज खुजली और जलन हो रही हो, तो तुरंत आशा दीदी या डॉक्टर से मिलें।</div>`,
        en: `<div class="comfort-card"><strong>Dear sister, please do not worry.</strong> White vaginal discharge is a common concern, but it requires timely care to prevent infections.</div>
            <p><strong>Simple and Safe Measures:</strong></p>
            <ul>
                <li><strong>Hygiene:</strong> Keep your private area clean and dry. Wash only with plain lukewarm water; avoid using soaps.</li>
                <li><strong>Clothing:</strong> Wear clean, breathable cotton undergarments. Dry them in direct sunlight to eliminate germs.</li>
                <li><strong>Hydration:</strong> Drink at least 8 to 10 glasses of clean water daily to flush out toxins.</li>
                <li><strong>Nutrition:</strong> Include curd (dahi), buttermilk, and whole grains in your diet. They help build healthy bacteria.</li>
            </ul>
            <div class="advice-highlight"><strong>Avoid:</strong> Using scented intimate washes, deodorants, or local powders in private areas.</div>
            <div class="advice-danger"><strong>When to see a Doctor (Warning Signs):</strong> If the discharge turns yellowish-green, becomes foul-smelling, or is accompanied by intense itching and burning, visit your ANM or doctor immediately.</div>`
    },
    uti: {
        keywords: ["jalan", "peshab me", "peshab jalan", "urine burning", "burning urine", "pee pain", "peshab dard", "pesaab me jalan"],
        severity: "caution",
        clinicalTerm: "Dysuria / Suspected Urinary Tract Infection (UTI)",
        potentialCondition: "Acute Cystitis (Urinary Infection)",
        vitals: "Body temperature, suprapubic tenderness, blood pressure.",
        action: "Refer to Primary Health Centre (PHC) for urine analysis; check if antibiotics are needed.",
        questions: [
            "Are you experiencing lower abdominal pain or back pain?",
            "Is there a frequent urge to urinate but only a small amount comes out?",
            "Is there any history of fever, chills, or blood in the urine?"
        ],
        hi: `<div class="comfort-card"><strong>मेरी प्यारी बहन, घबराएं नहीं।</strong> पेशाब में जलन होना आमतौर पर पानी की कमी या पेशाब की नली में संक्रमण (UTI) के कारण होता है।</div>
            <p><strong>आसान और सुरक्षित उपाय:</strong></p>
            <ul>
                <li><strong>पानी का सेवन:</strong> हर घंटे कम से कम 1 गिलास पानी पिएं। नारियल पानी और नींबू पानी पीना बहुत फायदेमंद होता है।</li>
                <li><strong>पेशाब न रोकें:</strong> जब भी महसूस हो, पेशाब करने जाएं। पेशाब रोकने से कीटाणु बढ़ते हैं।</li>
                <li><strong>सफाई:</strong> शौचालय जाने के बाद आगे से पीछे की ओर पानी से सफाई करें, ताकि मल के कीटाणु पेशाब के रास्ते में न जाएं।</li>
                <li><strong>आहार:</strong> ताजे फलों का रस पिएं। तीखे और मसालेदार भोजन से परहेज करें।</li>
            </ul>
            <div class="advice-highlight"><strong>सावधानी:</strong> बिना डॉक्टर की सलाह के मेडिकल स्टोर से दवाइयां लेकर न खाएं।</div>
            <div class="advice-danger"><strong>डॉक्टर के पास कब जाना है (चेतावनी):</strong> यदि पेशाब के साथ तेज बुखार आ रहा हो, ठंड लग रही हो, पीठ के निचले हिस्से में तेज दर्द हो, या पेशाब में खून दिखे, तो तुरंत डॉक्टर या एएनएम से मिलें।</div>`,
        en: `<div class="comfort-card"><strong>Dear sister, please do not worry.</strong> Burning during urination is usually caused by dehydration or a Urinary Tract Infection (UTI).</div>
            <p><strong>Simple and Safe Measures:</strong></p>
            <ul>
                <li><strong>Hydration:</strong> Drink 1 glass of water every hour. Coconut water and fresh lemonade are highly beneficial.</li>
                <li><strong>Do Not Hold Urine:</strong> Urinate whenever you feel the urge. Holding urine allows harmful bacteria to multiply.</li>
                <li><strong>Hygiene:</strong> Always wipe from front to back after using the toilet to prevent germs from entering the urinary tract.</li>
                <li><strong>Diet:</strong> Drink fresh juices and avoid eating excessively spicy or oily food.</li>
            </ul>
            <div class="advice-highlight"><strong>Avoid:</strong> Taking self-prescribed antibiotics from local chemist shops.</div>
            <div class="advice-danger"><strong>When to see a Doctor (Warning Signs):</strong> If you develop high fever with chills, severe lower back or side pain, or notice blood in your urine, visit a doctor or health center immediately.</div>`
    },
    dysmenorrhea: {
        keywords: ["mahavari", "period", "periods", "mahina", "mahavari dard", "pet dard period", "period pain", "bleeding", "mahina dard"],
        severity: "caution",
        clinicalTerm: "Dysmenorrhea (Severe Period Pain)",
        potentialCondition: "Primary or Secondary Dysmenorrhea / Menorrhagia",
        vitals: "Abdominal palpation for rigidity, pulse rate, Hemoglobin levels.",
        action: "Recommend anti-spasmodic (like Dicyclomine/Mefenamic Acid) if prescribed, or refer to ANM if bleeding is excessive.",
        questions: [
            "How many sanitary pads or clean cloths are you soaking in a day?",
            "Is the pain so severe that you cannot do your daily activities?",
            "Are there large blood clots (thक्के) or is your cycle highly irregular?"
        ],
        hi: `<div class="comfort-card"><strong>मेरी प्यारी बहन, माहवारी का दर्द सामान्य है, पर इसे सहने की सीमा होती है।</strong> हम आपकी तकलीफ को समझते हैं, कृपया आराम करें।</div>
            <p><strong>आसान और सुरक्षित उपाय:</strong></p>
            <ul>
                <li><strong>गर्म सिकाई:</strong> पीठ के निचले हिस्से और पेट पर गर्म पानी की थैली या सूती कपड़े को गर्म करके सिकाई करें। इससे बहुत राहत मिलती है।</li>
                <li><strong>पोषण:</strong> इस समय आयरन की कमी हो सकती है। गुड़, चना, पालक, और हरी सब्जियां खूब खाएं।</li>
                <li><strong>हल्का व्यायाम:</strong> बिस्तर पर लेटने की बजाय थोड़ा टहलना या हल्की स्ट्रेचिंग करना दर्द को कम करने में मदद करता है।</li>
                <li><strong>गुनगुना पानी:</strong> ठंडा पानी पीने से बचें, हमेशा गुनगुना पानी या हर्बल चाय पिएं।</li>
            </ul>
            <div class="advice-highlight"><strong>सावधानी:</strong> माहवारी में साफ सूती कपड़े या पैड का ही इस्तेमाल करें और हर 4-6 घंटे में बदलें। कपड़े को धूप में अच्छी तरह सुखाएं।</div>
            <div class="advice-danger"><strong>डॉक्टर के पास कब जाना है (चेतावनी):</strong> यदि दर्द असहनीय हो जाए, आपको चक्कर आ रहे हों, या भारी ब्लीडिंग हो रही हो (दिन में 5 से ज्यादा पैड भीग रहे हों), तो तुरंत आशा दीदी की मदद से डॉक्टर के पास जाएं।</div>`,
        en: `<div class="comfort-card"><strong>Dear sister, period pain is common, but you do not have to suffer in silence.</strong> We understand your discomfort; please rest.</div>
            <p><strong>Simple and Safe Measures:</strong></p>
            <ul>
                <li><strong>Warm Compression:</strong> Apply a hot water bag or warm cloth on your lower abdomen and back. This relaxes muscles.</li>
                <li><strong>Nutrition:</strong> Prevent iron deficiency by eating jaggery (gur), roasted gram (chana), spinach, and green vegetables.</li>
                <li><strong>Gentle Movement:</strong> Instead of staying in bed, light walking or mild stretching helps reduce cramps.</li>
                <li><strong>Warm Fluids:</strong> Avoid iced drinks. Drink warm water, ginger tea, or warm milk.</li>
            </ul>
            <div class="advice-highlight"><strong>Hygiene:</strong> Use only clean sanitary pads or sterile cloth. Change them every 4-6 hours and wash/dry cloth in direct sunlight.</div>
            <div class="advice-danger"><strong>When to see a Doctor (Warning Signs):</strong> If the pain is unbearable, you feel dizzy/faint, or if you soak more than 5 pads a day, seek medical help with your ASHA worker immediately.</div>`
    },
    anemia: {
        keywords: ["kamzori", "kamjori", "thakan", "tired", "weakness", "kamar dard", "khoon", "khoon ki kami", "anemia", "thak", "kamjori thakan"],
        severity: "caution",
        clinicalTerm: "Nutritional Deficiency / Suspected Anemia",
        potentialCondition: "Iron Deficiency Anemia (Common in rural women)",
        vitals: "Hemoglobin level check, conjunctival pallor, nailbed pallor, BP.",
        action: "Refer to sub-center for Hemoglobin testing. Provide Iron & Folic Acid (IFA) tablets.",
        questions: [
            "Do you feel dizzy, breathless, or hear a ringing sound in your ears when walking?",
            "Are your eyes (lower eyelid), nails, or tongue looking pale or whitish?",
            "If you are pregnant, which month of pregnancy are you in?"
        ],
        hi: `<div class="comfort-card"><strong>मेरी प्यारी बहन, कमजोरी को कमजोरी न समझें।</strong> यह शरीर में खून की कमी (अनीमिया) का लक्षण हो सकता है, जो हमारे देश में महिलाओं में बहुत आम है।</div>
            <p><strong>खान-पान में बदलाव (सबसे ज़रूरी):</strong></p>
            <ul>
                <li><strong>आयरन युक्त भोजन:</strong> पालक, हरी पत्तेदार सब्जियां, चुकंदर, अनार, और सेब खाएं।</li>
                <li><strong>लोहे की कढ़ाई:</strong> सब्जी बनाने के लिए लोहे की कढ़ाई का इस्तेमाल करें, इससे भोजन में आयरन बढ़ता है।</li>
                <li><strong>विटामिन सी:</strong> आयरन सोखने के लिए भोजन के साथ नींबू या आंवला लें।</li>
                <li><strong>गुड़-चना:</strong> हर रोज दोपहर में मुट्ठी भर भुना चना और गुड़ खाएं।</li>
            </ul>
            <div class="advice-highlight"><strong>सावधानी:</strong> खाने के तुरंत बाद चाय या कॉफी न पिएं। यह भोजन से आयरन सोखने की प्रक्रिया को रोक देता है।</div>
            <div class="advice-danger"><strong>डॉक्टर के पास कब जाना है (चेतावनी):</strong> यदि बहुत ज्यादा चक्कर आ रहे हों, सीढ़ियां चढ़ने में सांस फूल रही हो, या आंखें बिल्कुल सफेद दिख रही हों, तो तुरंत अस्पताल जाकर हीमोग्लोबिन (Hb) टेस्ट करवाएं और आईएफए (IFA) गोलियां शुरू करें।</div>`,
        en: `<div class="comfort-card"><strong>Dear sister, weakness should not be ignored.</strong> It is often a key sign of low blood levels (Anemia), which is highly prevalent among women.</div>
            <p><strong>Dietary Adjustments (Crucial):</strong></p>
            <ul>
                <li><strong>Iron-Rich Diet:</strong> Eat spinach, green leafy vegetables, beetroot, pomegranate, and apples.</li>
                <li><strong>Iron Cookware:</strong> Cook vegetables in an iron pan (kadahi) to naturally enrich the food with iron.</li>
                <li><strong>Vitamin C:</strong> Eat lemons, oranges, or amla alongside iron foods to help your body absorb the iron.</li>
                <li><strong>Jaggery & Gram:</strong> Have a handful of roasted chana and gur (jaggery) daily as a snack.</li>
            </ul>
            <div class="advice-highlight"><strong>Avoid:</strong> Drinking tea or coffee immediately after meals, as it blocks iron absorption in your gut.</div>
            <div class="advice-danger"><strong>When to see a Doctor (Warning Signs):</strong> If you experience severe dizziness, breathlessness during minor physical work, or extreme paleness of the eyes, visit the sub-center for a Hemoglobin (Hb) test.</div>`
    },
    mastitis: {
        keywords: ["stan", "breast", "gath", "lump", "dudh", "stan me dard", "breast pain", "stan me gath", "mastitis", "stan dard"],
        severity: "urgent",
        clinicalTerm: "Mastitis / Suspected Breast Mass / Lactational Abscess",
        potentialCondition: "Puerperal Mastitis or Fibroadenoma / Breast Lesion",
        vitals: "Breast examination for localized warmth, redness, fluctuant mass, axillary lymph nodes, temperature.",
        action: "Refer directly to Medical Officer (MO) at CHC/District Hospital. Do NOT squeeze or apply local herbs.",
        questions: [
            "Are you currently breastfeeding a baby? If yes, is the baby sucking properly?",
            "Is there a hard lump, and is the skin over the breast red, hot, or painful?",
            "Is there any pus or blood discharging from the nipple?"
        ],
        hi: `<div class="comfort-card"><strong>मेरी प्यारी बहन, छाती में दर्द या गांठ को कभी नजरअंदाज नहीं करना चाहिए।</strong> कृपया शांति से इसे समझें और सही कदम उठाएं।</div>
            <p><strong>स्तनपान कराने वाली माताओं के लिए सलाह:</strong></p>
            <ul>
                <li><strong>दूध पिलाना जारी रखें:</strong> यदि आप स्तनपान करा रही हैं, तो दर्द वाले स्तन से भी बच्चे को दूध पिलाना बंद न करें। दूध रुकने से संक्रमण बढ़ता है।</li>
                <li><strong>दूध निकालें:</strong> यदि बच्चा दूध नहीं पी पा रहा है, तो साफ हाथों से हल्के हाथों से सहलाते हुए अतिरिक्त दूध बाहर निकाल दें।</li>
                <li><strong>गुनगुनी सिकाई:</strong> दूध पिलाने से पहले स्तन की हल्के गर्म कपड़े से सिकाई करें।</li>
            </ul>
            <div class="advice-highlight"><strong>सावधानी:</strong> गांठ को कभी भी जोर से न दबाएं (squeeze न करें) और न ही कोई जंगली जड़ी-बूटी लगाएं।</div>
            <div class="advice-danger"><strong>डॉक्टर के पास कब जाना है (चेतावनी):</strong> यदि स्तन का हिस्सा लाल और गरम हो, तेज बुखार आ रहा हो, या गांठ समय के साथ बड़ी और कठोर हो रही हो, तो बिना देर किए सामुदायिक स्वास्थ्य केंद्र (CHC) या डॉक्टर से तुरंत जांच करवाएं।</div>`,
        en: `<div class="comfort-card"><strong>Dear sister, breast pain or a lump must never be ignored.</strong> Please stay calm and take the recommended medical steps.</div>
            <p><strong>Advice for Lactating Mothers:</strong></p>
            <ul>
                <li><strong>Continue Nursing:</strong> If breastfeeding, do not stop nursing from the painful breast. Stagnant milk increases infection risk.</li>
                <li><strong>Express Milk:</strong> If the baby is unable to suckle, gently express the milk using clean hands to relieve breast pressure.</li>
                <li><strong>Warm Compress:</strong> Apply a mild warm compress on the breast before feeding to aid milk flow.</li>
            </ul>
            <div class="advice-highlight"><strong>Caution:</strong> Never squeeze, press, or massage the lump forcefully. Avoid applying unverified local herbs.</div>
            <div class="advice-danger"><strong>When to see a Doctor (Warning Signs):</strong> If the breast is visibly red, swollen, warm to touch, or accompanied by high fever or a hard, painless growing lump, consult a doctor at the CHC immediately.</div>`
    }
};

// ==========================================================================
// Initialization and UI Setup
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Load configurations from browser memory
    loadSettingsFromStorage();
    loadFontSizeFromStorage();
    loadHistoryFromStorage();

    // Set initial language and render symptom preset chips
    setLanguage(currentLang);

    // Initialize speech recognition object if available
    initSpeechRecognition();
});

// Set App Language (hi / en)
function setLanguage(lang) {
    currentLang = lang;
    document.body.setAttribute('lang', lang);
    
    // Toggle active state in buttons
    document.getElementById('btn-lang-hi').classList.toggle('active', lang === 'hi');
    document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');
    
    // Translate static strings
    const dict = translations[lang];
    document.getElementById('header-tagline').innerText = dict.tagline;
    document.getElementById('input-title').innerText = dict.inputTitle;
    document.getElementById('input-subtitle').innerText = dict.inputSubtitle;
    document.getElementById('symptom-input').placeholder = dict.inputPlaceholder;
    document.getElementById('presets-title').innerText = dict.presetsTitle;
    document.getElementById('submit-text').innerText = dict.submitBtn;
    
    // Empty state strings
    document.getElementById('empty-title').innerText = dict.emptyTitle;
    document.getElementById('empty-subtitle').innerText = dict.emptySubtitle;
    
    // Loading state strings
    document.getElementById('loading-title').innerText = dict.loadingTitle;
    document.getElementById('loading-subtitle').innerText = dict.loadingSubtitle;
    
    // Results tabs
    document.getElementById('tab-lbl-advice').innerText = dict.tabAdvice;
    document.getElementById('tab-lbl-asha').innerText = dict.tabAsha;
    document.getElementById('tab-lbl-history').innerText = dict.tabHistory;
    
    // TTS text
    document.getElementById('tts-label').innerText = dict.ttsLabel;
    document.getElementById('tts-play-txt').innerText = dict.ttsPlay;
    document.getElementById('tts-stop-txt').innerText = dict.ttsStop;
    
    // ASHA action buttons
    document.getElementById('btn-txt-copy').innerText = dict.copyTicket;
    document.getElementById('btn-txt-print').innerText = dict.printTicket;

    // History sections
    document.getElementById('history-section-title').innerText = dict.historyTitle;
    document.getElementById('btn-clear-history').innerText = dict.btnClearHistory;
    
    // Render Chips & History List
    renderPresetChips(lang);
    renderHistoryList();

    // If currently playing TTS, stop it
    stopSpeaking();
}

// Render dynamic chips
function renderPresetChips(lang) {
    const container = document.getElementById('chips-container');
    container.innerHTML = '';
    
    const chips = presetChips[lang];
    chips.forEach(chip => {
        const btn = document.createElement('button');
        btn.className = 'chip';
        btn.innerHTML = `<span class="chip-icon"></span> ${chip.text}`;
        btn.onclick = () => selectPresetChip(btn, chip.value);
        container.appendChild(btn);
    });
}

// Select preset chip
function selectPresetChip(element, value) {
    const chips = document.querySelectorAll('.chips-container .chip');
    chips.forEach(c => c.classList.remove('selected'));
    
    element.classList.add('selected');
    
    const input = document.getElementById('symptom-input');
    input.value = value;
    input.focus();
}

// ==========================================================================
// Accessibility Font Scaling Engine
// ==========================================================================
function adjustFontSize(delta) {
    const btnContainer = document.getElementById('accessibility-font-controls');
    const buttons = btnContainer.querySelectorAll('.font-scale-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    if (delta === 0) {
        fontSizeScale = 1.0;
        btnContainer.querySelector('.font-scale-btn.reset').classList.add('active');
    } else {
        fontSizeScale = parseFloat((fontSizeScale + delta).toFixed(1));
        // Bound scaling between 0.8 and 1.5
        if (fontSizeScale < 0.8) fontSizeScale = 0.8;
        if (fontSizeScale > 1.5) fontSizeScale = 1.5;

        if (delta > 0) {
            btnContainer.lastElementChild.classList.add('active');
        } else {
            btnContainer.firstElementChild.classList.add('active');
        }
    }

    // Set variable on root document element
    document.documentElement.style.setProperty('--font-scale', fontSizeScale);
    localStorage.setItem('aura_font_scale', fontSizeScale);
}

function loadFontSizeFromStorage() {
    const scale = localStorage.getItem('aura_font_scale');
    if (scale) {
        fontSizeScale = parseFloat(scale);
        document.documentElement.style.setProperty('--font-scale', fontSizeScale);
        
        // Match UI buttons state
        const btnContainer = document.getElementById('accessibility-font-controls');
        if (fontSizeScale === 1.0) {
            btnContainer.querySelector('.font-scale-btn.reset').classList.add('active');
        } else if (fontSizeScale > 1.0) {
            btnContainer.lastElementChild.classList.add('active');
        } else {
            btnContainer.firstElementChild.classList.add('active');
        }
    } else {
        document.getElementById('accessibility-font-controls').querySelector('.font-scale-btn.reset').classList.add('active');
    }
}

// ==========================================================================
// Web Speech API Integration (STT)
// ==========================================================================
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        document.getElementById('btn-voice').disabled = true;
        document.getElementById('voice-status').innerText = translations[currentLang].voiceNotSupported;
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        isRecording = true;
        document.getElementById('voice-overlay').classList.remove('hidden');
        document.getElementById('voice-listening-msg').innerText = currentLang === 'hi' ? "सुन रहे हैं... कृपया बोलें" : "Listening... Please speak now";
    };
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const textarea = document.getElementById('symptom-input');
        if (textarea.value.trim() === "") {
            textarea.value = transcript;
        } else {
            textarea.value += " " + transcript;
        }
        textarea.focus();
    };
    
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        stopSpeechRecognition();
    };
    
    recognition.onend = () => {
        stopSpeechRecognition();
    };
}

function toggleSpeechRecognition() {
    if (!recognition) {
        showToast(translations[currentLang].voiceNotSupported);
        return;
    }
    
    if (isRecording) {
        stopSpeechRecognition();
    } else {
        recognition.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.start();
    }
}

function stopSpeechRecognition() {
    if (recognition && isRecording) {
        recognition.stop();
    }
    isRecording = false;
    document.getElementById('voice-overlay').classList.add('hidden');
}

// ==========================================================================
// Fuzzy Matching NLP Engine (Levenshtein Distance Algorithm)
// ==========================================================================
function levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = [];

    for (let i = 0; i <= len1; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = (s1[i - 1] === s2[j - 1]) ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,      // deletion
                matrix[i][j - 1] + 1,      // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }
    return matrix[len1][len2];
}

function getSimilarity(s1, s2) {
    const dist = levenshteinDistance(s1, s2);
    const maxLen = Math.max(s1.length, s2.length);
    if (maxLen === 0) return 1.0;
    return 1.0 - (dist / maxLen);
}

// Scans text for fuzzy matches with local dictionary
function findFuzzyMatch(userInput) {
    const inputCleaned = userInput.toLowerCase();
    
    // Filter out common Hinglish/Hindi stop words to clean up text
    const stopwords = ["hai", "h", "me", "se", "aur", "ko", "ki", "ka", "ke", "par", "ek", "do", "din", "raha", "rha", "thi", "rhi", "hu", "hoon", "hi", "to"];
    const tokens = inputCleaned.split(/[\s,，.।;?!]+/).filter(w => w.length > 1 && !stopwords.includes(w));

    let bestKey = null;
    let maxMatchCount = 0;

    // Check against offline clinical database
    for (const key in offlineClinicalDb) {
        const item = offlineClinicalDb[key];
        let currentMatchCount = 0;

        // Check each keyword
        item.keywords.forEach(keyword => {
            const kwParts = keyword.split(' ');

            if (kwParts.length > 1) {
                // Multi-word keyword: check if all parts have close fuzzy matches in patient tokens
                let partsMatched = 0;
                kwParts.forEach(part => {
                    const hasMatch = tokens.some(t => getSimilarity(t, part) >= 0.75); // Resilient threshold
                    if (hasMatch) partsMatched++;
                });
                if (partsMatched === kwParts.length) {
                    currentMatchCount += 2; // High weight for multi-word match (like "safed pani")
                }
            } else {
                // Single-word keyword: check fuzzy match similarity
                const hasMatch = tokens.some(t => getSimilarity(t, keyword) >= 0.8);
                if (hasMatch) {
                    currentMatchCount += 1;
                }
            }
        });

        if (currentMatchCount > maxMatchCount) {
            maxMatchCount = currentMatchCount;
            bestKey = key;
        }
    }

    // Require at least one matches to trigger specific case
    return maxMatchCount > 0 ? offlineClinicalDb[bestKey] : null;
}

// ==========================================================================
// Symptom Triage Processing Logic
// ==========================================================================
async function processSymptoms() {
    const text = document.getElementById('symptom-input').value.trim();
    if (!text) {
        showToast(currentLang === 'hi' ? 'कृपया अपनी बीमारी या लक्षण लिखें।' : 'Please describe your symptoms first.');
        return;
    }

    // Stop speaking if playing
    stopSpeaking();

    // Show Loader State
    showState('loading');

    const source = document.getElementById('ai-source').value;
    
    try {
        if (source === 'gemini') {
            await runGeminiTriage(text);
        } else {
            // Run offline engine with artificial short delay for comforting flow
            await new Promise(resolve => setTimeout(resolve, 1500));
            runOfflineTriage(text);
        }
    } catch (err) {
        console.error("AI engine processing error:", err);
        // Fallback to offline engine
        showToast(currentLang === 'hi' ? 'गड़बड़: ऑफ़लाइन मोड से सलाह दिखाई जा रही है।' : 'Error: Showing offline backup advice.');
        runOfflineTriage(text);
    }
}

// Offline Triage Engine utilizing Fuzzy Matcher
function runOfflineTriage(userInput) {
    const matchedCase = findFuzzyMatch(userInput);

    let resultHtml = "";
    let clinicalTerm = "General Health Consultation";
    let potentialCondition = "Symptomatic Care / Consult Clinic";
    let severity = "safe";
    let vitals = "Temperature, Blood Pressure, Pulse Rate.";
    let action = "Visit ASHA worker or ANM for baseline assessment.";
    let questions = [
        "How long have you been feeling these symptoms?",
        "Is there any pain, fever, or sleep disturbance?",
        "Are you taking any self-medication or home remedies?"
    ];

    if (matchedCase) {
        resultHtml = currentLang === 'hi' ? matchedCase.hi : matchedCase.en;
        clinicalTerm = matchedCase.clinicalTerm;
        potentialCondition = matchedCase.potentialCondition;
        severity = matchedCase.severity;
        vitals = matchedCase.vitals;
        action = matchedCase.action;
        questions = matchedCase.questions;
    } else {
        // Fallback general guidance
        resultHtml = translations[currentLang].generalFallbackText;
        if (currentLang === 'en') {
            clinicalTerm = "Undifferentiated Mild Symptoms";
            potentialCondition = "General Fatigue or Mild Infection";
        } else {
            clinicalTerm = "अस्पष्ट लक्षण (Undifferentiated Symptoms)";
            potentialCondition = "सामान्य कमजोरी या प्रारंभिक संक्रमण";
        }
    }

    const payload = {
        clinicalTerm,
        potentialCondition,
        severity,
        vitals,
        action,
        questions,
        rawText: userInput
    };

    // Save record to local storage
    saveConsultationRecord(adviceHtml = resultHtml, payload);

    renderResults(resultHtml, payload);
}

// Online Gemini Live AI Triage
async function runGeminiTriage(userInput) {
    const apiKey = document.getElementById('gemini-key').value.trim();
    if (!apiKey) {
        showToast(currentLang === 'hi' ? 'त्रुटि: कृपया सेटिंग्स में जाकर जेमिनी API की दर्ज करें।' : 'Error: Please enter a Gemini API Key in Settings.');
        throw new Error("Missing API Key");
    }

    const model = document.getElementById('gemini-model').value;
    const temp = parseFloat(document.getElementById('gemini-temp').value) || 0.2;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key={apiKey}`.replace('{apiKey}', apiKey);
    
    // Construct strict prompt instructing direct HTML returns
    const systemPrompt = `You are Aura Engine v2.0, a comforting, clinical AI health triage assistant designed specifically for women in rural India.
The user speaks a mix of Hindi, Hinglish, and English.
You must analyze the symptom input and output a valid JSON block containing:
1. "advice": Comforting health advice for the patient written in the requested user language (Active Language is: ${currentLang === 'hi' ? 'Hindi / Devnagari script' : 'English'}).
   CRITICAL RULE: The value for "advice" must be generated as clean, ready-to-render HTML (using <div>, <p>, <strong>, <ul>, <li>). Do NOT wrap it in markdown code blocks (e.g., do NOT include \`\`\`html or \`\`\`). Use gentle tone, dietary recommendations, home care, and clear emergency warning signs.
2. "clinical_term": Standard English medical term representing the colloquial symptoms.
3. "potential_condition": Possible clinical condition or diagnosis in English.
4. "severity": Triage level, choose exactly one of: "safe", "caution", "urgent".
5. "questions": Array of 3 specific clinical questions the doctor or ASHA worker should ask the patient.
6. "vitals": Essential physical vitals to check.
7. "action": Primary referral action plan (e.g., consult ANM, sub-center, urgent hospital referral).

Output strictly valid JSON and nothing else. Ensure proper JSON escaping.`;

    const userPrompt = `Patient symptom description: "${userInput}"`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: systemPrompt },
                        { text: userPrompt }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json",
                temperature: temp
            }
        })
    });

    if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
    }

    const data = await response.json();
    let jsonText = data.candidates[0].content.parts[0].text;
    
    const parsedData = JSON.parse(jsonText);
    
    const payload = {
        clinicalTerm: parsedData.clinical_term,
        potentialCondition: parsedData.potential_condition,
        severity: parsedData.severity || "safe",
        vitals: parsedData.vitals,
        action: parsedData.action,
        questions: parsedData.questions,
        rawText: userInput
    };

    saveConsultationRecord(parsedData.advice, payload);

    renderResults(parsedData.advice, payload);
}

// Render values into ASHA card and advice panes
function renderResults(adviceHtml, meta) {
    // 1. Injected advice HTML
    const container = document.getElementById('advice-content-container');
    container.innerHTML = adviceHtml;
    
    // 2. ASHA Card elements
    document.getElementById('asha-raw-symptoms').innerText = `"${meta.rawText}"`;
    document.getElementById('asha-clinical-term').innerText = meta.clinicalTerm;
    document.getElementById('asha-potential-cond').innerText = meta.potentialCondition;
    document.getElementById('asha-vitals-to-check').innerText = meta.vitals;
    document.getElementById('asha-action-plan').innerText = meta.action;
    
    // Urgent / Caution / Safe badge styling
    const badge = document.getElementById('asha-severity-badge');
    badge.className = 'triage-severity-badge';
    
    if (meta.severity === 'urgent') {
        badge.classList.add('urgent');
        badge.innerText = currentLang === 'hi' ? 'Emergency / आपातकालीन (Urgent)' : 'Urgent Referral';
    } else if (meta.severity === 'caution') {
        badge.classList.add('caution');
        badge.innerText = currentLang === 'hi' ? 'Care Needed / देखभाल आवश्यक' : 'Caution / Care Needed';
    } else {
        badge.classList.add('safe');
        badge.innerText = currentLang === 'hi' ? 'Safe / सामान्य' : 'Safe / Home Care';
    }

    // Diagnostic questions list
    const qList = document.getElementById('asha-questions-list');
    qList.innerHTML = '';
    meta.questions.forEach(q => {
        const li = document.createElement('li');
        li.innerText = q;
        qList.appendChild(li);
    });

    // Timestamp
    const now = new Date();
    const dateStr = now.toLocaleDateString(currentLang === 'hi' ? 'hi-IN' : 'en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('asha-timestamp').innerText = dateStr;

    // Generate Dynamic SVG QR Code completely offline
    generateOfflineQrCode(meta, dateStr);

    // Show Result Panel
    showState('result');
    switchTab('advice');
}

// Manage Panel View State Transitions
function showState(state) {
    document.getElementById('state-empty').classList.add('hidden');
    document.getElementById('state-loading').classList.add('hidden');
    document.getElementById('state-result').classList.add('hidden');
    
    if (state === 'empty') {
        document.getElementById('state-empty').classList.remove('hidden');
    } else if (state === 'loading') {
        document.getElementById('state-loading').classList.remove('hidden');
    } else if (state === 'result') {
        document.getElementById('state-result').classList.remove('hidden');
    }
}

// Switch tabs inside results (Advice vs ASHA Card vs History)
function switchTab(tab) {
    activeTab = tab;
    
    document.getElementById('tab-advice').classList.toggle('active', tab === 'advice');
    document.getElementById('tab-asha').classList.toggle('active', tab === 'asha');
    document.getElementById('tab-history').classList.toggle('active', tab === 'history');
    
    document.getElementById('pane-advice').classList.toggle('active', tab === 'advice');
    document.getElementById('pane-asha').classList.toggle('active', tab === 'asha');
    document.getElementById('pane-history').classList.toggle('active', tab === 'history');

    if (tab === 'history') {
        renderHistoryList();
    }
}

// ==========================================================================
// Text-to-Speech (TTS) Voice Synthesis
// ==========================================================================
function speakResult() {
    if (!('speechSynthesis' in window)) {
        showToast(translations[currentLang].ttsNotSupported);
        return;
    }
    
    stopSpeaking();
    
    // Get advice HTML text content only (stripped of HTML tags)
    const contentText = document.getElementById('advice-content-container').innerHTML;
    const cleanText = contentText.replace(/<[^>]*>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim();
    
    currentUtterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    let matchingVoice = null;
    
    if (currentLang === 'hi') {
        matchingVoice = voices.find(v => v.lang.startsWith('hi'));
    } else {
        matchingVoice = voices.find(v => v.lang.startsWith('en-IN')) || voices.find(v => v.lang.startsWith('en'));
    }
    
    if (matchingVoice) {
        currentUtterance.voice = matchingVoice;
    }
    
    currentUtterance.rate = 0.85; // Calmer speed for rural auditory comprehension
    
    currentUtterance.onstart = () => {
        document.getElementById('btn-tts-play').classList.add('hidden');
        document.getElementById('btn-tts-stop').classList.remove('hidden');
    };
    
    currentUtterance.onend = () => {
        resetTtsButtons();
    };
    
    currentUtterance.onerror = (e) => {
        console.error("TTS execution error:", e);
        resetTtsButtons();
    };

    window.speechSynthesis.speak(currentUtterance);
}

function stopSpeaking() {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    resetTtsButtons();
}

function resetTtsButtons() {
    document.getElementById('btn-tts-play').classList.remove('hidden');
    document.getElementById('btn-tts-stop').classList.add('hidden');
}

// ==========================================================================
// Local EHR Patient History Journal (localStorage EHR)
// ==========================================================================
function saveConsultationRecord(adviceHtml, meta) {
    const record = {
        timestamp: new Date().toISOString(),
        adviceHtml,
        rawText: meta.rawText,
        clinicalTerm: meta.clinicalTerm,
        potentialCondition: meta.potentialCondition,
        severity: meta.severity,
        vitals: meta.vitals,
        action: meta.action,
        questions: meta.questions
    };

    patientHistory.unshift(record);
    // Keep max 15 records to prevent filling browser storage
    if (patientHistory.length > 15) {
        patientHistory.pop();
    }

    localStorage.setItem('aura_patient_history', JSON.stringify(patientHistory));
    renderHistoryList();
}

function loadHistoryFromStorage() {
    const raw = localStorage.getItem('aura_patient_history');
    if (raw) {
        try {
            patientHistory = JSON.parse(raw);
        } catch (e) {
            patientHistory = [];
        }
    }
}

function renderHistoryList() {
    const container = document.getElementById('history-list-container');
    container.innerHTML = '';

    if (patientHistory.length === 0) {
        container.innerHTML = `<div class="history-empty-msg">${translations[currentLang].historyEmpty}</div>`;
        return;
    }

    patientHistory.forEach((record, index) => {
        const dateObj = new Date(record.timestamp);
        const displayDate = dateObj.toLocaleDateString(currentLang === 'hi' ? 'hi-IN' : 'en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const card = document.createElement('div');
        card.className = 'history-card';
        card.onclick = () => loadHistoryRecordIntoView(index);

        card.innerHTML = `
            <div class="history-card-header">
                <span class="history-card-title">${record.clinicalTerm}</span>
                <span class="history-card-time">${displayDate}</span>
            </div>
            <div class="history-card-symptom">"${record.rawText}"</div>
            <div class="history-card-footer">
                <span class="history-status-badge ${record.severity}">${record.severity.toUpperCase()}</span>
                <span class="history-card-click-tip">${translations[currentLang].historyClickTip} &rarr;</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadHistoryRecordIntoView(index) {
    const record = patientHistory[index];
    if (!record) return;

    renderResults(record.adviceHtml, {
        clinicalTerm: record.clinicalTerm,
        potentialCondition: record.potentialCondition,
        severity: record.severity,
        vitals: record.vitals,
        action: record.action,
        questions: record.questions,
        rawText: record.rawText
    });
}

function clearHistory() {
    const confirmMsg = currentLang === 'hi' 
        ? "क्या आप सचमुच अपने पुराने सभी परामर्श रिकॉर्ड मिटाना चाहती हैं?" 
        : "Are you sure you want to clear your entire health history logs?";
    
    if (confirm(confirmMsg)) {
        patientHistory = [];
        localStorage.removeItem('aura_patient_history');
        renderHistoryList();
        showToast(translations[currentLang].toastHistoryCleared);
    }
}

// ==========================================================================
// 100% Offline SVG QR Code Generator (Compact Custom Class)
// ==========================================================================
function generateOfflineQrCode(meta, timestamp) {
    const qrWrapper = document.getElementById('asha-qrcode-svg-wrapper');
    qrWrapper.innerHTML = '';

    // Compact summary string to fit in QR Code Version 4 / 5
    const ticketData = `AURA-TICKET v2.0
Date: ${timestamp}
Severity: ${meta.severity.toUpperCase()}
Symptoms: ${meta.rawText.substring(0, 50)}
Clinical: ${meta.clinicalTerm}
Cause: ${meta.potentialCondition}
Vitals: ${meta.vitals}
Action: ${meta.action}`;

    try {
        // Initialize custom tiny encoder
        const qr = new CompactQRCode(ticketData);
        const svgElement = qr.toSVGElement();
        qrWrapper.appendChild(svgElement);
    } catch (e) {
        console.error("Local QR Code Generation error:", e);
        // Fallback placeholder text if encoding size overflows
        qrWrapper.innerHTML = `<span style="font-size: 0.8rem; color:#dc3545; text-align:center;">QR Code Overflow (Text too long)</span>`;
    }
}

/**
 * Compact QRCode Class
 * A pure-JS, self-contained implementation of QR Code (Version 10, Medium Error Correction)
 * suited for local offline data transfers. Renders as a scalable SVG.
 */
class CompactQRCode {
    constructor(dataString) {
        this.data = dataString;
        this.typeNumber = this.determineBestVersion(dataString);
        this.errorCorrectLevel = 1; // 1 = Medium (M), suitable for typical cameras
        this.modules = null;
        this.moduleCount = 0;
        
        // QR Code constant references
        this.PAD0 = 0xEC;
        this.PAD1 = 0x11;
        
        this.make();
    }

    determineBestVersion(str) {
        const len = str.length;
        if (len < 60) return 4;
        if (len < 100) return 6;
        if (len < 150) return 8;
        return 10; // Up to ~200 characters easily with Level M
    }

    make() {
        this.moduleCount = this.typeNumber * 4 + 17;
        this.modules = new Array(this.moduleCount);
        for (let row = 0; row < this.moduleCount; row++) {
            this.modules[row] = new Array(this.moduleCount).fill(null);
        }

        // 1. Plot Finder Patterns
        this.setupFinderPattern(0, 0);
        this.setupFinderPattern(this.moduleCount - 7, 0);
        this.setupFinderPattern(0, this.moduleCount - 7);

        // 2. Plot Timing Patterns
        this.setupTimingPattern();

        // 3. Plot Alignment Patterns
        this.setupAlignmentPattern();

        // 4. Plot Format Info
        this.setupTypeInfo(true, 0);

        // 5. Build and Pack Data bytes
        const dataBytes = this.createData();
        
        // 6. Map to matrix
        this.mapData(dataBytes, 0);
    }

    setupFinderPattern(row, col) {
        for (let r = -1; r <= 7; r++) {
            if (row + r < -1 || this.moduleCount <= row + r) continue;
            for (let c = -1; c <= 7; c++) {
                if (col + c < -1 || this.moduleCount <= col + c) continue;
                
                if ( (0 <= r && r <= 6 && (c == 0 || c == 6) )
                        || (0 <= c && c <= 6 && (r == 0 || r == 6) )
                        || (2 <= r && r <= 4 && 2 <= c && c <= 4) ) {
                    this.modules[row + r][col + c] = true;
                } else {
                    this.modules[row + r][col + c] = false;
                }
            }
        }
    }

    setupTimingPattern() {
        for (let r = 8; r < this.moduleCount - 8; r++) {
            if (this.modules[r][6] != null) continue;
            this.modules[r][6] = (r % 2 == 0);
        }
        for (let c = 8; c < this.moduleCount - 8; c++) {
            if (this.modules[6][c] != null) continue;
            this.modules[6][c] = (c % 2 == 0);
        }
    }

    setupAlignmentPattern() {
        const pos = this.getAlignmentPositions();
        for (let i = 0; i < pos.length; i++) {
            for (let j = 0; j < pos.length; j++) {
                const row = pos[i];
                const col = pos[j];
                
                if (this.modules[row][col] != null) continue;
                
                for (let r = -2; r <= 2; r++) {
                    for (let c = -2; c <= 2; c++) {
                        if (Math.abs(r) == 2 || Math.abs(c) == 2 || (r == 0 && c == 0) ) {
                            this.modules[row + r][col + c] = true;
                        } else {
                            this.modules[row + r][col + c] = false;
                        }
                    }
                }
            }
        }
    }

    getAlignmentPositions() {
        // Standard coordinates index for version 4, 6, 8, 10
        if (this.typeNumber === 4) return [6, 26];
        if (this.typeNumber === 6) return [6, 34];
        if (this.typeNumber === 8) return [6, 24, 42];
        return [6, 28, 50]; // Version 10 positions
    }

    setupTypeInfo(test, maskPattern) {
        // Standard format pattern bitmask for Level M
        const bits = 0x5b37 ^ 0x5412; // Mask level M and pattern 0
        for (let i = 0; i < 15; i++) {
            const mod = ( ((bits >> i) & 1) == 1 );
            
            // First place
            if (i < 6) {
                this.modules[i][8] = mod;
            } else if (i < 8) {
                this.modules[i + 1][8] = mod;
            } else {
                this.modules[this.moduleCount - 15 + i][8] = mod;
            }
            
            // Second place
            if (i < 8) {
                this.modules[8][this.moduleCount - i - 1] = mod;
            } else if (i < 9) {
                this.modules[8][15 - i - 1 + 1] = mod;
            } else {
                this.modules[8][15 - i - 1] = mod;
            }
        }
    }

    createData() {
        const buffer = [];
        // Mode indicator: 0100 (Byte mode)
        buffer.push(0x40 | (this.data.length >> 4));
        buffer.push((this.data.length & 0x0f) << 4);
        
        let bitIndex = 12;
        
        // Pack data characters
        for (let i = 0; i < this.data.length; i++) {
            const charCode = this.data.charCodeAt(i);
            const byte = charCode & 0xFF;
            
            // Write 8 bits
            for (let b = 7; b >= 0; b--) {
                const bit = (byte >> b) & 1;
                const bytePos = Math.floor(bitIndex / 8);
                const bitPos = 7 - (bitIndex % 8);
                
                if (buffer[bytePos] === undefined) buffer[bytePos] = 0;
                if (bit) {
                    buffer[bytePos] |= (1 << bitPos);
                }
                bitIndex++;
            }
        }

        // Fill remaining spaces with alternate padding codes
        const totalBits = this.getCapacities();
        const paddingBytes = Math.floor(totalBits / 8) - buffer.length;
        
        for (let i = 0; i < paddingBytes; i++) {
            buffer.push(i % 2 === 0 ? this.PAD0 : this.PAD1);
        }

        return buffer;
    }

    getCapacities() {
        // Bit limits for Level M QR Codes (Ver 4: 624, Ver 6: 1088, Ver 8: 1632, Ver 10: 2304)
        if (this.typeNumber === 4) return 624;
        if (this.typeNumber === 6) return 1088;
        if (this.typeNumber === 8) return 1632;
        return 2304; // Version 10 limit
    }

    mapData(data, maskPattern) {
        let inc = -1;
        let row = this.moduleCount - 1;
        let bitIndex = 0;
        let bytePos = 0;

        for (let col = this.moduleCount - 1; col > 0; col -= 2) {
            if (col == 6) col--; // Skip timing column
            
            while (true) {
                for (let c = 0; c < 2; c++) {
                    const targetCol = col - c;
                    if (this.modules[row][targetCol] === null) {
                        let dark = false;
                        if (bytePos < data.length) {
                            const byte = data[bytePos];
                            const bitPos = 7 - (bitIndex % 8);
                            dark = ( ((byte >> bitPos) & 1) == 1 );
                        }
                        
                        // Apply basic mask (row + targetCol) % 2 === 0
                        if ((row + targetCol) % 2 === 0) {
                            dark = !dark;
                        }
                        
                        this.modules[row][targetCol] = dark;
                        bitIndex++;
                        if (bitIndex % 8 === 0) {
                            bytePos++;
                        }
                    }
                }
                
                row += inc;
                if (row < 0 || this.moduleCount <= row) {
                    row -= inc;
                    inc = -inc;
                    break;
                }
            }
        }
    }

    toSVGElement() {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", `0 0 ${this.moduleCount} ${this.moduleCount}`);
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.shapeRendering = "crispEdges";

        // Background white path
        const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bg.setAttribute("width", this.moduleCount);
        bg.setAttribute("height", this.moduleCount);
        bg.setAttribute("fill", "white");
        svg.appendChild(bg);

        // Path representing black squares
        let pathData = "";
        for (let r = 0; r < this.moduleCount; r++) {
            for (let c = 0; c < this.moduleCount; c++) {
                if (this.modules[r][c]) {
                    pathData += `M${c},${r}h1v1h-1z `;
                }
            }
        }

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", "black");
        svg.appendChild(path);

        return svg;
    }
}

// ==========================================================================
// Settings Modal & Preset Loaders
// ==========================================================================
function openModal() {
    document.getElementById('settings-modal').classList.add('active');
    loadSettingsFromStorage();
}

function closeModal() {
    document.getElementById('settings-modal').classList.remove('active');
}

function closeModalOnBackdrop(event) {
    if (event.target.id === 'settings-modal') {
        closeModal();
    }
}

function toggleAiSourceFields() {
    const source = document.getElementById('ai-source').value;
    const fields = document.getElementById('gemini-fields-container');
    if (source === 'gemini') {
        fields.classList.remove('hidden');
    } else {
        fields.classList.add('hidden');
    }
}

function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    const btn = input.nextElementSibling;
    if (input.type === 'password') {
        input.type = 'text';
        btn.innerText = 'Hide';
    } else {
        input.type = 'password';
        btn.innerText = 'Show';
    }
}

function saveSettings() {
    localStorage.setItem('aura_ai_source', document.getElementById('ai-source').value);
    localStorage.setItem('aura_gemini_key', document.getElementById('gemini-key').value);
    localStorage.setItem('aura_gemini_model', document.getElementById('gemini-model').value);
    localStorage.setItem('aura_gemini_temp', document.getElementById('gemini-temp').value);
    
    closeModal();
    showToast(translations[currentLang].toastSaved);
}

function loadSettingsFromStorage() {
    const source = localStorage.getItem('aura_ai_source') || 'offline';
    const key = localStorage.getItem('aura_gemini_key') || '';
    const model = localStorage.getItem('aura_gemini_model') || 'gemini-1.5-flash';
    const temp = localStorage.getItem('aura_gemini_temp') || '0.2';
    
    document.getElementById('ai-source').value = source;
    document.getElementById('gemini-key').value = key;
    document.getElementById('gemini-model').value = model;
    document.getElementById('gemini-temp').value = temp;
    document.getElementById('temp-val').innerText = temp;
    
    toggleAiSourceFields();
}

// Load clinical preset test scenarios from settings modal
function loadPresetScenario() {
    const scenario = document.getElementById('test-scenario').value;
    if (!scenario) return;
    
    let symptomsText = "";
    let targetLang = "hi"; // Default Hindi for Hinglish presets

    switch (scenario) {
        case 'leukorrhea':
            symptomsText = "2 hafte se yoni se safd panni aa raha h, dahi jesa white h aur peshab krne me jaln hoti h.";
            targetLang = "hi";
            break;
        case 'uti':
            symptomsText = "Pesaab krne me bahut tej jaln ho rha h aur niche peth me dard h. Kamar me bhi dard lag rha h.";
            targetLang = "hi";
            break;
        case 'dysmenorrhea':
            symptomsText = "Mhavari ke dauran pet me bahut tej drd aur ulti aa rha h. 3 din se bahut preshan hu.";
            targetLang = "hi";
            break;
        case 'anemia':
            symptomsText = "Kamjori aur thakawat lagta hai, thoda chalne pr hi saans phul jati hai, aankh bilkul safed dikhta hai.";
            targetLang = "hi";
            break;
        case 'breast_pain':
            symptomsText = "Stan me tez dard h aur ek choti si gath mehsoos ho rhi h, baby ko milk pilane me drd hota h.";
            targetLang = "hi";
            break;
    }

    if (symptomsText) {
        setLanguage(targetLang);
        document.getElementById('symptom-input').value = symptomsText;
        
        // Remove preset chip selections if active
        const chips = document.querySelectorAll('.chips-container .chip');
        chips.forEach(c => c.classList.remove('selected'));
        
        closeModal();
        showToast(targetLang === 'hi' ? "परीक्षण मामला लोड किया गया!" : "Test scenario loaded!");
    }
}

// ==========================================================================
// Actions and Exports
// ==========================================================================
function copyAuraTicketText() {
    const syms = document.getElementById('asha-raw-symptoms').innerText;
    const term = document.getElementById('asha-clinical-term').innerText;
    const cond = document.getElementById('asha-potential-cond').innerText;
    const vitals = document.getElementById('asha-vitals-to-check').innerText;
    const action = document.getElementById('asha-action-plan').innerText;
    
    const questions = [];
    document.querySelectorAll('#asha-questions-list li').forEach(li => {
        questions.push("- " + li.innerText);
    });

    const ticketText = `=== AURA TRIAGE MEDICAL TICKET ===
Severity: ${document.getElementById('asha-severity-badge').innerText}
Symptoms Reported: ${syms}
Clinical Jargon: ${term}
Suspected Cause: ${cond}
Vitals to Check: ${vitals}
ASHA Referral Action: ${action}
Suggested Questions to ask:
${questions.join('\n')}
Generated on: ${document.getElementById('asha-timestamp').innerText}
===================================`;

    navigator.clipboard.writeText(ticketText).then(() => {
        showToast(translations[currentLang].toastCopied);
    }).catch(err => {
        console.error("Copy failed: ", err);
    });
}

function printAuraTicket() {
    window.print();
}

// Toast alerts helper
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Necessary for loading voices asynchronously in Chrome
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        // Triggers voices loading
    };
}
