-- Create learning_resources table for Learning Hub
CREATE TABLE public.learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    resource_type TEXT NOT NULL DEFAULT 'article' CHECK (resource_type IN ('article', 'video', 'document', 'webinar', 'course')),
    category TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'fundraising', 'operations', 'legal', 'investment', 'impact', 'networking')),
    thumbnail_url TEXT,
    resource_url TEXT,
    duration_minutes INTEGER,
    difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can view published resources (but we'll filter by role in app)
CREATE POLICY "Published resources are viewable by authenticated users"
ON public.learning_resources
FOR SELECT
TO authenticated
USING (is_published = true);

-- Policy: Only admins can insert resources (using has_role function)
CREATE POLICY "Admins can insert learning resources"
ON public.learning_resources
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Policy: Only admins can update resources
CREATE POLICY "Admins can update learning resources"
ON public.learning_resources
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Policy: Only admins can delete resources
CREATE POLICY "Admins can delete learning resources"
ON public.learning_resources
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = auth.uid() AND role = 'admin'
    )
);

-- Create index for better performance
CREATE INDEX idx_learning_resources_category ON public.learning_resources(category);
CREATE INDEX idx_learning_resources_type ON public.learning_resources(resource_type);
CREATE INDEX idx_learning_resources_featured ON public.learning_resources(is_featured) WHERE is_featured = true;

-- Create updated_at trigger
CREATE TRIGGER update_learning_resources_updated_at
    BEFORE UPDATE ON public.learning_resources
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();