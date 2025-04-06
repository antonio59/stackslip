import React, { useEffect, useState, useRef } from 'react';
import { Award, MessageSquare, ThumbsUp, Trophy, Download, HelpCircle, Vote, Share2, Link } from 'lucide-react';
import { format as formatDate } from 'date-fns';
import { toPng, toJpeg } from 'html-to-image';
import JsBarcode from 'jsbarcode';
import { fetchUserData, fetchUserTags, type StackOverflowUser } from '../services/stackOverflowApi';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReceiptProps {
  show: boolean;
  username: string;
}

export function Receipt({ show, username }: ReceiptProps) {
  const [userData, setUserData] = useState<StackOverflowUser | null>(null);
  const [userTags, setUserTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    async function loadUserData() {
      if (!show || !username) return;
      
      setLoading(true);
      try {
        if (!mounted) return;
        
        const data = await fetchUserData(username);
        if (!mounted) return;
        
        setUserData(data);
        const tags = await fetchUserTags(data.user_id);
        setUserTags(tags);

        // Generate barcode after data is loaded
        if (barcodeRef.current && data.user_id) {
          const stackOverflowUrl = `stackoverflow.com/users/${data.user_id}`;
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
          } catch (error) {
            console.error('Error generating barcode:', error);
          }
        }
      } catch (error) {
        if (!mounted) return;
        
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error loading user data:', errorMessage);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      mounted = false;
    };
  }, [show, username, toast]);

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

  if (!show || !userData) return null;

  const stackOverflowUrl = `stackoverflow.com/users/${userData.user_id}`;

  return (
    <div className="space-y-4">
      <div ref={receiptRef} className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full font-mono">
        <div className="text-center border-b border-dashed border-gray-300 pb-4">
          <h2 className="text-2xl font-bold mb-2">STACKOVERFLOW RECEIPT</h2>
          <p className="text-gray-600">{formatDate(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          <p className="text-sm text-gray-500">ORDER #{userData.user_id.toString().padStart(4, '0')}</p>
        </div>

        <div className="border-b border-dashed border-gray-300 py-4">
          <p className="font-bold">CUSTOMER: {userData.display_name}</p>
          <div className="text-gray-600 flex items-center gap-2">
            <Link size={14} />
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

        <div className="border-b border-dashed border-gray-300 py-6 space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy size={16} />
              <span>REPUTATION</span>
            </div>
            <span>{userData.reputation.toLocaleString()}</span>
          </div>

          <div className="text-sm text-gray-600 pl-6 space-y-1">
            <div className="flex justify-between">
              <span>THIS WEEK</span>
              <span>+{userData.reputation_change_week.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>THIS MONTH</span>
              <span>+{userData.reputation_change_month.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>THIS YEAR</span>
              <span>+{userData.reputation_change_year.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Award size={16} />
              <span>BADGES</span>
            </div>
            <div className="text-right">
              <span className="text-yellow-500 mr-2">●{userData.badge_counts.gold}</span>
              <span className="text-gray-400 mr-2">●{userData.badge_counts.silver}</span>
              <span className="text-amber-600">●{userData.badge_counts.bronze}</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HelpCircle size={16} />
              <span>QUESTIONS</span>
            </div>
            <span>{userData.question_count.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>ANSWERS</span>
            </div>
            <span>{userData.answer_count.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ThumbsUp size={16} />
              <span>ACCEPT RATE</span>
            </div>
            <span>{userData.accept_rate || 'N/A'}%</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Vote size={16} />
              <span>VOTES CAST</span>
            </div>
            <span>+{userData.up_vote_count.toLocaleString()} / -{userData.down_vote_count.toLocaleString()}</span>
          </div>
        </div>

        <div className="py-4 text-center text-sm">
          <p>Served by: Antonio Smith</p>
          <p>{formatDate(new Date(), 'HH:mm:ss')}</p>
        </div>

        <div className="border-t border-dashed border-gray-300 pt-4 text-center">
          <p className="font-bold">COUPON CODE: {Math.random().toString(36).substring(2, 8).toUpperCase()}</p>
          <p className="text-sm text-gray-600">Save for your next Stack!</p>
          <p className="text-xs text-gray-500 mt-2">CARD #: **** **** **** 2024</p>
          <p className="text-xs text-gray-500">AUTH CODE: {Math.random().toString().substring(2, 8)}</p>
          <p className="text-xs text-gray-500">CARDHOLDER: {userData.display_name.toUpperCase()}</p>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <svg ref={barcodeRef} className="w-full"></svg>
          <p className="text-center text-sm mt-2">THANK YOU FOR SHARING YOUR KNOWLEDGE!</p>
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