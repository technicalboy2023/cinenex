import AdSlot from './AdSlot';

export default function AdBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-4 ${className}`}>
      <AdSlot format="horizontal" className="max-w-5xl mx-auto" />
    </div>
  );
}
