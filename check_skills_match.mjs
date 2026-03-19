import fs from 'fs';

// Read data.ts
const dataContent = fs.readFileSync('lib/data.ts', 'utf-8');
const skillsMatch = dataContent.match(/export const skills = {([\s\S]*?)};/);
if (!skillsMatch) {
  console.log("Could not parse skills");
  process.exit(1);
}

// Very hacky parsing to just extract all strings inside `items: [...]` arrays
const itemsMatches = [...skillsMatch[1].matchAll(/items:\s*\[([^\]]+)\]/g)];
const allSkills = new Set();
itemsMatches.forEach(m => {
  const arr = m[1].split(',').map(s => s.trim().replace(/['"]/g, ''));
  arr.forEach(s => { if (s && !s.startsWith('/')) allSkills.add(s) });
});

// Read components/skills-physics.tsx
const physicsContent = fs.readFileSync('components/skills-physics.tsx', 'utf-8');
const techIconsMatch = physicsContent.match(/const TECH_ICONS: Record<string, string> = {([\s\S]*?)}/);
const mappedSkills = new Set();
if (techIconsMatch) {
  const matches = [...techIconsMatch[1].matchAll(/'([^']+)':/g)];
  matches.forEach(m => mappedSkills.add(m[1]));
}

let missing = [];
allSkills.forEach(s => {
  if (!mappedSkills.has(s)) missing.push(s);
});

console.log("Missing mappings:", missing.length > 0 ? missing : "None");
