// Single source of truth for all site content.
// Edit here to update the site; components read from these exports.

export const profile = {
  name: "Abhay Singh Thakur",
  location: "New York",
  status: "Open to SWE / ML roles",
  email: "thakur22429s@gmail.com",
  linkedin: "https://www.linkedin.com/in/abhay-singh-thakur/",
  github: "https://github.com/thakur22429s",
  resume: "/resume.pdf",
};

export const hero = {
  photo: "/abhay.jpg",
  // Role line under the name - <em class="t|g|r"> accent spans per role.
  roles: [
    { text: "software engineer", accent: "t" },
    { text: " · " },
    { text: "machine learning engineer", accent: "g" },
    { text: " · " },
    { text: "graduate researcher", accent: "r" },
  ] as { text: string; accent?: "t" | "g" | "r" }[],
  lede:
    "I recently earned my Master's in Computer Science at Rutgers (May 2026), specializing in AI and machine learning. I lectured the ML Principles course, did graduate research in 3D object detection, and ship my own products on the side.",
};

export const about = {
  paragraph:
    "I recently completed my Master's in Computer Science at Rutgers University (May 2026), specializing in AI and Machine Learning. At Rutgers I lectured the undergraduate Machine Learning Principles course and worked on graduate research in 3D object detection, fusing LIDAR and camera sensor data. Before that, I earned my B.S. in Computer Science and Data Science at Purdue University, where I built backend services used by 10,000+ students and taught Data Structures and Algorithms as an undergraduate TA. I have also interned at Pacific Northwest National Lab, automating infrastructure for security research testbeds with Terraform and Ansible. Outside of coursework and research, I ship my own products - including a Flutter app live on the Apple App Store - and build full-stack and ML projects ranging from RAG-based medication safety tools to deep learning pipelines for sports video. Hackathons got me started (1st place at Purdue Hackers' Hackathon, top 10 at BoilerMake VIII), and that habit of building things end-to-end has stuck. I am currently looking for software engineering and machine learning roles where I can keep doing exactly that.",
  facts: [
    { k: "Now", v: "M.S. Computer Science, Rutgers - AI/ML (May 2026)" },
    { k: "Doing", v: "Interviewing for SWE / ML roles · building side projects" },
    { k: "Before", v: "Purdue CS · PNNL (US DOE) · Purdue backend engineering" },
    { k: "Shipped", v: "Nocta - live on the Apple App Store" },
    { k: "Offscreen", v: "Photography · badminton · Airbnb host" },
  ],
};

export type Experience = {
  role: string;
  org: string;
  place: string;
  period: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "Graduate Research Assistant",
    org: "Rutgers University",
    place: "New Brunswick, NJ",
    period: "Jun 2025 - Aug 2025",
    points: [
      "Engineered a high-throughput pipeline for 3D object detection fusing LIDAR and camera data, improving localization accuracy 25% over baseline.",
      "Built backend modules that auto-generate 3D bounding-box metadata from raw sensor inputs, cutting manual annotation ~40%.",
      "Implemented geometric transformation services with 98% reprojection accuracy using configurable camera intrinsics/extrinsics.",
    ],
  },
  {
    role: "Lecturer / Teaching Assistant",
    org: "Rutgers University",
    place: "New Brunswick, NJ",
    period: "2024 - Present",
    points: [
      "Lecture the undergraduate Machine Learning Principles course - supervised learning, model evaluation, neural networks.",
      "Run weekly office hours and help sessions, improving overall class performance and engagement.",
    ],
  },
  {
    role: "Graduate Teaching Assistant",
    org: "Rutgers University",
    place: "New Brunswick, NJ",
    period: "2024",
    points: [
      "Led graduate-level Data Structures & Algorithms for 40+ master's students - dynamic programming, graph theory, complexity.",
      "Held weekly sessions assisting 20+ students/week with problem-solving and Java assignments.",
    ],
  },
  {
    role: "Software Engineer",
    org: "Purdue University",
    place: "West Lafayette, IN",
    period: "Aug 2022 - Jul 2023",
    points: [
      "Built and maintained Circuit, a Java backend integrated with Brightspace LMS via REST APIs, enabling anonymous peer review for 10,000+ students.",
      "Designed API contracts and integration patterns handling edge cases for concurrent submissions; wrote JUnit test suites.",
      "Built Variate, a STEM assessment platform on PostgreSQL generating per-student randomized problem sets.",
    ],
  },
  {
    role: "Software Developer Intern",
    org: "Pacific Northwest National Lab (US DOE)",
    place: "Richland, WA",
    period: "Jun 2022 - Oct 2022",
    points: [
      "Automated provisioning with Terraform and Ansible, cutting deployment time 3× and saving 130+ hours/year across research teams.",
      "Deployed on-prem testbeds to simulate and monitor system behavior under threat scenarios.",
      "Cut infrastructure storage costs 20% through IaC tooling and disciplined configuration management.",
    ],
  },
  {
    role: "Undergraduate Teaching Assistant",
    org: "Purdue University",
    place: "West Lafayette, IN",
    period: "Aug 2021 - May 2023",
    points: [
      "TA'd CS 251 Data Structures & Algorithms - developed curriculum and graded for 200+ students.",
      "Held 3+ weekly office hours resolving student queries and debugging assignments.",
    ],
  },
];

export const education = [
  {
    school: "Rutgers University",
    degree: "M.S. Computer Science - AI/ML",
    period: "Jan 2024 - May 2026",
  },
  {
    school: "Purdue University",
    degree: "B.S. Computer Science & Data Science (Dean's List)",
    period: "Aug 2019 - Aug 2023",
  },
];

export const skills = [
  { group: "Languages", items: ["Python", "Java", "TypeScript", "JavaScript", "C++", "C", "SQL", "Dart", "Bash"] },
  { group: "ML / Data", items: ["PyTorch", "HuggingFace", "MediaPipe", "scikit-learn", "NumPy", "Pandas", "OpenCV", "TensorFlow"] },
  { group: "Web", items: ["Next.js", "React", "Node", "Spring Boot", "Flask", "Django", "GraphQL", "Tailwind", "REST", "OpenAPI"] },
  { group: "Infra / Cloud", items: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "pgvector", "Docker", "Kubernetes", "AWS", "GCP", "Terraform", "Ansible", "GitHub Actions", "Jenkins"] },
  { group: "Mobile", items: ["Flutter", "Riverpod", "Firebase"] },
  { group: "Testing / Tools", items: ["JUnit", "pytest", "Mockito", "Git", "Postman", "Datadog", "Linux"] },
];

export type Project = {
  id: string;
  color: string;
  category: string;
  title: string;
  short?: string; // compact label for the neuron node (falls back to title)
  blurb: string; // one-line, for quick scan
  detail: string; // full description shown in the project card
  tech: string; // display string
  tags: string[]; // normalized tech tags - the basis for neuron connections
  link?: string;
  linkLabel?: string;
};

// Every project is a neuron; two neurons wire together when they share a tech
// tag (see computeEdges). The layout is force-directed at runtime.
export const projects: Project[] = [
  {
    id: "det", color: "#84B3AC", category: "Perception", title: "3D Object Detection", short: "3D Detection",
    blurb: "LIDAR + camera fusion for autonomous perception, improving localization accuracy 25% over baseline.",
    detail:
      "Graduate research at Rutgers on 3D object detection that fuses LIDAR point clouds with camera imagery for autonomous perception. I engineered a high-throughput sensor pipeline that improved localization accuracy 25% over baseline, plus backend modules that auto-generate 3D bounding-box metadata from raw sensor inputs, cutting manual annotation time roughly 40%. Geometric transformation services map sensor data into world coordinates at 98% reprojection accuracy using configurable camera intrinsics and extrinsics. I explored PointPillars and BEVFusion baselines with custom fusion-head ablations, validated on KITTI and cross-checked on nuScenes.",
    tech: "PyTorch · OpenCV · NumPy · Rutgers research", tags: ["python", "pytorch", "opencv"],
  },
  {
    id: "pharma", color: "#BBA0A0", category: "Safety", title: "PharmaGuard",
    blurb: "A distilled language model + RAG that warns before medications collide, across 1M+ interactions.",
    detail:
      "A RAG-based medication-interaction detector that flags dangerous drug combinations before they happen. It pairs a distilled language model (PubMedBERT distilled into DistilBERT via knowledge distillation) with retrieval over 1M+ interaction entries, using all-MiniLM-L6-v2 sentence embeddings and a FAISS index served behind a REST API with structured JSON. I evaluated it on top-5 retrieval accuracy, MRR@10, and the faithfulness of generated explanations against the retrieved source snippets.",
    tech: "Python · HuggingFace · FAISS · sentence-transformers", tags: ["python", "huggingface", "rag"], link: "https://github.com/thakur22429s/DrugLM", linkLabel: "GitHub",
  },
  {
    id: "badminton", color: "#A2B295", category: "Sport", title: "Badminton-Sense",
    blurb: "Classifies badminton strokes from broadcast video using pose estimation and sequence models.",
    detail:
      "A deep-learning pipeline that classifies badminton strokes from broadcast video. BWF match footage is clipped per stroke, run through MediaPipe pose extraction, hip-center and torso-length normalized, resampled to 30 frames, then fed to a BiLSTM or a Spatial-Temporal Transformer for 10-class stroke prediction. Trained on ShuttleSet (36,492 strokes across 44 professional matches). The key finding: at this data scale the 527K-param BiLSTM (macro-F1 0.213) beats the larger Transformer, which collapses to majority-class prediction, while distant broadcast camera angles cap pose detection near 42%.",
    tech: "PyTorch · MediaPipe · scikit-learn · Streamlit", tags: ["python", "pytorch", "mediapipe", "scikit"], link: "https://github.com/thakur22429s/BadmintonSense", linkLabel: "GitHub",
  },
  {
    id: "nocta", color: "#C9B79A", category: "Shipped", title: "Nocta",
    blurb: "A card-deck social discovery app for college students, live on the Apple App Store.",
    detail:
      "A card-deck social discovery app for college students, live on the Apple App Store (originally shipped as Deqd, since rebranded). Built in Flutter and Dart with Riverpod for state management and Firebase for auth, Firestore, and Cloud Functions. It reached low-hundreds of early organic downloads.",
    tech: "Flutter · Dart · Riverpod · Firebase", tags: ["flutter", "dart", "firebase"], link: "https://apps.apple.com/us/app/nocta/id6758424070", linkLabel: "App Store",
  },
  {
    id: "acp", color: "#939CB0", category: "In flight", title: "ACP",
    blurb: "An AI career platform surfacing role and skill matches with RAG over your profile.",
    detail:
      "AI Career Platform - a RAG product that surfaces role and skill matches against a user's profile. It ingests a profile, embeds it, and runs embedding-based job and skill search alongside conversational guidance. Built on Next.js (App Router), Tailwind, and Supabase (Postgres + auth + pgvector). Pre-MVP: auth and ingestion are working, retrieval is in progress.",
    tech: "Next.js · Supabase · pgvector · Tailwind", tags: ["nextjs", "typescript", "supabase", "pgvector", "rag", "tailwind"],
  },
  {
    id: "boardroom", color: "#BE9B85", category: "In flight", title: "Investor Boardroom",
    blurb: "Pitch to a panel of AI investor personas that grill you in character and return a structured critique.",
    detail:
      "An LLM-driven pitch-practice simulator. A founder pitches a deck to a configurable panel of AI investor personas - growth VC, technical VC, angel - each grilling in character with role-consistent Q&A, then returning a structured critique. Built on Next.js and Supabase with streaming LLM responses. Currently a working prototype.",
    tech: "Next.js · Supabase · streaming LLM", tags: ["nextjs", "typescript", "supabase", "llm"],
  },
  {
    id: "apex", color: "#9DB0AE", category: "Data", title: "Apex Analytics",
    blurb: "An F1 telemetry dashboard processing 2GB+ of data with interactive Plotly/Dash visualizations.",
    detail:
      "An F1-style telemetry analytics dashboard. A Python/Pandas ingestion pipeline normalizes and stores 2GB+ of telemetry in PostgreSQL behind a Flask REST API, while an interactive Plotly/Dash frontend serves real-time heatmaps and performance comparisons across event conditions, with endpoints for both event-level and aggregate queries.",
    tech: "Python · Flask · Dash · PostgreSQL", tags: ["python", "flask", "dash", "postgres"],
  },
  {
    id: "circle", color: "#A8A2B5", category: "Social", title: "Purdue Circle",
    blurb: "A student social app on a headless GraphQL CMS, cutting response payloads by 60%.",
    detail:
      "A student social and networking app built with an Agile team. User queries flow through Next.js into a headless GraphQL CMS, cutting response payload size 60% and serving across platforms via Tailwind. A popularity engine reaches 70%+ accuracy using features like posts, timelines, direct messaging, and reactions.",
    tech: "Next.js · React · GraphQL · TypeScript", tags: ["nextjs", "react", "graphql", "typescript", "tailwind"],
  },
  {
    id: "magpie", color: "#BFB49A", category: "Recs", title: "Movie Magpie",
    blurb: "A recommendation system over 10k+ films with Firebase-backed profiles and feedback.",
    detail:
      "A movie recommender hitting 78% accuracy over a database of 10k+ films, driven by user parameters like genre, release date, ratings, and popularity. Firebase-backed CRUD saves recommendations, creates user profiles, and captures feedback on prediction accuracy. Built with React and Material UI.",
    tech: "React · Material UI · Firebase", tags: ["react", "firebase"],
  },
  {
    id: "arb", color: "#B0A48F", category: "Markets", title: "Betting Arbitrage",
    blurb: "Scrapes odds from 10+ books to surface 1-5% arbitrage opportunities in real time.",
    detail:
      "A sports-betting arbitrage bot that scrapes odds from 10+ books, analyzes real-time price differences, and surfaces 1-5% arbitrage opportunities, processing 1,000+ odds entries a day. Selenium and BeautifulSoup handle scraping into PostgreSQL, with NumPy/Pandas analysis and beta ML models for odds prediction and human-like automation. React frontend.",
    tech: "Python · Selenium · PostgreSQL · React", tags: ["python", "react", "selenium", "postgres"],
  },
  {
    id: "myshell", color: "#9AA0A6", category: "Systems", title: "MyShell",
    blurb: "A Unix-style shell interpreter in C++ with piping, redirection, and job control via Flex + Bison.",
    detail:
      "A Unix-style shell interpreter written in C++, reimplementing behavior from bash and csh across 10+ features: autocomplete, command history, environment variables, subshells, piping, and redirection. Flex generates the scanner and Bison the parser for the shell grammar.",
    tech: "C++ · Flex · Bison", tags: ["cpp"],
  },
];

// Two neurons connect when they share tech; edge weight = number shared.
export function computeEdges(): { a: number; b: number; w: number }[] {
  const edges: { a: number; b: number; w: number }[] = [];
  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const shared = projects[i].tags.filter((t) => projects[j].tags.includes(t));
      if (shared.length) edges.push({ a: i, b: j, w: shared.length });
    }
  }
  return edges;
}

export type Shot = {
  t: string;
  d: string;
  img: string; // CSS background (gradient placeholder for now)
  exif: [string, string, string];
};

// Life section - the film viewfinder scroll.
export const shots: Shot[] = [
  { t: "Photography", d: "Golden hour on the fire escape - the light I keep chasing.", img: "linear-gradient(160deg,#3a2c22,#FF7A45)", exif: ["ISO 400", "f/2.0", "1/125"] },
  { t: "Host notes", d: "The apartment I quietly turned into an Airbnb, and everyone it brought through.", img: "linear-gradient(160deg,#10242a,#2FD9C6)", exif: ["ISO 800", "f/1.8", "1/60"] },
  { t: "Badminton", d: "Match nights, and the smash that never quite lands.", img: "linear-gradient(160deg,#232a1c,#9FD05C)", exif: ["ISO 200", "f/4.0", "1/250"] },
];
