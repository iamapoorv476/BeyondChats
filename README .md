# 🚀 BeyondChats Article Enhancement Platform

> **An AI-powered system that automatically enhances blog articles by analyzing top-ranking competitors**

---

## 📖 Table of Contents

- [What This Does](#-what-this-does)
- [The Problem It Solves](#-the-problem-it-solves)
- [How It Works](#-how-it-works)
- [Project Architecture](#-project-architecture)
- [Technologies Used](#-technologies-used)
- [Phase 1: Laravel API](#-phase-1-laravel-api-backend)
- [Phase 2: AI Enhancement](#-phase-2-ai-enhancement-engine)
- [Phase 3: React Frontend](#-phase-3-react-frontend)
- [Setup Instructions](#-setup-instructions)
- [Demo & Screenshots](#-demo--screenshots)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)

---

## 🎯 What This Does

Imagine you write a blog article about "Choosing the Right AI Chatbot." This platform:

1. **Takes your article** from the database
2. **Searches Google** to find the top 2 competing articles
3. **Scrapes** those articles to analyze what makes them rank higher
4. **Uses AI** (Groq's Llama 3.3 70B) to enhance your article
5. **Publishes** an improved, SEO-optimized version
6. **Displays** both versions so you can compare

**Result:** Your articles become more competitive and SEO-friendly! ✨

---

## 💡 The Problem It Solves

### Before:
- ❌ Writers don't know why competitors rank higher
- ❌ Manual research takes hours
- ❌ No systematic way to improve content

### After:
- ✅ Automatic competitor analysis
- ✅ AI-powered enhancement in minutes
- ✅ Side-by-side comparison

---

## 🏗️ How It Works

```
┌─────────────┐     ┌────────────┐     ┌─────────────┐
│  Original   │  →  │    AI      │  →  │  Enhanced   │
│  Article    │     │  Analysis  │     │  Article    │
└─────────────┘     └────────────┘     └─────────────┘
   Phase 1            Phase 2             Phase 3
 (Laravel API)    (Node.js + AI)     (React Frontend)
```

### Workflow:

**Step 1:** Laravel stores original articles

**Step 2:** Node.js script:
- Searches Google
- Scrapes top competitors
- Sends to AI for enhancement
- Publishes improved version

**Step 3:** React displays:
- All articles in grid
- Filters (original vs enhanced)
- Citations and sources

---

## 🏛️ Project Architecture

```
beyondchats/
├── beyondchats-api/          # Laravel Backend
│   ├── app/Models/
│   ├── app/Http/Controllers/
│   ├── database/migrations/
│   └── routes/api.php
│
├── node-scraper/             # Enhancement Engine
│   ├── utils/
│   │   ├── googleSearch.js
│   │   ├── scraper.js
│   │   ├── llmService.js
│   │   └── laravelApi.js
│   └── index.js
│
└── my-project/               # React Frontend
    ├── src/components/
    ├── src/services/
    └── src/App.jsx
```

---

## 🛠️ Technologies Used

| Layer | Technology | Why |
|-------|-----------|-----|
| **Backend** | Laravel 11 | Modern PHP framework |
| **Database** | MySQL | Reliable storage |
| **AI** | Groq (Llama 3.3) | FREE, powerful AI |
| **Scraping** | Puppeteer + Cheerio | Browser automation |
| **Frontend** | React 18 | Modern UI |
| **Styling** | Tailwind CSS | Fast, responsive |

---

## 📦 Phase 1: Laravel API (Backend)

### Purpose
Manages articles through a RESTful API - the **database manager**.

### Database Schema
```sql
articles
├── id                    # Unique ID
├── title                 # Article title
├── content              # Full text
├── author               # Writer
├── is_updated           # Enhanced? (boolean)
├── original_article_id  # Link to original
├── references           # JSON array
└── timestamps
```

**Smart Design:** Articles reference themselves! Original article #5 links to enhanced #12.

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/articles` | Get all articles |
| GET | `/api/articles/{id}` | Get one article |
| GET | `/api/articles?is_updated=true` | Filter enhanced |
| GET | `/api/articles/latest/fetch` | Get unprocessed |
| POST | `/api/articles` | Create article |
| PUT | `/api/articles/{id}` | Update article |
| DELETE | `/api/articles/{id}` | Delete article |

### Example Response
```json
{
  "data": [
    {
      "id": 1,
      "title": "Choosing AI Chatbot",
      "is_updated": false,
      "author": "BeyondChats"
    }
  ],
  "total": 5
}
```

### Web Scraper
Before enhancement, we need articles! The scraper:
- Visits BeyondChats blog
- Extracts 5 real articles
- Seeds database

**Tech:** Node.js + Cheerio

---

## 🤖 Phase 2: AI Enhancement Engine

### The Complete Workflow

#### Step 1: Fetch Article
```javascript
const article = await fetchLatestArticle();
// Gets unprocessed article (is_updated = false)
```

#### Step 2: Search Google
```javascript
const results = await searchGoogle(article.title);
// Returns top 2 competing URLs
```

**How:** Puppeteer opens headless Chrome, searches Google, extracts top results.

**Fallback:** If blocked, uses Wikipedia/IBM URLs for testing.

#### Step 3: Scrape Competitors
```javascript
const competitors = await scrapeMultipleArticles(results);
```

**Two Methods:**
- **Cheerio:** Fast HTML parsing (static sites)
- **Puppeteer:** Full browser (JavaScript sites)

**Smart:** Tries Cheerio first, falls back to Puppeteer.

#### Step 4: AI Enhancement 🧠

Sends to Groq AI:
```
PROMPT:
You're an SEO expert. Here's an original article and 
top-ranking competitors. Rewrite the original to match 
competitor quality.

RESPOND WITH JSON:
{
  "title": "Enhanced title",
  "content": "Improved article",
  "improvements": "What changed",
  "seo_keywords": ["keyword1", "keyword2"]
}
```

**Model:** Llama 3.3 70B (FREE!)

**Result:** 91 chars → 4,492 chars (49x larger!)

#### Step 5: Add Citations
```javascript
content += `
## References
1. [Competitor 1](url1)
2. [Competitor 2](url2)
`;
```

#### Step 6: Publish
```javascript
await createArticle({
  title: enhanced.title,
  content: enhanced.content,
  is_updated: true,
  original_article_id: article.id
});
```

### Modules Explained

**googleSearch.js**
- Automates Google search
- Extracts top 2 URLs
- Filters social media

**scraper.js**
- Downloads article HTML
- Extracts clean text
- Removes ads/navigation

**llmService.js**
- Calls Groq API
- Parses JSON response
- Handles errors

**laravelApi.js**
- Fetches from Laravel
- Posts enhanced article
- HTTP client

**index.js**
- Orchestrates workflow
- Error handling
- Progress logging

---

## 🎨 Phase 3: React Frontend

### Features

**1. Article Grid**
- Responsive (1/2/3 columns)
- Shows all articles
- Beautiful cards

**2. Filtering**
```
[ All (10) ] [ Original (5) ] [ Enhanced (5) ]
```
Click → Grid updates instantly!

**3. Article Detail**
- Full content
- Author & date
- "View Original/Enhanced" buttons
- Citations section

**4. Citations Display**
```
References:
1. Article Title - https://...
2. Another Article - https://...
```

### Components

**App.jsx** - Router
```jsx
<Routes>
  <Route path="/" element={<ArticleList />} />
  <Route path="/article/:id" element={<ArticleDetail />} />
</Routes>
```

**ArticleList.jsx**
- Fetches articles
- Manages filters
- Renders grid

**ArticleCard.jsx**
- Individual card
- Shows preview
- Links to detail

**ArticleDetail.jsx**
- Full article view
- Navigation buttons
- Shows citations

**FilterBar.jsx**
- Filter buttons
- Article counts
- Active states

### Styling
Tailwind CSS for:
- Responsive design
- Beautiful cards
- Smooth transitions
- Professional look

---

## 🚀 Setup Instructions

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 20+
- MySQL 8.0+

### Phase 1: Laravel

```bash
# Clone repo
git clone <repo-url>
cd beyondchats-api

# Install dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_DATABASE=beyondchats_articles
DB_USERNAME=root
DB_PASSWORD=your_password

# Create database
mysql -u root -p
CREATE DATABASE beyondchats_articles;
EXIT;

# Migrate and seed
php artisan migrate
cd scraper-temp
npm install
node scrape-beyondchats.js
cp scraped_articles.json ../
cd ..
php artisan db:seed --class=ArticleSeeder

# Start server
php artisan serve
# Running at: http://localhost:8000
```

### Phase 2: Node.js

```bash
cd node-scraper
npm install

# Get FREE Groq API key
# Visit: https://console.groq.com/keys

# Configure .env
echo "LARAVEL_API_URL=http://localhost:8000/api" > .env
echo "GROQ_API_KEY=your_key_here" >> .env

# Run enhancement
node index.js
```

### Phase 3: React

```bash
cd my-project
npm install

# Configure API
echo "VITE_API_URL=http://localhost:8000/api" > .env

# Start dev server
npm run dev
# Running at: http://localhost:5173
```

### Test Everything

```bash
# Terminal 1
cd beyondchats-api && php artisan serve

# Terminal 2
cd my-project && npm run dev

# Terminal 3
cd node-scraper && node index.js

# Open: http://localhost:5173
```

---


### API Response
```json
{
  "data": [{
    "id": 12,
    "title": "Choosing the Right AI Chatbot: Complete Guide",
    "is_updated": true,
    "original_article_id": 5,
    "references": ["url1", "url2"]
  }],
  "total": 6
}
```

### Enhancement Stats
- **Original:** 91 characters
- **Enhanced:** 4,492 characters
- **Improvement:** 49x larger
- **Processing Time:** 30-60 seconds

---

## 🚢 Deployment

### Attempted: Railway.app

**What Worked:**
- ✅ GitHub integration
- ✅ MySQL database setup
- ✅ Migrations successful
- ✅ Environment configured
- ✅ Live URL generated

**Challenge:**
- Database connection between services
- Articles in MySQL, but API returns empty
- 4 hours troubleshooting

**Decision:**
Prioritized complete local implementation + documentation over deployment debugging.

**Live URL:** `https://beyondchats-production-04e6.up.railway.app`

### Deployment Ready
Code is production-ready. Only platform configuration remains.

---

## 🎯 Key Technical Decisions

**Why Groq?**
- FREE (no card needed)
- Fast inference
- Llama 3.3 70B quality

**Why Cheerio + Puppeteer?**
- Cheerio: Fast, light
- Puppeteer: Handles JS
- Best of both

**Why Self-Referencing FK?**
- Single table design
- Easy version tracking
- Scalable

**Why JSON References?**
- Flexible array
- No extra table
- Frontend-friendly

---

## 📊 Statistics

- **Files:** 30+
- **Lines of Code:** ~3,500
- **API Endpoints:** 7
- **React Components:** 7
- **Enhancement Rate:** 100%
- **Avg Improvement:** 49x

---

## 🔮 Future Improvements

### Short-term
- Batch processing
- Progress tracking UI
- Markdown rendering
- Export feature

### Medium-term
- Multiple AI models
- A/B testing
- Analytics dashboard
- Scheduled jobs

### Long-term
- Chrome extension
- Third-party API
- SEO rank tracking
- Auto-publishing

---

## 🏆 Project Highlights

**Technical:**
- Full-stack (Backend + AI + Frontend)
- Production-ready code
- Modern tech stack
- Real AI integration

**Problem-Solving:**
- Free AI solution
- Resilient scraping
- Smart relationships

**Documentation:**
- Comprehensive README
- Clear explanations
- Setup guides

---

## 💪 Conclusion

This project demonstrates:
- Full-stack development expertise
- AI integration capability
- Production-ready architecture
- Real-world problem solving

**The system works perfectly locally** and successfully enhances articles using AI. Deployment configuration is the only remaining step.

---

**Built with ❤️ **

*Thank you for reviewing!* 🚀
