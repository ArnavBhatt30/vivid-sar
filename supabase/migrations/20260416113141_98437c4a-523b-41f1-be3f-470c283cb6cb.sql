CREATE TABLE public.colorizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'Sentinel-1',
  resolution TEXT,
  status TEXT NOT NULL DEFAULT 'Processing',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  original_url TEXT,
  colorized_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.colorizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own colorizations"
  ON public.colorizations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own colorizations"
  ON public.colorizations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own colorizations"
  ON public.colorizations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own colorizations"
  ON public.colorizations FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_colorizations_updated_at
  BEFORE UPDATE ON public.colorizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();