#!/bin/bash

# SILOKER - Quick Start Script
# Jalankan script ini untuk setup cepat

echo "================================================"
echo "    SILOKER - Job Portal Demo Setup"
echo "================================================"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "  Node version: $(node -v)"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -eq 0 ]; then
    echo "  ✓ Dependencies installed successfully"
else
    echo "  ✗ Failed to install dependencies"
    exit 1
fi
echo ""

# Create .env.local template
echo "✓ Creating .env.local template..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "  ✓ .env.local created"
    echo "  ⚠️  IMPORTANT: Edit .env.local with your Supabase credentials"
else
    echo "  .env.local already exists"
fi
echo ""

echo "================================================"
echo "    Setup Complete!"
echo "================================================"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Setup Supabase Database:"
echo "   - Go to https://supabase.com"
echo "   - Create new project"
echo "   - Copy Project URL and anon key"
echo ""
echo "2. Create Database Tables:"
echo "   - Open SQL Editor in Supabase"
echo "   - Copy & paste sql/schema.sql"
echo "   - Execute"
echo ""
echo "3. Seed Dummy Data:"
echo "   - In SQL Editor, copy & paste sql/seed.sql"
echo "   - Execute"
echo ""
echo "4. Configure Environment:"
echo "   - Edit .env.local"
echo "   - Add NEXT_PUBLIC_SUPABASE_URL"
echo "   - Add NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "5. Run Development Server:"
echo "   npm run dev"
echo ""
echo "6. Open in Browser:"
echo "   http://localhost:3000"
echo ""
echo "================================================"
echo "📚 Documentation:"
echo "  - SETUP-GUIDE.md    - Step-by-step setup"
echo "  - PROJECT-SUMMARY.md - Project overview"
echo "  - README-SETUP.md   - Full documentation"
echo "================================================"
