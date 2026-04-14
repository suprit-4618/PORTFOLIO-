import React, { useRef, useCallback, useEffect, useState, useId, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutsideClick } from '../hooks/use-outside-click';
import './Skills.css';
import javaIcon from '../assets/java.svg';
import mysqlIcon from '../assets/mysql.png';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';


// ─── Skills Data with Descriptions ────────────────────
const SKILLS = [
  { 
    name: 'Python', 
    category: 'Languages', 
    slug: 'python',
    description: 'High-level programming language',
    content: () => (
      <p>
        Python is my primary tool for data science, AI, and backend automation. 
        Its elegant syntax and vast ecosystem of libraries (like NumPy and Pandas) 
        allow me to build robust, scalable solutions and complex machine learning models.
      </p>
    )
  },
  { 
    name: 'Java', 
    category: 'Languages', 
    slug: javaIcon,
    description: 'Object-oriented programming',
    content: () => (
      <p>
        Java provides a solid foundation for building enterprise-grade applications. 
        I use it for developing microservices and backend systems where performance, 
        security, and scalability are paramount.
      </p>
    )
  },
  { 
    name: 'JavaScript', 
    category: 'Languages', 
    slug: 'javascript',
    description: 'Web versatility',
    content: () => (
      <p>
        JavaScript is the heartbeat of my frontend development. 
        From interactive UI components in React to real-time features, 
        I leverage JS to create immersive and highly responsive user experiences.
      </p>
    )
  },
  { 
    name: 'PySpark', 
    category: 'Languages', 
    slug: 'apachespark',
    description: 'Big data processing',
    content: () => (
      <p>
        PySpark is essential for handling large-scale datasets. 
        I use it to build distributed data processing pipelines that extract 
        insightful information from terabytes of raw data efficiently.
      </p>
    )
  },
  { 
    name: 'Artificial Intelligence', 
    category: 'AI / ML', 
    slug: 'googlegemini',
    description: 'Future-ready tech',
    content: () => (
      <p>
        I specialize in integrating AI to solve real-world problems. 
        Whether it&apos;s natural language processing or custom generative models, 
        I aim to build systems that automate and enhance human capabilities.
      </p>
    )
  },
  { 
    name: 'Machine Learning', 
    category: 'AI / ML', 
    slug: 'scikitlearn',
    description: 'Predictive analytics',
    content: () => (
      <p>
        Focusing on both supervised and unsupervised learning, 
        I build predictive models using Scikit-learn, TensorFlow, and PyTorch 
        to uncover patterns and drive data-informed decision-making.
      </p>
    )
  },
  { 
    name: 'Data Science', 
    category: 'AI / ML', 
    slug: 'jupyter',
    description: 'Insight extraction',
    content: () => (
      <p>
        Combining statistical expertise with coding skills, 
        I perform deep data analysis to transform raw data into 
        compelling narratives and actionable business intelligence.
      </p>
    )
  },
  { 
    name: 'FastAPI', 
    category: 'Backend', 
    slug: 'fastapi',
    description: 'Modern backend API',
    content: () => (
      <p>
        FastAPI is my go-to for building high-performance Python APIs. 
        Its speed, built-in validation, and automatic documentation 
        make it ideal for modern, asynchronous web services.
      </p>
    )
  },
  { 
    name: 'MySQL', 
    category: 'Databases', 
    slug: mysqlIcon,
    description: 'Relational DB',
    content: () => (
      <p>
        I use MySQL for managing structured data with complex relationships. 
        Ensuring data integrity and optimizing SQL queries are core parts of 
        my backend lifecycle management.
      </p>
    )
  },
  { 
    name: 'PostgreSQL', 
    category: 'Databases', 
    slug: 'postgresql',
    description: 'Advanced Relational DB',
    content: () => (
      <p>
        PostgreSQL is my choice for advanced relational features and 
        data reliability. Its support for JSONB and complex analytical 
        functions makes it incredibly versatile.
      </p>
    )
  },
  { 
    name: 'MongoDB', 
    category: 'Databases', 
    slug: 'mongodb',
    description: 'NoSQL Document Store',
    content: () => (
      <p>
        For unstructured or rapidly changing data, I use MongoDB. 
        Its flexible document schema allows for fast iteration and 
        easy horizontal scaling.
      </p>
    )
  },
  { 
    name: 'Docker', 
    category: 'Tools', 
    slug: 'docker',
    description: 'Containerization',
    content: () => (
      <p>
        Docker ensures my software runs identically in any environment. 
        I containerize applications to simplify deployment, scaling, 
        and management in CI/CD pipelines.
      </p>
    )
  },
  { 
    name: 'Airflow', 
    category: 'Tools', 
    slug: 'apacheairflow',
    description: 'Workflow orchestration',
    content: () => (
      <p>
        I use Apache Airflow to programmatically author, schedule, 
        and monitor complex data workflows, ensuring reliable data delivery 
        for analysis and AI.
      </p>
    )
  },
  { 
    name: 'Git', 
    category: 'Tools', 
    slug: 'git',
    description: 'Version control',
    content: () => (
      <p>
        Git is the backbone of my collaborative workflow. 
        I maintain clean commit histories and manage branches effectively 
        to ensure seamless team integration.
      </p>
    )
  },
  { 
    name: 'CI/CD', 
    category: 'Tools', 
    slug: 'githubactions',
    description: 'Automation pipeline',
    content: () => (
      <p>
        I implement CI/CD pipelines using GitHub Actions to automate 
        testing and deployment, reducing manual errors and 
        speeding up the shipping process.
      </p>
    )
  },
  { 
    name: 'Linux', 
    category: 'Tools', 
    slug: 'linux',
    description: 'Operating system',
    content: () => (
      <p>
        I am proficient in Linux environments, often using them for 
        server management, scripting, and development tasks 
        where stability and control are required.
      </p>
    )
  },
  { 
    name: 'Vercel', 
    category: 'Tools', 
    slug: 'vercel',
    description: 'Deployment platform',
    content: () => (
      <p>
        Vercel is my preferred platform for deploying frontend applications. 
        It provides lightning-fast performance and seamless 
        integration with my development workflow.
      </p>
    )
  },
  { 
    name: 'Three.js', 
    category: '3D & Graphics', 
    slug: 'threedotjs',
    description: '3D Web graphics',
    content: () => (
      <p>
        Three.js allows me to bring 3D experiences to the browser. 
        Whether it&apos;s a creative portfolio or a complex visualization, 
        I use it to push the boundaries of traditional web UI.
      </p>
    )
  },
  { 
    name: 'WebGL', 
    category: '3D & Graphics', 
    slug: 'webgl',
    description: 'Low-level graphics',
    content: () => (
      <p>
        WebGL provides the power of GPU-accelerated graphics in the web. 
        I use it to build performance-critical visualizations 
        and immersive 3D simulations.
      </p>
    )
  },
  { 
    name: 'MediaPipe', 
    category: '3D & Graphics', 
    slug: 'google',
    description: 'ML for media',
    content: () => (
      <p>
        I use MediaPipe for high-performance ML solutions such as 
        hand tracking and pose estimation, often integrating them 
        into interactive, gesture-controlled web apps.
      </p>
    )
  },
  { 
    name: 'Unreal Engine', 
    category: '3D & Graphics', 
    slug: 'unrealengine',
    description: 'Real-time 3D creation',
    content: () => (
      <p>
        Beyond the web, I explore real-time graphics with Unreal Engine. 
        It&apos;s my tool for high-fidelity 3D environments, VR experiences, 
        and professional simulations.
      </p>
    )
  },
  { 
    name: 'Firebase', 
    category: 'Tools', 
    slug: 'firebase',
    description: 'BaaS & Auth',
    content: () => (
      <p>
        I use Firebase for rapid backend development, specifically for 
        Authentication, Real-time Databases, and Cloud Functions, 
        ensuring secure and scalable user management.
      </p>
    )
  },
  { 
    name: 'Render', 
    category: 'Tools', 
    slug: 'render',
    description: 'Cloud Hosting',
    content: () => (
      <p>
        Render is my choice for hosting full-stack applications and 
        background services. Its seamless deployment and zero-downtime 
        updates make it a reliable partner for production code.
      </p>
    )
  },
];

const CATEGORY_COLORS = {
  'Languages':    '139, 92, 246',   // violet
  'AI / ML':      '236, 72, 153',   // pink
  'Backend':      '6, 182, 212',    // cyan
  'Databases':    '251, 146, 60',   // orange
  'Tools':        '52, 211, 153',   // emerald
  '3D & Graphics':'248, 113, 113',  // red
};

// ─── 3D Skill Node Component ─────────────────────────────
const SkillNode3D = ({ skill, index, total, onClick, activeId }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Create an ultra-wide grid layout
  const cols = typeof window !== 'undefined' && window.innerWidth < 768 ? 4 : 8;
  const spacingX = 4.2;
  const spacingY = 4.2;
  const row = Math.floor(index / cols);
  const col = index % cols;
  
  // Center the grid dynamically
  const totalRows = Math.ceil(total / cols);
  const lastRowItems = total % cols || cols;
  
  const isLastRow = row === totalRows - 1;
  const currentCols = isLastRow ? lastRowItems : cols;
  
  const x = (col - (currentCols - 1) / 2) * spacingX;
  const y = ((totalRows - 1) / 2 - row) * spacingY;
  
  const colorStr = CATEGORY_COLORS[skill.category] || '139, 92, 246';
  const color = `rgb(${colorStr})`;

  const slugStr = typeof skill.slug === 'string' ? skill.slug : String(skill.slug);
  const imgSrc = (slugStr.includes('/') || slugStr.startsWith('data:')) 
    ? skill.slug 
    : `https://cdn.simpleicons.org/${skill.slug}/white`;

  // Animating the rotation on hover
  useFrame((state) => {
    if (meshRef.current) {
      if (hovered && !activeId) {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (state.pointer.x * Math.PI) / 6, 0.1);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -(state.pointer.y * Math.PI) / 6, 0.1);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0.5, 0.1);
      } else {
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.05);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.05);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0, 0.05);
      }
    }
  });

  return (
    <group position={[x, y, 0]}>
      <RoundedBox
        ref={meshRef}
        args={[3.6, 3.6, 0.6]} 
        radius={0.3}
        smoothness={4}
        onClick={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          if (!activeId) onClick(skill, e);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (!activeId) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshStandardMaterial 
          color="#141417" 
          metalness={0.7} 
          roughness={0.3} 
          emissive={color}
          emissiveIntensity={hovered && !activeId ? 0.35 : 0.02}
        />
        
        {/* Project HTML strictly on front face */}
        <Html position={[0, 0, 0.31]} transform center distanceFactor={1.5} style={{ pointerEvents: 'none' }}>
           <div className="flex flex-col items-center justify-center p-2 select-none" style={{ width: '220px', pointerEvents: 'none' }}>
              <img 
                 src={imgSrc} 
                 alt={skill.name}
                 style={{ 
                   width: '100px', 
                   height: '100px', 
                   objectFit: 'contain', 
                   filter: hovered && !activeId ? `drop-shadow(0 0 45px ${color})` : 'drop-shadow(0 0 20px rgba(0,0,0,0.8))',
                   transition: 'filter 0.3s ease'
                 }}
              />
              <span style={{
                marginTop: '18px',
                fontSize: '18px',
                fontWeight: '800',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#fff',
                textAlign: 'center',
                opacity: hovered && !activeId ? 1 : 0.3,
                transition: 'opacity 0.3s ease'
              }}>
                {skill.name}
              </span>
           </div>
        </Html>
      </RoundedBox>
    </group>
  );
};


const Skills = () => {
  const [active, setActive] = useState(null);
  const gridRef = useRef(null);
  const activeRef = useRef(null);
  const id = useId();

  // Handle click outside to close
  useOutsideClick(activeRef, () => setActive(null));

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.reveal-cube');
      cards.forEach(card => card.style.setProperty('--glow', '0'));
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!gridRef.current || active) return;
    const cards = gridRef.current.querySelectorAll('.reveal-cube');
    if (cards.length === 0) return;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCx = rect.left + rect.width / 2;
      const cardCy = rect.top + rect.height / 2;
      const dx = e.clientX - cardCx;
      const dy = e.clientY - cardCy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      const maxRadius = 300; 
      const intensity = Math.max(0, 1 - dist / maxRadius);

      card.style.setProperty('--glow', intensity);
      card.style.setProperty('--cx', `${relX}px`);
      card.style.setProperty('--cy', `${relY}px`);
    });
  }, [active]);

  const handleMouseLeave = useCallback(() => {
    if (!gridRef.current) return;
    gridRef.current.querySelectorAll('.reveal-cube').forEach((card) => {
      card.style.setProperty('--glow', '0');
    });
  }, []);

  return (
    <section id="skills" className="skills-section">
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[1001] p-4">
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={activeRef}
              className="w-full max-w-[500px] flex flex-col bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative">
                <motion.button
                  className="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white/70 hover:text-white transition-colors"
                  onClick={() => setActive(null)}
                >
                  <CloseIcon />
                </motion.button>
                
                <motion.div 
                  layoutId={`icon-container-${active.name}-${id}`}
                  className="h-48 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent pt-8"
                >
                   <img 
                      src={ (typeof active.slug === 'string' && (active.slug.includes('/') || active.slug.startsWith('data:'))) ? active.slug : `https://cdn.simpleicons.org/${active.slug}`} 
                      alt={active.name}
                      className="w-24 h-24 object-contain filter drop-shadow-[0_0_20px_rgba(var(--color),0.5)]"
                      style={{ '--color': CATEGORY_COLORS[active.category] }}
                    />
                </motion.div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <motion.h3
                      layoutId={`name-${active.name}-${id}`}
                      className="text-2xl font-bold text-white tracking-tight"
                    >
                      {active.name}
                    </motion.h3>
                    <motion.p
                      layoutId={`category-${active.category}-${id}`}
                      className="text-white/40 text-sm uppercase tracking-widest font-semibold"
                    >
                      {active.category}
                    </motion.p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter" style={{ backgroundColor: `rgba(${CATEGORY_COLORS[active.category]}, 0.2)`, color: `rgb(${CATEGORY_COLORS[active.category]})` }}>
                    {active.description}
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-white/70 text-sm leading-relaxed"
                >
                  {typeof active.content === "function" ? active.content() : active.content}
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="skills-container">
        <div className="skills-header">
           <motion.h2 
             className="section-title text-5xl md:text-6xl mb-4"
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
           >
             Tech <span className="highlight">Stack</span>
           </motion.h2>
           <p className="skills-hint">Move your cursor across the grid & click to explore</p>
         </div>

         <div className="skills-canvas-container" style={{ minHeight: '85vh', width: '100vw', position: 'relative', left: '50%', right: '50%', marginLeft: '-50vw', marginRight: '-50vw' }}>
           <Canvas 
             camera={{ position: [0, 0, typeof window !== 'undefined' && window.innerWidth < 768 ? 38 : 22], fov: 45 }}
             style={{ pointerEvents: active ? 'none' : 'auto' }}
           >
             <Suspense fallback={null}>
               <ambientLight intensity={0.5} />
               <directionalLight position={[10, 10, 10]} intensity={1.5} />
               <pointLight position={[-10, -10, -10]} intensity={1.0} color="#8b5cf6" />
               <pointLight position={[0, 10, 5]} intensity={0.5} color="#ec4899" />
               
               <group position={[0, 0, 0]}>
                 {SKILLS.map((skill, i) => (
                   <SkillNode3D 
                     key={skill.name} 
                     skill={skill} 
                     index={i} 
                     total={SKILLS.length} 
                     onClick={(s) => setActive(s)}
                     activeId={active ? active.name : null}
                   />
                 ))}
               </group>
               
               <ContactShadows position={[0, -7.5, 0]} opacity={0.6} scale={60} blur={3.5} far={15} color="#000000" />
             </Suspense>
           </Canvas>
         </div>
      </div>
    </section>
  );
};

export const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

export default Skills;
