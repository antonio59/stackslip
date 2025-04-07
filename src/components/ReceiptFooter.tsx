import { RefObject } from 'react'; // Removed unused React import
import { format as formatDate } from 'date-fns';

interface ReceiptFooterProps {
  displayName: string;
  couponCode: string;
  authCode: string;
  barcodeRef: RefObject<SVGSVGElement>;
}

export function ReceiptFooter({ displayName, couponCode, authCode, barcodeRef }: ReceiptFooterProps) {
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