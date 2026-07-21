// Seeds the Supabase database with the platform's initial sample content
// (experts, projects, mentors, knowledge articles, courses).
//
// Usage:
//   1) Create a .env file in the project root with:
//        NEXT_PUBLIC_SUPABASE_URL=...
//        SUPABASE_SERVICE_ROLE_KEY=...   <-- from Supabase dashboard, Project Settings > API
//   2) Run:  node --env-file=.env scripts/seed.mjs
//
// The service role key is required (not the anon key) because this script
// bypasses Row Level Security to insert data directly. NEVER expose the
// service role key in client-side code or commit it to git.

import { createClient } from '@supabase/supabase-js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const data = require('./seed-data.cjs');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log('Seeding expert_profiles...');
  const { error: expertsErr } = await supabase.from('expert_profiles').insert(
    data.experts.map((e) => ({
      name: e.name,
      title: e.title,
      country: e.country,
      city: e.city,
      field: e.field,
      years_experience: e.exp,
      skills: e.skills,
      languages: e.languages,
      bio: e.bio,
      avatar_emoji: e.avatar,
      available: e.available,
      is_verified: true, // sample data is pre-verified for demo purposes
    }))
  );
  if (expertsErr) console.error('experts error:', expertsErr.message);

  console.log('Seeding projects...');
  const { error: projectsErr } = await supabase.from('projects').insert(
    data.projects.map((p) => {
      const budgetNums = (p.budget.match(/\d+/g) || []).map(Number);
      return {
        title: p.title,
        description: p.desc,
        field: p.field,
        budget_min: budgetNums[0] ?? null,
        budget_max: budgetNums[1] ?? null,
        duration: p.duration,
        work_type: p.type,
        status: p.status,
      };
    })
  );
  if (projectsErr) console.error('projects error:', projectsErr.message);

  console.log('Seeding knowledge_articles...');
  const { error: articlesErr } = await supabase.from('knowledge_articles').insert(
    data.knowledge.map((k) => ({
      author_name: k.author,
      title: k.title,
      description: k.desc,
      field: k.field,
      icon: k.icon,
    }))
  );
  if (articlesErr) console.error('articles error:', articlesErr.message);

  console.log('Seeding courses...');
  const { error: coursesErr } = await supabase.from('courses').insert(
    data.courses.map((c) => ({
      instructor_name: c.instructor,
      title: c.title,
      country: c.country,
      field: c.field,
      duration: c.duration,
      level: c.level,
      student_count: c.students,
      format: c.format,
      icon: c.icon,
    }))
  );
  if (coursesErr) console.error('courses error:', coursesErr.message);

  console.log('Done. Check the Supabase Table Editor to confirm rows were inserted.');
}

main();
