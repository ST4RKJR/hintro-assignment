# Hintro Mock Server

Mock server for testing Hintro backend APIs.


## Users

Two users are available for testing:

| User ID | Description |
|---------|-------------|
| `u1` | Returns empty responses (new user with no data) |
| `u2` | Returns randomized data (active user) |

To switch users, pass `x-user-id` header.

## Endpoints

### Profile

```
GET /api/auth/profile
Headers: x-user-id: u1 | u2
```

Returns user profile data.

**Response (u1):**
```json
{
  "id": "u1",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "login_method": "google",
  "status": "active",
  "is_hintro_admin": false,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-06-20T14:30:00Z"
}
```

---

### Dashboard

```
GET /api/auth/dashboard
Headers: x-user-id: u1 | u2
```

Returns user data with subscription and usage info.

**Response (u1 - empty):**
```json
{
  "user": { ... },
  "subscription": null,
  "usage": {
    "kb_files": { "used": 0, "limit": 100, "percentage": 0 },
    "vocab_terms": 0,
    "notes": 0
  }
}
```

**Response (u2 - with data):**
```json
{
  "user": { ... },
  "subscription": {
    "plan": "professional",
    "billing_cycle": "monthly",
    "status": "active"
  },
  "usage": {
    "kb_files": { "used": 181, "limit": 1000, "percentage": 34 },
    "vocab_terms": 104,
    "notes": 24
  }
}
```

---

### Call Session Stats

```
GET /api/call-sessions/stats
Headers: x-user-id: u1 | u2
```

Returns call statistics.

**Response (u1 - empty):**
```json
{
  "totalSessions": 0,
  "averageDuration": 0,
  "totalAIInteractions": 0,
  "lastSession": []
}
```

**Response (u2 - randomized):**
```json
{
  "totalSessions": 126,
  "averageDuration": 2211,
  "totalAIInteractions": 16,
  "lastSession": [
    "2026-05-09T14:15:59.550Z",
    "2026-05-07T05:39:52.481Z",
    "2026-04-09T23:23:31.808Z"
  ]
}
```

**Data ranges (u2 only):**
- `totalSessions`: 1-200 (random)
- `averageDuration`: 1-8000 seconds (random)
- `totalAIInteractions`: 1-70 (random)
- `lastSession`: Array of 3 dates (within last 60 days)

---

### Call History

```
GET /api/call-sessions?limit=N
Headers: x-user-id: u1 | u2
```

Returns list of call sessions with pagination.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Number of sessions to return |

**Response (u1 - empty):**
```json
{
  "callSessions": [],
  "pagination": {
    "page": 1,
    "limit": 3,
    "totalCount": 0,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Response (u2 - randomized):**
```json
{
  "callSessions": [
    {
      "_id": "cs1",
      "user_id": "u2",
      "status": "ended",
      "client": "Acme Corp",
      "description": "Product demo",
      "started_at": "2026-04-29T03:38:35.444Z",
      "ended_at": "2026-04-29T04:43:06.444Z",
      "total_duration_seconds": 3871,
      "language": ["en"],
      "auto_gen_ai_response": false,
      "save_transcript": true,
      "transcript": null,
      "transcript_final": false,
      "ai_interactions": 2,
      "call_framework_id": null,
      "participants": [
        { "name": "Jane Smith", "isUser": true },
        { "name": "Client", "isUser": false }
      ],
      "ended_reason": "user_ended",
      "createdAt": "2026-04-29T03:38:35.444Z",
      "updatedAt": "2026-04-29T04:43:06.444Z"
    }
  ],
  "pagination": { ... }
}
```

**Data ranges (u2 only):**
- Random clients: Acme Corp, TechStart, BigCorp, StartupXYZ, Enterprise Inc, etc.
- Random descriptions: Sales call, Product demo, Discovery call, etc.
- Random durations: 300-3600 seconds
- Random dates within last 60 days

---

## Postman Collection

Import `postman-collection.json` into Postman for quick testing.

Variables:
- `baseUrl`: the api url provided in the assignment
- `userId`: u1 or u2
- `limit`: number of sessions

---

# Hintro Frontend Dashboard

This directory contains the premium, modern **Hintro Frontend Dashboard** built as a Single Page Application (SPA) using React, Vite, TypeScript, and Vanilla CSS. It connects to the live Hintro Mock API and showcases advanced audio metrics, call transcriptions, and interactive elements.

## 🚀 Tech Stack & Design Choices

- **Vite + React + TypeScript:** Scaffolded for lightning-fast bundling, component architecture, and full type safety.
- **Vanilla CSS Tokens:** Implemented a robust theme configuration using pure CSS custom variables. Avoids bulky utility classes and supports a premium dark mode by default.
- **Lucide Icons:** Premium, minimalist stroke icons matching modern Figma layouts.
- **Micro-animations & Particles:** Includes smooth transition interpolations, floating interactive elements, radial circular progress gauges, and programmatically generated CSS-particle confetti upon feedback submission.
- **LocalStorage Integrations:** Multi-step feedback responses are stringified and logged in `localStorage`, maintaining complete history records across reloads.

## 📦 Getting Started

To launch the frontend dashboard locally, make sure you have **Node.js (v18+)** and **npm** installed, then run:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Build for production (optional check)
npm run build
```

## ⚙️ Features Tour

1. **Floating User Toggle (Header):** Swap between **User 1 (John Doe)** to inspect the beautiful empty states, and **User 2 (Jane Smith)** to observe dynamic dashboard activities instantly.
2. **Theme Toggler (Header):** Smoothly slide between a stunning deep-neon dark mode and a sleek minimalist light mode.
3. **Radial File Limit Gauge (Dashboard):** An interactive SVG stroke progress controller tracking file usage percentages.
4. **Call History Ledger (Call History):** 
   - Search logs by client name or description.
   - Configure page layout sizes (limit queries) and paginations.
   - Click rows to expand an inline audio log mapping participant dialog bubbles and AI co-pilot insights.
5. **Multi-step Feedback Wizard (Sidebar):** An interactive flow triggering standard emojis scales, categories tags, text reviews, and email credentials with confetti success triggers.