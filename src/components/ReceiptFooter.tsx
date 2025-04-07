import { useEffect, useRef } from 'react';
import { format as formatDate } from 'date-fns';
import JsBarcode from 'jsbarcode';
import { useToast } from './ui/use-toast'; // Import useToast

interface ReceiptFooterProps {
  displayName: string;
  couponCode: string;
  authCode: string;
  userId: number; // Add userId prop
}

export function ReceiptFooter({ displayName, couponCode, authCode, userId }: ReceiptFooterProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast(); // Get toast function from the hook

  // Effect to generate barcode when userId is available
  useEffect(() => {
    if (barcodeRef.current && userId) {
      const stackOverflowUrl = `stackoverflow.com/users/${userId}`;
      try {
        JsBarcode(barcodeRef.current, stackOverflowUrl, {
          format: "CODE128",
          width: 2,
          height: 50,
          displayValue: true,
          fontSize: 12,
          font: 'monospace',
          textMargin: 2,
          margin: 10
        });
      } catch (barcodeError) {
        console.error('Error generating barcode:', barcodeError);
        toast({
          title: "Barcode Error",
          description: "Failed to generate barcode.",
          variant: "destructive",
        });
      }
    }
  }, [userId, toast]); // Depend on userId and toast

  return (
    <>
      {/* Served By & Time */}
      <div className="py-4 text-center text-sm">
        <p>Served by: Antonio Smith</p> {/* Consider making this dynamic */}
        <p>{formatDate(new Date(), 'HH:mm:ss')}</p>
      </div>

      {/* Coupon & Auth */}
      <div className="border-t border-dashed border-gray-300 pt-4 text-center">
        <p className="font-bold">COUPON CODE: {couponCode}</p>
        <p className="text-sm text-gray-600">Save for your next Stack!</p>
        <p className="text-xs text-gray-500 mt-2">CARD #: **** **** **** 2024</p> {/* Consider making this dynamic/configurable */}
        <p className="text-xs text-gray-500">AUTH CODE: {authCode}</p>
        <p className="text-xs text-gray-500">CARDHOLDER: {displayName.toUpperCase()}</p>
      </div>

      {/* Barcode & Thank You */}
      <div className="mt-4 flex flex-col items-center">
        <svg ref={barcodeRef} className="w-full"></svg>
        <p className="text-center text-sm mt-2">THANK YOU FOR SHARING YOUR KNOWLEDGE!</p>
      </div>
    </>
  );
}