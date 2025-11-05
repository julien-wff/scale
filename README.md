# Scale - AI-Powered Call for Tenders Analysis Platform

**Scale** is an intelligent platform that automates the analysis and qualification of project call for tenders using advanced AI capabilities. Upload tender documents, get instant insights, and prioritize opportunities based on comprehensive scoring.

<img width="1629" height="1105" alt="image" src="https://github.com/user-attachments/assets/f6826ba3-dbe6-4a01-96c7-d54a1ba542e1" />

## 🎯 Overview

Scale transforms how organizations handle project opportunities by automatically extracting, analyzing, and scoring tender documents. The platform combines a powerful **n8n-based backend** with a modern **SvelteKit frontend** to deliver actionable intelligence from PDF tender documents.

### Key Capabilities

-   **🤖 Automated Document Processing**: Upload PDF call for tenders and let AI extract all relevant information
-   **📊 Multi-Dimensional Scoring**: Get comprehensive temperature scores across Budget, Technical, Timing, and Geographic dimensions
-   **🔍 Smart Search & Filtering**: Find opportunities by keywords, technologies, or temperature ranges
-   **💰 Budget Intelligence**: Automatic calculation of billing, costs, margins, and profitability ratios
-   **⚡ Real-Time Processing**: Track document processing status with live updates
-   **📈 Priority Recommendations**: AI-generated recommendations (High Priority, Medium Priority, Low Priority)

---

## 🏗️ Architecture

### Backend (n8n)

The backend leverages **n8n workflow automation** to orchestrate the entire analysis pipeline:

-   **PDF Processing**: Extract text and structure from tender documents
-   **AI Analysis**: Multiple AI agents analyze different aspects:
    -   Budget & Financial modeling
    -   Technical requirements & technology stack
    -   Timeline & urgency assessment
    -   Geographic & logistics considerations
-   **Temperature Calculation**: Multi-factor scoring algorithm (0-100 scale)
-   **Database Storage**: PostgreSQL for project metadata and analysis results
-   **API Endpoints**: RESTful API for project CRUD operations

### Frontend (SvelteKit)

Modern, responsive UI built with:

-   **SvelteKit** (Svelte 5) - Reactive framework
-   **Tailwind CSS v4** - Utility-first styling
-   **shadcn-svelte** - Beautiful, accessible components
-   **Lucide Icons** - Consistent iconography
-   **TypeScript** - Type-safe development

---

## 📋 Extracted Information

Scale automatically extracts and structures the following information from tender documents:

### 📄 Project Metadata

-   **Title** - Project name
-   **Company** - Issuing organization
-   **Description** - Short and detailed descriptions
    -   Context & Objectives
    -   Expected Results & Impact
    -   Additional Details

### 🌍 Geographic Information

-   **Location** - Project site/region
-   **Type** - On-site, Remote, or Hybrid
-   **Logistics Details** - Travel, accommodation requirements

### ⏱️ Timeline

-   **Start Date** - Project kick-off (e.g., "ASAP", specific dates)
-   **Duration** - Project length (e.g., "6 months", "12 months")
-   **Urgency** - Time-sensitivity assessment

### 💻 Technical Requirements

-   **Technologies** - Required tech stack (e.g., Python, React, AWS)
-   **Expertise Level** - Junior, Mid-level, Senior, Expert
-   **Number of Positions** - Team size requirements
-   **Internal Fit** - Match assessment with internal capabilities

### 💰 Budget Analysis

-   **Billing**
    -   Total billing amount
    -   Daily rate per profile
    -   Total working days
    -   Number of profiles
-   **Costs**
    -   Salary costs
    -   Logistics costs
    -   Overhead costs
    -   Risk buffer
    -   Total costs
-   **Profitability**
    -   Gross margin (€)
    -   Net margin (€)
    -   Profitability ratio (%)
    -   Break-even status

### 🌡️ Temperature Scores (0-100 scale)

Each opportunity receives granular scoring across four dimensions:

-   **Budget Temperature** (0-25°) - Financial attractiveness
-   **Technical Temperature** (0-25°) - Technical fit & feasibility
-   **Timing Temperature** (0-25°) - Schedule alignment & urgency
-   **Geographic Temperature** (0-25°) - Location convenience

**Global Temperature** (0-100°) aggregates all dimensions with AI-generated priority recommendation.

---

## ✨ Features

### 📤 Upload & Processing

-   Drag-and-drop PDF upload
-   Real-time processing status
-   Background processing with notifications
-   Support for multiple simultaneous uploads

### 🔎 Smart Filtering

-   **Search** - Full-text search across titles, descriptions, technologies
-   **Technology Filter** - Filter by specific tech stacks
-   **Temperature Range** - Min/max temperature sliders
-   **Sort Options** - High→Low or Low→High temperature

### 📊 Project Dashboard

-   **Card View** - Compact project cards with key info
-   **Temperature Visualization** - Color-coded vertical bars
-   **Technology Tags** - At-a-glance tech stack
-   **Quick Stats** - Start date, duration, company

### 📖 Detailed Project Dialog

-   **Comprehensive Overview** - Full description sections
-   **Temperature Breakdown** - Individual dimension scores
-   **Key Metrics** - Location, timeline, profile, budget insights
-   **Technology List** - Complete tech stack badges
-   **Budget Details** - Billing, costs, margins, profitability
-   **PDF Access** - Direct link to original document

### 🗑️ Project Management

-   **Delete Confirmation** - Safe deletion with confirmation dialog
-   **Keyboard Shortcuts** - Delete key for quick actions
-   **Refresh** - Manual or auto-refresh for processing status

---

## 🚀 Getting Started

### Prerequisites

-   **Bun** (or Node.js)
-   Backend API running (n8n workflow + PostgreSQL)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd scale

# Install dependencies
bun install
```

### Configuration

Create a .env file in the project root:

```env
PUBLIC_API_URL=https://your-n8n-api.example.com/webhook/
```

If `PUBLIC_API_URL` is not set, the UI falls back to a local mock (projects.json).

### Development

```bash
# Run dev server
bun run dev

# Open http://localhost:5173
```

### Production

```bash
# Build for production
bun run build

# Preview production build
bun run preview
```

---

## 📁 Project Structure

```
scale/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn-svelte components
│   │   │   └── # Custom components
│   │   ├── api.ts               # API client
│   │   ├── types.ts             # TypeScript types
│   │   └── utils.ts             # Utility functions
│   ├── routes/
│   │   ├── +page.svelte         # Main dashboard
│   │   └── +layout.svelte
│   ├── app.css                  # Global styles
│   └── app.html
├── static/
│   └── mock/                    # Mock data for development
├── .env                         # Environment configuration
├── svelte.config.js
├── vite.config.ts
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

-   **SvelteKit** - Full-stack framework
-   **Svelte 5** - Reactive UI with runes
-   **TypeScript** - Type safety
-   **Tailwind CSS v4** - Utility-first CSS
-   **shadcn-svelte** - Component library
-   **Lucide Icons** - Icon set
-   **Bun** - Fast package manager & runtime

### Backend (n8n)

-   **n8n** - Workflow automation

---

## 📡 API Endpoints

### `GET /projects`

Fetch all projects with metadata and analysis results.

**Response:**

```json
[
  {
    "project_id": "uuid",
    "project_state": "PROCESSED",
    "project_meta": {
      "title": "...",
      "company_name": "...",
      "temperatures": { ... },
      "metrics": { ... },
      "budget": { ... }
    },
    "original_file_name": "tender.pdf",
    "createdAt": "2025-01-09T11:00:00Z",
    "updatedAt": "2025-01-09T11:19:00Z"
  }
]
```

### `POST /upload`

Upload a PDF tender document for processing.

**Request:**

```
Content-Type: multipart/form-data
data: <file>
```

### `DELETE /project`

Delete a project by ID.

**Request:**

```json
{
    "id": "project-uuid"
}
```

### `GET /pdf?id=<project_id>`

Download the original PDF document.

---

## 🎨 UI Components

### shadcn-svelte Components

Pre-configured components include:

-   **Layout**: Sidebar, Separator, ScrollArea
-   **Forms**: Input, Textarea, Select, Label, Form
-   **Feedback**: Skeleton, Progress, Tooltip, Badge
-   **Overlays**: Dialog, Sheet, AlertDialog
-   **Data**: Card, Avatar, Breadcrumb

Add more components:

```bash
bunx --bun shadcn-svelte add <component>
```

### Icons

All icons from `@lucide/svelte`:

```ts
import Plus from '@lucide/svelte/icons/plus';
import Thermometer from '@lucide/svelte/icons/thermometer';
```

---

## 🔧 Development

### Add shadcn Components

```bash
bunx --bun shadcn-svelte add button
bunx --bun shadcn-svelte add card
```

### Type Safety

All API responses and UI components are fully typed with TypeScript.

### Styling

Tailwind CSS v4 with custom color palette defined in app.css.

---

## 📝 Environment Variables

| Variable         | Description          | Default               |
| ---------------- | -------------------- | --------------------- |
| `PUBLIC_API_URL` | Backend API base URL | `''` (uses mock data) |

---

## 🐛 Troubleshooting

### Upload fails

-   Verify `PUBLIC_API_URL` is set correctly
-   Check CORS configuration on backend
-   Ensure n8n workflow is active

### Components not rendering

-   Run `bun install` to ensure all dependencies are installed
-   Check browser console for errors

### Backend connection issues

-   Verify backend is running and accessible
-   Check network tab for API request failures

---

## 📚 Resources

-   **SvelteKit**: https://kit.svelte.dev
-   **shadcn-svelte**: https://shadcn-svelte.com
-   **Tailwind CSS**: https://tailwindcss.com
-   **n8n**: https://n8n.io

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ using SvelteKit, n8n, and AI**
