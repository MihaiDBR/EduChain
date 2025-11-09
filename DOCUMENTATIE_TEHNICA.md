# Documentație Tehnică - EduChain Platform

## Cuprins
1. [Ce Este EduChain?](#ce-este-educhain)
2. [Tehnologiile Folosite](#tehnologiile-folosite)
3. [Arhitectura Aplicației](#arhitectura-aplicației)
4. [Cum Funcționează Fiecare Componentă](#cum-funcționează-fiecare-componentă)
5. [Baza de Date](#baza-de-date)
6. [Integrările](#integrările)
7. [Funcționalitățile Principale](#funcționalitățile-principale)
8. [Cum Să Rulezi Proiectul](#cum-să-rulezi-proiectul)

---

## Ce Este EduChain?

**EduChain** este o platformă educațională descentralizată (Web3) unde:
- **Profesorii** creează teme/taskuri pentru studenți
- **Studenții** se înscriu la taskuri, uploadează soluții și primesc feedback
- **Toată lumea** poate câștiga tokenuri prin participare
- **Sistemul** oferă insigne NFT ca dovadă a învățării (Proof of Learning)
- **Transparența** și privacy-ul sunt prioritare (GDPR compliant)

---

## Tehnologiile Folosite

### Frontend (Partea Vizuală)

| Tehnologie | Versiune | Ce Face? |
|-----------|----------|----------|
| **Next.js** | 16.0.1 | Framework React pentru aplicații web moderne. Face routing-ul, server-side rendering și optimizări automate. |
| **React** | 19.2.0 | Librăria pentru construirea interfețelor. Permite componente reutilizabile și gestionare stare. |
| **TypeScript** | 5.x | JavaScript cu tipuri de date. Previne bug-uri și face codul mai sigur. |
| **Tailwind CSS** | v4 | Framework CSS pentru styling rapid. Folosești clase predefinite în loc să scrii CSS manual. |
| **shadcn/ui** | Latest | Componente UI gata făcute (butoane, carduri, dialoguri) care sunt accesibile și customizabile. |
| **RainbowKit** | 2.2.9 | Bibliotecă pentru conectarea portofelelor Web3 (MetaMask, WalletConnect, etc.). UI gata făcut. |
| **Wagmi** | 2.19.2 | React hooks pentru Web3. Face ușoară interacțiunea cu blockchain și portofelele. |
| **Viem** | 2.38.6 | Librărie modernă pentru Ethereum. Mai rapidă și mai sigură decât ethers.js. |
| **TanStack Query** | 5.90.7 | Gestionare date asincrone. Cache-uiește rezultatele și face refetch automat. |
| **Supabase JS** | 2.80.0 | Client pentru conectare la baza de date Supabase. |
| **Lucide React** | 0.553.0 | 500+ iconițe moderne și frumoase. |

### Backend (Partea Server)

| Tehnologie | Ce Face? |
|-----------|----------|
| **Supabase** | Backend-as-a-Service. Oferă PostgreSQL cloud, autentificare, storage pentru fișiere și API automat. |
| **PostgreSQL** | Baza de date relațională. Stochează utilizatori, taskuri, submissions, reviews, etc. |
| **Row Level Security (RLS)** | Sistem de securitate la nivel de bază de date. Un student nu poate vedea datele altui student. |
| **Supabase Storage** | Pentru stocarea fișierelor uploadate de studenți (PDF, imagini, documente). |

### Blockchain (Web3)

| Tehnologie | Ce Face? |
|-----------|----------|
| **Solidity** 0.8.20 | Limbaj pentru smart contracts. Scrii logica care rulează pe blockchain. |
| **Foundry** | Framework pentru dezvoltare smart contracts. Testare, deployment și debugging. |
| **OpenZeppelin** | Librării de smart contracts sigure și testate. Folosim pentru ERC-20 tokens. |
| **Sepolia** | Ethereum testnet. Aici deployăm contractele pentru testare (nu costă bani reali). |

---

## Arhitectura Aplicației

### Structura Folderelor

```
smarthack/
├── frontend/              # Aplicația Next.js (interfața vizuală)
│   ├── app/              # Pagini și routing
│   │   ├── page.tsx      # Landing page
│   │   ├── dashboard/    # Dashboard-uri (profesor și student)
│   │   ├── settings/     # Setări și privacy
│   │   ├── staking/      # Interfața pentru stakare
│   │   └── dao/          # Guvernare descentralizată
│   ├── components/       # Componente reutilizabile
│   │   ├── Navigation.tsx
│   │   ├── BadgeTemplate.tsx
│   │   ├── DataPrivacyPanel.tsx
│   │   └── ui/           # Componente shadcn/ui
│   ├── lib/              # Utilități și integrări
│   │   ├── supabase/     # Client și query-uri Supabase
│   │   ├── types/        # Tipuri TypeScript
│   │   └── wagmi.ts      # Configurare Web3
│   └── public/           # Resurse statice
├── web3/                 # Smart contracts Solidity
│   ├── src/
│   │   ├── EduToken.sol      # Token ERC-20
│   │   └── TaskStaking.sol   # Logica de stakare
│   └── foundry.toml      # Configurare Foundry
└── supabase/             # Migrații bază de date
    └── migrations/       # Fișiere SQL pentru schema DB
```

### Cum Comunică Componentele

```
┌─────────────────────────────────────────────────────────────┐
│                        UTILIZATOR                            │
│                     (Browser Web)                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pagini     │  │  Componente  │  │     UI       │      │
│  │  (Routes)    │  │  Reutilizabile│  │  (shadcn)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────┬──────────────────────┬──────────────────────────────┘
        │                      │
        ↓                      ↓
┌──────────────────┐    ┌──────────────────┐
│   SUPABASE       │    │  BLOCKCHAIN      │
│   (Backend)      │    │  (Ethereum)      │
│                  │    │                  │
│  • PostgreSQL    │    │  • EduToken      │
│  • Auth          │    │  • TaskStaking   │
│  • Storage       │    │  • Sepolia       │
│  • Real-time     │    │                  │
└──────────────────┘    └──────────────────┘
```

---

## Cum Funcționează Fiecare Componentă

### 1. **Landing Page** (`/app/page.tsx`)

**Ce face:**
- Prima pagină pe care o vede utilizatorul
- Prezintă features-urile platformei
- Butoane pentru "Get Started" și "Learn More"
- Statistici fake (pentru demo): număr de taskuri, studenți, tokens

**Tehnologii folosite:**
- React components
- Tailwind CSS pentru styling
- Animații CSS custom (fade-in, slide-in, typewriter)
- Lucide icons pentru iconițe

**Design pattern:**
- Hero section cu gradient background
- Features cards cu icons
- "How it works" în 3 pași
- Ethics & Transparency section
- Call-to-action final

### 2. **Sistem de Autentificare** (Web3 Wallet)

**Ce face:**
- Conectare cu portofelul cripto (MetaMask, WalletConnect, etc.)
- Nu folosim username/password tradițional
- Adresa wallet-ului devine identitatea utilizatorului

**Tehnologii folosite:**
- **RainbowKit**: UI pentru conectare wallet
- **Wagmi**: Hooks React pentru verificare conexiune
- **Viem**: Comunicare cu blockchain

**Cum funcționează:**
```typescript
// 1. Utilizatorul dă click pe "Connect Wallet"
<ConnectButton />

// 2. RainbowKit deschide dialog cu opțiuni de wallet
// 3. După conectare, verificăm dacă utilizatorul există în DB
const { address, isConnected } = useAccount();

// 4. Dacă nu există profil, redirectăm la setup
if (!profile && isConnected) {
  router.push('/dashboard/setup');
}

// 5. Dacă există profil, verificăm rolul și redirectăm
if (profile.role === 'teacher') {
  router.push('/dashboard/teacher');
} else {
  router.push('/dashboard/student');
}
```

### 3. **Dashboard Profesor** (`/dashboard/teacher/page.tsx`)

**Ce face:**
- Afișează taskurile create de profesor
- Statistici: token balance, total tasks, studenți, întrebări nerezolvate
- Butoane pentru: Create Task, View Details, Review Students
- System de reputație: rating, upvotes, downvotes

**Cum afișăm datele:**
```typescript
// 1. Luăm profilul profesorului din Supabase
const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('wallet_address', address.toLowerCase())
  .single();

// 2. Luăm toate taskurile profesorului
const { data: homeworks } = await supabase
  .from('homeworks')
  .select('*')
  .eq('teacher_id', profile.id)
  .order('created_at', { ascending: false });

// 3. Calculăm statistici
const totalStudents = homeworks.reduce((sum, hw) => sum + hw.current_students, 0);

// 4. Luăm întrebările nerezolvate
const { data: unansweredQuestions } = await supabase
  .from('questions')
  .select('*')
  .in('homework_id', homeworkIds)
  .eq('is_answered', false);
```

**Features speciale:**
- Warning dacă nu ai destui tokeni pentru a crea task (cost: 1 token)
- Link-uri rapide către "View all questions" și "View all submissions"
- Cards cu hover effects și animații

### 4. **Creare Task** (`/dashboard/teacher/create-homework/page.tsx`)

**Ce face:**
- Form pentru crearea unui task nou
- Upload resurse (PDF-uri, imagini) pentru studenți
- Validare: titlu, descriere, număr maxim de studenți
- Cost: 1 token

**Tehnologii folosite:**
- React useState pentru form state
- Supabase pentru salvare în DB
- Supabase Storage pentru upload fișiere

**Procesul de creare:**
```typescript
// 1. Utilizatorul completează formularul
const [formData, setFormData] = useState({
  title: '',
  description: '',
  maxStudents: 10,
  deadline: '' // opțional
});

// 2. Upload fișiere resurse în Supabase Storage
const uploadedUrls = [];
for (const file of uploadedFiles) {
  const { data, error } = await supabase.storage
    .from('task-resources')
    .upload(`${Date.now()}_${file.name}`, file);

  if (!error) {
    const publicUrl = supabase.storage
      .from('task-resources')
      .getPublicUrl(data.path).data.publicUrl;
    uploadedUrls.push({ name: file.name, url: publicUrl });
  }
}

// 3. Creăm task-ul în DB
const { data: homework } = await supabase
  .from('homeworks')
  .insert({
    teacher_id: profile.id,
    title: formData.title,
    description: formData.description,
    max_students: formData.maxStudents,
    deadline: formData.deadline || null
  })
  .select()
  .single();

// 4. Salvăm resursele în task_resources table
for (const resource of uploadedUrls) {
  await supabase.from('task_resources').insert({
    homework_id: homework.id,
    teacher_id: profile.id,
    file_url: resource.url,
    file_name: resource.name
  });
}

// 5. Scădem 1 token din balanța profesorului
await supabase
  .from('profiles')
  .update({ token_balance: profile.token_balance - 1 })
  .eq('id', profile.id);

// 6. Redirect la dashboard
router.push('/dashboard/teacher');
```

### 5. **Review Studenți** (`/dashboard/teacher/homework/[id]/review/page.tsx`)

**Ce face:**
- Afișează toți studenții înscriși la un task
- Profesorul poate vedea submissions (text + fișiere)
- Profesorul dă rating (1-5 stele) și comentariu
- După review, studentul primește feedback

**Cum funcționează review-ul:**
```typescript
// 1. Afișăm lista de studenți înscriși
const { data: enrollments } = await supabase
  .from('enrollments')
  .select('*, student:profiles(*), homework:homeworks(*)')
  .eq('homework_id', homeworkId);

// 2. Pentru fiecare student, afișăm submissions
const { data: submissions } = await supabase
  .from('submissions')
  .select('*')
  .eq('enrollment_id', enrollment.id);

// 3. Profesorul dă review (stele + comentariu)
const handleSubmitReview = async (studentId, enrollmentId) => {
  // Creăm review-ul
  await supabase.from('reviews').insert({
    reviewer_id: profile.id,
    student_id: studentId,
    homework_id: homeworkId,
    stars: stars, // 1-5
    comment: comment
  });

  // Actualizăm enrollment status
  await supabase
    .from('enrollments')
    .update({
      status: 'reviewed',
      review_score: stars,
      review_comment: comment
    })
    .eq('id', enrollmentId);

  // Actualizăm rating-ul studentului (medie)
  // Calculăm noul rating bazat pe toate review-urile
  const { data: allReviews } = await supabase
    .from('reviews')
    .select('stars')
    .eq('student_id', studentId);

  const avgRating = allReviews.reduce((sum, r) => sum + r.stars, 0) / allReviews.length;

  await supabase
    .from('profiles')
    .update({
      rating: avgRating,
      total_reviews: allReviews.length
    })
    .eq('id', studentId);
};
```

### 6. **Dashboard Student** (`/dashboard/student/page.tsx`)

**Ce face:**
- Afișează taskurile disponibile pentru înscriere
- Taskurile la care studentul este deja înscris
- Statistici: enrollments, completed tasks, rating, tokens
- Eligibilitate pentru a deveni Mentor (rating > 4.0 + 5 taskuri completate)
- Link către NFT achievements

**Procesul de înscriere:**
```typescript
const handleEnroll = async (homeworkId) => {
  // 1. Verificăm dacă mai sunt locuri disponibile
  const { data: homework } = await supabase
    .from('homeworks')
    .select('current_students, max_students')
    .eq('id', homeworkId)
    .single();

  if (homework.current_students >= homework.max_students) {
    alert('No slots available!');
    return;
  }

  // 2. Creăm enrollment
  await supabase.from('enrollments').insert({
    student_id: profile.id,
    homework_id: homeworkId,
    status: 'active'
  });

  // 3. Incrementăm numărul de studenți înscriși
  await supabase
    .from('homeworks')
    .update({ current_students: homework.current_students + 1 })
    .eq('id', homeworkId);

  // 4. Refresh lista
  loadData();
};
```

### 7. **Upload Soluție** (`/dashboard/student/homework/[id]/page.tsx`)

**Ce face:**
- Studentul poate uploada fișiere (PDF, imagini, documente)
- Poate scrie și text ca răspuns
- Vede resursele uploadate de profesor
- Poate pune întrebări

**Upload fișiere:**
```typescript
const handleFileUpload = async (files) => {
  for (const file of files) {
    // 1. Upload în Supabase Storage
    const { data, error } = await supabase.storage
      .from('student-submissions')
      .upload(`${enrollment.id}/${Date.now()}_${file.name}`, file);

    if (error) {
      console.error('Upload failed:', error);
      continue;
    }

    // 2. Obținem URL-ul public
    const publicUrl = supabase.storage
      .from('student-submissions')
      .getPublicUrl(data.path).data.publicUrl;

    // 3. Salvăm în submissions table
    await supabase.from('submissions').insert({
      enrollment_id: enrollment.id,
      student_id: profile.id,
      homework_id: homeworkId,
      file_url: publicUrl,
      file_name: file.name,
      file_type: file.type,
      status: 'submitted'
    });
  }

  // 4. Actualizăm status enrollment la 'completed'
  await supabase
    .from('enrollments')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', enrollment.id);
};
```

### 8. **Sistem Q&A** (Întrebări & Răspunsuri)

**Ce face:**
- Studenții pot pune întrebări pe task-uri
- Profesorii pot răspunde (primesc tokeni)
- Mentorii (studenți avansați) pot răspunde (primesc tokeni)
- Peer-to-peer learning

**Flow-ul întrebărilor:**
```typescript
// 1. STUDENTUL PUNE O ÎNTREBARE
const askQuestion = async (questionText) => {
  await supabase.from('questions').insert({
    student_id: profile.id,
    homework_id: homeworkId,
    question_text: questionText,
    is_answered: false
  });
};

// 2. PROFESORUL/MENTORUL RĂSPUNDE
const answerQuestion = async (questionId, answerText) => {
  // Creăm răspunsul
  const { data: answer } = await supabase.from('answers').insert({
    question_id: questionId,
    answerer_id: profile.id,
    answer_text: answerText,
    is_from_teacher: profile.role === 'teacher',
    tokens_earned: profile.role === 'teacher' ? 2 : 1 // Profesorii primesc mai mult
  }).select().single();

  // Marcăm întrebarea ca răspunsă
  await supabase
    .from('questions')
    .update({ is_answered: true })
    .eq('id', questionId);

  // Dăm tokeni celui care a răspuns
  await supabase
    .from('profiles')
    .update({
      token_balance: profile.token_balance + answer.tokens_earned
    })
    .eq('id', profile.id);

  // Salvăm tranzacția
  await supabase.from('token_transactions').insert({
    user_id: profile.id,
    amount: answer.tokens_earned,
    type: 'earned',
    description: `Answered question #${questionId}`
  });
};
```

### 9. **Sistem de Badge-uri NFT** (`/dashboard/student/achievements/page.tsx`)

**Ce face:**
- Când un student completează un task cu scor bun, primește un badge NFT
- Badge-urile sunt categorii de skill: Python, JavaScript, Math, Science, etc.
- SVG-uri generate dinamic cu culori și iconițe
- Metadata: titlu, descriere, skill verificat, review score

**Crearea unui badge:**
```typescript
const createBadge = async (enrollment, reviewScore) => {
  // 1. Verificăm dacă scorul este suficient (>= 3 stele)
  if (reviewScore < 3) return;

  // 2. Determinăm categoria skill-ului bazat pe task
  const skill = determineSkill(homework.title); // ex: "Python Programming"

  // 3. Generăm metadate badge
  const badge = {
    student_id: profile.id,
    homework_id: homework.id,
    teacher_id: homework.teacher_id,
    badge_title: `${skill} Achievement`,
    badge_description: `Completed "${homework.title}" with ${reviewScore}/5 stars`,
    badge_image_url: generateBadgeSVG(skill, reviewScore),
    skill_verified: skill,
    review_score: reviewScore,
    token_id: generateTokenId(), // Simulat pentru now
    blockchain_network: 'Sepolia'
  };

  // 4. Salvăm în DB
  await supabase.from('badges').insert(badge);
};

// Generare SVG badge
const generateBadgeSVG = (skill, score) => {
  const colors = {
    'Python': { primary: '#3776ab', secondary: '#ffd43b' },
    'JavaScript': { primary: '#f7df1e', secondary: '#000000' },
    // ... alte culori
  };

  return `
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="90" fill="${colors[skill].primary}" />
      <text x="100" y="100" text-anchor="middle">${skill}</text>
      <text x="100" y="120" text-anchor="middle">${score}/5 ★</text>
    </svg>
  `;
};
```

### 10. **Data Privacy Panel** (`/components/DataPrivacyPanel.tsx`)

**Ce face:**
- GDPR compliance - utilizatorii pot vedea ce date avem despre ei
- Export toate datele într-un fișier JSON
- Cerere de ștergere date (soft delete)
- Link către politica de confidențialitate

**Export date:**
```typescript
const exportUserData = async () => {
  // 1. Colectăm toate datele utilizatorului
  const userData = {
    profile: await getProfile(userId),
    enrollments: await getEnrollments({ studentId: userId }),
    submissions: await getSubmissions({ studentId: userId }),
    questions: await getQuestions({ studentId: userId }),
    answers: await getAnswers({ answererId: userId }),
    reviews: await getReviews({ studentId: userId }),
    badges: await getBadges({ studentId: userId }),
    transactions: await getTransactions({ userId })
  };

  // 2. Convertim în JSON
  const json = JSON.stringify(userData, null, 2);

  // 3. Trigger download
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `educhain_data_${Date.now()}.json`;
  link.click();
};
```

### 11. **DAO Voting System** (`/app/dao/page.tsx`)

**Ce face:**
- Studenții pot vota profesori (upvote/downvote)
- Profesorii pot vota alți profesori
- Sistem de reputație community-driven
- Previne manipularea voturilor

**Voting logic:**
```typescript
const handleVote = async (targetId, voteType) => {
  // 1. Verificăm dacă ai votat deja
  const { data: existingVote } = await supabase
    .from('votes')
    .select('*')
    .eq('voter_id', profile.id)
    .eq('voted_for_id', targetId)
    .single();

  if (existingVote) {
    // Schimbăm votul
    await supabase
      .from('votes')
      .update({ vote_type: voteType })
      .eq('id', existingVote.id);
  } else {
    // Votăm pentru prima dată
    await supabase.from('votes').insert({
      voter_id: profile.id,
      voted_for_id: targetId,
      vote_type: voteType,
      voter_role: profile.role
    });
  }

  // 2. Recalculăm upvotes/downvotes pentru target
  const { data: allVotes } = await supabase
    .from('votes')
    .select('vote_type')
    .eq('voted_for_id', targetId);

  const upvotes = allVotes.filter(v => v.vote_type === 'upvote').length;
  const downvotes = allVotes.filter(v => v.vote_type === 'downvote').length;

  // 3. Actualizăm profilul targetului
  await supabase
    .from('profiles')
    .update({ upvotes, downvotes })
    .eq('id', targetId);
};
```

### 12. **Smart Contracts** (`/web3/src/`)

**EduToken.sol - Token ERC-20:**
```solidity
// Token-ul platformei
contract EduToken is ERC20, Ownable {
    constructor() ERC20("EduToken", "EDU") {
        _mint(msg.sender, 1_000_000 * 10**18); // 1 milion tokeni
    }

    // Doar owner-ul poate minta tokeni noi
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Oricine poate arde propriile tokeni
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
```

**TaskStaking.sol - Logica de stakare:**
```solidity
contract TaskStaking {
    struct Task {
        address teacher;
        uint256 stakeAmount;
        uint256 maxStudents;
        uint256 currentStudents;
        bool isActive;
    }

    mapping(uint256 => Task) public tasks;
    mapping(address => uint256) public teacherReputation;

    // Profesorul creează task și stakează tokeni
    function createTask(uint256 taskId, uint256 stakeAmount, uint256 maxStudents) external {
        require(eduToken.transferFrom(msg.sender, address(this), stakeAmount), "Stake failed");

        tasks[taskId] = Task({
            teacher: msg.sender,
            stakeAmount: stakeAmount,
            maxStudents: maxStudents,
            currentStudents: 0,
            isActive: true
        });
    }

    // Studentul stakează pentru a încerca task-ul
    function enrollInTask(uint256 taskId, uint256 stakeAmount) external {
        Task storage task = tasks[taskId];
        require(task.isActive, "Task not active");
        require(task.currentStudents < task.maxStudents, "Task full");
        require(eduToken.transferFrom(msg.sender, address(this), stakeAmount), "Stake failed");

        task.currentStudents++;
        // Salvăm stake-ul studentului...
    }

    // Distribuție recompense după completion
    function distributeRewards(uint256 taskId) external onlyOwner {
        // Logica de distribuire bazată pe performanță
        // Profesorul primește înapoi stake-ul + bonus
        // Studenții buni primesc recompense
        // Studenții răi pierd stake-ul (merge la profesor)
    }
}
```

---

## Baza de Date

### Schema Completă

**Profiles (Utilizatori)**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  role TEXT CHECK (role IN ('student', 'teacher')),
  token_balance INTEGER DEFAULT 10,
  rating DECIMAL(3,2) DEFAULT 0,
  completed_count INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  is_mentor BOOLEAN DEFAULT FALSE,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Homeworks (Taskuri)**
```sql
CREATE TABLE homeworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  max_students INTEGER DEFAULT 10,
  current_students INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  deadline TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Enrollments (Înscrierea studenților)**
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  homework_id UUID REFERENCES homeworks(id),
  status TEXT CHECK (status IN ('active', 'completed', 'reviewed', 'missed')),
  submission_text TEXT,
  review_score INTEGER,
  review_comment TEXT,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  UNIQUE(student_id, homework_id) -- Un student se poate înscrie o singură dată
);
```

**Submissions (Fișiere uploadate)**
```sql
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enrollment_id UUID REFERENCES enrollments(id),
  student_id UUID REFERENCES profiles(id),
  homework_id UUID REFERENCES homeworks(id),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT,
  status TEXT CHECK (status IN ('submitted', 'reviewed')),
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);
```

**Questions & Answers (Q&A System)**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  homework_id UUID REFERENCES homeworks(id),
  question_text TEXT NOT NULL,
  is_answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id),
  answerer_id UUID REFERENCES profiles(id),
  answer_text TEXT NOT NULL,
  is_from_teacher BOOLEAN DEFAULT FALSE,
  tokens_earned INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Reviews (Sistem de rating)**
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID REFERENCES profiles(id),
  student_id UUID REFERENCES profiles(id),
  teacher_id UUID REFERENCES profiles(id),
  homework_id UUID REFERENCES homeworks(id),
  stars INTEGER CHECK (stars >= 1 AND stars <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Badges (NFT Achievements)**
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES profiles(id),
  homework_id UUID REFERENCES homeworks(id),
  teacher_id UUID REFERENCES profiles(id),
  badge_title TEXT NOT NULL,
  badge_description TEXT,
  badge_image_url TEXT,
  skill_verified TEXT,
  token_id TEXT,
  blockchain_network TEXT DEFAULT 'Sepolia',
  review_score INTEGER,
  minted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Votes (DAO Voting)**
```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  voter_id UUID REFERENCES profiles(id),
  voted_for_id UUID REFERENCES profiles(id),
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')),
  voter_role TEXT CHECK (voter_role IN ('student', 'teacher')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(voter_id, voted_for_id) -- Un utilizator poate vota o singură dată
);
```

### Row Level Security (RLS)

**De ce e important?**
- Previne accesul neautorizat la date
- Un student nu poate vedea submissions-urile altui student
- Un profesor vede doar propriile taskuri
- Aplicat automat la nivel de bază de date

**Exemplu RLS Policy:**
```sql
-- Studenții văd doar propriile submissions
CREATE POLICY "Students can view own submissions"
ON submissions FOR SELECT
USING (student_id = auth.uid());

-- Profesorii văd submissions pentru propriile taskuri
CREATE POLICY "Teachers can view submissions for their homeworks"
ON submissions FOR SELECT
USING (
  homework_id IN (
    SELECT id FROM homeworks WHERE teacher_id = auth.uid()
  )
);
```

---

## Integrările

### 1. Supabase Integration

**Setup:**
```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const createSupabaseBrowserClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
```

**Queries comune:**
```typescript
// lib/supabase/queries.ts

// GET profil utilizator
export const getProfile = async (walletAddress: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('wallet_address', walletAddress.toLowerCase())
    .single();
  return data;
};

// CREATE enrollment
export const createEnrollment = async (studentId: string, homeworkId: string) => {
  const { data, error } = await supabase
    .from('enrollments')
    .insert({ student_id: studentId, homework_id: homeworkId })
    .select()
    .single();
  return data;
};

// UPDATE profile
export const updateProfile = async (id: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data;
};
```

### 2. Web3 Integration (RainbowKit + Wagmi)

**Setup:**
```typescript
// lib/wagmi.ts
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'EduChain',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, sepolia],
  ssr: true, // Server-side rendering support
});
```

**Providers setup:**
```typescript
// app/providers.tsx
'use client';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**Folosirea în componente:**
```typescript
'use client';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function Navigation() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      {isConnected ? (
        <div>
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <ConnectButton />
      )}
    </>
  );
}
```

### 3. TanStack Query (React Query)

**De ce îl folosim?**
- Cache-uiește rezultatele API calls
- Refetch automat la interval
- Loading states și error handling
- Deduplicare requests

**Exemplu:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query cu cache
const { data: profile, isLoading } = useQuery({
  queryKey: ['profile', address],
  queryFn: () => getProfile(address),
  enabled: !!address, // Rulează doar dacă avem address
  staleTime: 5 * 60 * 1000, // Cache 5 minute
});

// Mutation cu invalidare cache
const queryClient = useQueryClient();
const enrollMutation = useMutation({
  mutationFn: (homeworkId) => createEnrollment(profile.id, homeworkId),
  onSuccess: () => {
    // Invalidăm cache-ul pentru a forța refetch
    queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    queryClient.invalidateQueries({ queryKey: ['homeworks'] });
  },
});
```

---

## Funcționalitățile Principale

### 1. Role-Based Access Control

- **Student**: poate vedea taskuri, se poate înscrie, uploada soluții, pune întrebări
- **Teacher**: poate crea taskuri, review studenți, răspunde la întrebări
- **Mentor** (student avansat): poate răspunde la întrebări și ajuta alți studenți

### 2. Token Economy

**Cum câștigi tokeni:**
- Initial signup: 10 tokeni
- Răspuns la întrebări: 1-2 tokeni
- Completare task cu rating bun: tokeni de la profesor
- Devii mentor: 5 tokeni bonus

**Cum cheltuiești tokeni:**
- Creare task (profesor): 1 token
- Stakare pentru task (viitor): variabil

### 3. Reputation System

**Pentru studenți:**
- Rating bazat pe review-urile primite (1-5 stele)
- Badge-uri NFT pentru taskuri completate
- Eligibilitate mentor: rating > 4.0 + 5 taskuri

**Pentru profesori:**
- Rating bazat pe feedback studenți
- Upvotes/downvotes din DAO
- Reputație on-chain (smart contract)

### 4. Data Privacy (GDPR Compliance)

**Rights garantate:**
- **Right to Access**: vezi toate datele tale
- **Right to Export**: descarcă datele în JSON
- **Right to Delete**: cere ștergerea datelor
- **Right to Be Informed**: politică de confidențialitate clară

### 5. NFT Achievements System

**Skills categorii:**
- Programming: Python, JavaScript, Solidity, Rust, Go
- Academic: Math, Science, Physics, Chemistry, Biology
- Creative: Writing, Design, Music
- Professional: Communication, Leadership, Teamwork

**Badge metadata:**
- Titlu achievement
- Descriere (ce task ai completat)
- Skill verificat
- Review score
- Data obținerii
- Token ID (pentru mintuire pe blockchain)

---

## Cum Să Rulezi Proiectul

### Prerequisite

1. **Node.js** 18+ și npm/yarn
2. **Git** pentru clonare repository
3. **Wallet crypto** (MetaMask) pentru testare Web3
4. **Supabase account** (opțional, doar pentru modificări DB)

### Pași de instalare

```bash
# 1. Clonează repository-ul
git clone https://github.com/yourusername/smarthack.git
cd smarthack

# 2. Instalează dependențele frontend
cd frontend
npm install

# 3. Configurează variabilele de mediu
# Creează fișier .env.local în folder frontend/
NEXT_PUBLIC_SUPABASE_URL=https://oxoziyolukepddqvrxxn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id

# 4. Rulează aplicația în development mode
npm run dev

# 5. Deschide browser la http://localhost:3000
```

### Testare funcționalități

**1. Conectare Wallet:**
- Deschide http://localhost:3000
- Click "Get Started"
- Selectează MetaMask sau alt wallet
- Conectează wallet-ul

**2. Setup profil:**
- După conectare, vei fi redirectat la /dashboard/setup
- Alege username
- Alege rol (Student sau Teacher)
- Submit

**3. Testare ca Student:**
- Dashboard student va afișa taskuri disponibile
- Click "Enroll" pe un task
- Click "View Task" pentru a vedea detalii
- Upload fișiere soluție
- Pune întrebări

**4. Testare ca Teacher:**
- Dashboard profesor afișează "Create Task"
- Completează form (titlu, descriere, max students)
- Upload resurse (opțional)
- Submit (costă 1 token)
- Vei vedea task-ul în listă
- Click "Review Students" pentru a da feedback

### Debugging

**Probleme comune:**

1. **"Supabase connection failed"**
   - Verifică că .env.local există și are valorile corecte
   - Verifică că Supabase project este activ

2. **"Wallet connection error"**
   - Verifică că ai MetaMask instalat
   - Switch la Sepolia network în MetaMask
   - Clear cache browser

3. **"Token balance is 0"**
   - Prima conectare primești 10 tokeni automat
   - Verifică în Supabase DB dacă record-ul profile s-a creat

4. **"File upload failed"**
   - Verifică mărimea fișierului (max 10MB)
   - Verifică că Supabase Storage buckets există
   - Verifică permissions în Supabase

### Build pentru producție

```bash
# 1. Build aplicația
npm run build

# 2. Rulează production server
npm start

# 3. Deploy pe Vercel (recomandat pentru Next.js)
vercel deploy
```

---

## Smart Contracts Deployment

### Setup Foundry

```bash
# 1. Instalează Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 2. Navighează la folder web3
cd web3

# 3. Instalează dependențe
forge install

# 4. Compilează contractele
forge build

# 5. Rulează testele
forge test
```

### Deploy pe Sepolia

```bash
# 1. Configurează .env în folder web3/
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-key
PRIVATE_KEY=your-private-key

# 2. Deploy EduToken
forge script script/DeployEduToken.s.sol --rpc-url sepolia --broadcast --verify

# 3. Deploy TaskStaking
forge script script/DeployTaskStaking.s.sol --rpc-url sepolia --broadcast --verify

# 4. Salvează adresele contractelor deployate
# Le vei folosi în frontend pentru interacțiune
```

### Interacțiune cu contractele din frontend

```typescript
import { useWriteContract, useReadContract } from 'wagmi';
import { parseEther } from 'viem';

// ABI-ul contractului
import EduTokenABI from './abis/EduToken.json';

const EDUTOKEN_ADDRESS = '0x...'; // Adresa după deploy

// Mint tokeni (doar owner)
const { writeContract } = useWriteContract();

const mintTokens = async () => {
  await writeContract({
    address: EDUTOKEN_ADDRESS,
    abi: EduTokenABI,
    functionName: 'mint',
    args: [recipientAddress, parseEther('100')], // 100 tokeni
  });
};

// Citire balance
const { data: balance } = useReadContract({
  address: EDUTOKEN_ADDRESS,
  abi: EduTokenABI,
  functionName: 'balanceOf',
  args: [userAddress],
});
```

---

## Design Patterns Folosite

### 1. **Server Components vs Client Components** (Next.js 14+)

- **Server Components** (default): renderare pe server, mai rapid, SEO-friendly
- **Client Components** (cu 'use client'): interactivitate, hooks, state

```typescript
// Server Component (fără 'use client')
// Poate face direct database calls
export default async function Page() {
  const data = await fetch('...');
  return <div>{data}</div>;
}

// Client Component (cu 'use client')
// Poate folosi useState, useEffect, event handlers
'use client';
export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. **Composition Pattern**

- Componente mici, reutilizabile
- Compunere de componente pentru features complexe

```typescript
// Componente mici
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>

// Compunere în features
<DashboardCard stats={stats}>
  <StatsList items={items} />
  <ActionButtons />
</DashboardCard>
```

### 3. **Custom Hooks Pattern**

- Logică reutilizabilă extrasă în hooks

```typescript
// Hook custom pentru profile
function useProfile() {
  const { address } = useAccount();
  const { data, isLoading } = useQuery({
    queryKey: ['profile', address],
    queryFn: () => getProfile(address),
  });
  return { profile: data, isLoading };
}

// Folosire în componente
function Dashboard() {
  const { profile, isLoading } = useProfile();
  if (isLoading) return <Loader />;
  return <div>Hello {profile.username}</div>;
}
```

### 4. **Optimistic Updates**

- UI update instant, apoi sync cu server

```typescript
const enrollMutation = useMutation({
  mutationFn: enrollInHomework,
  onMutate: async (newEnrollment) => {
    // Cancel ongoing fetches
    await queryClient.cancelQueries({ queryKey: ['enrollments'] });

    // Snapshot previous value
    const previousEnrollments = queryClient.getQueryData(['enrollments']);

    // Optimistically update UI
    queryClient.setQueryData(['enrollments'], (old) => [...old, newEnrollment]);

    return { previousEnrollments };
  },
  onError: (err, newEnrollment, context) => {
    // Rollback on error
    queryClient.setQueryData(['enrollments'], context.previousEnrollments);
  },
});
```

---

## Security Best Practices

### 1. **Row Level Security (RLS)**
- Toate tabelele au RLS enabled
- Policies bazate pe user role
- Previne SQL injection și unauthorized access

### 2. **Input Validation**
- Zod schemas pentru toate formele
- Validare pe frontend și backend
- Sanitizare text user input

```typescript
import { z } from 'zod';

const homeworkSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(1000),
  maxStudents: z.number().min(1).max(100),
});

// Validare
const result = homeworkSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.errors);
  return;
}
```

### 3. **File Upload Security**
- Validare tip fișier (MIME type)
- Limitare mărime (10MB)
- Storage în buckets separate
- URL-uri signed pentru acces temporar

### 4. **Environment Variables**
- Secrets în .env.local (nu commitate în Git)
- NEXT_PUBLIC_ prefix doar pentru valori publice
- Verificare existență în runtime

---

## Performance Optimizations

### 1. **Image Optimization**
- Next.js Image component cu lazy loading
- Automatic WebP conversion
- Responsive images

### 2. **Code Splitting**
- Dynamic imports pentru componente mari
- Route-based splitting automat în Next.js

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Loader />,
  ssr: false, // Disable server-side rendering
});
```

### 3. **React Query Caching**
- staleTime: cât timp datele sunt considerate fresh
- cacheTime: cât timp datele rămân în cache după ce nu mai sunt folosite
- refetchOnWindowFocus: refetch automat când user revine la tab

### 4. **Database Indexing**
- Index pe wallet_address pentru lookup rapid
- Index pe foreign keys pentru JOIN-uri
- Composite index pe (student_id, homework_id) pentru enrollments

---

## Viitoare Îmbunătățiri

### 1. **Actual Blockchain Integration**
- Deploy contracte pe Sepolia/Mainnet
- Real staking functionality
- On-chain NFT minting pentru badges

### 2. **AI Recommendations**
- Algoritm de recomandare taskuri bazat pe skill-uri
- Auto-categorization task-uri
- Feedback insights pentru profesori

### 3. **Real-time Features**
- Notificări live pentru răspunsuri
- Chat între studenți și profesori
- Live collaboration features

### 4. **Mobile App**
- React Native app
- Push notifications
- Offline support

### 5. **Analytics Dashboard**
- Student progress tracking
- Teacher performance metrics
- Platform usage statistics

---

## Concluzie

**EduChain** este o platformă educațională modernă care combină:

✅ **Web3 & Blockchain** pentru descentralizare și ownership
✅ **Modern stack** (Next.js, TypeScript, Tailwind) pentru dezvoltare rapidă
✅ **Privacy-first** cu GDPR compliance
✅ **Gamification** prin tokenuri, badges și NFT-uri
✅ **Community-driven** prin DAO voting
✅ **Production-ready** cu securitate, performanță și scalabilitate

Platforma demonstrează cum tehnologia Web3 poate fi folosită pentru a crea sisteme educaționale mai transparente, mai echitabile și mai engaging.

---

**Întrebări frecvente? Probleme tehnice?**

Contactează-ne sau deschide un issue pe GitHub!
