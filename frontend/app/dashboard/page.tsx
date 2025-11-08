'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.replace('/');
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl rounded-lg bg-white p-10 shadow-sm dark:bg-black">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Dashboard</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Authorized wallet: <span className="font-mono">{address}</span>
        </p>
        <button
          type="button"
          onClick={() => {
            disconnect();
            router.replace('/');
          }}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          Disconnect
        </button>
      </main>
    </div>
  );
}


