-- Location: supabase/migrations/20250805131608_palette_pigeon_collaboration.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: NEW_MODULE - Complete collaborative color management system
-- Dependencies: None - this is the initial migration

-- 1. Core Types
CREATE TYPE public.user_role AS ENUM ('admin', 'member', 'viewer');
CREATE TYPE public.palette_visibility AS ENUM ('private', 'team', 'public');
CREATE TYPE public.collaboration_action AS ENUM ('color_change', 'color_add', 'color_remove', 'lock_toggle', 'palette_update');

-- 2. Core Tables
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'member'::public.user_role,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role public.user_role DEFAULT 'member'::public.user_role,
    invited_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

CREATE TABLE public.palettes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    visibility public.palette_visibility DEFAULT 'private'::public.palette_visibility,
    is_template BOOLEAN DEFAULT false,
    accessibility_score INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.palette_colors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    palette_id UUID REFERENCES public.palettes(id) ON DELETE CASCADE,
    hex_value TEXT NOT NULL,
    name TEXT,
    position INTEGER NOT NULL,
    is_locked BOOLEAN DEFAULT false,
    contrast_white DECIMAL(4,2),
    contrast_black DECIMAL(4,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(palette_id, position)
);

CREATE TABLE public.collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    palette_id UUID REFERENCES public.palettes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    cursor_x INTEGER,
    cursor_y INTEGER,
    is_active BOOLEAN DEFAULT true,
    last_seen TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.palette_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    palette_id UUID REFERENCES public.palettes(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    action public.collaboration_action NOT NULL,
    changes JSONB NOT NULL DEFAULT '{}',
    version INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.accessibility_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    palette_id UUID REFERENCES public.palettes(id) ON DELETE CASCADE,
    wcag_aa_score INTEGER DEFAULT 0,
    wcag_aaa_score INTEGER DEFAULT 0,
    colorblind_safe BOOLEAN DEFAULT false,
    contrast_issues JSONB DEFAULT '[]',
    recommendations JSONB DEFAULT '[]',
    generated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_teams_owner ON public.teams(owner_id);
CREATE INDEX idx_team_members_team ON public.team_members(team_id);
CREATE INDEX idx_team_members_user ON public.team_members(user_id);
CREATE INDEX idx_palettes_owner ON public.palettes(owner_id);
CREATE INDEX idx_palettes_team ON public.palettes(team_id);
CREATE INDEX idx_palettes_visibility ON public.palettes(visibility);
CREATE INDEX idx_palette_colors_palette ON public.palette_colors(palette_id);
CREATE INDEX idx_palette_colors_position ON public.palette_colors(palette_id, position);
CREATE INDEX idx_collaboration_sessions_palette ON public.collaboration_sessions(palette_id);
CREATE INDEX idx_collaboration_sessions_active ON public.collaboration_sessions(palette_id, is_active);
CREATE INDEX idx_palette_history_palette ON public.palette_history(palette_id);
CREATE INDEX idx_accessibility_reports_palette ON public.accessibility_reports(palette_id);

-- 4. RLS Setup
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.palettes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.palette_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.palette_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_reports ENABLE ROW LEVEL SECURITY;

-- 5. Helper Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.is_team_member(team_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.team_id = team_uuid
    AND tm.user_id = auth.uid()
)
$$;

CREATE OR REPLACE FUNCTION public.can_access_palette(palette_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.palettes p
    WHERE p.id = palette_uuid
    AND (
        p.visibility = 'public'::public.palette_visibility
        OR p.owner_id = auth.uid()
        OR (p.visibility = 'team'::public.palette_visibility AND p.team_id IS NOT NULL AND public.is_team_member(p.team_id))
    )
)
$$;

CREATE OR REPLACE FUNCTION public.can_edit_palette(palette_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.palettes p
    LEFT JOIN public.team_members tm ON p.team_id = tm.team_id AND tm.user_id = auth.uid()
    WHERE p.id = palette_uuid
    AND (
        p.owner_id = auth.uid()
        OR (p.team_id IS NOT NULL AND tm.role IN ('admin'::public.user_role, 'member'::public.user_role))
    )
)
$$;

-- 6. RLS Policies
-- Pattern 1: Core user table - simple only
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for teams
CREATE POLICY "users_manage_own_teams"
ON public.teams
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Pattern 7: Complex access for team members
CREATE POLICY "team_members_access_own_memberships"
ON public.team_members
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_team_member(team_id));

CREATE POLICY "team_owners_manage_members"
ON public.team_members
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.teams t
        WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.teams t
        WHERE t.id = team_id AND t.owner_id = auth.uid()
    )
);

-- Pattern 4: Public read, owner/team write for palettes
CREATE POLICY "public_can_read_public_palettes"
ON public.palettes
FOR SELECT
TO public
USING (visibility = 'public'::public.palette_visibility);

CREATE POLICY "users_access_own_and_team_palettes"
ON public.palettes
FOR SELECT
TO authenticated
USING (
    owner_id = auth.uid()
    OR (visibility = 'team'::public.palette_visibility AND team_id IS NOT NULL AND public.is_team_member(team_id))
);

CREATE POLICY "users_manage_own_palettes"
ON public.palettes
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Pattern 7: Complex access for palette colors through palette ownership
CREATE POLICY "users_access_palette_colors"
ON public.palette_colors
FOR SELECT
TO authenticated
USING (public.can_access_palette(palette_id));

CREATE POLICY "users_edit_palette_colors"
ON public.palette_colors
FOR ALL
TO authenticated
USING (public.can_edit_palette(palette_id))
WITH CHECK (public.can_edit_palette(palette_id));

-- Pattern 7: Complex access for collaboration sessions
CREATE POLICY "users_manage_collaboration_sessions"
ON public.collaboration_sessions
FOR ALL
TO authenticated
USING (user_id = auth.uid() OR public.can_access_palette(palette_id))
WITH CHECK (user_id = auth.uid());

-- Pattern 7: Complex access for palette history
CREATE POLICY "users_view_palette_history"
ON public.palette_history
FOR SELECT
TO authenticated
USING (public.can_access_palette(palette_id));

CREATE POLICY "users_create_palette_history"
ON public.palette_history
FOR INSERT
TO authenticated
WITH CHECK (public.can_edit_palette(palette_id));

-- Pattern 7: Complex access for accessibility reports
CREATE POLICY "users_view_accessibility_reports"
ON public.accessibility_reports
FOR SELECT
TO authenticated
USING (public.can_access_palette(palette_id));

CREATE POLICY "users_manage_accessibility_reports"
ON public.accessibility_reports
FOR ALL
TO authenticated
USING (public.can_edit_palette(palette_id))
WITH CHECK (public.can_edit_palette(palette_id));

-- 7. Utility Functions
CREATE OR REPLACE FUNCTION public.calculate_contrast_ratio(color1 TEXT, color2 TEXT)
RETURNS DECIMAL
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    luminance1 DECIMAL;
    luminance2 DECIMAL;
    contrast DECIMAL;
BEGIN
    -- Simplified contrast calculation - in production, use proper color science
    -- This is a placeholder that returns a mock value
    contrast := 4.5 + (random() * 3);
    RETURN ROUND(contrast, 2);
END;
$$;

CREATE OR REPLACE FUNCTION public.update_palette_accessibility_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    avg_contrast DECIMAL;
    new_score INTEGER;
BEGIN
    -- Calculate average contrast for the palette
    SELECT AVG((contrast_white + contrast_black) / 2) INTO avg_contrast
    FROM public.palette_colors
    WHERE palette_id = NEW.palette_id;
    
    -- Convert to score out of 100
    new_score := LEAST(ROUND((avg_contrast / 7) * 100), 100);
    
    -- Update palette accessibility score
    UPDATE public.palettes
    SET accessibility_score = new_score,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.palette_id;
    
    RETURN NEW;
END;
$$;

-- 8. Triggers
CREATE TRIGGER update_palette_accessibility_trigger
    AFTER INSERT OR UPDATE ON public.palette_colors
    FOR EACH ROW
    EXECUTE FUNCTION public.update_palette_accessibility_score();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    designer_uuid UUID := gen_random_uuid();
    team_uuid UUID := gen_random_uuid();
    palette1_uuid UUID := gen_random_uuid();
    palette2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@palettepigeon.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (designer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'designer@palettepigeon.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Designer", "role": "member"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create team
    INSERT INTO public.teams (id, name, description, owner_id) VALUES
        (team_uuid, 'Design Team', 'Main design team for collaborative work', admin_uuid);

    -- Add team member
    INSERT INTO public.team_members (team_id, user_id, role, invited_by) VALUES
        (team_uuid, designer_uuid, 'member'::public.user_role, admin_uuid);

    -- Create palettes
    INSERT INTO public.palettes (id, name, description, owner_id, team_id, visibility, accessibility_score) VALUES
        (palette1_uuid, 'Brand Primary Palette', 'Main brand colors for company identity', admin_uuid, team_uuid, 'team'::public.palette_visibility, 85),
        (palette2_uuid, 'Website Color Scheme', 'Colors for the new website design', designer_uuid, team_uuid, 'public'::public.palette_visibility, 92);

    -- Create palette colors
    INSERT INTO public.palette_colors (palette_id, hex_value, name, position, is_locked, contrast_white, contrast_black) VALUES
        -- Brand Primary Palette
        (palette1_uuid, '#2563EB', 'Primary Blue', 1, true, 5.2, 4.1),
        (palette1_uuid, '#059669', 'Success Green', 2, false, 3.8, 5.5),
        (palette1_uuid, '#DC2626', 'Error Red', 3, true, 5.8, 3.6),
        (palette1_uuid, '#D97706', 'Warning Orange', 4, false, 4.2, 5.0),
        (palette1_uuid, '#8B5CF6', 'Purple Accent', 5, false, 4.7, 4.5),
        
        -- Website Color Scheme
        (palette2_uuid, '#0EA5E9', 'Sky Blue', 1, false, 3.9, 5.4),
        (palette2_uuid, '#10B981', 'Emerald', 2, false, 3.5, 6.0),
        (palette2_uuid, '#F59E0B', 'Amber', 3, false, 2.8, 7.5),
        (palette2_uuid, '#EF4444', 'Red', 4, false, 5.1, 4.2);

    -- Create accessibility reports
    INSERT INTO public.accessibility_reports (palette_id, wcag_aa_score, wcag_aaa_score, colorblind_safe, contrast_issues, recommendations) VALUES
        (palette1_uuid, 85, 65, true, '[]'::jsonb, '["Consider darkening the purple accent for better contrast"]'::jsonb),
        (palette2_uuid, 92, 78, true, '[]'::jsonb, '["Excellent accessibility scores across all color combinations"]'::jsonb);

    -- Create collaboration session
    INSERT INTO public.collaboration_sessions (palette_id, user_id, session_id, cursor_x, cursor_y) VALUES
        (palette1_uuid, designer_uuid, 'session_' || generate_random_uuid(), 245, 120);

    -- Create palette history
    INSERT INTO public.palette_history (palette_id, user_id, action, changes, version) VALUES
        (palette1_uuid, admin_uuid, 'palette_update'::public.collaboration_action, '{"name": "Brand Primary Palette"}'::jsonb, 1),
        (palette2_uuid, designer_uuid, 'color_add'::public.collaboration_action, '{"color": "#EF4444", "position": 4}'::jsonb, 1);
END $$;