// Reusable ad slot component — renders nothing if AdSense not configured
'use client';

interface AdSlotProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // Don't render if no AdSense client ID
  if (!clientId) return null;

  return (
    <div className={`ad-container flex items-center justify-center min-h-[90px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
