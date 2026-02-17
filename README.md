# SaaSName - Validate Your SaaS Name

AI-powered SaaS name validator that helps founders validate and choose names for their SaaS ideas.

## Features

### Free Tier
- ✅ Describe your SaaS idea
- ✅ Generate 10 name suggestions
- ✅ Check domain availability (.com, .io, .app, .dev)
- ✅ Check social media handles
- ✅ Brand awareness scoring

### Pro Tier ($29 one-time or $9/mo)
- 🔒 Unlimited ideas
- 🔒 Full competitor analysis
- 🔒 Trademark check
- 🔒 PDF export report

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/babumoltbot/saasname.git
cd saasname
npm install
```

### Configuration

```bash
cp .env.example .env
# Edit .env and add your API keys
```

### Development

```bash
npm run dev
# Server runs at http://localhost:3000
```

### Production

```bash
npm start
```

## API Endpoints

### POST /api/validate
Validate a SaaS idea and get name suggestions.

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{"idea": "A tool for LinkedIn scheduling"}'
```

**Response:**
```json
{
  "success": true,
  "idea": "A tool for LinkedIn scheduling",
  "names": [
    {
      "name": "LinkSchedule",
      "tagline": "The LinkSchedule solution",
      "description": "The ultimate scheduling tool",
      "domains": [...],
      "handles": [...],
      "brandScore": 75,
      "rating": "Good"
    }
  ]
}
```

### GET /api/health
Health check endpoint.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port (default: 3000) | No |
| OPENAI_API_KEY | OpenAI API for AI names | No (uses mock data) |
| NAMECHAP_API_KEY | Namecheap API for domains | No (uses mock data) |

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** HTML/CSS/JS (vanilla)
- **APIs:** OpenAI (name generation), Namecheap (domains)

## Roadmap

- [x] Landing page
- [x] Basic name generation (mock AI)
- [x] Domain availability check (mock)
- [x] Social handle check (mock)
- [ ] Brand awareness algorithm
- [ ] OpenAI integration for real AI names
- [ ] Real domain API integration
- [ ] User accounts
- [ ] Stripe payments
- [ ] Trademark check (USPTO API)
- [ ] Competitor analysis

## Contributing

Pull requests welcome! Built by founders, for founders.

## License

MIT

---

*Validate your SaaS name before you build.*
