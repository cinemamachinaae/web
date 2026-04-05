export default function BrandAssetsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Brand Assets</h2>
        <p className="text-sm text-foreground/50">Manage logos, brand marks, and identity files.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1,2,3].map(i => (
          <div key={i} className="admin-card aspect-video flex items-center justify-center border-dashed border-2">
            <p className="text-foreground/20 text-xs font-bold uppercase tracking-widest">Asset Slot {i}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
