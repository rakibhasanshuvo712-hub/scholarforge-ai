# ScholarForge AI 🎓

An all-in-one academic productivity web app — **AI Presentation Maker, Lab Report Generator, and Assignment Builder** with built-in diagram generation (`mermaid`) and multi-format export (`.pptx`, `.docx`, `.pdf`).

---

## 🌟 Key Features

1. **Unified Academic Input Form**:
   - Modes: **Presentation Slides**, **Lab Report**, **Coursework Assignment**
   - Formal University Cover Page metadata inputs:
     - Student Name, Student ID, Department, Institution
     - Course Code & Title, Instructor Name, Date of Submission
   - Preset 1-click academic templates (Distributed Consensus, Quantum Cryptography, Database Normalization)
   - Code snippet embedding & slide/section depth slider

2. **AI Content & Diagram Engine**:
   - Google Gemini API (`@google/generative-ai`) returning strict structured JSON
   - Dynamic Offline Academic Engine fallback when offline or without an API key
   - Automatic valid **Mermaid.js** syntax generation for system architectures, workflows, and state transitions
   - In-browser SVG-to-Canvas-to-PNG rendering for crisp vector image embedding into exports

3. **Live Interactive Preview & Editor**:
   - **Presentation View**: 16:9 interactive slide deck with Next/Prev slide controls, slide selector strip, speaker notes drawer, and inline editing
   - **Academic Paper View**: Paginated document preview with formal university cover page, executive summary, structured sections, styled data tables, and code blocks
   - **Live Mermaid Editor**: Real-time syntax editing with immediate canvas re-render and compile diagnostics
   - 4 Scholarly Visual Themes: *Academic Classic*, *Modern Tech Dark*, *Oxford Crimson*, and *Emerald Scholar*

4. **One-Click Multi-Format Export**:
   - **Download PPTX**: Styled widescreen presentation deck with cover slide, bullet hierarchy, speaker notes, and embedded diagram images via `pptxgenjs`
   - **Download DOCX**: Fully styled Word document with formal academic cover page, borders, styled headings, data tables, and diagrams via `docx`
   - **Print / PDF**: Clean, paginated print layout with custom `@media print` CSS rules

---

## 🛠 Tech Stack

- **Framework:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS, Lucide React
- **AI Engine:** Google Gemini API (`@google/generative-ai`)
- **Diagrams:** `mermaid` (SVG & Canvas PNG conversion)
- **Document Exporters:** `pptxgenjs`, `docx`, `file-saver`

---

## 🚀 Getting Started

### 1. Set Active Workspace & Navigate
Set your workspace to:
`C:\Users\Rakib\.gemini\antigravity\scratch\scholar-forge-ai`

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

Or run the production build:
```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. (Optional) Configure Gemini API Key
You can pass your `GEMINI_API_KEY` either:
- In `.env.local`: `GEMINI_API_KEY=your_key_here`
- Directly in the UI under **"Configure Custom Gemini API Key"**
- Or use the built-in **Offline Academic Template Engine**, which works immediately out-of-the-box!
