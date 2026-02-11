type SectionBadgeProps = {
  children: React.ReactNode;
};

export default function SectionBadge({ children }: SectionBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                    bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-medium">
      <span className="w-1.5 h-1.5 bg-white rounded-full" />
      {children}
      <span className="w-1.5 h-1.5 bg-white rounded-full" />
    </div>
  );
}
