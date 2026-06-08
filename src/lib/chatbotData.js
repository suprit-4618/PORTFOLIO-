export const CHATBOT_CONFIG = {
  name: "Jaykav",
  greeting: "Hi! I'm Jaykav, Suprit's AI assistant. Ask me anything about his work, skills, or projects!",
  quickQuestions: [
    "What are your core skills?",
    "Tell me about your AI projects.",
    "Where is your internship?",
    "Tell me about your research."
  ]
};

export const KNOWLEDGE_BASE = [
  {
    keywords: ["who", "suprit", "introduction", "background", "yourself"],
    response: "Suprit L is an AI & Data Science Engineer with a deep fascination for space exploration and defense systems. He focuses on building intelligent solutions and contributing to open-source projects."
  },
  {
    keywords: ["skills", "tech", "technologies", "stack", "languages"],
    response: "Suprit specializes in AI/ML (TensorFlow, PyTorch), Python, Java, and Big Data (PySpark). He's also proficient in Backend (Node.js, FastAPI, Firebase, Render, n8n), DevOps (Docker, CI/CD), testing (Postman), and 3D Graphics (Three.js, WebGL)."
  },
  {
    keywords: ["node", "nodejs", "node.js"],
    response: "Suprit uses Node.js for backend development, building scalable network applications and RESTful APIs with JavaScript."
  },
  {
    keywords: ["n8n", "automation", "workflow"],
    response: "Suprit is skilled in n8n for node-based workflow automation, connecting APIs, databases, and AI services."
  },
  {
    keywords: ["postman", "api testing"],
    response: "Suprit uses Postman for testing, debugging, and documenting RESTful APIs to ensure reliability."
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
    response: "AgriVerseAI is a bilingual (Kannada & English) assistant for farmers. It provides real-time crop disease detection and weather insights using Gemini 2.0 and MobileNetV2. It's now live and helping farmers optimize their process!"
  },
  {
    keywords: ["crypto", "airflow"],
    response: "Crypto Airflow is an automated ETL pipeline that fetches live crypto prices every 5 minutes and transforms them using dbt for analytics-ready PostgreSQL tables."
  },
  {
    keywords: ["experience", "intern", "internship", "tap academy", "work"],
    response: "Suprit is currently a Full Stack Web Development Intern at TAP Academy in Bengaluru, gaining hands-on experience with Java, React, and SQL. He's also a Student Innovator at K-tech (NAIN) in Belagavi, developing a smart reverse vending system involving embedded hardware!"
  },
  {
    keywords: ["publication", "paper", "journal", "research"],
    response: "Suprit has published a research paper titled 'AGRIVERSEAI – SMART AGRICULTURAL WEB APPLICATION FOR KARNATAKA PEOPLE' in the IRJMETS Journal. It focuses on a bilingual voice assistant for farmers using NLP."
  },
  {
    keywords: ["education", "degree", "college", "university", "study", "btech"],
    response: "Suprit is pursuing his B.Tech in AI & Data Science. He is based in Karnataka, India, and is highly active in institutional innovation teams."
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
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      if (regex.test(lowercaseInput)) {
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

  return "I don't have a specific answer for that, but you can definitely ask Suprit directly through the contact section below.";
};
