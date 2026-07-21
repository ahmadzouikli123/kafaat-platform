# منصة الكفاءات السورية في الخارج — Kafaat Platform

نسخة Next.js حقيقية من المنصة، مبنية على قاعدة بيانات **Supabase** حقيقية بدل
`localStorage`. أي شخص يزور الموقع يرى نفس البيانات، والتسجيل الفعلي يُخزَّن
لجميع الزوار.

## 1) إنشاء مشروع Supabase (مرة واحدة فقط)

1. أنشئ حساباً مجانياً على https://supabase.com
2. أنشئ مشروعاً جديداً (اختر أي اسم ومنطقة قريبة، مثلاً Frankfurt لأوروبا/الشرق الأوسط)
3. من **SQL Editor** داخل المشروع، افتح ملف `supabase/schema.sql` من هذا المستودع،
   انسخ محتواه بالكامل، الصقه، واضغط **Run**. هذا ينشئ كل الجداول والصلاحيات.
4. من **Project Settings → API** انسخ:
   - `Project URL`
   - `anon public` key
   - `service_role` key (سرّي — لا تشاركه أبداً)

## 2) إعداد المشروع محلياً

```bash
npm install
cp .env.local.example .env.local
# افتح .env.local وضع فيه NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY
```

لتشغيل سكربت تعبئة البيانات التجريبية (اختياري لكن موصى به عند أول تشغيل):

```bash
# أنشئ ملف .env منفصل (وليس .env.local) وضع فيه:
#   NEXT_PUBLIC_SUPABASE_URL=...
#   SUPABASE_SERVICE_ROLE_KEY=...
node --env-file=.env scripts/seed.mjs
```

## 3) التشغيل محلياً

```bash
npm run dev
```

افتح http://localhost:3000

## 4) النشر على Vercel

بنفس أسلوبك المعتاد:

```bash
git init
git add .
git commit -m "Initial real backend version"
git remote add origin https://github.com/ahmadzouikli123/kafaat-platform.git
git push -u origin main
```

ثم من Vercel: **Import Project** → اختر المستودع → في **Environment Variables**
أضف `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY` (فقط هذين
الاثنين — لا تضع مفتاح service_role في Vercel أبداً) → Deploy.

## ما الذي تغيّر عن النسخة القديمة (HTML الواحد)؟

| قبل | الآن |
|---|---|
| البيانات في localStorage (خاصة بكل متصفح) | قاعدة بيانات Supabase حقيقية يشاركها كل الزوار |
| لا يوجد تسجيل حقيقي | تسجيل الكفاءات ونشر المشاريع يُحفظ فعلياً وتراه إدارة الموقع |
| لا تحقق من الهوية | كل ملف كفاءة جديد يظهر بعلامة "قيد التحقق" حتى تُراجعه وتفعّله يدوياً |
| نموذج "تواصل معنا" وهمي | الرسائل تُحفظ في جدول contact_messages |

## نقاط يجب معرفتها قبل الإطلاق العلني

- **لا يوجد بعد نظام دخول/حساب مستخدم كامل** (تسجيل الدخول، استعادة كلمة
  المرور). التسجيل الحالي مفتوح للجميع بدون حساب، على غرار النسخة الأصلية —
  وهذا يكفي لمرحلة الإطلاق الأولى، لكن يُفضّل إضافته لاحقاً حتى يستطيع كل خبير
  تعديل ملفه بنفسه.
- **المراجعة اليدوية**: افتح Supabase → Table Editor → expert_profiles وفعّل
  is_verified = true لكل ملف تتحقق من صحته يدوياً (رابط LinkedIn، شهادة، الخ).
- **حذف البيانات التجريبية**: قبل الإطلاق الفعلي، احذف الصفوف التجريبية التي
  أضافها scripts/seed.mjs من نفس الـ Table Editor.

## البنية

```
app/                  الصفحات (App Router)
  page.js             الصفحة الرئيسية (Server Component يجلب البيانات الأولية)
  register/page.js    صفحة تسجيل كفاءة مستقلة
  projects/new/page.js صفحة اقتراح مشروع
components/           كل مكوّنات الواجهة (بطاقات، نوافذ منبثقة، الخ)
lib/supabase/         عملاء Supabase (متصفح/خادم)
supabase/schema.sql   مخطط قاعدة البيانات الكامل
scripts/seed.mjs      سكربت تعبئة البيانات التجريبية
proxy.js              تحديث الجلسة (اسم middleware.js في Next.js 16)
```
