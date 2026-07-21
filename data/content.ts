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
  // Rendered with <em class="t|g|r"> accent spans on the highlighted words.
  headline: [
    { text: "Software engineer", accent: "t" },
    { text: ", " },
    { text: "machine learning engineer", accent: "g" },
    { text: ", and " },
    { text: "graduate researcher", accent: "r" },
    { text: "." },
  ] as { text: string; accent?: "t" | "g" | "r" }[],
  lede:
    "I'm Abhay — a Master's student in Computer Science at Rutgers (graduating May 2026), specializing in AI and machine learning. I lecture the ML Principles course, do graduate research in 3D object detection, and ship my own products on the side.",
};

export const about = {
  photo: "/abhay.jpg",
  paragraph:
    "I am a Master's student in Computer Science at Rutgers University (graduating May 2026), specializing in AI and Machine Learning. At Rutgers I lecture the undergraduate Machine Learning Principles course and have worked on graduate research in 3D object detection, fusing LIDAR and camera sensor data. Before that, I earned my B.S. in Computer Science and Data Science at Purdue University, where I built backend services used by 10,000+ students and taught Data Structures and Algorithms as an undergraduate TA. I have also interned at Pacific Northwest National Lab, automating infrastructure for security research testbeds with Terraform and Ansible. Outside of coursework and research, I ship my own products — including a Flutter app live on the Apple App Store — and build full-stack and ML projects ranging from RAG-based medication safety tools to deep learning pipelines for sports video. Hackathons got me started (1st place at Purdue Hackers' Hackathon, top 10 at BoilerMake VIII), and that habit of building things end-to-end has stuck. I am currently looking for software engineering and machine learning roles where I can keep doing exactly that.",
  facts: [
    { k: "Now", v: "M.S. Computer Science, Rutgers — AI/ML, grad May 2026" },
    { k: "Doing", v: "3D object-detection research · lecturing ML Principles" },
    { k: "Before", v: "Purdue CS · PNNL (US DOE) · Purdue backend engineering" },
    { k: "Shipped", v: "Nocta — live on the Apple App Store" },
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
    period: "Jun 2025 – Aug 2025",
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
    period: "2024 – Present",
    points: [
      "Lecture the undergraduate Machine Learning Principles course — supervised learning, model evaluation, neural networks.",
      "Run weekly office hours and help sessions, improving overall class performance and engagement.",
    ],
  },
  {
    role: "Graduate Teaching Assistant",
    org: "Rutgers University",
    place: "New Brunswick, NJ",
    period: "2024",
    points: [
      "Led graduate-level Data Structures & Algorithms for 40+ master's students — dynamic programming, graph theory, complexity.",
      "Held weekly sessions assisting 20+ students/week with problem-solving and Java assignments.",
    ],
  },
  {
    role: "Software Engineer",
    org: "Purdue University",
    place: "West Lafayette, IN",
    period: "Aug 2022 – Jul 2023",
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
    period: "Jun 2022 – Oct 2022",
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
    period: "Aug 2021 – May 2023",
    points: [
      "TA'd CS 251 Data Structures & Algorithms — developed curriculum and graded for 200+ students.",
      "Held 3+ weekly office hours resolving student queries and debugging assignments.",
    ],
  },
];

export const education = [
  {
    school: "Rutgers University",
    degree: "M.S. Computer Science — AI/ML",
    period: "Jan 2024 – May 2026",
  },
  {
    school: "Purdue University",
    degree: "B.S. Computer Science & Data Science (Dean's List)",
    period: "Aug 2019 – Aug 2023",
  },
];

export type Project = {
  id: string;
  x: number; // % position in the neural canvas
  y: number;
  color: string;
  category: string;
  title: string;
  blurb: string;
  tech: string;
  link?: string;
  linkLabel?: string;
};

// Flagship projects — rendered as the neural constellation.
export const projects: Project[] = [
  { id: "det", x: 18, y: 34, color: "#2FD9C6", category: "Perception", title: "3D Object Detection", blurb: "LIDAR + camera fusion for autonomous perception, improving localization accuracy 25% over baseline.", tech: "Rutgers Research · PyTorch · OpenCV" },
  { id: "pharma", x: 42, y: 60, color: "#FF6F9C", category: "Safety", title: "PharmaGuard", blurb: "A distilled language model + RAG that warns before medications collide, across 1M+ interactions.", tech: "Python · HuggingFace · FAISS", link: "https://github.com/thakur22429s/DrugLM", linkLabel: "GitHub" },
  { id: "badminton", x: 63, y: 26, color: "#9FD05C", category: "Sport", title: "Badminton-Sense", blurb: "Classifies badminton strokes from broadcast video using pose estimation and sequence models.", tech: "PyTorch · MediaPipe · BiLSTM", link: "https://github.com/thakur22429s/BadmintonSense", linkLabel: "GitHub" },
  { id: "nocta", x: 82, y: 50, color: "#FFC24B", category: "Shipped", title: "Nocta", blurb: "A card-deck social discovery app for college students, live on the Apple App Store.", tech: "Flutter · Firebase · iOS", link: "https://apps.apple.com/us/app/nocta/id6758424070", linkLabel: "App Store" },
  { id: "acp", x: 30, y: 82, color: "#7C86FF", category: "In flight", title: "ACP", blurb: "An AI career platform surfacing role and skill matches with RAG over your profile.", tech: "Next.js · Supabase · pgvector" },
  { id: "boardroom", x: 70, y: 80, color: "#FF7A45", category: "In flight", title: "Investor Boardroom", blurb: "Pitch to a panel of AI investor personas that grill you in character and return a structured critique.", tech: "Next.js · Supabase · LLM" },
];

// How flagship projects connect in the neural graph (indices into `projects`).
export const projectEdges: [number, number][] = [
  [0, 1], [0, 2], [1, 2], [2, 3], [3, 5], [4, 5], [1, 4], [1, 5], [2, 4],
];

// Older / additional work, listed compactly below the constellation.
export const moreProjects = [
  { title: "Apex Analytics", note: "F1 telemetry dashboard — 2GB+ processed, Flask + Plotly/Dash + PostgreSQL." },
  { title: "Sports Betting Arbitrage", note: "Scrapes odds from 10+ books to surface arbitrage opportunities." },
  { title: "Purdue Circle", note: "Student social app — Next.js + GraphQL, 60% smaller payloads." },
  { title: "Movie Magpie", note: "Recommendation system over 10k+ films with Firebase CRUD." },
  { title: "MyShell", note: "Unix-style shell interpreter in C++ with Flex + Bison." },
];

export type Shot = {
  t: string;
  d: string;
  img: string; // CSS background (gradient placeholder for now)
  exif: [string, string, string];
};

// Life section — the film viewfinder scroll.
export const shots: Shot[] = [
  { t: "Photography", d: "Golden hour on the fire escape — the light I keep chasing.", img: "linear-gradient(160deg,#3a2c22,#FF7A45)", exif: ["ISO 400", "f/2.0", "1/125"] },
  { t: "Host notes", d: "The apartment I quietly turned into an Airbnb, and everyone it brought through.", img: "linear-gradient(160deg,#10242a,#2FD9C6)", exif: ["ISO 800", "f/1.8", "1/60"] },
  { t: "Badminton", d: "Match nights, and the smash that never quite lands.", img: "linear-gradient(160deg,#232a1c,#9FD05C)", exif: ["ISO 200", "f/4.0", "1/250"] },
];
