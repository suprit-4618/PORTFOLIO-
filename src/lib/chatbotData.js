export const CHATBOT_CONFIG = {
  name: "Jaykav",
  greeting: "Hi! I'm Jaykav, Suprit's AI assistant. Ask me anything about his work, skills, or projects!",
  quickQuestions: [
    "What are your core skills?",
    "Tell me about your AI projects.",
    "Which technologies do you specialize in?",
    "How can I contact you?"
  ]
};

export const KNOWLEDGE_BASE = [
  {
    keywords: ["who", "suprit", "you", "about"],
    response: "Suprit L is an AI & Data Science Engineer with a deep fascination for space exploration and defense systems. He focuses on building intelligent solutions and contributing to open-source projects."
  },
  {
    keywords: ["skills", "tech", "technologies", "stack", "languages"],
    response: "Suprit specializes in AI/ML (TensorFlow, PyTorch), Python, Java, and Big Data (PySpark). He's also proficient in Backend (FastAPI, SQL/NoSQL), DevOps (Docker, CI/CD), and 3D Graphics (Three.js, WebGL)."
  },
  {
    keywords: ["projects", "work", "portfolio"],
    response: "Suprit has built some amazing projects like 'Janisa' (a holographic AI interface), 'Friday' (a voice-activated desktop assistant), and 'AgriVerseAI' (a smart agriculture tool). Which one should I tell you more about?"
  },
  {
    keywords: ["janisa"],
    response: "Janisa is a Holographic AI Interface that uses Three.js and MediaPipe for hand-gesture interaction with 3D models. It's designed to make complex structures easier to understand through immersive visualization."
  },
  {
    keywords: ["friday"],
    response: "Friday is a voice-activated AI desktop assistant powered by Groq LLaMA 3.3. It features wake-word detection, a futuristic HUD, and can execute system actions like sending messages via automation."
  },
  {
    keywords: ["agriverse", "agriculture"],
    response: "AgriVerseAI is a bilingual (Kannada & English) assistant for farmers. It providing real-time crop disease detection and weather insights using Gemini 2.0 and MobileNetV2."
  },
  {
    keywords: ["crypto", "airflow"],
    response: "Crypto Airflow is an automated ETL pipeline that fetches live crypto prices every 5 minutes and transforms them using dbt for analytics-ready PostgreSQL tables."
  },
  {
    keywords: ["contact", "email", "linkedin", "hire", "reach"],
    response: "You can reach Suprit via email at his contact section below, or connect with him on LinkedIn and GitHub. He's always open to collaborating on innovative AI or Data Science project!"
  },
  {
    keywords: ["space", "defense", "rockets"],
    response: "Suprit is highly interested in Space Exploration and Defense Technology R&D. He loves building solutions that push the boundaries of what's possible in these fields."
  },
  {
    keywords: ["games", "gaming", "hobby"],
    response: "When he's not coding, Suprit is an avid gamer (often nocturnal!) and loves exploring virtual worlds or diving into sci-fi movies and series."
  }
];

export const getResponse = (input) => {
  const lowercaseInput = input.toLowerCase();
  
  // Find the best match based on keywords
  let bestMatch = null;
  let maxOverlap = 0;

  KNOWLEDGE_BASE.forEach(entry => {
    let overlap = 0;
    entry.keywords.forEach(keyword => {
      if (lowercaseInput.includes(keyword)) {
        overlap++;
      }
    });

    if (overlap > maxOverlap) {
      maxOverlap = overlap;
      bestMatch = entry;
    }
  });

  if (maxOverlap > 0) {
    return bestMatch.response;
  }

  return "That's an interesting question! I don't have a specific answer for that, but you can definitely ask Suprit directly through the contact section below.";
};
