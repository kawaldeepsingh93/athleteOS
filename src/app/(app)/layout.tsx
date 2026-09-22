import { AppShell } from "@/components/layout/app-shell";
import { SupabaseSync } from "@/components/persist/supabase-sync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <SupabaseSync />
      {children}
    </AppShell>
  );
}
