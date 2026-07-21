import { createClient } from '@/lib/supabase/server';
import HomeClient from '@/components/HomeClient';

export const revalidate = 0; // always fetch fresh data

export default async function Home() {
  const supabase = await createClient();

  const [experts, projects, knowledge, courses] = await Promise.all([
    supabase.from('expert_profiles').select('*').order('created_at', { ascending: false }),
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('knowledge_articles').select('*').order('created_at', { ascending: false }),
    supabase.from('courses').select('*').order('created_at', { ascending: false }),
  ]);

  const initialData = {
    experts: experts.data || [],
    projects: projects.data || [],
    knowledge: knowledge.data || [],
    courses: courses.data || [],
  };

  return <HomeClient initialData={initialData} />;
}
