import { useEffect, useRef } from 'react'; // Removed unused React import
import { Download, Share2 } from 'lucide-react'; // Keep only icons used directly here
import { format as formatDate } from 'date-fns'; // Keep for getFileName
import { toPng, toJpeg } from 'html-to-image';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useStackOverflowData } from '../hooks/useStackOverflowData';
import { ReceiptHeader } from './ReceiptHeader'; // Import sub-components
import { ReceiptCustomerInfo } from './ReceiptCustomerInfo';
import { ReceiptStats } from './ReceiptStats';
import { ReceiptFooter } from './ReceiptFooter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; // Corrected import path

interface ReceiptProps {
  show: boolean;
  username: string;
}

export function Receipt({ show, username }: ReceiptProps) {
  const {
    userData,
    // userTags, // Removed as it's not currently used
    loading,
    error,
    couponCode,
    authCode,
    fetchData
  } = useStackOverflowData();
  
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast(); // Keep toast for download/share errors

  // Effect to fetch data when component should be shown and username is provided
  useEffect(() => {
    if (show && username) {
      fetchData(username);
    }
    // Intentionally not resetting data when show becomes false,
    // so the receipt persists until a new username is generated.
    // Resetting happens within fetchData if needed.
  }, [show, username, fetchData]);

  const getFileName = (format: string) => {
    return `stackslip_${formatDate(new Date(), 'yyyy-MM-dd')}.${format}`;
  };

  const downloadReceipt = async (format: 'png' | 'jpg') => {
    if (!receiptRef.current) return;

    try {
      const dataUrl = format === 'png' 
        ? await toPng(receiptRef.current)
        : await toJpeg(receiptRef.current);
      
      const link = document.createElement('a');
      link.download = getFileName(format);
      link.href = dataUrl;
      link.click();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error downloading receipt:', errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareReceipt = async () => {
    if (!receiptRef.current) return;

    try {
      const dataUrl = await toPng(receiptRef.current);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], getFileName('png'), { type: 'image/png' });
      
      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'StackSlip - Stack Overflow Receipt',
          text: 'Check out my Stack Overflow stats!'
        });
      } else {
        // Fallback to download if sharing is not supported
        downloadReceipt('png');
        toast({
          title: "Info",
          description: "Sharing is not supported on your device. The receipt has been downloaded instead.",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error sharing receipt:', errorMessage);
      
      if (errorMessage.includes('Permission denied')) {
        toast({
          title: "Info",
          description: "Sharing requires a secure connection (HTTPS) and user interaction.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to share receipt. Please try downloading instead.",
          variant: "destructive",
        });
      }
    }
  };

  // Display loading state as a short stub feeding out of the printer
  if (loading) {
    return (
      <div className="receipt-paper receipt-edge w-full max-w-[340px] px-6 py-6 text-center text-xs text-ink-soft" role="status">
        PRINTING<span className="receipt-blink">_</span>
      </div>
    );
  }

  // Don't render anything if not shown, or if there was an error and no data
  if (!show || !userData) {
     // Optionally, display the error message if an error occurred
     if (error && show) {
       return (
         <div className="receipt-paper receipt-edge w-full max-w-[340px] px-6 py-6 text-center" role="alert">
           <p className="text-xs font-bold text-stamp">** ERROR **</p>
           <p className="mt-2 text-xs text-ink-soft">{error}</p>
         </div>
       );
     }
     return null;
  }

  // const stackOverflowUrl = `stackoverflow.com/users/${userData.user_id}`; // Removed as it's not used directly here anymore


  return (
    <div className="w-full max-w-[340px] space-y-5">
      {/* The actual receipt content — prints top-to-bottom on generate */}
      <div className="receipt-print">
        <div ref={receiptRef} className="receipt-paper receipt-edge px-6 pb-8 pt-9 text-[13px] leading-relaxed">
          <ReceiptHeader userId={userData.user_id} />
          <ReceiptCustomerInfo
            displayName={userData.display_name}
            userId={userData.user_id}
          />
          <ReceiptStats userData={userData} />
          <ReceiptFooter
            displayName={userData.display_name}
            couponCode={couponCode}
            authCode={authCode}
            userId={userData.user_id} // Pass userId for barcode generation
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => downloadReceipt('png')}>
              PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => downloadReceipt('jpg')}>
              JPG
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          onClick={shareReceipt}
          className="flex items-center gap-2"
        >
          <Share2 size={16} />
          Share
        </Button>
      </div>
    </div>
  );
}