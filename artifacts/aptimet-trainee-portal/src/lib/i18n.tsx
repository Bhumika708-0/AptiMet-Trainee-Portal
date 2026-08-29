import React, { createContext, useContext, useState, useEffect } from 'react';

export type SupportedLanguage = 'en' | 'hi' | 'or' | 'bn' | 'ta';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🌊' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🌾' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🌴' },
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    dashboard: "Dashboard",
    courseCatalog: "Course Catalog",
    skillAssessment: "Skill Assessment",
    myProfile: "My Profile",
    cycloneWarZone: "Cyclone War Zone",
    forecastDuels: "Forecast Duels",
    groundReports: "Citizen Ground Reports",
    leaderboard: "Operational ELO Leaderboard",
    emergencyBroadcast: "Emergency Fan-Out",
    howThisWorks: "How this works",
    realVsSimulated: "Real vs Simulated Logic",
    liveDataFeed: "Live Meteorological Feeds",
    offlineMode: "Offline Mode Active",
    online: "Online",
    lowBandwidth: "Low Bandwidth (2G)",
    offline: "Offline",
    submitCall: "Submit Operational Call",
    predictionAssist: "Explainable Prediction Assist",
    accuracyScore: "Accuracy Score",
    meanTrackError: "Mean Track Error",
    eloRating: "ELO Rating",
    evacuateZone: "Order Evacuation",
    livesSaved: "Estimated Lives Saved",
    totalCost: "Total Mobilization Cost",
    disasterReady: "Disaster-Ready Simulator",
    upvoteReport: "Confirm Report",
    verifiedByImd: "Verified by IMD Ground Spotter",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    courseCatalog: "पाठ्यक्रम सूची",
    skillAssessment: "कौशल मूल्यांकन",
    myProfile: "मेरी प्रोफ़ाइल",
    cycloneWarZone: "चक्रवात वार ज़ोन सिमुलेशन",
    forecastDuels: "पूर्वानुमान द्वंद्व (Duels)",
    groundReports: "नागरिक ग्राउंड रिपोर्ट",
    leaderboard: "ऑपरेशनल ELO लीडरबोर्ड",
    emergencyBroadcast: "आपातकालीन प्रसारण",
    howThisWorks: "यह कैसे काम करता है",
    realVsSimulated: "वास्तविक बनाम सिमुलेटेड मॉडल",
    liveDataFeed: "लाइव मौसम विज्ञान डेटा",
    offlineMode: "ऑफ़लाइन मोड सक्रिय",
    online: "ऑनलाइन",
    lowBandwidth: "कम बैंडविड्थ (2G)",
    offline: "ऑफ़लाइन",
    submitCall: "पूर्वानुमान दर्ज करें",
    predictionAssist: "स्पष्टीकरणात्मक भविष्यवाणी सहायक",
    accuracyScore: "सटीकता स्कोर",
    meanTrackError: "औसत ट्रैक त्रुटि",
    eloRating: "ELO रेटिंग",
    evacuateZone: "निकासी आदेश जारी करें",
    livesSaved: "अनुमानित बचाए गए जीवन",
    totalCost: "कुल मोबिलाइज़ेशन लागत",
    disasterReady: "आपदा तैयारी सिम्युलेटर",
    upvoteReport: "रिपोर्ट की पुष्टि करें",
    verifiedByImd: "IMD ग्राउंड स्पॉटर द्वारा सत्यापित",
  },
  or: {
    dashboard: "ଡ୍ୟାସବୋର୍ଡ",
    courseCatalog: "ପାଠ୍ୟକ୍ରମ ତାଲିକା",
    skillAssessment: "ଦକ୍ଷତା ମୂଲ୍ୟାଙ୍କନ",
    myProfile: "ମୋର ପ୍ରୋଫାଇଲ୍",
    cycloneWarZone: "ବାତ୍ୟା ୱାର୍ ଜୋନ୍",
    forecastDuels: "ପୂର୍ବାନୁମାନ ଦ୍ୱନ୍ଦ୍ୱ",
    groundReports: "ଗ୍ରାଉଣ୍ଡ ସ୍ପଟର ରିପୋର୍ଟ",
    leaderboard: "କାର୍ଯ୍ୟକ୍ଷମ ELO ରାଙ୍କିଙ୍ଗ",
    emergencyBroadcast: "ଜରୁରୀକାଳୀନ ପ୍ରସାରଣ",
    howThisWorks: "ଏହା କିପରି କାର୍ଯ୍ୟ କରେ",
    realVsSimulated: "ବାସ୍ତବିକ ବନାମ ସିମୁଲେଟେଡ୍",
    liveDataFeed: "ପ୍ରତ୍ୟକ୍ଷ ପାଣିପାଗ ଡାଟା",
    offlineMode: "ଅଫଲାଇନ୍ ମୋଡ୍ ସକ୍ରିୟ",
    online: "ଅନଲାଇନ୍",
    lowBandwidth: "ନିମ୍ନ ବ୍ୟାଣ୍ଡୱିଡଥ୍ (2G)",
    offline: "ଅଫଲାଇନ୍",
    submitCall: "କଲ୍ ଦାଖଲ କରନ୍ତୁ",
    predictionAssist: "ବ୍ୟାଖ୍ୟାତ୍ମକ ପୂର୍ବାନୁମାନ ସହାୟକ",
    accuracyScore: "ସଠିକତା ସ୍କୋର",
    meanTrackError: "ହାରାହାରି ଟ୍ରାକ୍ ତ୍ରୁଟି",
    eloRating: "ELO ରେଟିଂ",
    evacuateZone: "ସ୍ଥାନାନ୍ତରଣ ନିର୍ଦ୍ଦେଶ",
    livesSaved: "ଅନୁମାନିତ ବଞ୍ଚାଯାଇଥିବା ଜୀବନ",
    totalCost: "ସମୁଦାୟ ଖର୍ଚ୍ଚ",
    disasterReady: "ବିପର୍ଯ୍ୟୟ ପ୍ରସ୍ତୁତି ସିମୁଲେଟର",
    upvoteReport: "ନିଶ୍ଚିତ କରନ୍ତୁ",
    verifiedByImd: "IMD ଦ୍ୱାରା ଯାଞ୍ଚ ହୋଇଛି",
  },
  bn: {
    dashboard: "ড্যাশবোর্ড",
    courseCatalog: "কোর্স ক্যাটালগ",
    skillAssessment: "দক্ষতা মূল্যায়ন",
    myProfile: "আমার প্রোফাইল",
    cycloneWarZone: "ঘূর্ণিঝড় ওয়ার জোন",
    forecastDuels: "পূর্বাভাস দ্বন্দ্ব",
    groundReports: "নাগরিক গ্রাউন্ড রিপোর্ট",
    leaderboard: "অপারেশনাল ELO লিডারবোর্ড",
    emergencyBroadcast: "জরুরি বার্তা সম্প্রচার",
    howThisWorks: "এটি কীভাবে কাজ করে",
    realVsSimulated: "বাস্তব বনাম সিমুলেটেড",
    liveDataFeed: "লাইভ আবহাওয়া ফিড",
    offlineMode: "অফলাইন মোড সক্রিয়",
    online: "অনলাইন",
    lowBandwidth: "কম ব্যান্ডউইথ (2G)",
    offline: "অফলাইন",
    submitCall: "পূর্বাভাস জমা দিন",
    predictionAssist: "ব্যাখ্যামূলক পূর্বাভাস সহায়ক",
    accuracyScore: "নির্ভুলতা স্কোর",
    meanTrackError: "গড় ট্র্যাক ত্রুটি",
    eloRating: "ELO রেটিং",
    evacuateZone: "স্থানান্তর নির্দেশ",
    livesSaved: "আনুমানিক রক্ষা পাওয়া জীবন",
    totalCost: "মোট মোতায়েন খরচ",
    disasterReady: "দুর্যোগ প্রস্তুতি সিমুলেটর",
    upvoteReport: "রিপোর্ট নিশ্চিত করুন",
    verifiedByImd: "IMD দ্বারা যাচাইকৃত",
  },
  ta: {
    dashboard: "முகப்புப்பலகை",
    courseCatalog: "பாடநெறி பட்டியல்",
    skillAssessment: "திறன் மதிப்பீடு",
    myProfile: "சுயவிவரம்",
    cycloneWarZone: "புயல் போர் மண்டலம்",
    forecastDuels: "முன்னறிவிப்பு போட்டி",
    groundReports: "கள அறிக்கைகள்",
    leaderboard: "செயல்பாட்டு ELO தரவரிசை",
    emergencyBroadcast: "அவசர ஒளிபரப்பு",
    howThisWorks: "இது எவ்வாறு செயல்படுகிறது",
    realVsSimulated: "உண்மை vs மாதிரி",
    liveDataFeed: "நேரலை வானிலை தரவு",
    offlineMode: "ஆஃப்லைன் பயன்முறை",
    online: "ஆன்லைன்",
    lowBandwidth: "குறைந்த இணைய வேகம் (2G)",
    offline: "ஆஃப்லைன்",
    submitCall: "அறிக்கையை சமர்ப்பிக்கவும்",
    predictionAssist: "வானிலை பகுப்பாய்வு உதவி",
    accuracyScore: "துல்லிய மதிப்பீடு",
    meanTrackError: "சராசரி பாதை பிழை",
    eloRating: "ELO மதிப்பீடு",
    evacuateZone: "வெளியேற்ற உத்தரவு",
    livesSaved: "காப்பாற்றப்பட்ட உயிர்கள்",
    totalCost: "மொத்த செலவு",
    disasterReady: "பேரிடர் தயார்நிலை மாதிரி",
    upvoteReport: "உறுதிப்படுத்தவும்",
    verifiedByImd: "IMD சரிபார்க்கப்பட்டது",
  },
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('aptimet_lang') as SupportedLanguage) || 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('aptimet_lang', lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
