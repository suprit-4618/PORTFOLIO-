import React from 'react';
import DishOrbitCarousel from './ui/dish-orbit-carousel';
import './Skills.css';

// All 33 Tools Organised by Engineering Domain
export const TECH_DOMAINS = [
  {
    id: "aiml",
    label: "AIML",
    dishes: [
      {
        title: "CORE RUNTIME &",
        subtitle: "PYTHON 3.11",
        image: "/stack/python.svg",
        label: "Python",
        accent: "#38bdf8",
      },
      {
        title: "GPU TENSOR &",
        subtitle: "PYTORCH · CUDA",
        image: "/stack/pytorch.svg",
        label: "PyTorch",
        accent: "#f97316",
      },
      {
        title: "DEEP LEARNING &",
        subtitle: "TENSORFLOW",
        image: "/stack/tensorflow.svg",
        label: "TensorFlow",
        accent: "#FF6F00",
      },
      {
        title: "STATISTICAL ML &",
        subtitle: "SCIKIT-LEARN",
        image: "/stack/scikitlearn.svg",
        label: "Scikit-Learn",
        accent: "#F89939",
      },
      {
        title: "COMPUTER VISION &",
        subtitle: "OPENCV",
        image: "/stack/opencv.svg",
        label: "OpenCV",
        accent: "#ED1C24",
      },
      {
        title: "GENERATIVE AI &",
        subtitle: "GEMINI 2.0 · LLMS",
        image: "/stack/gemini.svg",
        label: "Gemini AI",
        accent: "#8E75FF",
      },
      {
        title: "VECTOR RETRIEVAL &",
        subtitle: "CHROMA · ENDEE",
        image: "/stack/vectordb.svg",
        label: "Vector DBs",
        accent: "#06b6d4",
      },
      {
        title: "INFERENCE ENGINE &",
        subtitle: "GROQ · LLAMA 3.3",
        image: "/stack/groq.svg",
        label: "Groq LPU",
        accent: "#F55036",
      },
      {
        title: "SPATIAL TELEMETRY &",
        subtitle: "MEDIAPIPE VISION",
        image: "/stack/mediapipe.svg",
        label: "MediaPipe",
        accent: "#ec4899",
      },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    dishes: [
      {
        title: "MODERN FRONTEND &",
        subtitle: "REACT 19 · SPA",
        image: "/stack/react.svg",
        label: "React 19",
        accent: "#00d8ff",
      },
      {
        title: "SEMANTIC WEB &",
        subtitle: "HTML5 · CSS3",
        image: "/stack/htmlcss.svg",
        label: "HTML & CSS",
        accent: "#E34F26",
      },
      {
        title: "CORE WEB RUNTIME &",
        subtitle: "JAVASCRIPT ES6+",
        image: "/stack/javascript.svg",
        label: "JavaScript",
        accent: "#F7DF1E",
      },
      {
        title: "SPATIAL 3D &",
        subtitle: "THREE.JS · WEBGL",
        image: "/stack/threejs.svg",
        label: "Three.js",
        accent: "#a855f7",
      },
      {
        title: "DESIGN TOKEN SYSTEM &",
        subtitle: "TAILWIND CSS",
        image: "/stack/tailwind.svg",
        label: "TailwindCSS",
        accent: "#06B6D4",
      },
      {
        title: "PHYSICS MOTION &",
        subtitle: "FRAMER MOTION",
        image: "/stack/framermotion.svg",
        label: "Framer Motion",
        accent: "#0055FF",
      },
      {
        title: "LIGHTNING BUILD TOOL &",
        subtitle: "VITE BUNDLER",
        image: "/stack/vite.svg",
        label: "Vite",
        accent: "#BD34FE",
      },
      {
        title: "REAL-TIME 3D &",
        subtitle: "UNREAL ENGINE",
        image: "/stack/unreal.svg",
        label: "Unreal 3D",
        accent: "#31375B",
      },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    dishes: [
      {
        title: "ASYNC APIS &",
        subtitle: "FASTAPI REST",
        image: "/stack/fastapi.svg",
        label: "FastAPI",
        accent: "#10b981",
      },
      {
        title: "EVENT-DRIVEN BACKEND &",
        subtitle: "NODE.JS RUNTIME",
        image: "/stack/nodejs.svg",
        label: "Node.js",
        accent: "#539E43",
      },
      {
        title: "ENTERPRISE SYSTEMS &",
        subtitle: "JAVA RUNTIME",
        image: "/stack/java.svg",
        label: "Java",
        accent: "#EA2D2E",
      },
      {
        title: "LOW-LEVEL SYSTEMS &",
        subtitle: "C / C++ COMPUTING",
        image: "/stack/cpp.svg",
        label: "C / C++",
        accent: "#00599C",
      },
      {
        title: "API SPECIFICATION &",
        subtitle: "POSTMAN CONTRACTS",
        image: "/stack/postman.svg",
        label: "Postman",
        accent: "#FF6C37",
      },
      {
        title: "WORKFLOW AUTOMATION &",
        subtitle: "N8N PIPELINES",
        image: "/stack/n8n.svg",
        label: "n8n",
        accent: "#EA4B71",
      },
    ],
  },
  {
    id: "data",
    label: "Data & DBs",
    dishes: [
      {
        title: "DATA ORCHESTRATION &",
        subtitle: "APACHE AIRFLOW",
        image: "/stack/airflow.svg",
        label: "Airflow",
        accent: "#06b6d4",
      },
      {
        title: "ACID DATA WAREHOUSE &",
        subtitle: "POSTGRESQL",
        image: "/stack/postgres.svg",
        label: "PostgreSQL",
        accent: "#6366f1",
      },
      {
        title: "RELATIONAL DATABASE &",
        subtitle: "MYSQL 8.0",
        image: "/stack/mysql.svg",
        label: "MySQL",
        accent: "#00758F",
      },
      {
        title: "DOCUMENT DATABASE &",
        subtitle: "MONGODB NOSQL",
        image: "/stack/mongodb.svg",
        label: "MongoDB",
        accent: "#47A248",
      },
      {
        title: "ANALYTICS ENGINEERING &",
        subtitle: "DBT CORE",
        image: "/stack/dbt.svg",
        label: "dbt Core",
        accent: "#FF694B",
      },
      {
        title: "DISTRIBUTED BIG DATA &",
        subtitle: "APACHE PYSPARK",
        image: "/stack/pyspark.svg",
        label: "PySpark",
        accent: "#E25A1C",
      },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    dishes: [
      {
        title: "CONTAINER FLEET &",
        subtitle: "DOCKER · COMPOSE",
        image: "/stack/docker.svg",
        label: "Docker",
        accent: "#0284c7",
      },
      {
        title: "CLOUD SERVICES &",
        subtitle: "FIREBASE REALTIME",
        image: "/stack/firebase.svg",
        label: "Firebase",
        accent: "#FFCA28",
      },
      {
        title: "VERSION CONTROL &",
        subtitle: "GIT · GITHUB",
        image: "/stack/git.svg",
        label: "Git",
        accent: "#F05032",
      },
      {
        title: "POSIX ARCHITECTURE &",
        subtitle: "LINUX · BASH",
        image: "/stack/linux.svg",
        label: "Linux",
        accent: "#FFA500",
      },
    ],
  },
];

export const Skills = () => {
  return (
    <section id="skills" className="startup-skills-section" aria-label="Technical Stack & Engineering Capabilities">
      {/* ─── SECTION HEADER ─── */}
      <div className="startup-skills-container">
        <div className="startup-section-header">
          <h2 className="startup-section-title">
            Tech <span className="title-highlight">Stack</span>
          </h2>
        </div>
      </div>

      {/* ─── DISH ORBIT CAROUSEL (Organized by Domain) ─── */}
      <div className="skills-carousel-wrapper">
        <DishOrbitCarousel
          domains={TECH_DOMAINS}
          height="88vh"
          loop={false}
        />
      </div>
    </section>
  );
};

export default Skills;
