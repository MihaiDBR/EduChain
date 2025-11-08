# Deployment Guide

This guide will help you deploy the EduChain platform for the hackathon demo.

## Prerequisites

- Supabase account
- Vercel account (or other Next.js hosting)
- Ethereum testnet (Sepolia, Mumbai, etc.)
- WalletConnect Project ID
- MetaMask or other Web3 wallet

## Step 1: Deploy Database (Supabase)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project details
4. Wait for project to be created (~2 minutes)

### 1.2 Run Database Migration
1. Go to SQL Editor in your Supabase dashboard
2. Create a new query
3. Copy entire content from `supabase/migrations/001_initial_schema.sql`
4. Paste and run the query
5. Verify tables are created in Table Editor

### 1.3 Get API Keys
1. Go to Project Settings > API
2. Copy `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
3. Copy `anon/public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Step 2: Deploy Smart Contracts

### 2.1 Setup Foundry
```bash
cd web3
forge install OpenZeppelin/openzeppelin-contracts
```

### 2.2 Create Deployment Script
Create `web3/script/Deploy.s.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EduToken.sol";
import "../src/TaskStaking.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy EDU Token
        EduToken eduToken = new EduToken(msg.sender);
        console.log("EduToken deployed at:", address(eduToken));

        // Deploy TaskStaking
        TaskStaking taskStaking = new TaskStaking(address(eduToken), msg.sender);
        console.log("TaskStaking deployed at:", address(taskStaking));

        vm.stopBroadcast();
    }
}
```

### 2.3 Deploy to Testnet
```bash
# Create .env in web3 folder
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-API-KEY

# Deploy
forge script script/Deploy.s.sol:DeployScript --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

### 2.4 Save Contract Addresses
After deployment, save the contract addresses. You'll need them for the frontend.

## Step 3: Configure Frontend

### 3.1 Create Environment Variables
Create `frontend/.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Smart Contracts (add after deployment)
NEXT_PUBLIC_EDU_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_TASK_STAKING_ADDRESS=0x...

# Chain (e.g., Sepolia = 11155111)
NEXT_PUBLIC_CHAIN_ID=11155111
```

### 3.2 Update Wagmi Config
Edit `frontend/lib/wagmi.ts` to include your deployed contract addresses if needed.

### 3.3 Install Dependencies
```bash
cd frontend
npm install
```

### 3.4 Test Locally
```bash
npm run dev
```
Visit http://localhost:3000

## Step 4: Deploy Frontend to Vercel

### 4.1 Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 4.2 Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Import your GitHub repository
4. Set root directory to `frontend`
5. Add environment variables from `.env.local`
6. Click "Deploy"

### 4.3 Verify Deployment
1. Visit your Vercel URL
2. Connect wallet
3. Test creating a profile
4. Test creating a task (as teacher)
5. Test browsing tasks (as student)

## Step 5: Initial Setup & Demo Data

### 5.1 Create Test Profiles
1. Connect with two different wallets
2. Set one as "Teacher" role
3. Set one as "Student" role

### 5.2 Create Sample Tasks
As teacher:
- Create 3-5 sample tasks with different difficulties
- Use realistic descriptions
- Set reasonable stake/reward amounts

### 5.3 Test Student Flow
As student:
- Browse tasks
- View recommendations
- Submit a task
- Test chat feature

## Troubleshooting

### Database Issues
- Verify RLS policies are enabled
- Check that auth is configured
- Ensure migrations ran successfully

### Smart Contract Issues
- Verify deployment on block explorer
- Check token approval before staking
- Ensure you have testnet ETH

### Frontend Issues
- Clear browser cache
- Check browser console for errors
- Verify environment variables are set
- Ensure wallet is on correct network

## Demo Checklist

Before presenting:
- [ ] Database tables created and accessible
- [ ] Smart contracts deployed and verified
- [ ] Frontend deployed and accessible
- [ ] At least 2 test profiles (teacher & student)
- [ ] 3-5 sample tasks created
- [ ] Wallet connection working
- [ ] Chat feature functional
- [ ] Data privacy panel accessible
- [ ] Recommendation system working

## Quick Demo Script

1. **Introduction** (1 min)
   - Show landing page
   - Explain the concept

2. **Teacher Flow** (2 min)
   - Connect wallet as teacher
   - Show dashboard
   - Create a new task
   - Explain staking mechanism

3. **Student Flow** (3 min)
   - Connect as student
   - Browse tasks
   - Show AI recommendations with explanations
   - Attempt a task
   - Show chat with AI

4. **Transparency & Ethics** (2 min)
   - Open settings page
   - Show data privacy controls
   - Explain algorithmic transparency
   - Show reputation system explanation

5. **Q&A** (2 min)

## Post-Hackathon

If continuing development:
- Add OpenAI integration for real AI responses
- Implement actual smart contract integration
- Add more comprehensive tests
- Improve UI/UX
- Add mobile responsiveness
- Implement NFT certificates
- Add DAO governance

---

Good luck with your hackathon! 🚀
