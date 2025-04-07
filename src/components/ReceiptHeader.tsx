// Removed unused React import
import { format as formatDate } from 'date-fns';

interface ReceiptHeaderProps {
  userId: number;
}

export function ReceiptHeader({ userId }: ReceiptHeaderProps) {
  return (
    <div className="text-center border-b border-dashed border-gray-300 pb-4">
      <h2 className="text-2xl font-bold mb-2">STACKOVERFLOW RECEIPT</h2>
      <p className="text-gray-600">{formatDate(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      <p className="text-sm text-gray-500">ORDER #{userId.toString().padStart(4, '0')}</p>
    </div>
  );
}