#!/bin/bash

# Supabase Setup Script for CineWorkflow
# Run this after creating the Supabase project

echo "Setting up CineWorkflow database..."

# SQL to run in Supabase SQL Editor:
cat << 'EOF'

-- Create prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  category TEXT NOT NULL,
  tool TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create emails table for lead capture
CREATE TABLE IF NOT EXISTS emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'landing_page',
  is_pro BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  stripe_payment_id TEXT,
  amount INTEGER NOT NULL, -- in cents
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS (Row Level Security)
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prompts
CREATE POLICY "Allow public read of all prompts" 
  ON prompts FOR SELECT 
  USING (true);

CREATE POLICY "Allow authenticated insert" 
  ON prompts FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for emails
CREATE POLICY "Allow public insert of emails" 
  ON emails FOR INSERT 
  WITH CHECK (true);

-- Insert sample prompts
INSERT INTO prompts (title, prompt, category, tool, tags, is_premium) VALUES
('Cinematic Product Rotation', 
 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic',
 'Product Demo', 'Runway', ARRAY['product', 'commercial', 'rotation'], false),

('Smooth Aerial Drone Shot',
 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution',
 'B-Roll', 'Pika', ARRAY['drone', 'landscape', 'travel'], false),

('Dramatic Lighting Portrait',
 'Dramatic interview lighting, Rembrandt style, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light',
 'Interview', 'Runway', ARRAY['interview', 'portrait', 'dramatic'], true),

('Seamless Loop Background',
 'Abstract flowing particles, seamless loop, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps',
 'Motion Graphics', 'Runway', ARRAY['background', 'loop', 'abstract'], true),

('Handheld Documentary Style',
 'Handheld camera movement, subtle shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges',
 'B-Roll', 'Pika', ARRAY['handheld', 'documentary', 'natural'], false);

-- Create indexes
CREATE INDEX idx_prompts_category ON prompts(category);
CREATE INDEX idx_prompts_tool ON prompts(tool);
CREATE INDEX idx_prompts_premium ON prompts(is_premium);

EOF

echo "SQL created. Copy the above and paste into Supabase SQL Editor:"
echo "https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql/new"
echo ""
echo "After running SQL, your database is ready!"