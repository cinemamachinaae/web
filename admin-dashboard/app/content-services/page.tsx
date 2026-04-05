export default function ContentServicesPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Services Content</h2>
        <p className="text-sm text-foreground/50">Manage service descriptions, tiers, and technical tiers.</p>
      </div>
      <div className="admin-card min-h-[400px] flex items-center justify-center border-dashed border-2">
        <p className="text-foreground/30 font-medium">Services Editor coming soon...</p>
      </div>
    </div>
  );
}
