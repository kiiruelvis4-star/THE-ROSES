# THE ROSES - LITTLE ROSES ACADEMY 🌹
> **The Roses • Little Roses Academy Nakuru • CBC EduHub: Teach, Assess, Excel**

A comprehensive, offline-first Progressive Web App (PWA) and educational management platform built for teachers, learners, and administrators at Little Roses Academy under the Kenyan Competency-Based Curriculum (CBC).

---

## 🌟 Core System Modules & Features

1. **Executive Administration Dashboard**:
   - Master school records, staff allocation, and student roster management.
   - Comprehensive Document Centre with official rectangular school stamp, letterheads, and certificates.
   - Global CBE Evaluation module (Grades 1–6) across all rationalized learning areas.
   - Term calendar and examination date scheduling.
   - Full JSON database backup and restoration engine.

2. **Teacher Workstation**:
   - Automated Continuous Assessment Test (CAT) entry and real-time grading.
   - 4-Tier CBC Rubric scoring:
     - **EE** (Exceeding Expectation 80–100%)
     - **ME** (Meeting Expectation 65–79%)
     - **AE** (Approaching Expectation 50–64%)
     - **BE** (Below Expectation 0–49%)
   - Automated remarks generation and class performance analytics.
   - Dynamic weekly timetable and period tracking.
   - Schemes of work & lesson notes organizer.

3. **Learner & Parent Portal**:
   - Learner progress dashboard with subject breakdown.
   - Interactive revision quizzes with instant feedback and answer explanations.
   - CBC curriculum digital library & downloadable revision materials.
   - Weekly timetable schedule with active period highlight.

4. **Security & Role-Based Access Control (RBAC)**:
   - **Administrator**: Full WRITE clearance across official textbooks, curriculum repositories, timetable overrides, and school settings.
   - **Teachers**: Individual faculty logins with allocated subjects. READ-ONLY clearance on school-wide master materials and READ-WRITE on personal teaching modules.
   - **Zero On-Screen Credential Exposure**: All master keys and passwords are encrypted and masked in the user interface.

5. **PWA & Offline Capability**:
   - Service Worker caching for complete offline functionality in classrooms.
   - Installable on Android, iPhone/iPad, Windows, and Mac directly from the browser.
   - Native Android APK package bundled (`LittleRosesEduHub.apk`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed on your computer
- npm

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/kiiruelvis4/the-roses.git

# 2. Enter project folder
cd the-roses

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Building for Production & GitHub Pages

To create an optimized production build from root:

```bash
npm run build
```

This compiles all assets into the `dist/` directory.

### Deploying to GitHub Pages
When deploying under a GitHub repository subpath (e.g. `https://<username>.github.io/the-roses/`):

```bash
# Set your repository name as the base URL during build
VITE_BASE_URL=/the-roses/ npm run build
```

---

## 🔗 Connecting & Pushing to GitHub (THE ROSES)

To push this current version to the **THE ROSES** repository:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Commit your changes
git commit -m "feat: The Roses - Little Roses Academy consolidated release"

# 4. Set the main branch
git branch -M main

# 5. Connect your remote GitHub repository
git remote add origin https://github.com/kiiruelvis4/the-roses.git

# 6. Push to GitHub
git push -u origin main
```

---

## 📥 Downloading Source Code & App

1. **Source ZIP**: Download `LittleRosesEduHub-source.zip` directly from within the app interface or using Google AI Studio's **Export to ZIP** option.
2. **Android APK**: Download `LittleRosesEduHub.apk` directly from the app interface for direct Android installation.
3. **PWA**: Tap **"Install App"** directly in Chrome, Safari, or Edge on Android, iPhone, Windows, or Mac.

---

## 🏫 Little Roses Academy Nakuru
*Teach • Assess • Excel*
