-- Storage bucket for SAR + colorized outputs
INSERT INTO storage.buckets (id, name, public)
VALUES ('sar-images', 'sar-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "SAR images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'sar-images');

-- Users upload to their own folder: {user_id}/...
CREATE POLICY "Users can upload SAR images to own folder"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'sar-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own SAR images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'sar-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own SAR images"
ON storage.objects FOR DELETE
USING (bucket_id = 'sar-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Realtime for colorizations
ALTER TABLE public.colorizations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.colorizations;