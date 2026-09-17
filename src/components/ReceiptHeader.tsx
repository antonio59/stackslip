// Removed unused React import
import { format as formatDate } from 'date-fns';

interface ReceiptHeaderProps {
  userId: number;
}

export function ReceiptHeader({ userId }: ReceiptHeaderProps) {
  return (
    <div className="text-center border-b border-dashed border-ink-faint pb-4">
      <h2 className="text-xl font-bold mb-1 tracking-tight">STACKOVERFLOW RECEIPT</h2>
      <p className="text-ink-soft text-xs">{formatDate(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      <p className="text-xs text-ink-faint mt-1">ORDER #{userId.toString().padStart(4, '0')}</p>
    </div>
  );
}
