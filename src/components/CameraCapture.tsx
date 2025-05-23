
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CameraCaptureProps {
  friendImageUrl: string;
  onCombinedImage: (combinedImageDataUrl: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ friendImageUrl, onCombinedImage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  // Request camera permission and setup stream
  const setupCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "user",
          width: { ideal: isMobile ? 1280 : 1920 },
          height: { ideal: isMobile ? 720 : 1080 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    }
  };

  // Clean up function to stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleOpenCamera = () => {
    setIsOpen(true);
    setupCamera();
  };

  const handleClose = () => {
    setIsOpen(false);
    setCapturedImage(null);
    stopCamera();
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        // Get the captured image as data URL
        const imageDataUrl = canvasRef.current.toDataURL('image/png');
        setCapturedImage(imageDataUrl);
        
        // Stop the camera after capturing
        stopCamera();
        
        // Create combined image
        setTimeout(() => {
          createCombinedImage(imageDataUrl);
        }, 500);
      }
    }
  };

  const createCombinedImage = async (capturedImageUrl: string) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Create new images from URLs
    const friendImg = new Image();
    const capturedImg = new Image();
    
    // Wait for both images to load
    const friendImgLoaded = new Promise<void>((resolve) => {
      friendImg.onload = () => resolve();
      friendImg.src = friendImageUrl;
    });
    
    const capturedImgLoaded = new Promise<void>((resolve) => {
      capturedImg.onload = () => resolve();
      capturedImg.src = capturedImageUrl;
    });
    
    await Promise.all([friendImgLoaded, capturedImgLoaded]);
    
    // Set canvas size to fit both images side by side
    const maxHeight = Math.max(friendImg.height, capturedImg.height);
    const scaledWidth = isMobile ? 300 : 400; // Smaller width for mobile
    
    const scaledFriendWidth = scaledWidth;
    const scaledFriendHeight = (friendImg.height / friendImg.width) * scaledFriendWidth;
    
    const scaledCapturedWidth = scaledWidth;
    const scaledCapturedHeight = (capturedImg.height / capturedImg.width) * scaledCapturedWidth;
    
    // Set canvas dimensions
    canvas.width = scaledFriendWidth + scaledCapturedWidth;
    canvas.height = Math.max(scaledFriendHeight, scaledCapturedHeight) + 60; // Extra space for text
    
    // Draw images side by side with proper scaling
    context.fillStyle = '#FFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.drawImage(friendImg, 0, 0, scaledFriendWidth, scaledFriendHeight);
    context.drawImage(capturedImg, scaledFriendWidth, 0, scaledCapturedWidth, scaledCapturedHeight);
    
    // Add heart between images
    context.font = isMobile ? '36px Arial' : '48px Arial';
    context.fillStyle = '#FF4757';
    context.textAlign = 'center';
    context.fillText('❤️', scaledFriendWidth / 2, canvas.height / 2);
    
    // Draw text at the bottom
    context.font = isMobile ? '18px Arial' : '24px Arial';
    context.fillStyle = '#FF4757';
    context.textAlign = 'center';
    context.fillText('Made for each other', canvas.width / 2, canvas.height - 20);
    
    // Convert to data URL and pass it back
    const combinedImageUrl = canvas.toDataURL('image/png');
    onCombinedImage(combinedImageUrl);
    
    // Close the camera modal
    handleClose();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!isOpen) {
    return (
      <Button 
        onClick={handleOpenCamera} 
        variant="secondary"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full bg-romantic-dark/70 hover:bg-romantic-dark shadow-md"
      >
        <Camera className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 w-full max-w-md flex flex-col items-center">
        <h3 className="text-xl font-bold mb-4">Take a Photo</h3>
        
        {!capturedImage ? (
          <>
            {hasPermission === false && (
              <div className="text-red-500 mb-4">
                Camera permission denied. Please allow camera access.
              </div>
            )}
            <div className="relative w-full aspect-square mb-4 bg-gray-200 rounded overflow-hidden">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
            <div className="flex gap-4 w-full justify-center">
              <Button onClick={handleClose} variant="outline" className="w-1/3">
                Cancel
              </Button>
              <Button onClick={capturePhoto} variant="default" className="w-1/3">
                Capture
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="relative w-full aspect-square mb-4 bg-gray-200 rounded overflow-hidden">
              <img 
                src={capturedImage} 
                alt="Captured"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4 w-full justify-center">
              <Button onClick={handleClose} variant="outline" className="w-1/3">
                Cancel
              </Button>
              <Button onClick={setupCamera} variant="default" className="w-1/3">
                Retake
              </Button>
            </div>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
