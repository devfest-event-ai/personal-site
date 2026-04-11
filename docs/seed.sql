-- Portfolio V2.0 — Turso Seed Data
-- Run AFTER schema.sql: turso db shell racharta-portfolio < docs/seed.sql

-- ─── Projects ────────────────────────────────────────────────────────────────
INSERT INTO projects (title, slug, description, stack, preview_url) VALUES
(
  'Intelligent Invoice Tracker',
  'invoice-tracker',
  'Automated OCR-based system that extracts invoice data from Gmail attachments and populates a structured Google Sheets ledger — eliminating manual data entry for finance teams.',
  '["n8n","Gemini Vision","Gmail API","Google Sheets"]',
  '/workflows/invoice-tracker.png'
),
(
  'Context-Aware AI Agent',
  'ai-chatbot-smkdev',
  'Telegram AI tutor built for SMKDEV learners, featuring Simple Memory for coherent multi-turn conversations. Students can ask follow-up questions without losing context across sessions.',
  '["n8n","Telegram Bot API","Gemini Pro","LLM Memory"]',
  '/workflows/ai-chatbot-smkdev.png'
),
(
  'Multi-Persona Work Assistant',
  'persona-assistant',
  'Task orchestrator that adapts communication tone and structure based on the selected persona (Engineer, Project Manager, or Casual) via dynamic system prompting — one workflow, three personalities.',
  '["n8n","Dynamic Prompting","HTTP Request","Node Automation"]',
  '/workflows/persona-assistant.png'
);

-- ─── Writing ─────────────────────────────────────────────────────────────────
INSERT INTO writing (title, category, description, url, published_date) VALUES
(
  'How AI Agents Will Transform Work in 2025',
  'Strategy',
  'A strategic analysis of how autonomous AI agents are shifting from assistant tools to active workflow participants — and what that means for productivity professionals.',
  'https://www.linkedin.com/newsletters/racharta',
  '2025-01-10'
),
(
  'Building Modern LLM Applications with LangChain',
  'Technical Tutorial',
  'Step-by-step guide to building production-grade LLM pipelines using LangChain: prompt templates, memory chains, and tool integration for real automation use cases.',
  'https://www.linkedin.com/newsletters/racharta',
  '2025-02-18'
),
(
  'Exploring AI''s Journey: From Content Creation to Autonomous Execution',
  'Analysis',
  'Tracing the evolution of AI from text generators to autonomous execution engines — and how curriculum designers can stay ahead by teaching workflow automation alongside AI literacy.',
  'https://www.linkedin.com/newsletters/racharta',
  '2025-03-05'
);

-- ─── Publications ─────────────────────────────────────────────────────────────
INSERT INTO publications (title, journal, published_date, abstract, doi_url, type) VALUES
(
  'Challenges of Digital Transformation: IT Managers'' Experiences',
  'International Journal of Information Management',
  '2025-01-15',
  'This study examines the lived experiences of IT managers navigating enterprise digital transformation, identifying key friction points in change management, legacy system integration, and workforce upskilling.',
  NULL,
  'journal'
),
(
  'The Power of Data Analysis in the Era of AI & Robotics',
  'Journal of Applied Technology & Innovation',
  '2025-06-01',
  'Explores the expanding role of data analysis practitioners as AI and robotics redefine industrial workflows, with emphasis on human-AI collaboration frameworks and curriculum implications.',
  NULL,
  'journal'
),
(
  'Cited as Subject Matter Expert — AI Curriculum Design',
  'UIN Jakarta — Research on Vocational AI Education',
  '2025-03-20',
  'Rachmawati Ari Taurisia cited as industry SME on practical AI automation curriculum design for vocational and professional training contexts.',
  NULL,
  'citation'
),
(
  'Cited as Subject Matter Expert — n8n Workflow Automation',
  'STAIDDI — Digital Innovation Whitepaper',
  '2025-04-10',
  'Referenced as a practitioner authority on no-code/low-code workflow automation, specifically n8n implementations in educational and SME productivity contexts.',
  NULL,
  'citation'
);

-- ─── Speaking ─────────────────────────────────────────────────────────────────
INSERT INTO speaking (title, provider, event_date, role, description, link, modules) VALUES
(
  'Menjadi Produktif Tanpa Ribet dengan Asisten Kerja Otomatis',
  'EUDEKA x SMKDEV',
  '2025-10-01',
  'Lead Instructor & Curriculum Designer',
  'A premium, deep-dive session for professionals focusing on production-ready n8n blueprints. Participants are guaranteed to leave with 2 fully functional custom workflows built during the session.',
  'https://goakal.com/smkdev/productivity-workflow-automation-ai-assistant',
  '[
    {
      "title": "Smart Email Assistant",
      "desc": "Build an automated invoice and contract extraction pipeline from Gmail to Google Sheets using Gemini Vision OCR."
    },
    {
      "title": "Task Reminder Engine",
      "desc": "Sync Google Sheets task deadlines to Telegram or Slack with intelligent scheduling and priority-based notification logic."
    }
  ]'
);
