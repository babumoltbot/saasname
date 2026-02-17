// SaaSName MVP - Express Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store for demo (in production, use a database)
const generatedNames = new Map();

// Mock data generators (replace with real APIs in production)

// Generate names using AI-like logic
function generateNames(idea, count = 10) {
    const keywords = extractKeywords(idea);
    const names = [];
    
    const prefixes = ['Link', 'Post', 'Content', 'Creator', 'Schedule', 'Grow', 'Smart', 'Easy', 'Quick', 'Auto', 'Cloud', 'Hub'];
    const suffixes = ['ly', 'io', 'app', 'pro', 'hub', 'box', 'tool', 'flow', 'wise', 'central'];
    
    // Generate variations
    keywords.forEach(keyword => {
        prefixes.forEach(prefix => {
            if (names.length < count) {
                names.push({
                    name: prefix + keyword,
                    tagline: `The ${prefix + keyword} solution for ${keyword}`,
                    description: `The ultimate ${keyword} tool for professionals.`
                });
            }
        });
    });
    
    // Fill with creative names if needed
    const creativeNames = [
        { name: 'NameForge', tagline: 'Forge your perfect name', description: 'AI-powered naming for SaaS' },
        { name: 'Brandable', tagline: 'Names that stick', description: 'Memorable names for memorable products' },
        { name: 'NameGenius', tagline: 'Genius names, generated', description: 'Smart naming for smart founders' },
        { name: 'SaaSNamer', tagline: 'Name your SaaS right', description: 'Purpose-built naming for SaaS' },
        { name: 'Moniker', tagline: 'Your name, your brand', description: 'Professional naming for professionals' }
    ];
    
    while (names.length < count) {
        const creative = creativeNames[names.length % creativeNames.length];
        names.push(creative);
    }
    
    return names.slice(0, count);
}

// Extract keywords from idea
function extractKeywords(idea) {
    const words = idea.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !['that', 'with', 'this', 'from', 'have', 'will', 'would', 'could', 'should', 'what', 'when', 'where', 'which', 'their', 'there', 'these', 'those'].includes(word));
    
    return [...new Set(words)].slice(0, 5);
}

// Mock domain checker
function checkDomain(name) {
    const extensions = ['.com', '.io', '.app', '.dev', '.co', '.ai'];
    const results = extensions.map(ext => {
        const domain = name.toLowerCase() + ext;
        // Mock: 70% availability
        const available = Math.random() > 0.3;
        return {
            domain: domain,
            available: available,
            price: available ? '$12-15/year' : 'Taken'
        };
    });
    return results;
}

// Mock social media checker
function checkHandles(name) {
    const platforms = [
        { name: 'Twitter/X', handle: name.toLowerCase(), url: `https://x.com/${name.toLowerCase()}` },
        { name: 'LinkedIn', handle: name.toLowerCase(), url: `https://linkedin.com/company/${name.toLowerCase()}` },
        { name: 'Instagram', handle: name.toLowerCase(), url: `https://instagram.com/${name.toLowerCase()}` }
    ];
    
    return platforms.map(p => ({
        platform: p.name,
        handle: `@${p.handle}`,
        available: Math.random() > 0.4, // 60% available mock
        url: p.url
    }));
}

// Calculate brand score
function calculateBrandScore(name) {
    let score = 50; // Base score
    
    // Short names score higher
    if (name.length <= 6) score += 15;
    else if (name.length <= 10) score += 10;
    
    // Easy to pronounce bonus
    if (/^[a-z]+$/i.test(name)) score += 10;
    
    // No numbers bonus
    if (!/\d/.test(name)) score += 5;
    
    // Easy to spell (no double letters)
    if (!/(.)\1/i.test(name)) score += 5;
    
    // Alliteration bonus (same starting letter for compound names)
    if (/^[A-Z][a-z]+[A-Z]/.test(name)) score += 5;
    
    return Math.min(100, score);
}

// API Routes

// Generate names from SaaS idea
app.post('/api/generate-names', (req, res) => {
    const { idea, count = 10 } = req.body;
    
    if (!idea || idea.trim().length < 10) {
        return res.status(400).json({ 
            error: 'Please provide a detailed SaaS idea (at least 10 characters)' 
        });
    }
    
    const names = generateNames(idea, count);
    const keywords = extractKeywords(idea);
    
    res.json({
        success: true,
        idea: idea,
        keywords: keywords,
        names: names,
        timestamp: new Date().toISOString()
    });
});

// Check domain availability
app.post('/api/check-domain', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const domains = checkDomain(name);
    const available = domains.filter(d => d.available);
    
    res.json({
        success: true,
        name: name,
        domains: domains,
        summary: {
            total: domains.length,
            available: available.length,
            unavailable: domains.length - available.length
        }
    });
});

// Check social media handles
app.post('/api/check-handles', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const handles = checkHandles(name);
    const available = handles.filter(h => h.available);
    
    res.json({
        success: true,
        name: name,
        handles: handles,
        summary: {
            total: handles.length,
            available: available.length,
            unavailable: handles.length - available.length
        }
    });
});

// Get brand score
app.post('/api/brand-score', (req, res) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    
    const score = calculateBrandScore(name);
    
    let rating;
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Fair';
    else rating = 'Needs Work';
    
    res.json({
        success: true,
        name: name,
        score: score,
        rating: rating,
        factors: [
            { name: 'Length', score: name.length <= 6 ? 'Good (short)' : name.length <= 10 ? 'Fair (medium)' : 'Needs Work (long)' },
            { name: 'Pronunciation', score: /^[a-z]+$/i.test(name) ? 'Easy' : 'Moderate' },
            { name: 'Spelling', score: !/(.)\1/i.test(name) ? 'Easy' : 'Contains doubles' },
            { name: 'Characters', score: !/\d/.test(name) ? 'Letters only' : 'Contains numbers' }
        ]
    });
});

// Comprehensive validation
app.post('/api/validate', (req, res) => {
    const { idea } = req.body;
    
    if (!idea) {
        return res.status(400).json({ error: 'SaaS idea is required' });
    }
    
    const names = generateNames(idea, 10);
    const validatedNames = names.map(n => {
        const domains = checkDomain(n.name);
        const handles = checkHandles(n.name);
        const score = calculateBrandScore(n.name);
        
        return {
            ...n,
            domains: domains,
            handles: handles,
            brandScore: score,
            rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work',
            overallScore: Math.round((score + (domains.filter(d => d.available).length / domains.length * 20) / 2)
        };
    });
    
    // Sort by overall score
    validatedNames.sort((a, b) => b.overallScore - a.overallScore);
    
    res.json({
        success: true,
        idea: idea,
        timestamp: new Date().toISOString(),
        names: validatedNames
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
🚀 SaaSName API Server Running!
   
   Local:   http://localhost:${PORT}
   Health:  http://localhost:${PORT}/api/health
   
   Endpoints:
   - POST /api/generate-names   - Generate name suggestions
   - POST /api/check-domain   - Check domain availability
   - POST /api/check-handles  - Check social handles
   - POST /api/brand-score   - Calculate brand score
   - POST /api/validate      - Full validation
   
   Demo mode: Using mock data (replace with real APIs in production)
   `);
});

module.exports = app;
