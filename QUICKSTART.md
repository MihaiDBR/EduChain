# Quick Start Guide - EduChain

Get the platform running locally in under 10 minutes!

## 🚀 Fast Setup

### 1. Install Dependencies (2 min)

```bash
# Frontend
cd frontend
npm install

# Smart Contracts (optional for frontend-only testing)
cd ../web3
forge install
```

### 2. Setup Supabase (3 min)

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Copy & paste content from `supabase/migrations/001_initial_schema.sql`
5. Run the query
6. Go to Settings > API and copy:
   - Project URL
   - anon/public key

### 3. Configure Environment (1 min)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=get_from_walletconnect.com
```

Get WalletConnect Project ID:
- Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Create project (free)
- Copy Project ID

### 4. Run Development Server (30 sec)

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎯 Testing the App

### Without Smart Contracts (Database Only)

The app works without deploying smart contracts! Smart contract integration is optional for demo purposes.

### Step 1: Create Profile
1. Click "Connect Wallet" (use MetaMask)
2. You'll be redirected to dashboard
3. Go to Settings
4. Set username and role (Teacher or Student)

### Step 2: As Teacher
1. Go to Teacher Dashboard
2. Click "Create New Task"
3. Fill in task details
4. Click "Create Task" (this saves to database)

### Step 3: As Student
1. Switch to a different wallet OR
2. Use incognito mode with another wallet
3. Go to Student Dashboard
4. Browse tasks
5. View AI recommendations

### Step 4: Test Chat
1. On any task page
2. Use the chat interface
3. Ask questions (AI will auto-respond)

## 📝 Demo Data

Want some quick demo data? Run this in Supabase SQL Editor:

```sql
-- Insert demo teacher profile
INSERT INTO profiles (id, wallet_address, role, username, reputation_score, total_tasks_created)
VALUES (
  gen_random_uuid(),
  '0x1234567890123456789012345678901234567890',
  'teacher',
  'demo_teacher',
  100,
  5
);

-- Insert demo student profile
INSERT INTO profiles (id, wallet_address, role, username, reputation_score, total_tasks_completed)
VALUES (
  gen_random_uuid(),
  '0x0987654321098765432109876543210987654321',
  'student',
  'demo_student',
  50,
  10
);
```

## 🎨 Features to Demo

### 1. Personalized Recommendations
- Student dashboard shows recommended tasks
- Click on "View Details" to see WHY it was recommended
- Each recommendation has a detailed explanation

### 2. Collaborative Chat
- Open any task
- Use the chat interface
- Ask questions with "?" and AI responds
- Real-time messaging between teachers and students

### 3. Data Privacy
- Go to Settings
- Click "Data Privacy & Transparency"
- View/Export/Delete your data
- See what data is collected and why

### 4. Algorithmic Transparency
- Settings > Algorithmic Transparency
- See how recommendations work
- Understand reputation calculation
- All decisions are explained

### 5. Reputation System
- Based on participation, not wealth
- Can't be bought or transferred
- Clearly explained in UI

## 🔧 Common Issues

### "Supabase connection error"
- Check `.env.local` has correct values
- Verify Supabase project is running
- Check if migration ran successfully

### "Wallet not connecting"
- Ensure MetaMask is installed
- Try refreshing the page
- Check if you're on a supported network

### "Tasks not showing"
- Create a profile first (Settings page)
- Set your role to "Student" or "Teacher"
- Ensure you have tasks in the database

## 📚 Project Structure Quick Reference

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── teacher/      # Teacher dashboard & create task
│   │   └── student/      # Student dashboard & browse tasks
│   ├── settings/         # Profile & privacy settings
│   └── tasks/[id]/       # Task detail page (create this for chat)
├── components/
│   ├── ui/              # shadcn components
│   ├── TaskCard.tsx     # Task display component
│   ├── ChatInterface.tsx # Chat with AI
│   └── DataPrivacyPanel.tsx # Privacy controls
└── lib/
    ├── supabase/        # Database queries
    └── types/           # TypeScript types
```

## 🎯 Hackathon Demo Tips

### 5-Minute Pitch
1. **Problem** (30s): Education needs personalization, transparency, and fair incentives
2. **Solution** (1m): Web3 platform with staking, AI recommendations, and ethical design
3. **Demo** (2.5m): Show teacher creating task, student browsing, AI chat, privacy controls
4. **Impact** (30s): Combines best of EdTech and Web3 with ethics first
5. **Q&A** (30s)

### Key Differentiators
- ✅ **Ethical by design**: Transparency & privacy built-in
- ✅ **AI with explanations**: Every recommendation is explained
- ✅ **Fair reputation**: Based on participation, not wealth
- ✅ **Real collaboration**: Teacher-student chat with AI assistance
- ✅ **Student empowerment**: Choose your own learning path

## 🚀 Next Steps

After getting it running:
1. Customize the UI colors/branding
2. Add more sample tasks
3. Deploy to Vercel (see DEPLOYMENT.md)
4. Deploy contracts to testnet (optional)
5. Add your team's logo
6. Practice your demo!

## 💡 Tips for Hackathon Judges

Show them:
- The **recommendation explanation** feature (unique!)
- The **data privacy panel** (shows ethical approach)
- The **reputation system** explanation (fair, not pay-to-win)
- The **chat with AI** (collaborative learning)
- The **clean, modern UI** (professional quality)

## 📞 Need Help?

Check the main README.md for detailed documentation.

---

**Remember**: You don't need to deploy smart contracts for the demo! The database-only version is fully functional for showing the platform's features.

Good luck! 🎉
