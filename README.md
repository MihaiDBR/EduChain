# EduChain - Decentralized Educational Platform

A Web3-powered educational platform where teachers create tasks and students solve them through a stake-based incentive system. Built for hackathon with focus on education in the era of technology.

## 🎯 Key Features

### For Teachers
- **Task Creation**: Post educational tasks with customizable difficulty, categories, and rewards
- **Staking Mechanism**: Stake tokens based on task quality and earn yield based on student success rates
- **Quality Metrics**: Build reputation through high-quality tasks and student satisfaction
- **Dashboard**: Track student progress, submissions, and task performance

### For Students
- **Task Discovery**: Browse and filter tasks by difficulty, category, and rewards
- **AI-Powered Recommendations**: Get personalized task suggestions with transparent explanations
- **Stake to Learn**: Stake tokens to attempt tasks, earn rewards upon completion
- **Collaborative Learning**: Chat with teachers and AI assistant for guidance

### Core Principles

#### 🔐 Ethical & Transparent
- **Algorithmic Transparency**: All recommendations and evaluations come with clear explanations
- **Data Privacy**: Students can view, export, and delete their personal data anytime
- **Fair Reputation**: Reputation earned through participation, not wealth

#### 🎓 Personalized Learning
- Students choose which tasks to attempt
- AI recommendations based on skill level and interests
- Flexible learning paths

#### 🤝 Collaboration
- Built-in chat with AI assistance
- Teacher-student communication
- Peer learning support

## 🛠 Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful component library
- **RainbowKit** - Wallet connection
- **Wagmi** - Web3 React hooks
- **Viem** - Ethereum library

### Backend
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security (RLS)** - Database-level access control
- **Supabase Auth** - User authentication

### Blockchain
- **Solidity** - Smart contract development
- **Foundry** - Smart contract framework
- **OpenZeppelin** - Secure contract libraries
- **ERC-20 Token (EDU)** - Platform token for staking/rewards

## 📂 Project Structure

```
smarthack/
├── frontend/              # Next.js frontend application
│   ├── app/              # App router pages
│   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── teacher/  # Teacher dashboard
│   │   │   └── student/  # Student dashboard
│   │   ├── settings/     # User settings & privacy
│   │   └── tasks/        # Task pages
│   ├── components/       # React components
│   │   ├── ui/          # UI components (shadcn)
│   │   ├── TaskCard.tsx
│   │   ├── ChatInterface.tsx
│   │   └── DataPrivacyPanel.tsx
│   └── lib/             # Utilities & configs
│       ├── types/       # TypeScript types
│       ├── supabase/    # Supabase client & queries
│       └── wagmi.ts     # Web3 configuration
├── web3/                # Smart contracts
│   └── src/
│       ├── EduToken.sol         # ERC-20 token
│       └── TaskStaking.sol      # Staking contract
└── supabase/            # Database
    └── migrations/      # SQL migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Foundry (for smart contracts)
- Supabase account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd smarthack
```

### 2. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

Run development server:
```bash
npm run dev
```

### 3. Setup Supabase

1. Create a new Supabase project
2. Run the migration file in SQL editor:
```bash
supabase/migrations/001_initial_schema.sql
```

### 4. Setup Smart Contracts

```bash
cd web3
forge install OpenZeppelin/openzeppelin-contracts
forge build
```

Deploy contracts:
```bash
forge script script/Deploy.s.sol --rpc-url <your-rpc-url> --broadcast
```

## 📊 Database Schema

### Core Tables
- **profiles**: User profiles with wallet addresses and reputation
- **tasks**: Educational tasks created by teachers
- **task_submissions**: Student submissions and grades
- **staking_transactions**: Token staking records
- **task_ratings**: Student ratings of tasks
- **teacher_ratings**: Student ratings of teachers
- **chat_rooms**: Collaboration spaces
- **chat_messages**: Messages with AI support
- **recommendation_explanations**: AI recommendation reasoning
- **user_data_access_log**: Privacy compliance tracking
- **notifications**: User notifications

## 🔗 Smart Contracts

### EduToken (ERC-20)
- Platform token for staking and rewards
- Mintable by contract owner
- Burnable by token holders

### TaskStaking
- Teachers stake when creating tasks
- Students stake when attempting tasks
- Automatic reward distribution based on success
- Yield calculation based on task quality and success rate
- Emergency withdraw functionality

## 🎨 Key Components

### TaskCard
Displays task information with:
- Difficulty badge
- Reward and stake amounts
- Success rate
- Teacher reputation
- Category and tags

### ChatInterface
Real-time chat with:
- Teacher-student messaging
- AI assistant integration
- Message history
- Auto-responses to questions

### DataPrivacyPanel
GDPR-compliant features:
- View all personal data
- Export data as JSON
- Delete account and data
- Algorithmic transparency explanations

## 🔒 Security Features

1. **Row Level Security (RLS)**: Database-level access control
2. **Smart Contract Auditing**: Using OpenZeppelin standards
3. **ReentrancyGuard**: Protection against reentrancy attacks
4. **Input Validation**: Both frontend and database level
5. **Private Keys**: Never exposed to frontend

## 🌟 Unique Features

### Transparent AI Recommendations
Every task recommendation comes with an explanation showing:
- Why it was recommended
- Relevance score
- Contributing factors (skill match, success rate, etc.)

### Fair Reputation System
Reputation grows through:
- Creating quality tasks (+1 point)
- Completing tasks (+1 point)
- High ratings (+5 points)
- Success rate bonuses (+10 for >70%)
- Consistent activity (+2/week)

**Important**: Reputation cannot be bought or transferred!

### Data Privacy First
Students have full control:
- View what data is collected and why
- Export complete data history
- Delete all personal data
- Track who accessed their data

## 📈 Future Enhancements

- [ ] NFT certificates for completed tasks
- [ ] DAO governance for platform decisions
- [ ] Advanced AI tutoring integration
- [ ] Multi-chain support
- [ ] Mobile app (React Native)
- [ ] Peer review system
- [ ] Task marketplace
- [ ] Learning analytics dashboard

## 🤝 Contributing

This is a hackathon project! Feel free to fork and improve.

## 📄 License

MIT License - feel free to use for educational purposes

## 🏆 Hackathon Theme: Education in the Era of Technology

This platform addresses:
- ✅ Personalized learning through AI
- ✅ Active participation through gamification
- ✅ Creativity through flexible task selection
- ✅ Transparency in algorithmic decisions
- ✅ Data privacy and ethical technology
- ✅ Fair access (reputation ≠ wealth)
- ✅ Teacher-student collaboration

---

Built with ❤️ for education and Web3
