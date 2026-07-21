'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from './Toast';
import Header from './Header';
import Hero from './Hero';
import ExpertCard from './ExpertCard';
import FeaturedCard from './FeaturedCard';
import ProjectCard from './ProjectCard';
import MentorCard from './MentorCard';
import KnowledgeCard from './KnowledgeCard';
import CourseCard from './CourseCard';
import ContactModal from './ContactModal';
import RegisterModal from './RegisterModal';

const TABS = [
  { key: 'experts', label: 'الكفاءات', icon: 'fa-users', color: 'green' },
  { key: 'projects', label: 'المشاريع والاستشارات', icon: 'fa-project-diagram', color: 'blue' },
  { key: 'mentors', label: 'الإرشاد المهني', icon: 'fa-hands-helping', color: 'orange' },
  { key: 'knowledge', label: 'مركز المعرفة', icon: 'fa-book-open', color: 'teal' },
  { key: 'courses', label: 'دورات تدريبية مجانية', icon: 'fa-graduation-cap', color: 'purple' },
];

const COUNTRY_OPTIONS = [
  'ألمانيا', 'تركيا', 'الولايات المتحدة', 'المملكة المتحدة', 'كندا', 'فرنسا',
  'السويد', 'هولندا', 'الإمارات', 'قطر', 'مصر', 'الأردن',
];

export default function HomeClient({ initialData }) {
  const [experts, setExperts] = useState(initialData?.experts || []);
  const [projects, setProjects] = useState(initialData?.projects || []);
  const [knowledge, setKnowledge] = useState(initialData?.knowledge || []);
  const [courses, setCourses] = useState(initialData?.courses || []);
  const [loading, setLoading] = useState(!initialData);

  const [tab, setTab] = useState('experts');
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [contactOpen, setContactOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const showToast = useToast();

  async function reload() {
    const supabase = createClient();
    setLoading(true);
    const [e, p, k, c] = await Promise.all([
      supabase.from('expert_profiles').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('knowledge_articles').select('*').order('created_at', { ascending: false }),
      supabase.from('courses').select('*').order('created_at', { ascending: false }),
    ]);
    setExperts(e.data || []);
    setProjects(p.data || []);
    setKnowledge(k.data || []);
    setCourses(c.data || []);
    setLoading(false);
  }

  useEffect(() => {
    if (!initialData) reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredExperts = useMemo(() => {
    let list = experts;
    if (search) {
      const k = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name?.includes(search) ||
          e.title?.includes(search) ||
          e.field?.includes(search) ||
          (e.skills || []).some((s) => s.toLowerCase().includes(k))
      );
    }
    if (countryFilter) list = list.filter((e) => e.country === countryFilter);
    return list;
  }, [experts, search, countryFilter]);

  function filterByCategory(label) {
    const fieldMap = {
      'تقنية المعلومات': 'تكنولوجيا المعلومات',
      'الهندسة والبنية التحتية': 'الهندسة',
      'الطب والعلوم الصحية': 'الصحة والطب',
    };
    const keyword = fieldMap[label] || label;
    setTab('experts');
    setSearch(keyword);
    document.getElementById('diaspora-experts')?.scrollIntoView({ behavior: 'smooth' });
    const hasMatch = experts.some(
      (e) => e.field?.includes(keyword) || e.title?.includes(keyword) || (e.skills || []).some((s) => s.includes(keyword))
    );
    if (!hasMatch) showToast('لا نتائج بعد', `لا توجد كفاءات مسجلة في "${label}" حالياً`, 'info');
  }

  const stats = {
    experts: experts.length,
    projects: projects.length,
    countries: new Set(experts.map((e) => e.country)).size,
  };

  return (
    <>
      <div className="diaspora-quick-stats diaspora-quick-stats-top">
        <div className="qstat-card">
          <div className="qstat-icon c-purple"><i className="fas fa-users" /></div>
          <div><div className="qstat-num">{stats.experts}</div><div className="qstat-lbl">كفاءة مسجلة</div></div>
        </div>
        <div className="qstat-card">
          <div className="qstat-icon"><i className="fas fa-rocket" /></div>
          <div><div className="qstat-num">{stats.projects}</div><div className="qstat-lbl">مشروع واستشارة</div></div>
        </div>
        <div className="qstat-card">
          <div className="qstat-icon c-orange"><i className="fas fa-graduation-cap" /></div>
          <div><div className="qstat-num">{courses.length}</div><div className="qstat-lbl">دورة ومحاضرة</div></div>
        </div>
        <div className="qstat-card">
          <div className="qstat-icon c-blue"><i className="fas fa-globe" /></div>
          <div><div className="qstat-num">{stats.countries}</div><div className="qstat-lbl">دولة حول العالم</div></div>
        </div>
        <div className="qstat-card">
          <div className="qstat-icon c-teal"><i className="fas fa-handshake" /></div>
          <div><div className="qstat-num">{experts.filter((e) => e.available).length}</div><div className="qstat-lbl">كفاءة متاحة الآن</div></div>
        </div>
      </div>

      <Header onContactClick={() => setContactOpen(true)} />
      <Hero onRegisterClick={() => setRegisterOpen(true)} />

      <div className="diaspora-search-card">
        <div className="dsf">
          <label>الاختصاص</label>
          <i className="fas fa-briefcase dsf-icon" />
          <select style={{ paddingRight: 22 }} value={search} onChange={(e) => setSearch(e.target.value)}>
            <option value="">اختر الاختصاص</option>
            <option>تكنولوجيا المعلومات</option><option>الهندسة</option><option>الصحة والطب</option>
            <option>التعليم</option><option>المحاسبة والمالية</option><option>الزراعة</option>
          </select>
        </div>
        <div className="dsf">
          <label>الدولة</label>
          <i className="fas fa-map-marker-alt dsf-icon" />
          <select style={{ paddingRight: 22 }} value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
            <option value="">اختر الدولة</option>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-green"
          onClick={() => {
            setTab('experts');
            document.getElementById('diaspora-experts')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <i className="fas fa-search" /> بحث
        </button>
      </div>

      <div className="quick-actions-bar">
        <div className="qa-btn pink" onClick={() => showToast('قريباً', 'قسم المجتمعات قيد التطوير', 'info')}>
          <i className="fas fa-users" /> المجتمعات
        </div>
        <div
          className="qa-btn teal"
          onClick={() => {
            setTab('projects');
            document.getElementById('diaspora-projects')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <i className="fas fa-chart-line" /> الاستثمار
        </div>
        <div
          className="qa-btn purple"
          onClick={() => {
            setTab('courses');
            document.getElementById('diaspora-courses')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <i className="fas fa-graduation-cap" /> نقل الخبرات
        </div>
      </div>

      <div className="diaspora-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`diaspora-tab ${t.color}${tab === t.key ? ' active' : ''}`}
            onClick={() => {
              setTab(t.key);
              document.getElementById(`diaspora-${t.key}`)?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <i className={`fas ${t.icon}`} style={{ marginLeft: 6 }} /> {t.label}
          </button>
        ))}
      </div>

      <div className="diaspora-section">
        <div className="diaspora-section-title">
          <h2><i className="fas fa-star" /> كفاءات مميزة من مجتمعنا</h2>
        </div>
        <div className="featured-scroll">
          {experts.slice(0, 6).map((ex) => (
            <FeaturedCard
              key={ex.id}
              expert={ex}
              onViewProfile={() => {
                setTab('experts');
                document.getElementById('diaspora-experts')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          ))}
        </div>
      </div>

      <div className="diaspora-section">
        <div className="map-specialty-grid">
          <div className="map-card">
            <div className="map-card-label"><i className="fas fa-satellite-dish" /> شبكة الكفاءات حول العالم</div>
            <img src="/images/logo-3.png" alt="خريطة شبكة الكفاءات حول العالم" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div className="specialty-card">
            <h3><i className="fas fa-chart-line" /> أبرز التخصصات المطلوبة</h3>
            <ul className="specialty-list">
              <li><span>الطب والعلوم الصحية</span></li>
              <li><span>الهندسة والبنية التحتية</span></li>
              <li><span>تقنية المعلومات والذكاء الاصطناعي</span></li>
              <li><span>التعليم والتطوير التربوي</span></li>
              <li><span>الإدارة والحوكمة</span></li>
              <li><span>الزراعة والأمن الغذائي</span></li>
              <li><span>الطاقة والبيئة</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="diaspora-section">
        <div className="category-icons-row">
          {[
            ['fa-lightbulb', 'ريادة الأعمال'], ['fa-seedling', 'الزراعة والبيئة'],
            ['fa-microscope', 'البحث العلمي'], ['fa-landmark', 'الإدارة والحوكمة'],
            ['fa-graduation-cap', 'التعليم'], ['fa-laptop-code', 'تقنية المعلومات'],
            ['fa-drafting-compass', 'الهندسة والبنية التحتية'], ['fa-stethoscope', 'الطب والعلوم الصحية'],
          ].map(([icon, label]) => (
            <div className="category-icon-card" key={label} onClick={() => filterByCategory(label)}>
              <div className="cic-icon"><i className={`fas ${icon}`} /></div>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ padding: '0 24px 40px' }}>
        <div id="diaspora-experts" className="diaspora-panel" style={{ display: tab === 'experts' ? undefined : 'none' }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <h2>كفاءات سورية حول العالم</h2>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <input
                type="text"
                placeholder="ابحث باسم أو تخصص..."
                style={{ padding: '10px 16px', borderRadius: 9, border: '1.5px solid var(--border)', fontFamily: 'inherit', fontSize: 12.5, width: 260 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                style={{ padding: '10px 16px', borderRadius: 9, border: '1.5px solid var(--border)', fontFamily: 'inherit', fontSize: 12.5 }}
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              >
                <option value="">كل الدول</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="jobs-grid">
            {loading && <p>جارٍ التحميل...</p>}
            {!loading && filteredExperts.length === 0 && <p style={{ color: 'var(--muted)' }}>لا توجد نتائج مطابقة.</p>}
            {filteredExperts.map((ex) => (
              <ExpertCard key={ex.id} expert={ex} />
            ))}
          </div>
        </div>

        <div id="diaspora-projects" className="diaspora-panel" style={{ display: tab === 'projects' ? undefined : 'none' }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <h2>مشاريع واستشارات متاحة</h2>
            <a href="/projects/new" className="btn btn-green btn-sm">
              <i className="fas fa-plus" /> اقترح مشروع
            </a>
          </div>
          <div className="jobs-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        <div id="diaspora-mentors" className="diaspora-panel" style={{ display: tab === 'mentors' ? undefined : 'none' }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <h2>برنامج الإرشاد المهني</h2>
            <p style={{ color: 'var(--muted)', fontSize: 12.5 }}>تواصل مع خبراء سوريين في الخارج لإرشادك في مسيرتك المهنية</p>
          </div>
          <div className="courses-grid">
            {experts.filter((e) => e.available).slice(0, 8).map((m) => (
              <MentorCard key={m.id} mentor={m} />
            ))}
          </div>
        </div>

        <div id="diaspora-knowledge" className="diaspora-panel" style={{ display: tab === 'knowledge' ? undefined : 'none' }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <h2>مركز المعرفة</h2>
            <button className="btn btn-green btn-sm" onClick={() => showToast('قريباً', 'إضافة محتوى قيد التطوير', 'info')}>
              <i className="fas fa-plus" /> اقترح محتوى
            </button>
          </div>
          <div className="courses-grid">
            {knowledge.map((k) => (
              <KnowledgeCard key={k.id} article={k} />
            ))}
          </div>
        </div>

        <div id="diaspora-courses" className="diaspora-panel" style={{ display: tab === 'courses' ? undefined : 'none' }}>
          <div className="section-header" style={{ marginBottom: 24 }}>
            <h2>دورات تدريبية مجانية من الكفاءات السورية</h2>
            <button className="btn btn-green btn-sm" onClick={() => showToast('قريباً', 'سيتم فتح باب التقديم لتقديم دورة تدريبية قريباً', 'info')}>
              <i className="fas fa-plus" /> قدّم دورة
            </button>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 12.5, marginBottom: 20 }}>
            كفاءات سورية في الخارج تقدّم دوراتها التدريبية مجاناً في مختلف المجالات، لنقل الخبرة إلى الداخل ودعم الكوادر السورية.
          </p>
          <div className="courses-grid">
            {courses.map((c) => (
              <CourseCard key={c.id} course={c} />
            ))}
          </div>
        </div>

        <div className="diaspora-cta">
          <h2>هل أنت كفاءة سورية في الخارج؟</h2>
          <p>سجّل الآن مجاناً وكن جزءاً من شبكة المعرفة السورية العالمية. مساهمتك في بناء الوطن تبدأ من هنا.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-outline btn-lg" onClick={() => setRegisterOpen(true)}>
              <i className="fas fa-user-plus" /> إنشاء ملف كفاءة
            </button>
            <button className="btn btn-green btn-lg" onClick={() => setContactOpen(true)}>
              <i className="fas fa-envelope" /> تواصل معنا
            </button>
          </div>
        </div>
      </div>

      <footer className="standalone-footer">
        <p>© 2026 منصة الكفاءات السورية في الخارج — جزء من منصة كفاءات للتوظيف السوري</p>
        <p style={{ marginTop: 6 }}>
          للتواصل:{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setContactOpen(true); }}>
            تواصل معنا
          </a>
        </p>
      </footer>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
      <RegisterModal open={registerOpen} onClose={() => setRegisterOpen(false)} onRegistered={reload} />
    </>
  );
}
