import { ReactNode } from 'react';
import { TopNav } from './TopNav';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="p-6 lg:p-8 max-w-[1600px] mx-auto relative">
        {children}
      </main>
    </div>
  );
}
