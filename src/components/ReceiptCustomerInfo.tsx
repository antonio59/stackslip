// Removed unused React import
import { Link as LinkIcon } from 'lucide-react'; // Renamed to avoid conflict with HTML 'a' tag

interface ReceiptCustomerInfoProps {
  displayName: string;
  userId: number;
}

export function ReceiptCustomerInfo({ displayName, userId }: ReceiptCustomerInfoProps) {
  const stackOverflowUrl = `stackoverflow.com/users/${userId}`;

  return (
    <div className="border-b border-dashed border-gray-300 py-4">
      <p className="font-bold">CUSTOMER: {displayName}</p>
      <div className="text-gray-600 flex items-center gap-2">
        <LinkIcon size={14} />
        <a
          href={`https://${stackOverflowUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-500 transition-colors"
        >
          {stackOverflowUrl}
        </a>
      </div>
    </div>
  );
}