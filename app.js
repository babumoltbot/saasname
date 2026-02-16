// SaaSName MVP - Simple Name Generator
// This is a proof-of-concept for name generation

const namePrefixes = {
    professional: ['Link', 'Post', 'Content', 'Creator', 'Schedule', 'Grow'],
    friendly: ['Panda', 'Chef', 'Wizard', 'Snap', 'Flow', 'Easy'],
    action: ['Post', 'Schedule', 'Grow', 'Build', 'Create', 'Plan'],
    descriptive: ['Tool', 'App', 'Hub', 'Studio', 'Lab', 'Box']
};

const nameSuffixes = {
    professional: ['Pro', 'Hub', 'Hub', 'Studio', 'Works'],
    friendly: ['ly', 'io', 'app', 'go', 'ify'],
    descriptive: ['er', 'ly', 'ify', 'wise', 'central']
};

const domainExtensions = ['.com', '.io', '.app', '.dev'];

// Simple name generator (without AI)
function generateNames(idea, count = 5) {
    const keywords = extractKeywords(idea);
    const names = [];
    
    // Generate combinations
    keywords.forEach(keyword => {
        namePrefixes.professional.forEach(prefix => {
            nameSuffixes.friendly.forEach(suffix => {
                if (names.length < count * 2) {
                    const name = prefix + keyword + suffix;
                    if (!names.includes(name)) {
                        names.push(name);
                    }
                }
            });
        });
    });
    
    // Return random selection
    return names.slice(0, count);
}

// Extract simple keywords from idea
function extractKeywords(idea) {
    const words = idea.toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);
    
    // Return unique keywords (limit to 5)
    return [...new Set(words)].slice(0, 5);
}

// Check domain availability (mock - would use real API)
async function checkDomain(name) {
    // This would integrate with Namecheap/GoDaddy API
    return {
        name: name,
        available: Math.random() > 0.3, // Mock result
        extensions: domainExtensions.map(ext => ({
            domain: name + ext,
            available: Math.random() > 0.5
        }))
    };
}

// Main function
async function validateName(idea) {
    const names = generateNames(idea, 10);
    const results = [];
    
    for (const name of names) {
        const domainCheck = await checkDomain(name);
        results.push({
            name: name,
            domain: domainCheck,
            score: Math.floor(Math.random() * 40) + 60 // Mock score 60-100
        });
    }
    
    return results.sort((a, b) => b.score - a.score);
}

// Export for use
module.exports = { generateNames, validateName, checkDomain };
