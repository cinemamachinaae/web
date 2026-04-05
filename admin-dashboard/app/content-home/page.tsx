export default function ContentHomePage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Homepage Content</h2>
        <p className="text-sm text-foreground/50">Manage hero, feature sections, and CTA blocks.</p>
      </div>
      <div className="admin-card min-h-[600px] flex items-center justify-center border-dashed border-2">
        <p className="text-foreground/30 font-medium">Section Editor coming soon...</p>
      </div>
    </div>
  );
}
