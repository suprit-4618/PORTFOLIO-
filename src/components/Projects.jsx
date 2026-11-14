import React from 'react';
import './Projects.css';

export const PROJECTS = [
  {
    id: 1,
    title: 'AgriVerseAI',
    subtitle: 'Bilingual AI Crop Disease Diagnosis & Regional Farm Intelligence',
    category: 'Computer Vision & Multilingual NLP',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    accent: '#10b981',
    github: 'https://github.com/suprit-4618/AgriVerseAI',
    live: 'https://agriverseai-six.vercel.app',
    paper: '/publications/agriverseAi.pdf',
    brief: 'A full-stack agricultural intelligence platform engineered for rural farmers. Integrates a fine-tuned MobileNetV2 CNN achieving 95.4% accuracy across 38 crop disease classes, paired with a bilingual Kannada-English voice synthesis system and Gemini 2.0 reasoning for localized treatment advisory.',
    architecture: 'Edge Camera Feed → OpenCV Preprocessing → MobileNetV2 CNN (35ms CUDA) → Gemini 2.0 Multilingual Reasoning → Regional Speech Synthesis',
    metrics: [
      { label: 'Validation Accuracy', value: '95.4%' },
      { label: 'Inference Latency', value: '35ms' },
      { label: 'Disease Classes', value: '38 Types' },
      { label: 'Training Speedup', value: '60%' }
    ],
    problemSolves: [
      'Eliminates language & literacy barriers for regional Karnataka farmers via native voice interfaces',
      'Prevents catastrophic harvest losses through sub-second deep learning crop disease identification',
      'Provides localized pesticide recommendations, market price comparisons, and weather telemetries',
      'Runs efficiently on low-cost edge smartphones via lightweight quantized neural network weights'
    ],
    technicalHighlights: [
      'Fine-tuned MobileNetV2 architecture with transfer learning on 81,000+ plant leaf datasets across 38 distinct categories.',
      'Optimized PyTorch/CUDA training pipeline reducing training time by 60% with an average edge inference latency of 35ms.',
      'Constructed dual-channel real-time camera capture with offline image buffering for areas with intermittent rural connectivity.',
      'Integrated Google Gemini 2.0 with custom prompt templates for bilingual conversational farming advice in Kannada & English.',
      'Published academic research paper in the International Research Journal of Modernization in Engineering Technology and Science (IRJMETS DOI: 10.56726/IRJMETS78194).'
    ],
    pipelineStages: [
      { step: '01', title: 'Multimodal Ingestion', desc: 'Real-time camera feed capture or offline image buffer loaded into normalized canvas.' },
      { step: '02', title: 'OpenCV Tensor Preprocessing', desc: 'Resizing, illumination normalization, and tensor batching for inference optimization.' },
      { step: '03', title: 'MobileNetV2 CNN Classification', desc: '38-class softmax prediction with confidence scoring and disease severity rating.' },
      { step: '04', title: 'Bilingual Agronomic Reasoning', desc: 'Gemini 2.0 generates localized treatments, dosage guidelines, and weather advisories.' },
      { step: '05', title: 'Regional Voice Dispatch', desc: 'Browser SpeechSynthesis produces fluid Kannada / English audio instructions.' }
    ],
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
    tech: ['TensorFlow', 'MobileNetV2', 'FastAPI', 'OpenCV', 'Gemini 2.0', 'React', 'Firebase', 'CUDA']
  },
  {
    id: 2,
    title: 'Semantic-RAG-Search Engine',
    subtitle: 'Dual-Engine Neural Vector Retrieval & RAG Pipeline',
    category: 'Information Retrieval & Vector Databases',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    accent: '#06b6d4',
    github: 'https://github.com/suprit-4618/Semantic-and-Dual-Engine-Rag',
    live: 'https://ai-semantic-search-endee-fznbrf5gfer5dczpjweoaz.streamlit.app/',
    brief: 'A high-throughput semantic information retrieval system and RAG pipeline engineered to overcome keyword search mismatches. Projects queries and documents into 384-dimensional dense semantic vector space, executing sub-50ms cosine similarity searches with 95% precision.',
    architecture: 'Raw Text Query → Transformer Encoder (all-MiniLM-L6-v2) → 384-d Vector Index (ChromaDB / Endee) → Cosine Similarity Top-K → RAG Context Augmentation',
    metrics: [
      { label: 'Query Latency', value: '<50ms' },
      { label: 'Retrieval Precision', value: '95%' },
      { label: 'Embedding Dim', value: '384-d' },
      { label: 'Context Accuracy', value: '+40%' }
    ],
    problemSolves: [
      'Resolves lexical and vocabulary mismatch where keyword search fails to comprehend semantic intent',
      'Executes sub-linear nearest-neighbor search across dense multi-document knowledge corpora',
      'Prevents LLM hallucinations by injecting highly relevant grounded reference passages into prompts',
      'Provides transparent cosine-distance scoring and vector clustering visualizations'
    ],
    technicalHighlights: [
      'Architected semantic search core using HuggingFace Transformers (all-MiniLM-L6-v2) to map complex sentences into dense 384-dimensional embeddings.',
      'Achieved 40% increase in meaning-aware search accuracy compared to classical sparse BM25 indices.',
      'Engineered decoupled FastAPI REST microservice backed by ChromaDB and Endee Vector DB for cosine similarity queries with <50ms response latency.',
      'Expanded into an end-to-end Retrieval-Augmented Generation (RAG) pipeline delivering contextual grounded prompt packets to LLMs.',
      'Configured automated CI/CD pipeline using GitHub Actions to package model artifacts and deploy directly to Hugging Face Spaces.'
    ],
    pipelineStages: [
      { step: '01', title: 'Document Chunking', desc: 'Recursive token-aware text splitting with sliding window context preservation.' },
      { step: '02', title: 'Dense Vectorization', desc: 'Hugging Face all-MiniLM-L6-v2 projects text into normalized 384-d embedding vectors.' },
      { step: '03', title: 'Index Ingestion', desc: 'HNSW graph indexing in ChromaDB and Endee Vector Database for sub-linear retrieval.' },
      { step: '04', title: 'Cosine Distance Ranking', desc: 'Cosine similarity calculation with score thresholding filtering irrelevant context.' },
      { step: '05', title: 'Augmented Generation', desc: 'Top-K semantic context passages combined with query to synthesize grounded answers.' }
    ],
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
    tech: ['Python', 'Transformers (all-MiniLM-L6-v2)', 'ChromaDB', 'Endee Vector DB', 'FastAPI', 'Docker', 'PyTorch']
  },
  {
    id: 3,
    title: 'Autonomous AI Job Search Agent',
    subtitle: '24/7 Scraping, Semantic Matching & Tool-Calling Agent',
    category: 'Autonomous Agents & LLM Orchestration',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    accent: '#8b5cf6',
    github: 'https://github.com/suprit-4618/autonomous-job-scout',
    brief: 'An autonomous 24/7 background agent pipeline that scouts job listings from Hacker News and remote tech boards. Employs LLaMA-3 on Groq for sub-second semantic resume-to-job matching, performs skill-gap analysis, generates tailored cover letters, and dispatches real-time Telegram alerts.',
    architecture: 'Cron / Webhook Trigger → BeautifulSoup & Scraper Engine → LLaMA-3 Semantic Alignment → Skill-Gap & Cover Letter Pipeline → Firebase Firestore → Telegram Webhooks',
    metrics: [
      { label: 'Time Saved', value: '80%' },
      { label: 'Match Latency', value: '<1.2s' },
      { label: 'Scouting Cycle', value: '24/7 Continual' },
      { label: 'Alert Dispatch', value: 'Real-Time' }
    ],
    problemSolves: [
      'Eliminates hundreds of hours of manual browsing across fragmented job boards and forums',
      'Provides instant objective skill-gap analysis identifying missing libraries or requirements',
      'Generates hyper-tailored, authentic cover letters mapped to specific job descriptions',
      'Delivers immediate push alerts straight to Telegram the moment a high-matching opening appears'
    ],
    technicalHighlights: [
      'Constructed a 24/7 autonomous job scouting engine using LangChain and BeautifulSoup, parsing Hacker News "Who is Hiring" threads and remote boards.',
      'Engineered an LLaMA-3 semantic matching engine executing resume-to-job alignment with sub-second latency on Groq LPUs.',
      'Automated dynamic cover letter synthesis and technical skill-gap diagnostics via a multi-step LangChain tool pipeline, slashing preparation time by 80%.',
      'Developed RESTful endpoints via FastAPI integrated with Firebase Firestore for persistent cloud-native logging of matches and application status.',
      'Packaged and deployed as an isolated Dockerized background microservice with Telegram Bot API webhooks for instant push notifications.'
    ],
    pipelineStages: [
      { step: '01', title: 'Target Board Scouting', desc: 'Scrapes Hacker News and remote portals using resilient HTTP clients with exponential backoff.' },
      { step: '02', title: 'Posting Normalization', desc: 'Extracts roles, compensation, tech requirements, and contact emails into clean schemas.' },
      { step: '03', title: 'Semantic Scoring Engine', desc: 'Groq LLaMA-3 computes similarity score between job requirements and candidate CV.' },
      { step: '04', title: 'Automated Artifact Synthesis', desc: 'LangChain tool chain generates custom cover letter and skill-gap recommendations.' },
      { step: '05', title: 'Cloud Sync & Telegram Alerts', desc: 'Records payload to Firebase Firestore and transmits rich markdown card to Telegram.' }
    ],
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
    tech: ['Python', 'LangChain', 'FastAPI', 'LLaMA-3 (Groq API)', 'Firebase Firestore', 'Docker', 'Telegram API']
  },
  {
    id: 4,
    title: 'DocTest',
    subtitle: 'Intelligent Document-to-Interactive Exam Engine with AI Verification',
    category: 'Full-Stack AI & Document Understanding',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
    accent: '#f59e0b',
    github: 'https://github.com/suprit-4618/DOCTEST',
    brief: 'A full-stack exam engine that ingests static documents (PDFs, photo scans, DOCX) and compiles them into timed, interactive multiple-choice test sessions. Features second-opinion AI question auditing, real-time grading, dynamic answer override, and granular analytics.',
    architecture: 'Document Upload (PDF / Scans) → Regex & LLM Question Extraction → SQLAlchemy Session Engine → Timed Test-Taker Interface → LLM Verification & Answer Override',
    metrics: [
      { label: 'Extraction Types', value: 'PDF / OCR / DOCX' },
      { label: 'Auditing LLM', value: 'Groq LLaMA / Gemini' },
      { label: 'Grading Latency', value: 'Instant (<10ms)' },
      { label: 'Type Safety', value: '100% Pydantic & TS' }
    ],
    problemSolves: [
      'Eliminates manual exam preparation from static past papers, problem sets, and textbooks',
      'Provides instant AI verification for ambiguous or disputed answer keys with step-by-step explanations',
      'Maintains server-synchronized timers with automatic submission to prevent time overrun',
      'Allows instructors and learners to manually override questions and retroactively re-grade sessions'
    ],
    technicalHighlights: [
      'Constructed a robust multi-modal document extraction pipeline parsing questions, answer options, and answer keys from PDFs and scanned documents.',
      'Implemented an AI "Second Opinion" verification endpoint leveraging Groq LLaMA and Gemini to analyze questions and generate pedagogical rationales.',
      'Architected interactive timed test sessions in React 18 TypeScript with auto-save, auto-submit triggers, and pause/resume session resilience.',
      'Built dynamic question override endpoints in FastAPI that update the question bank and recalculate historical session scores on the fly.',
      'Formulated strict Pydantic and SQLAlchemy data models with UTC timestamp parsing and comprehensive session scorecards.'
    ],
    pipelineStages: [
      { step: '01', title: 'Document Parsing & OCR', desc: 'Accepts PDF, scanned documents, and text, extracting raw structural question blocks.' },
      { step: '02', title: 'Question Tokenizer', desc: 'Parses question numbers, prompts, multiple options, and correct answers into schemas.' },
      { step: '03', title: 'Interactive Test Session', desc: 'Spawns timed exam environment with question navigation, timer countdown, and state save.' },
      { step: '04', title: 'Automated Score Engine', desc: 'Instantly computes percentage, correct/wrong counts, and generates review breakdown.' },
      { step: '05', title: 'AI Expert Second Opinion', desc: 'Allows learners to trigger AI auditing on any question to confirm or dispute answers.' }
    ],
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
    tech: ['FastAPI', 'React 18', 'TypeScript', 'TailwindCSS', 'Groq LLaMA-3.3', 'Gemini Flash', 'SQLAlchemy', 'Pydantic']
  },
  {
    id: 5,
    title: 'Janisa',
    subtitle: 'Holographic Spatial WebGL & Gesture-Controlled 3D Interface',
    category: 'Spatial Computing & Computer Vision',
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    accent: '#38bdf8',
    github: 'https://github.com/suprit-4618/janisa-hologram',
    live: 'https://janisa-hologram.vercel.app',
    brief: 'A futuristic spatial web interface that transforms passive 3D model viewing into an intuitive touchless holographic experience. Uses in-browser computer vision via MediaPipe to track 21 hand landmark coordinates in real-time through standard webcams, allowing multi-axis spatial rotation, zoom, and inspection.',
    architecture: 'Client Webcam Stream → MediaPipe Hands 21-Landmark Neural Tracking → Normalization & Delta Vector Calculus → Three.js Matrix Transformations → Hardware-Accelerated WebGL Rendering',
    metrics: [
      { label: 'Render Frame Rate', value: '60 FPS' },
      { label: 'Tracking Latency', value: '<20ms' },
      { label: 'Landmarks Tracked', value: '21 Points' },
      { label: 'Hardware Required', value: 'Zero VR Sensors' }
    ],
    problemSolves: [
      'Eliminates difficulty in understanding complex 3D structures and spatial geometries via flat 2D screens',
      'Transforms passive rendering into direct hands-on physical interaction using computer vision',
      'Operates 100% in browser on consumer hardware without expensive VR/AR headsets or external tracking gear',
      'Enhances spatial retention and intuitive inspection of scientific and engineering models'
    ],
    technicalHighlights: [
      'Engineered an interactive spatial visualization pipeline using Three.js and MediaPipe Hands in pure client-side JavaScript.',
      'Extracted real-time 3D coordinate vectors for 21 skeletal hand landmarks at 60 FPS with sub-20ms processing latency.',
      'Mapped gesture primitives (pinch, palm orientation, wrist yaw/pitch) directly to Three.js transformation matrices for natural model manipulation.',
      'Optimized WebGL scene shaders, lighting rigs, and geometry buffer attributes for smooth 60 FPS execution on low-spec laptops.',
      'Deployed live on Vercel with progressive camera permission handling and intuitive gesture HUD indicators.'
    ],
    pipelineStages: [
      { step: '01', title: 'Video Stream Capture', desc: 'Lightweight webcam video frame polling via browser MediaDevices API.' },
      { step: '02', title: 'Neural Hand Landmark Tracking', desc: 'MediaPipe Hands machine learning model estimates 21 3D coordinate joints.' },
      { step: '03', title: 'Kinematic Vector Calculation', desc: 'Computes pinch distance, palm plane normal vectors, and velocity damping.' },
      { step: '04', title: 'Matrix Transform Mapping', desc: 'Translates kinematic vectors into quaternion rotations and scale transforms.' },
      { step: '05', title: '60 FPS WebGL Scene Render', desc: 'Updates Three.js scene graph with smooth lerping and particle feedback.' }
    ],
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
    tech: ['Three.js', 'WebGL', 'MediaPipe Hands', 'JavaScript (ES6+)', 'Vite']
  },
  {
    id: 6,
    title: 'Crypto Airflow',
    subtitle: 'Automated Production ETL & Dimensional Modeling Engine',
    category: 'Distributed Data Engineering & Analytics',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80',
    accent: '#6366f1',
    github: 'https://github.com/suprit-4618/crypto-airflow-dbt-pipeline',
    brief: 'A robust, production-grade cryptocurrency data orchestration pipeline. Automated Apache Airflow DAGs execute every 5 minutes to extract real-time market data from the CoinGecko API, ingest raw payloads into PostgreSQL staging tables, execute dimensional transformations with dbt, and maintain analytics-ready star schemas.',
    architecture: 'Airflow DAG Scheduler (5m Cron) → Python API Extractor with Exponential Backoff → PostgreSQL Staging Store → dbt Transformation Models (Staging, Fact, Dim) → Production Analytics Mart',
    metrics: [
      { label: 'Orchestration Cadence', value: 'Every 5 Mins' },
      { label: 'Data Quality Tests', value: 'Automated dbt' },
      { label: 'Target Database', value: 'PostgreSQL' },
      { label: 'Deployment', value: 'Docker Compose' }
    ],
    problemSolves: [
      'Eliminates manual market data collection by continuously synchronizing live cryptocurrency ticks',
      'Standardizes highly nested, heterogeneous API JSON payloads into clean relational star schemas',
      'Guarantees data integrity and idempotency with automated dbt tests (uniqueness, referential integrity)',
      'Provides a reproducible, version-controlled analytics engineering environment with Docker'
    ],
    technicalHighlights: [
      'Engineered an enterprise cryptocurrency ETL orchestration pipeline using Apache Airflow, dbt, and PostgreSQL.',
      'Scheduled recurring 5-minute ingestion DAGs consuming CoinGecko market telemetry with automated rate-limit retry logic.',
      'Architected modular dbt SQL transformations organizing staging, intermediate, and dimensional fact tables.',
      'Implemented automated dbt test assertions ensuring zero duplicate records, non-null guarantees, and referential validity.',
      'Containerized the entire infrastructure via Docker Compose, coordinating Airflow webserver, scheduler, and Postgres instances.'
    ],
    pipelineStages: [
      { step: '01', title: 'Scheduled DAG Trigger', desc: 'Airflow scheduler triggers ingestion tasks on a 5-minute interval.' },
      { step: '02', title: 'API Extraction & Backoff', desc: 'Python worker queries CoinGecko endpoints with rate-limiting and payload validation.' },
      { step: '03', title: 'Raw Ingestion Staging', desc: 'Loads raw nested JSON into un-opinionated PostgreSQL staging tables.' },
      { step: '04', title: 'dbt Dimensional Modeling', desc: 'Transforms staging data into star-schema fact and dimension tables.' },
      { step: '05', title: 'Data Quality Auditing', desc: 'Executes dbt test suite verifying uniqueness, schema constraints, and freshness.' }
    ],
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
    tech: ['Apache Airflow', 'dbt', 'PostgreSQL', 'Docker', 'Python', 'SQL']
  },
  {
    id: 7,
    title: 'Rumi',
    subtitle: 'Automated Email Resume Extraction & Hiring Pipeline CLI',
    category: 'Workflow Automation & LLM Parsing',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    accent: '#ec4899',
    github: 'https://github.com/suprit-4618/rumi',
    brief: 'A high-velocity automation pipeline designed to eliminate recruiting chaos for small-to-medium businesses. Integrates with the Gmail API via OAuth2 to monitor applicant inboxes, extracts incoming candidate resumes, parses unstructured data using structured Gemini 3.8 Flash inference, and outputs clean normalized candidate records.',
    architecture: 'Gmail API (OAuth2) Filter Monitoring → Attachment Downloader (PDF / DOCX) → Gemini 3.8 Flash Schema Extraction → Candidate Normalization → Structured CSV / Database Export',
    metrics: [
      { label: 'Parse Duration', value: '<3s / Resume' },
      { label: 'Schema Validity', value: '100% Strict JSON' },
      { label: 'Inbox Integration', value: 'OAuth2 Gmail API' },
      { label: 'Human Effort Saved', value: 'Hours / Week' }
    ],
    problemSolves: [
      'Eliminates manual downloading, opening, and scanning of hundreds of applicant emails and resumes',
      'Extracts structured candidate data (experience years, core tech stack, contact info, match rating)',
      'Ensures zero hallucination via Gemini structured schema mode and Pydantic validation',
      'Provides a clean, terminal-native CLI interface for small business founders and engineering managers'
    ],
    technicalHighlights: [
      'Constructed a streamlined email automation pipeline using Python and Google Gmail API (OAuth2).',
      'Implemented automated email inbox filtering and secure attachment decoding for PDF and Word resumes.',
      'Engineered structured prompting with Gemini 3.8 Flash to extract verified candidate attributes into strict JSON.',
      'Eliminated manual hiring data entry, processing candidate dossiers in under 3 seconds per application.',
      'Delivered a lightweight terminal CLI tool complete with colored logging, candidate scoring, and tabular export.'
    ],
    pipelineStages: [
      { step: '01', title: 'Gmail Inbox Polling', desc: 'Queries Gmail threads using customized search labels and date filters via OAuth2.' },
      { step: '02', title: 'Attachment Parsing', desc: 'Identifies and extracts resume attachments (PDF/DOCX), decoding raw text content.' },
      { step: '03', title: 'Gemini Flash Extraction', desc: 'Gemini 3.8 Flash processes unstructured resume text against strict JSON schema.' },
      { step: '04', title: 'Candidate Profile Scoring', desc: 'Computes relevance score, validates phone/email, and extracts years of experience.' },
      { step: '05', title: 'Export & Notification', desc: 'Logs parsed applicant record to database and outputs formatted terminal summary.' }
    ],
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
    tech: ['Python', 'Gmail API (OAuth2)', 'Gemini 3.8 Flash', 'JSON Schema', 'CLI']
  }
];

import GlassFolder from './ui/glass-folder-cards';
import { ArrowUpRight, FolderOpen, ExternalLink, Sparkles } from 'lucide-react';

const PROJECT_FOLDERS = [
  {
    slug: 'agriverseai',
    title: 'AgriVerseAI',
    categoryTag: 'Edge CNN & Regional Audio',
    art: 'verdant',
    seed: 3,
    folderBg: '/projects/bgs/agriverseai_bg.png',
    live: 'https://agriverseai-six.vercel.app',
    github: 'https://github.com/suprit-4618/AgriVerseAI',
    drafts: [
      { 
        name: 'Draft 01: MobileNetV2 Architecture', 
        meta: '35ms CUDA · 95.4% Acc', 
        image: '/projects/agriverseai/agri_1.png' 
      },
      { 
        name: 'Draft 02: Bilingual Kannada Voice Engine', 
        meta: 'Gemini 2.0 Advisory', 
        image: '/projects/agriverseai/agri_3.png' 
      },
      { 
        name: 'Draft 03: Field Study & Research Paper', 
        meta: 'IRJMETS Journal ↗', 
        image: '/projects/agriverseai/agri_2.png' 
      },
    ]
  },
  {
    slug: 'semantic-rag-search',
    title: 'Semantic RAG Search',
    categoryTag: '384-d Vector Retrieval',
    art: 'glacier',
    seed: 8,
    folderBg: '/projects/bgs/semantic_search_bg.png',
    live: 'https://ai-semantic-search-endee-fznbrf5gfer5dczpjweoaz.streamlit.app/',
    github: 'https://github.com/suprit-4618/Semantic-and-Dual-Engine-Rag',
    drafts: [
      { 
        name: 'Draft 01: 384-d Dense Vector Index', 
        meta: 'all-MiniLM-L6-v2', 
        image: '/projects/ai-semantic-search/semantic_search_1.png' 
      },
      { 
        name: 'Draft 02: Chroma & Endee Pipelines', 
        meta: '<50ms · 95% Precision', 
        image: '/projects/ai-semantic-search/endee_project.png' 
      },
      { 
        name: 'Draft 03: Grounded Context Augmentation', 
        meta: '+40% Accuracy ↗', 
        image: '/projects/ai-semantic-search/semantic_search_2.png' 
      },
    ]
  },
  {
    slug: 'autonomous-job-scout',
    title: 'Autonomous Job Scout',
    categoryTag: 'Agentic Scraping & Ranking',
    art: 'aurora',
    seed: 12,
    folderBg: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
    github: 'https://github.com/suprit-4618/AI-Driven-Autonomous-Job-Scout',
    drafts: [
      { 
        name: 'Draft 01: Multi-Portal Scraping Pipeline', 
        meta: '5 Portals · Headless',
        art: 'aurora'
      },
      { 
        name: 'Draft 02: Groq LLaMA 3.3 Semantic Match', 
        meta: '80% Noise Filter',
        art: 'ember'
      },
      { 
        name: 'Draft 03: Automated Deduplication Mart', 
        meta: '30s Scan Cycle ↗',
        art: 'glacier'
      },
    ]
  },
  {
    slug: 'doctest',
    title: 'DocTest Engine',
    categoryTag: 'Healthcare AI & HIPAA',
    art: 'ember',
    seed: 19,
    folderBg: '/projects/bgs/doctest_bg.png',
    live: 'https://doc-test-eight.vercel.app/',
    github: 'https://github.com/suprit-4618/DocTest',
    drafts: [
      { 
        name: 'Draft 01: Synthetic Clinical Test Generator', 
        meta: 'Gemini 2.0 Flash', 
        image: '/projects/doctest/doctest_preview.png' 
      },
      { 
        name: 'Draft 02: HIPAA Anonymization Engine', 
        meta: 'Zero Data Leakage',
        art: 'ember'
      },
      { 
        name: 'Draft 03: Test Matrix Execution Runner', 
        meta: '10x Speedup ↗', 
        image: '/projects/doctest/doctest_preview.png' 
      },
    ]
  },
  {
    slug: 'janisa',
    title: 'Janisa Hologram',
    categoryTag: 'Spatial Vision & WebGL',
    art: 'dusk',
    seed: 24,
    folderBg: '/projects/bgs/janisa_bg.png',
    live: 'https://janisa-three.vercel.app/',
    github: 'https://github.com/suprit-4618/Janisa',
    drafts: [
      { 
        name: 'Draft 01: 21-Keypoint Hand Telemetry', 
        meta: 'MediaPipe · 60 FPS', 
        image: '/projects/janisa/janisa_model.png' 
      },
      { 
        name: 'Draft 02: Three.js Spatial Manipulation', 
        meta: '12 Gestures · WebGL',
        art: 'dusk'
      },
      { 
        name: 'Draft 03: Real-Time Hologram Viewport', 
        meta: 'Spatial AI ↗', 
        image: '/projects/janisa/janisa_model.png' 
      },
    ]
  },
  {
    slug: 'crypto-airflow',
    title: 'Crypto Airflow Mart',
    categoryTag: 'Real-Time Financial ETL',
    art: 'verdant',
    seed: 31,
    folderBg: '/projects/bgs/crypto_airflow_bg.png',
    github: 'https://github.com/suprit-4618/Crypto_Airflow_Dbt_Analytics_Engineering',
    drafts: [
      { 
        name: 'Draft 01: Multi-Coin Live Price Ingestion', 
        meta: '5-Min DAG Schedule',
        art: 'verdant'
      },
      { 
        name: 'Draft 02: dbt Dimensional Transformations', 
        meta: 'SCD Type 2 · PostgreSQL',
        art: 'ember'
      },
      { 
        name: 'Draft 03: Warehousing & Analytics Mart', 
        meta: '100% DAG Success ↗',
        art: 'glacier'
      },
    ]
  },
  {
    slug: 'rumi',
    title: 'Rumi Hiring CLI',
    categoryTag: 'Automated Gmail Screening',
    art: 'aurora',
    seed: 42,
    folderBg: '/projects/bgs/rumi_bg.png',
    github: 'https://github.com/suprit-4618/rumi',
    drafts: [
      { 
        name: 'Draft 01: OAuth2 Resume Inbox Daemon', 
        meta: 'Async Gmail Watcher', 
        image: '/projects/rumi/Screenshot 2026-09-16 095151.png' 
      },
      { 
        name: 'Draft 02: Gemini 3.8 Flash Profile Match', 
        meta: '94% Accuracy', 
        image: '/projects/rumi/Screenshot 2026-09-16 095312.png' 
      },
      { 
        name: 'Draft 03: Candidate Ranking CLI Engine', 
        meta: '90% Time Saved ↗', 
        image: '/projects/rumi/Screenshot 2026-09-16 095427.png' 
      },
    ]
  },
];

export const Projects = ({ onProjectSelect }) => {
  return (
    <section id="projects" className="startup-projects-section" aria-label="Featured Engineering Projects">
      <div className="startup-projects-container">
        
        {/* Section Header */}
        <div className="startup-section-header">
          <h2 className="startup-section-title">
            Projects
          </h2>
        </div>

        {/* Glass Folder Cards Grid */}
        <div className="projects-folders-grid">
          {PROJECT_FOLDERS.map((project, index) => (
            <div key={project.slug} className="project-folder-card-unit">
              <div className="project-folder-wrapper">
                <GlassFolder
                  label={project.title}
                  meta={project.categoryTag}
                  art={project.art}
                  image={project.folderBg}
                  seed={project.seed}
                  tone="light"
                  files={project.drafts}
                  action="more"
                  menu={[
                    {
                      label: 'Read Full Case Study',
                      onSelect: () => onProjectSelect && onProjectSelect(project.slug),
                    },
                    ...(project.live ? [{
                      label: 'Launch Live Demo ↗',
                      onSelect: () => window.open(project.live, '_blank'),
                    }] : []),
                    ...(project.github ? [{
                      label: 'GitHub Repository ↗',
                      onSelect: () => window.open(project.github, '_blank'),
                    }] : []),
                  ]}
                  onFileSelect={() => {
                    if (onProjectSelect) {
                      onProjectSelect(project.slug);
                    }
                  }}
                  appearDelay={index * 90}
                />
              </div>

              {/* Direct Open Button */}
              <div className="project-folder-action-bar">
                <button 
                  type="button"
                  className="project-folder-open-btn"
                  onClick={() => onProjectSelect && onProjectSelect(project.slug)}
                  title={`Open full explanation for ${project.title}`}
                >
                  <span>Explore Explanation</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>



      </div>
    </section>
  );
};

export default Projects;
