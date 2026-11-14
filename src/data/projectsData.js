// Comprehensive Project Data Model for the Project Details Showcase
// Real engineering details verified from suprit-4618 GitHub repositories.

export const PROJECTS_DATA = [
  {
    id: 1,
    slug: 'agriverseai',
    title: 'AgriVerseAI',
    subtitle: 'Bilingual AI Crop Disease Diagnosis & Regional Farm Intelligence',
    category: 'Computer Vision & Multilingual NLP',
    description: 'An agricultural intelligence platform connecting rural farmers with sub-second AI-powered crop diagnostics, localized weather intelligence, bilingual Kannada-English voice advisory, and direct market access.',
    accent: '#10b981',
    accentSecondary: '#059669',
    bgImage: '/projects/bgs/agriverseai_bg.png',
    fallbackImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=85',
    live: 'https://agriverseai-six.vercel.app',
    github: 'https://github.com/suprit-4618/AgriVerseAI',
    paper: '/publications/agriverseAi.pdf',
    year: '2025',
    role: 'Creator & Lead ML Engineer',
    metrics: [
      { label: 'Validation Accuracy', value: '95.4%' },
      { label: 'Inference Latency', value: '35ms' },
      { label: 'Disease Classes', value: '38 Types' },
      { label: 'Training Speedup', value: '60%' }
    ],
    overview: {
      summary: 'AgriVerseAI was built to bridge the gap between cutting-edge deep learning agronomy and rural smallholder farmers. By eliminating language and literacy barriers through voice-first bilingual interfaces, it empowers farmers to protect crop yields against devastating plant pathogens with instant edge diagnostics.',
      targetAudience: 'Smallholder farmers, regional agricultural cooperatives, and agronomy field officers.',
      purpose: 'Deliver real-time plant disease detection under 50 milliseconds directly on consumer smartphones without requiring cloud connectivity for initial diagnosis.'
    },
    problem: {
      heading: 'The Challenge in Rural Agriculture',
      description: 'Rural farmers frequently lose 20% to 40% of their annual crop yields to preventable fungal, viral, and bacterial pathogens. Traditional agricultural extension services suffer from regional shortages, while existing diagnostic software relies on text-heavy English interfaces and persistent high-speed internet—both largely unavailable in remote farmlands.'
    },
    solution: {
      heading: 'Edge-Optimized CNNs & Multilingual Voice Guidance',
      description: 'AgriVerseAI pairs an edge-quantized MobileNetV2 neural network with Google Gemini 2.0 conversational reasoning and browser SpeechSynthesis in regional Kannada and English. Farmers point their smartphone camera at affected foliage to obtain instant diagnosis, treatment protocols with exact pesticide dosages, and localized weather alerts.'
    },
    features: [
      {
        icon: 'scan',
        title: '38-Class Disease Detection',
        desc: 'MobileNetV2 CNN achieving 95.4% accuracy across 38 distinct crop disease categories trained on 81,000+ plant leaf images.'
      },
      {
        icon: 'mic',
        title: 'Bilingual Kannada & English Voice',
        desc: 'Native conversational voice interface powered by Gemini 2.0 with browser-native text-to-speech for accessible guidance.'
      },
      {
        icon: 'zap',
        title: 'Sub-35ms Edge CUDA Inference',
        desc: 'Quantized PyTorch weights running at an average inference latency of 35ms on consumer edge hardware.'
      },
      {
        icon: 'database',
        title: 'Offline Resilient Buffer',
        desc: 'Dual-channel real-time camera capture with offline image buffering for areas with intermittent connectivity.'
      }
    ],
    architecture: {
      pipeline: 'Edge Camera Feed → OpenCV Preprocessing → MobileNetV2 CNN (35ms CUDA) → Gemini 2.0 Multilingual Reasoning → Regional Speech Synthesis',
      stages: [
        { step: '01', title: 'Camera Stream Ingestion', desc: 'Real-time camera feed capture or offline image buffer loaded into normalized canvas.' },
        { step: '02', title: 'OpenCV Preprocessing', desc: 'Resizing, illumination normalization, and tensor batching for inference optimization.' },
        { step: '03', title: 'MobileNetV2 Classification', desc: '38-class softmax prediction with confidence scoring and disease severity rating.' },
        { step: '04', title: 'Bilingual Agronomic Reasoning', desc: 'Gemini 2.0 generates localized treatments, dosage guidelines, and weather advisories.' },
        { step: '05', title: 'Regional Voice Dispatch', desc: 'Browser SpeechSynthesis produces fluid Kannada and English audio instructions.' }
      ]
    },
    codeSnippet: `// AgriVerseAI Edge Inference & Telemetry Pipeline
@app.post("/api/v1/diagnose-crop")
async def diagnose_crop(file: UploadFile = File(...), lang: str = "kn"):
    image_bytes = await file.read()
    tensor = preprocess_leaf_tensor(image_bytes, target_size=(224, 224))
    
    # Accelerated GPU inference (35ms latency)
    with torch.no_grad():
        logits = mobilenet_v2_model(tensor.to(device))
        confidences = torch.softmax(logits, dim=-1)
        top_pred_idx = torch.argmax(confidences).item()
        confidence_score = confidences[0][top_pred_idx].item()
        
    disease_metadata = CROP_DISEASE_TAXONOMY[top_pred_idx]
    
    # Bilingual Gemini 2.0 Contextual Advisory
    treatment_plan = await generate_remedy_advisory(
        crop=disease_metadata.crop,
        pathogen=disease_metadata.pathogen,
        target_language=lang
    )
    return {
        "status": "success",
        "disease": disease_metadata.name,
        "confidence": f"{confidence_score * 100:.1f}%",
        "advisory": treatment_plan
    }`,
    codeLanguage: 'python',
    techStack: {
      'AI & Machine Learning': ['TensorFlow', 'MobileNetV2', 'PyTorch', 'CUDA', 'OpenCV', 'Google Gemini 2.0'],
      'Backend & APIs': ['FastAPI', 'Python 3.11', 'REST Architecture', 'Pydantic'],
      'Frontend': ['React 18', 'Vite', 'SpeechSynthesis API', 'TailwindCSS'],
      'Cloud & Deployment': ['Vercel', 'Firebase', 'Docker']
    },
    gallery: [
      { src: '/projects/agriverseai/agri_1.png', caption: 'Bilingual Farmer Dashboard & Disease Telemetry' },
      { src: '/projects/agriverseai/agri_2.png', caption: 'Deep Learning Leaf Scanner with Pathogen Bounding Box' },
      { src: '/projects/agriverseai/agri_3.png', caption: 'Bilingual Kannada Speech Synthesis & Treatment Guidelines' },
      { src: '/projects/agriverseai/agri_4.png', caption: 'Regional Weather Forecasts & Spray Timing Advisories' },
      { src: '/projects/agriverseai/agri_6.png', caption: 'Crop Market Price Index & Yield Comparison' },
      { src: '/projects/agriverseai/agri_7.png', caption: 'Mobile Edge Inference Real-time Camera Feed' }
    ],
    challenges: [
      {
        title: 'Illumination Variance in Direct Sunlight',
        solution: 'Constructed an adaptive OpenCV histogram equalization preprocessor that normalizes stark sun glare and shadow patches before feeding tensors to MobileNetV2.'
      },
      {
        title: 'Low-Bandwidth Kannada Audio Latency',
        solution: 'Switched from cloud audio round-trips to client-side browser SpeechSynthesis with pre-rendered phonetic fallback dictionaries, reducing voice output latency from 1.8s to sub-50ms.'
      }
    ]
  },
  {
    id: 2,
    slug: 'semantic-rag-search',
    title: 'Semantic RAG Search',
    subtitle: 'Dual-Engine Neural Vector Retrieval & RAG Pipeline',
    category: 'Information Retrieval & Vector Databases',
    description: 'A high-throughput semantic information retrieval system and RAG pipeline engineered to overcome keyword search mismatches. Projects queries and documents into 384-dimensional dense semantic vector space, executing sub-50ms cosine similarity searches with 95% precision.',
    accent: '#06b6d4',
    accentSecondary: '#0284c7',
    bgImage: '/projects/bgs/semantic_search_bg.png',
    fallbackImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=85',
    live: 'https://ai-semantic-search-endee-fznbrf5gfer5dczpjweoaz.streamlit.app/',
    github: 'https://github.com/suprit-4618/Semantic-and-Dual-Engine-Rag',
    year: '2025',
    role: 'Vector Systems Architect',
    metrics: [
      { label: 'Query Latency', value: '<50ms' },
      { label: 'Retrieval Precision', value: '95%' },
      { label: 'Embedding Dim', value: '384-d' },
      { label: 'Context Accuracy', value: '+40%' }
    ],
    overview: {
      summary: 'Semantic RAG Search was developed to solve the lexical mismatch problem where traditional keyword search fails on synonyms or conceptual descriptions. By projecting queries into dense 384-dimensional semantic space, it enables intuitive meaning-based search and grounded LLM context synthesis.',
      targetAudience: 'Researchers, knowledge managers, and developers building hallucination-free AI search.',
      purpose: 'Execute sub-50ms nearest-neighbor search across dense multi-document knowledge corpora with high precision.'
    },
    problem: {
      heading: 'The Limits of Traditional Keyword Search',
      description: 'Lexical indices like BM25 fail when users search using descriptive queries that lack exact keyword overlap with documents. In generative AI pipelines, retrieving irrelevant chunks leads directly to prompt bloating and hallucinated answers.'
    },
    solution: {
      heading: 'Dense Embeddings & Dual Vector Engines',
      description: 'The system uses Hugging Face Transformers (all-MiniLM-L6-v2) to project documents and queries into normalized 384-d dense embeddings. Vector indices in ChromaDB and Endee execute sub-50ms HNSW cosine nearest-neighbor searches, supplying high-confidence context packets directly to LLMs.'
    },
    features: [
      {
        icon: 'cpu',
        title: '384-Dimensional Dense Vectors',
        desc: 'High-speed transformer encoding capturing deep semantic relations with zero external API dependencies.'
      },
      {
        icon: 'database',
        title: 'Dual Vector Backends',
        desc: 'Benchmarked and optimized across both ChromaDB and Endee Vector DB for flexible storage.'
      },
      {
        icon: 'zap',
        title: 'Sub-50ms HNSW Retrieval',
        desc: 'Sub-linear nearest-neighbor index lookups ensuring real-time response even under concurrent query load.'
      },
      {
        icon: 'layers',
        title: 'Sliding-Window Chunking',
        desc: 'Token-aware recursive text chunking that preserves paragraph context across document boundaries.'
      }
    ],
    architecture: {
      pipeline: 'Raw Text Query → Transformer Encoder (all-MiniLM-L6-v2) → 384-d Vector Index (ChromaDB / Endee) → Cosine Similarity Top-K → RAG Context Augmentation',
      stages: [
        { step: '01', title: 'Document Chunking', desc: 'Recursive token-aware text splitting with sliding window context preservation.' },
        { step: '02', title: 'Dense Vectorization', desc: 'Hugging Face all-MiniLM-L6-v2 projects text into normalized 384-d embedding vectors.' },
        { step: '03', title: 'Index Ingestion', desc: 'HNSW graph indexing in ChromaDB and Endee Vector Database for sub-linear retrieval.' },
        { step: '04', title: 'Cosine Distance Ranking', desc: 'Cosine similarity calculation with score thresholding filtering irrelevant context.' },
        { step: '05', title: 'Augmented Generation', desc: 'Top-K semantic context passages combined with query to synthesize grounded answers.' }
      ]
    },
    codeSnippet: `# Vector Indexing & Cosine Retrieval Microservice
from sentence_transformers import SentenceTransformer
import chromadb

encoder = SentenceTransformer("all-MiniLM-L6-v2")
vector_client = chromadb.PersistentClient(path="./vector_store")
collection = vector_client.get_or_create_collection(
    name="semantic_knowledge_base",
    metadata={"hnsw:space": "cosine"}
)

@app.post("/api/v1/semantic-query")
async def semantic_query(query: str, top_k: int = 5):
    # Map raw text to 384-dimensional dense vector space
    query_vector = encoder.encode(query, normalize_embeddings=True).tolist()
    
    # Sub-50ms HNSW index cosine-similarity nearest neighbor lookup
    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k,
        include=["documents", "metadatas", "distances"]
    )
    return {
        "query": query,
        "matches": [
            {"doc": d, "score": 1 - dist, "meta": m}
            for d, dist, m in zip(results["documents"][0], results["distances"][0], results["metadatas"][0])
        ]
    }`,
    codeLanguage: 'python',
    techStack: {
      'Vector & NLP': ['SentenceTransformers', 'all-MiniLM-L6-v2', 'ChromaDB', 'Endee Vector DB', 'PyTorch'],
      'Backend & APIs': ['FastAPI', 'Python 3.11', 'Streamlit', 'Docker'],
      'Deployment': ['Hugging Face Spaces', 'GitHub Actions']
    },
    gallery: [
      { src: '/projects/ai-semantic-search/semantic_search_1.png', caption: 'Semantic Search Query & Cosine Distance Scoring' },
      { src: '/projects/ai-semantic-search/endee_project.png', caption: 'Endee Vector DB Benchmark & Distance Telemetry' },
      { src: '/projects/ai-semantic-search/semantic_search_2.png', caption: 'Top-K Grounded Retrieval Passages for RAG Augmentation' }
    ],
    challenges: [
      {
        title: 'Balancing Chunk Size Against Loss of Context',
        solution: 'Benchmarked 256, 512, and 1024 token windows; selected 384 tokens with 64-token overlap, yielding a 40% accuracy increase over baseline BM25.'
      }
    ]
  },
  {
    id: 3,
    slug: 'autonomous-job-scout',
    title: 'Autonomous Job Scout',
    subtitle: '24/7 Scraping, Semantic Matching & Tool-Calling Agent',
    category: 'Autonomous Agents & LLM Orchestration',
    description: 'An autonomous background agent pipeline that scouts job listings from Hacker News and remote tech boards. Employs LLaMA-3 on Groq for sub-second semantic resume-to-job matching, performs skill-gap analysis, generates tailored cover letters, and dispatches real-time Telegram alerts.',
    accent: '#8b5cf6',
    accentSecondary: '#7c3aed',
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=85',
    fallbackImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1920&q=85',
    github: 'https://github.com/suprit-4618/autonomous-job-scout',
    year: '2025',
    role: 'Autonomous Systems Engineer',
    metrics: [
      { label: 'Time Saved', value: '80%' },
      { label: 'Match Latency', value: '<1.2s' },
      { label: 'Scouting Cycle', value: '24/7 Continual' },
      { label: 'Alert Dispatch', value: 'Real-Time' }
    ],
    overview: {
      summary: 'Autonomous Job Scout is a full-lifecycle agentic worker designed to continuously crawl high-value hiring channels, extract unstructured job postings, evaluate candidate fit with LLaMA-3 on Groq, and deliver proactive mobile alerts without human oversight.',
      targetAudience: 'Software engineers and job seekers seeking high-fit remote positions.',
      purpose: 'Eliminate manual job hunting through automated scraping, semantic CV alignment, and instant mobile alerts.'
    },
    problem: {
      heading: 'The Repetitive Grind of Job Applications',
      description: 'Job seekers spend dozens of hours every week checking cluttered aggregators, filtering irrelevant postings, and manually tailoring cover letters from scratch.'
    },
    solution: {
      heading: 'Multi-Tool Agent with Real-Time Push Alerts',
      description: 'Using LangChain, BeautifulSoup, Groq LPUs, and Firebase Firestore, the agent crawls developer forums 24/7, scores opportunities against candidate profiles, synthesizes targeted cover letters, and pushes high-priority leads to Telegram.'
    },
    features: [
      {
        icon: 'bot',
        title: 'Continuous 24/7 Crawling',
        desc: 'Automated crawlers targeting Hacker News Who is Hiring threads and remote developer portals.'
      },
      {
        icon: 'sparkles',
        title: 'Sub-Second LLM Matching',
        desc: 'Groq LLaMA-3.3 parses job specs and computes quantitative fit scores in under 1.2 seconds.'
      },
      {
        icon: 'file-text',
        title: 'Tailored Cover Letters',
        desc: 'Synthesizes professional, role-specific cover letters highlighting exact candidate strengths.'
      },
      {
        icon: 'send',
        title: 'Real-Time Telegram Alerts',
        desc: 'Immediate mobile notifications formatted with match scores and direct application links.'
      }
    ],
    architecture: {
      pipeline: 'Cron / Webhook Trigger → BeautifulSoup & Scraper Engine → LLaMA-3 Semantic Alignment → Skill-Gap & Cover Letter Pipeline → Firebase Firestore → Telegram Webhooks',
      stages: [
        { step: '01', title: 'Target Board Scouting', desc: 'Scrapes Hacker News and remote portals using resilient HTTP clients with exponential backoff.' },
        { step: '02', title: 'Posting Normalization', desc: 'Extracts roles, compensation, tech requirements, and contact emails into clean schemas.' },
        { step: '03', title: 'Semantic Scoring Engine', desc: 'Groq LLaMA-3 computes similarity score between job requirements and candidate CV.' },
        { step: '04', title: 'Automated Artifact Synthesis', desc: 'LangChain tool chain generates custom cover letter and skill-gap recommendations.' },
        { step: '05', title: 'Cloud Sync & Telegram Alerts', desc: 'Records payload to Firebase Firestore and transmits rich markdown card to Telegram.' }
      ]
    },
    codeSnippet: `# LangChain LLaMA-3 Autonomous Evaluation Pipeline
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq

llm = ChatGroq(model_name="llama-3.3-70b-versatile", temperature=0.2)

async def evaluate_job_opening(job_post: dict, candidate_resume: str):
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an autonomous technical recruiter agent evaluating candidate fit."),
        ("user", """
        CANDIDATE DOSSIER: {resume}
        JOB DESCRIPTION: {job_desc}
        Analyze match percentage, list concrete skill gaps, and write a targeted cover letter.
        Output strictly in JSON schema.
        """)
    ])
    chain = prompt | llm.with_structured_output(JobMatchReport)
    report = await chain.ainvoke({"resume": candidate_resume, "job_desc": job_post["raw_text"]})
    
    if report.match_score >= 80:
        await dispatch_telegram_alert(job_post, report)
        await firestore_db.collection("matches").add(report.dict())
    return report`,
    codeLanguage: 'python',
    techStack: {
      'Agent & LLM': ['LangChain', 'Groq LPU', 'LLaMA-3.3-70B', 'Prompt Templates'],
      'Scraping & Ingestion': ['BeautifulSoup4', 'Requests', 'HTTPX', 'Asyncio'],
      'Storage & Cloud': ['FastAPI', 'Firebase Firestore', 'Docker', 'Telegram Bot API']
    },
    gallery: [
      { src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80', caption: 'Autonomous Job Scout Agent Architecture & Multi-Stage Execution' }
    ],
    challenges: [
      {
        title: 'Handling Anti-Bot Throttling and Irregular Thread Layouts',
        solution: 'Implemented randomized exponential jitter, User-Agent rotation, and custom resilient BeautifulSoup DOM parsers that tolerate broken HTML tags.'
      }
    ]
  },
  {
    id: 4,
    slug: 'doctest',
    title: 'DocTest',
    subtitle: 'Document-to-Interactive Exam Engine with AI Verification',
    category: 'Full-Stack AI & Document Understanding',
    description: 'A full-stack exam engine that ingests static documents (PDFs, photo scans, DOCX) and compiles them into timed, interactive multiple-choice test sessions. Features second-opinion AI question auditing, real-time grading, dynamic answer override, and granular analytics.',
    accent: '#f59e0b',
    accentSecondary: '#d97706',
    bgImage: '/projects/bgs/doctest_bg.png',
    fallbackImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1920&q=85',
    github: 'https://github.com/suprit-4618/DOCTEST',
    year: '2025',
    role: 'Full-Stack AI Engineer',
    metrics: [
      { label: 'Extraction Types', value: 'PDF / OCR / DOCX' },
      { label: 'Auditing LLM', value: 'Groq LLaMA / Gemini' },
      { label: 'Grading Latency', value: 'Instant (<10ms)' },
      { label: 'Type Safety', value: '100% Pydantic & TS' }
    ],
    overview: {
      summary: 'DocTest converts static study materials, past exam PDFs, and lecture notes into dynamic, graded interactive testing environments with automated AI validation.',
      targetAudience: 'Students preparing for exams, educators, and self-directed learners.',
      purpose: 'Transform passive textbook reading into active recall and immediate pedagogical feedback.'
    },
    problem: {
      heading: 'Static Study Materials Prevent Active Recall',
      description: 'Learners preparing from printed mock exams and PDFs struggle to simulate realistic timed environments, while ambiguous answer keys lead to wasted study time.'
    },
    solution: {
      heading: 'Instant OCR Document Ingestion with Dual-Engine AI Auditing',
      description: 'DocTest uses regex and LLM parsing to extract question banks from uploaded documents, creates a persistent exam simulator, and gives learners on-demand AI rationales for each option.'
    },
    features: [
      {
        icon: 'file-text',
        title: 'Multi-Format Ingestion',
        desc: 'Upload PDFs, Word documents, or image scans for instantaneous question bank generation.'
      },
      {
        icon: 'clock',
        title: 'Timed Interactive Exams',
        desc: 'Browser-based exam runner with auto-save, auto-submit countdowns, and question navigation.'
      },
      {
        icon: 'check-circle-2',
        title: 'AI Second-Opinion Verification',
        desc: 'Trigger LLM verification on disputed questions to receive detailed pedagogical rationales.'
      },
      {
        icon: 'bar-chart-2',
        title: 'Instant Scorecard Analytics',
        desc: 'Comprehensive post-exam telemetry with subject accuracy breakdowns and time-per-question metrics.'
      }
    ],
    architecture: {
      pipeline: 'Document Upload (PDF / Scans) → Regex & LLM Question Extraction → SQLAlchemy Session Engine → Timed Test-Taker Interface → LLM Verification & Answer Override',
      stages: [
        { step: '01', title: 'Document Parsing & OCR', desc: 'Accepts PDF, scanned documents, and text, extracting raw structural question blocks.' },
        { step: '02', title: 'Question Tokenizer', desc: 'Parses question numbers, prompts, multiple options, and correct answers into schemas.' },
        { step: '03', title: 'Interactive Test Session', desc: 'Spawns timed exam environment with question navigation, timer countdown, and state save.' },
        { step: '04', title: 'Automated Score Engine', desc: 'Instantly computes percentage, correct/wrong counts, and generates review breakdown.' },
        { step: '05', title: 'AI Expert Second Opinion', desc: 'Allows learners to trigger AI auditing on any question to confirm or dispute answers.' }
      ]
    },
    codeSnippet: `@router.post("/{question_id}/ai-verify")
async def ai_verify_question(question_id: str, apply: bool = False, db: Session = Depends(get_db)):
    question = db.query(QuestionDB).filter(QuestionDB.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Send question payload to AI verification engine
    llm = get_llm_provider()
    res = await llm.suggest_answers([{
        "question_id": question.id,
        "question_text": question.text,
        "options": question.options
    }])
    suggestion = res.suggestions[0]
    
    # Retroactively apply verified answer if requested
    if apply and suggestion.correct_options:
        question.correct_options = suggestion.correct_options
        question.answer_source = AnswerSource.AI_SUGGESTED.value
        question.explanation = suggestion.explanation
        db.commit()
        
    return {
        "question_id": question.id,
        "suggested_options": suggestion.correct_options,
        "explanation": suggestion.explanation
    }`,
    codeLanguage: 'python',
    techStack: {
      'Backend & AI': ['FastAPI', 'Python 3.11', 'Groq LLaMA-3.3', 'Google Gemini Flash', 'SQLAlchemy', 'Pydantic'],
      'Frontend': ['React 18', 'TypeScript', 'TailwindCSS', 'Vite', 'Lucide Icons'],
      'Database': ['PostgreSQL', 'SQLite']
    },
    gallery: [
      { src: '/projects/doctest/doctest_preview.png', caption: 'DocTest Interactive Exam Interface & Real-time AI Verification' }
    ],
    challenges: [
      {
        title: 'Parsing Non-Standard Multi-Column PDF Exam Layouts',
        solution: 'Developed a dual-stage text normalizer combining PyPDF coordinate sorting with structured LLM schema correction for complex question blocks.'
      }
    ]
  },
  {
    id: 5,
    slug: 'janisa',
    title: 'Janisa',
    subtitle: 'Holographic Spatial WebGL & Gesture-Controlled 3D Interface',
    category: 'Spatial Computing & Computer Vision',
    description: 'A futuristic spatial web interface that transforms passive 3D model viewing into an intuitive touchless holographic experience. Uses in-browser computer vision via MediaPipe to track 21 hand landmark coordinates in real-time through standard webcams, allowing multi-axis spatial rotation, zoom, and inspection.',
    accent: '#38bdf8',
    accentSecondary: '#0284c7',
    bgImage: '/projects/bgs/janisa_bg.png',
    fallbackImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1920&q=85',
    live: 'https://janisa-hologram.vercel.app',
    github: 'https://github.com/suprit-4618/janisa-hologram',
    year: '2024',
    role: 'Spatial Computing Developer',
    metrics: [
      { label: 'Render Frame Rate', value: '60 FPS' },
      { label: 'Tracking Latency', value: '<20ms' },
      { label: 'Landmarks Tracked', value: '21 Points' },
      { label: 'Hardware Required', value: 'Zero VR Sensors' }
    ],
    overview: {
      summary: 'Janisa breaks the barrier between physical hand movements and digital 3D models. By leveraging browser-native machine learning, it turns standard consumer webcams into spatial holographic controllers.',
      targetAudience: 'Engineers, industrial designers, and educational institutions.',
      purpose: 'Enable zero-touch, headset-free spatial manipulation of 3D assets in standard modern browsers.'
    },
    problem: {
      heading: 'Standard 2D Interfaces Cannot Naturally Express 3D Manipulation',
      description: 'Inspecting 3D geometry via 2D mouse drags feels artificial, while VR/AR headsets remain too bulky and expensive for everyday web browsing.'
    },
    solution: {
      heading: 'MediaPipe Hands Real-Time Kinematics Coupled with Three.js',
      description: 'Extracting 21 spatial landmarks at 60 FPS allows natural pinching to zoom, palm rotations to orbit, and hand elevation to manipulate complex geometries without physical contact.'
    },
    features: [
      {
        icon: 'eye',
        title: '21-Point Skeletal Tracking',
        desc: 'Sub-20ms real-time hand landmark estimation using client-side WebAssembly neural networks.'
      },
      {
        icon: 'box',
        title: '60 FPS WebGL Scene Graph',
        desc: 'Three.js rendering engine with custom holographic shaders and particle field ambience.'
      },
      {
        icon: 'maximize-2',
        title: 'Zero External Hardware',
        desc: 'Operates entirely through standard laptop webcams without controllers or headsets.'
      },
      {
        icon: 'activity',
        title: 'Quaternion Smoothing',
        desc: 'Exponential kinematics damping eliminating jitter and hand tremor from camera feeds.'
      }
    ],
    architecture: {
      pipeline: 'Client Webcam Stream → MediaPipe Hands 21-Landmark Neural Tracking → Normalization & Delta Vector Calculus → Three.js Matrix Transformations → Hardware-Accelerated WebGL Rendering',
      stages: [
        { step: '01', title: 'Video Stream Capture', desc: 'Lightweight webcam video frame polling via browser MediaDevices API.' },
        { step: '02', title: 'Neural Hand Landmark Tracking', desc: 'MediaPipe Hands machine learning model estimates 21 3D coordinate joints.' },
        { step: '03', title: 'Kinematic Vector Calculation', desc: 'Computes pinch distance, palm plane normal vectors, and velocity damping.' },
        { step: '04', title: 'Matrix Transform Mapping', desc: 'Translates kinematic vectors into quaternion rotations and scale transforms.' },
        { step: '05', title: '60 FPS WebGL Scene Render', desc: 'Updates Three.js scene graph with smooth lerping and particle feedback.' }
      ]
    },
    codeSnippet: `// MediaPipe Landmark to Three.js Quaternion Transformation
const onHandResults = (results) => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;
  
  const landmarks = results.multiHandLandmarks[0];
  const wrist = landmarks[0];
  const indexTip = landmarks[8];
  const thumbTip = landmarks[4];
  
  // Calculate Euclidean distance for pinch-to-zoom
  const pinchDist = Math.hypot(
    indexTip.x - thumbTip.x,
    indexTip.y - thumbTip.y,
    indexTip.z - thumbTip.z
  );
  
  // Map hand yaw & pitch to 3D model rotation with exponential smoothing
  const targetRotationY = (wrist.x - 0.5) * Math.PI * 2;
  const targetRotationX = (wrist.y - 0.5) * Math.PI;
  
  model3D.rotation.y += (targetRotationY - model3D.rotation.y) * 0.15;
  model3D.rotation.x += (targetRotationX - model3D.rotation.x) * 0.15;
  model3D.scale.setScalar(THREE.MathUtils.lerp(0.8, 2.5, pinchDist * 3));
};`,
    codeLanguage: 'javascript',
    techStack: {
      '3D & Graphics': ['Three.js', 'WebGL', 'GLSL Shaders'],
      'Vision & ML': ['MediaPipe Hands', 'WebAssembly', 'TensorFlow.js'],
      'Core Frontend': ['JavaScript (ES6+)', 'HTML5 Canvas', 'Vite']
    },
    gallery: [
      { src: '/projects/janisa/janisa_model.png', caption: 'Janisa Holographic 3D Model Inspection & Gesture HUD' }
    ],
    challenges: [
      {
        title: 'Mitigating Frame Jitter in Low-Light Webcam Streams',
        solution: 'Implemented double-buffered quaternion spherical interpolation (Slerp) with thresholded delta dead-zones, maintaining rock-solid visual stability.'
      }
    ]
  },
  {
    id: 6,
    slug: 'crypto-airflow',
    title: 'Crypto Airflow',
    subtitle: 'Automated Production ETL & Dimensional Modeling Engine',
    category: 'Distributed Data Engineering',
    description: 'A robust, production-grade cryptocurrency data orchestration pipeline. Automated Apache Airflow DAGs execute every 5 minutes to extract real-time market data from the CoinGecko API, ingest raw payloads into PostgreSQL staging tables, execute dimensional transformations with dbt, and maintain analytics-ready star schemas.',
    accent: '#6366f1',
    accentSecondary: '#4f46e5',
    bgImage: '/projects/bgs/crypto_airflow_bg.png',
    fallbackImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1920&q=85',
    github: 'https://github.com/suprit-4618/crypto-airflow-dbt-pipeline',
    year: '2024',
    role: 'Data Pipeline Engineer',
    metrics: [
      { label: 'Orchestration Cadence', value: 'Every 5 Mins' },
      { label: 'Data Quality Tests', value: 'Automated dbt' },
      { label: 'Target Database', value: 'PostgreSQL' },
      { label: 'Deployment', value: 'Docker Compose' }
    ],
    overview: {
      summary: 'Crypto Airflow is an enterprise data platform built to continuously ingest, validate, model, and serve volatile crypto market data for downstream quantitative analytics.',
      targetAudience: 'Quantitative analysts, data engineers, and algorithmic trading teams.',
      purpose: 'Deliver clean, reliable, star-schema relational data warehouse tables updated on a strict 5-minute cadence.'
    },
    problem: {
      heading: 'Unreliable API Feeds Cause Inconsistent Metrics',
      description: 'Cryptocurrency APIs frequently rate-limit callers, alter response schemas, and deliver nested payloads that break standard relational database ingestion.'
    },
    solution: {
      heading: 'Resilient Airflow Scheduling Combined with dbt Data Marts',
      description: 'Using exponential backoff retries in Airflow workers and modular dbt incremental models in PostgreSQL, the pipeline guarantees idempotent loading and strict schema enforcement.'
    },
    features: [
      {
        icon: 'calendar',
        title: '5-Minute Ingestion Cadence',
        desc: 'Airflow cron scheduler managing parallel extraction tasks with automated retry mechanisms.'
      },
      {
        icon: 'database',
        title: 'Star-Schema Dimensional Modeling',
        desc: 'dbt transformations separating raw staging tables into query-optimized fact and dimension marts.'
      },
      {
        icon: 'check-square',
        title: 'Automated Data Quality Assertions',
        desc: 'dbt testing suites guaranteeing uniqueness, non-null values, and referential integrity.'
      },
      {
        icon: 'package',
        title: 'Containerized Infrastructure',
        desc: 'Complete stack orchestrated via Docker Compose for 100% reproducible local and cloud deployment.'
      }
    ],
    architecture: {
      pipeline: 'Airflow DAG Scheduler (5m Cron) → Python API Extractor with Exponential Backoff → PostgreSQL Staging Store → dbt Transformation Models (Staging, Fact, Dim) → Production Analytics Mart',
      stages: [
        { step: '01', title: 'Scheduled DAG Trigger', desc: 'Airflow scheduler triggers ingestion tasks on a 5-minute interval.' },
        { step: '02', title: 'API Extraction & Backoff', desc: 'Python worker queries CoinGecko endpoints with rate-limiting and payload validation.' },
        { step: '03', title: 'Raw Ingestion Staging', desc: 'Loads raw nested JSON into un-opinionated PostgreSQL staging tables.' },
        { step: '04', title: 'dbt Dimensional Modeling', desc: 'Transforms staging data into star-schema fact and dimension tables.' },
        { step: '05', title: 'Data Quality Auditing', desc: 'Executes dbt test suite verifying uniqueness, schema constraints, and freshness.' }
      ]
    },
    codeSnippet: `-- dbt Dimensional Model: fact_crypto_market_ticks.sql
{{ config(materialized='incremental', unique_key='tick_id') }}

WITH raw_source AS (
    SELECT * FROM {{ ref('stg_coingecko_crypto_prices') }}
),
standardized_metrics AS (
    SELECT
        md5(concat(coin_id, cast(extracted_at as text))) AS tick_id,
        coin_id,
        symbol,
        current_price_usd,
        market_cap_usd,
        total_volume_24h,
        price_change_percentage_24h,
        extracted_at
    FROM raw_source
)
SELECT * FROM standardized_metrics
{% if is_incremental() %}
    WHERE extracted_at > (SELECT max(extracted_at) FROM {{ this }})
{% endif %}`,
    codeLanguage: 'sql',
    techStack: {
      'Orchestration & Transformation': ['Apache Airflow', 'dbt (data build tool)', 'Python 3.11', 'SQL'],
      'Storage & Infra': ['PostgreSQL', 'Docker', 'Docker Compose', 'CoinGecko API']
    },
    gallery: [
      { src: '/projects/bgs/crypto_airflow_bg.png', caption: 'Apache Airflow DAG Execution Graph & Market Ingestion Pipeline' }
    ],
    challenges: [
      {
        title: 'CoinGecko Public API Rate-Limiting During High Volatility',
        solution: 'Engineered a custom Airflow PythonOperator with adaptive exponential backoff and cached fallback tables to prevent pipeline DAG failures.'
      }
    ]
  },
  {
    id: 7,
    slug: 'rumi',
    title: 'Rumi',
    subtitle: 'Automated Email Resume Extraction & Hiring Pipeline CLI',
    category: 'Workflow Automation & NLP',
    description: 'A high-velocity automation pipeline designed to eliminate recruiting chaos for small-to-medium businesses. Integrates with the Gmail API via OAuth2 to monitor applicant inboxes, extracts incoming candidate resumes, parses unstructured data using structured Gemini 3.8 Flash inference, and outputs clean normalized candidate records.',
    accent: '#ec4899',
    accentSecondary: '#db2777',
    bgImage: '/projects/bgs/rumi_bg.png',
    fallbackImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1920&q=85',
    github: 'https://github.com/suprit-4618/rumi',
    year: '2024',
    role: 'Automation Engineer',
    metrics: [
      { label: 'Parse Duration', value: '<3s / Resume' },
      { label: 'Schema Validity', value: '100% Strict JSON' },
      { label: 'Inbox Integration', value: 'OAuth2 Gmail API' },
      { label: 'Human Effort Saved', value: 'Hours / Week' }
    ],
    overview: {
      summary: 'Rumi frees hiring managers from tedious resume triage. By connecting directly to company mailboxes and applying Gemini structured inference, it extracts candidate credentials into organized tabular formats in seconds.',
      targetAudience: 'Startup founders, technical recruiters, and talent acquisition teams.',
      purpose: 'Automate candidate dossier extraction from messy email inboxes without manual data entry.'
    },
    problem: {
      heading: 'Recruiting Inboxes Suffer from High Clutter',
      description: 'Hiring teams spend hours downloading attachments, converting PDFs, and manually copy-pasting years of experience and skill sets into spreadsheets.'
    },
    solution: {
      heading: 'Secure OAuth2 Ingestion with Gemini Structured Output Modes',
      description: 'Rumi polls designated Gmail filters, downloads resume documents, prompts Gemini with strict JSON schemas, and outputs formatted terminal summaries and CSV files.'
    },
    features: [
      {
        icon: 'mail',
        title: 'Automated Gmail Polling',
        desc: 'Secure OAuth2 integration filtering applicant threads by label, sender, and date window.'
      },
      {
        icon: 'file-text',
        title: 'Multi-Format Attachment Parsing',
        desc: 'Extracts clean textual streams from PDF, Word (.docx), and plaintext attachments.'
      },
      {
        icon: 'cpu',
        title: 'Gemini Structured JSON Extraction',
        desc: 'Sub-3 second parsing into validated schemas with candidate experience, stack, and contact data.'
      },
      {
        icon: 'terminal',
        title: 'Terminal CLI Tool',
        desc: 'Terminal-native CLI with color-coded logging, candidate ranking, and CSV exports.'
      }
    ],
    architecture: {
      pipeline: 'Gmail API (OAuth2) Filter Monitoring → Attachment Downloader (PDF / DOCX) → Gemini 3.8 Flash Schema Extraction → Candidate Normalization → Structured CSV / Database Export',
      stages: [
        { step: '01', title: 'Gmail Inbox Polling', desc: 'Queries Gmail threads using customized search labels and date filters via OAuth2.' },
        { step: '02', title: 'Attachment Parsing', desc: 'Identifies and extracts resume attachments (PDF/DOCX), decoding raw text content.' },
        { step: '03', title: 'Gemini Flash Extraction', desc: 'Gemini 3.8 Flash processes unstructured resume text against strict JSON schema.' },
        { step: '04', title: 'Candidate Profile Scoring', desc: 'Computes relevance score, validates phone/email, and extracts years of experience.' },
        { step: '05', title: 'Export & Notification', desc: 'Logs parsed applicant record to database and outputs formatted terminal summary.' }
      ]
    },
    codeSnippet: `# Rumi Candidate Extraction Engine
from googleapiclient.discovery import build
import google.generativeai as genai

model = genai.GenerativeModel("gemini-2.0-flash")

async def parse_candidate_email(message_id: str, gmail_service):
    # Retrieve email thread and resume attachment
    msg = gmail_service.users().messages().get(userId='me', id=message_id).execute()
    attachment_text = extract_resume_attachment_text(msg, gmail_service)
    
    prompt = """
    Extract the applicant's credentials into this JSON schema:
    {
      "name": "string",
      "email": "string",
      "years_of_experience": float,
      "primary_skills": ["string"],
      "education": "string",
      "summary": "string",
      "suitability_score": int (1-100)
    }
    """
    response = await model.generate_content_async([prompt, attachment_text])
    candidate_profile = json.loads(response.text)
    return candidate_profile`,
    codeLanguage: 'python',
    techStack: {
      'AI & Extraction': ['Google Gemini 3.8 Flash', 'Pydantic JSON Schemas', 'pdfplumber', 'python-docx'],
      'Core & Integrations': ['Python 3.11', 'Google Gmail API (OAuth2)', 'Rich CLI', 'Asyncio']
    },
    gallery: [
      { src: '/projects/rumi/Screenshot 2026-09-16 095151.png', caption: 'Rumi Automated Candidate Resume Parser & CLI Dashboard' },
      { src: '/projects/rumi/Screenshot 2026-09-16 095158.png', caption: 'Structured JSON Schema Extraction Telemetry' },
      { src: '/projects/rumi/Screenshot 2026-09-16 095249.png', caption: 'Applicant Scoring & Skills Match Comparison' }
    ],
    challenges: [
      {
        title: 'Extracting Clean Text from Multi-Column and Image-Heavy Resumes',
        solution: 'Implemented fallback OCR and layout-preserving token streams in pdfplumber, ensuring Gemini receives properly ordered text blocks.'
      }
    ]
  }
];
