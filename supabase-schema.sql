-- ============================================================================
-- LITTLE ROSES ACADEMY - SUPABASE BACKEND SECURITY & DATABASE SCHEMA
-- ============================================================================
-- Run this SQL in the Supabase SQL Editor in your Supabase Dashboard:
-- https://supabase.com/dashboard/project/_/sql
--
-- Enforces:
-- 1. Strict Row Level Security (RLS) on all tables
-- 2. Hardware Device Binding (1 active phone per teacher at a time)
-- 3. Supabase Storage Policies for PDFs and learning materials
-- 4. Role-based backend authorization (Teachers cannot modify/delete resources or access Admin functions)
-- 5. Anti-tamper trigger preventing role escalation
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'teacher' CHECK (role IN ('admin', 'teacher')),
  teacher_id TEXT, -- e.g. 'tr-elvis', 'tr-fresiah', 'tr-kelvin', 'tr-liz'
  full_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Security helper function to check if current authenticated caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Profiles RLS Policies:
-- Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins can read all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Only Admins can update profiles (prevents unauthorized role changes)
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Allow initial profile creation for authenticated users and admins
DROP POLICY IF EXISTS "Enable insert for users and admins" ON public.profiles;
CREATE POLICY "Enable insert for users and admins"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR public.is_admin());

-- Anti-Tamper Trigger: Prevents non-admins from escalating their role
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role <> OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: only school administrators can modify system roles.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_role_escalation();


-- ============================================================================
-- 2. TEACHER RESOURCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teacher_resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  term TEXT,
  description TEXT,
  input_type TEXT NOT NULL DEFAULT 'RAW_TEXT' CHECK (input_type IN ('RAW_TEXT', 'FILE')),
  file_name TEXT,
  file_size TEXT,
  file_type TEXT,
  file_data_url TEXT,
  storage_path TEXT,
  raw_text_content TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  author_name TEXT DEFAULT 'School Administrator',
  author_role TEXT DEFAULT 'ADMIN',
  version INTEGER DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_teacher_resources_published ON public.teacher_resources (published, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_teacher_resources_subject ON public.teacher_resources (subject, grade);

ALTER TABLE public.teacher_resources ENABLE ROW LEVEL SECURITY;

-- 2.1 SELECT POLICY:
-- Teachers and anonymous clients can ONLY read resources where published = true!
-- Admins can read ALL resources (both published and drafts).
DROP POLICY IF EXISTS "Teachers can only read published resources" ON public.teacher_resources;
CREATE POLICY "Teachers can only read published resources"
  ON public.teacher_resources FOR SELECT
  USING (published = true OR public.is_admin());

-- 2.2 INSERT POLICY:
-- ONLY authenticated Admins can create resources!
DROP POLICY IF EXISTS "Only admins can insert resources" ON public.teacher_resources;
CREATE POLICY "Only admins can insert resources"
  ON public.teacher_resources FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- 2.3 UPDATE POLICY:
-- ONLY authenticated Admins can edit or publish/unpublish resources!
DROP POLICY IF EXISTS "Only admins can update resources" ON public.teacher_resources;
CREATE POLICY "Only admins can update resources"
  ON public.teacher_resources FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 2.4 DELETE POLICY:
-- ONLY authenticated Admins can delete resources!
DROP POLICY IF EXISTS "Only admins can delete resources" ON public.teacher_resources;
CREATE POLICY "Only admins can delete resources"
  ON public.teacher_resources FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ============================================================================
-- 3. TEACHER DEVICE BINDINGS & HARDWARE ISOLATION TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.teacher_devices (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  activated_at TIMESTAMPTZ DEFAULT now(),
  biometric_enabled BOOLEAN DEFAULT false,
  biometric_credential_id TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVOKED')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CRITICAL HARDWARE CONSTRAINT:
-- Enforces that a teacher can have AT MOST ONE active physical phone binding at any time!
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_device_per_teacher 
  ON public.teacher_devices (teacher_id) 
  WHERE (status = 'ACTIVE');

ALTER TABLE public.teacher_devices ENABLE ROW LEVEL SECURITY;

-- 3.1 SELECT POLICY:
-- Admins can view all device locks.
-- Teachers can ONLY see their own device record! (Guarantees Teacher-to-Teacher isolation).
DROP POLICY IF EXISTS "Admins view all devices" ON public.teacher_devices;
CREATE POLICY "Admins view all devices"
  ON public.teacher_devices FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Teachers view own device record" ON public.teacher_devices;
CREATE POLICY "Teachers view own device record"
  ON public.teacher_devices FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.teacher_id = teacher_devices.teacher_id
    )
  );

-- 3.2 INSERT POLICY:
-- Teachers can register their own device binding if no active lock exists.
DROP POLICY IF EXISTS "Teachers can register own device" ON public.teacher_devices;
CREATE POLICY "Teachers can register own device"
  ON public.teacher_devices FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.teacher_id = teacher_devices.teacher_id
    )
    OR public.is_admin()
  );

-- 3.3 UPDATE POLICY:
-- ONLY Admins can revoke or reset a teacher's device binding!
DROP POLICY IF EXISTS "Only admins can update or revoke device locks" ON public.teacher_devices;
CREATE POLICY "Only admins can update or revoke device locks"
  ON public.teacher_devices FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 3.4 DELETE POLICY:
-- ONLY Admins can delete device bindings!
DROP POLICY IF EXISTS "Only admins can delete device locks" ON public.teacher_devices;
CREATE POLICY "Only admins can delete device locks"
  ON public.teacher_devices FOR DELETE
  TO authenticated
  USING (public.is_admin());


-- ============================================================================
-- 4. SUPABASE STORAGE BUCKET & POLICIES ('resource-files')
-- ============================================================================
-- Creates the bucket for PDFs and teaching materials
INSERT INTO storage.buckets (id, name, public)
VALUES ('resource-files', 'resource-files', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Read Policy: All authenticated users and teachers can download resources
DROP POLICY IF EXISTS "Public & Teachers read resource files" ON storage.objects;
CREATE POLICY "Public & Teachers read resource files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resource-files');

-- Storage Insert Policy: ONLY Admins can upload files
DROP POLICY IF EXISTS "Only admins upload resource files" ON storage.objects;
CREATE POLICY "Only admins upload resource files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resource-files' 
    AND public.is_admin()
  );

-- Storage Update Policy: ONLY Admins can replace files
DROP POLICY IF EXISTS "Only admins update resource files" ON storage.objects;
CREATE POLICY "Only admins update resource files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'resource-files' 
    AND public.is_admin()
  );

-- Storage Delete Policy: ONLY Admins can delete files
DROP POLICY IF EXISTS "Only admins delete resource files" ON storage.objects;
CREATE POLICY "Only admins delete resource files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'resource-files' 
    AND public.is_admin()
  );


-- ============================================================================
-- 5. SEED INITIAL CURRICULUM RESOURCES (CBC RATIONALIZED)
-- ============================================================================
INSERT INTO public.teacher_resources (
  id, title, resource_type, grade, subject, term, description, 
  input_type, published, raw_text_content, author_name, author_role
) VALUES 
(
  'res-seed-001',
  'CBC Grade 6 Mathematics Term 1 Schemes of Work (Rationalized 2026)',
  'Schemes of Work',
  'Grade 6',
  'Mathematics',
  'Term 1',
  'Comprehensive 13-week rationalized schemes covering Numbers, Algebra, Measurement, and Geometry aligned with KNEC CAT assessment targets.',
  'RAW_TEXT',
  true,
  'LITTLE ROSES ACADEMY - DEPARTMENT OF MATHEMATICS
GRADE 6 TERM 1 SCHEMES OF WORK (RATIONALIZED CBC)

Week 1: Numbers - Place Value & Total Value of Numbers up to 1,000,000
Week 2: Operations - Addition and Subtraction of large whole numbers
Week 3: Multiplication & Division with mental strategies
Week 4: Fractions - Addition and Subtraction of Mixed Numbers
Week 5: Decimals - Conversion, Rounding off to nearest tenths and hundredths
Week 6: Mid-Term CAT 1 Administration and Scoring
Week 7: Algebra - Simple linear equations and algebraic expressions
Week 8: Measurement - Length, Perimeter of composite figures
Week 9: Area of regular polygons and triangles
Week 10: Volume and Capacity calculations
Week 11: Geometry - Angles on a straight line and angle properties
Week 12: Data Handling - Frequency tables and bar graphs
Week 13: End of Term Assessment & Remediation',
  'Curriculum Coordinator',
  'ADMIN'
),
(
  'res-seed-002',
  'Grade 5 Science & Technology - Living Things & Matter Assessment Guide',
  'Assessment',
  'Grade 5',
  'Science',
  'Term 1',
  'KNEC-standard continuous assessment test marking rubric for Grade 5 Science strands.',
  'RAW_TEXT',
  true,
  'LITTLE ROSES ACADEMY - CONTINUOUS ASSESSMENT TEST (CAT)
GRADE 5 SCIENCE AND TECHNOLOGY - STRAND 1: LIVING THINGS

ASSESSMENT RUBRIC:
1. Exceeding Expectations (EE): Learner accurately classifies vertebrate and invertebrate animals with 90-100% precision.
2. Meeting Expectations (ME): Learner classifies animals into major groups with 70-89% accuracy.
3. Approaching Expectations (AE): Learner identifies basic groups with minimal guidance (50-69%).
4. Below Expectations (BE): Requires continuous scaffolding and remedial exercises (<50%).',
  'Lead Science Teacher',
  'ADMIN'
),
(
  'res-seed-003',
  'Grade 4 English Language Activities - Term 1 Lesson Plans',
  'Lesson Plans',
  'Grade 4',
  'English',
  'Term 1',
  'Structured daily lesson plan templates covering Listening, Speaking, Reading Comprehension, and Guided Writing.',
  'RAW_TEXT',
  true,
  'LITTLE ROSES ACADEMY - ENGLISH DEPARTMENT
GRADE 4 LESSON PLAN: THEME - ENVIRONMENT AND HEALTH

Specific Learning Outcomes:
By the end of the lesson, the learner should be able to:
a) Listen attentively to a short story about environmental cleanliness.
b) Pronounce target vocabulary words correctly (conserve, pollution, compost).
c) Write three complete sentences describing how to keep the school clean.',
  'Academic Dean',
  'ADMIN'
)
ON CONFLICT (id) DO NOTHING;
