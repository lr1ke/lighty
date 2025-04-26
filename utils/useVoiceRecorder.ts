// import { useState, useRef } from "react";

// export default function useVoiceRecorder() {
//   const [isRecording, setIsRecording] = useState<boolean>(false);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunks = useRef<Blob[]>([]);



//   const startRecording = async (): Promise<void> => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;

//       mediaRecorder.ondataavailable = (event: BlobEvent) => {
//         if (event.data.size > 0) {
//           audioChunks.current.push(event.data);
//         }
//       };

//       mediaRecorder.onstop = () => {
//         const recordedBlob = new Blob(audioChunks.current, { type: "audio/mp3" });
//         setAudioBlob(recordedBlob);
//         audioChunks.current = [];
//       };

//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Error accessing microphone:", error);
//     }
//   };

//   const stopRecording = (): void => {
//     const mediaRecorder = mediaRecorderRef.current;
//     if (mediaRecorder && mediaRecorder.state !== "inactive") {
//       mediaRecorder.stop();
//       setIsRecording(false);
//     }
//   };

//   return { isRecording, audioBlob, startRecording, stopRecording };
// }


import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Check if browser supports required APIs
  const isSupportedBrowser = (): boolean => {
    return !!(
      typeof navigator !== 'undefined' && 
      navigator.mediaDevices && 
      typeof navigator.mediaDevices.getUserMedia === 'function' && 
      typeof window !== 'undefined' && 
      'MediaRecorder' in window
    );
  };

  const startRecording = async (): Promise<void> => {
    // Clear any previous recording data
    setAudioBlob(null);
    audioChunks.current = [];

    if (!isSupportedBrowser()) {
      toast.error('Your browser does not support voice recording');
      return;
    }

    try {
      console.log('Requesting microphone access...');

      // Enhanced audio constraints for better iOS compatibility
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Microphone access granted');

      // Determine the best audio format based on browser support
      let mediaRecorder: MediaRecorder;
      
      // Try WebM first (works well on most browsers)
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        console.log('Using audio/webm format');
      } 
      // Try MP4 next (better for iOS)
      else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
        console.log('Using audio/mp4 format');
      }
      // Fallback to default format
      else {
        mediaRecorder = new MediaRecorder(stream);
        console.log('Using default audio format');
      }

      mediaRecorderRef.current = mediaRecorder;

      // Capture data more frequently on iOS (250ms chunks)
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        console.log(`Recorded chunk: ${event.data.size} bytes`);
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        console.log('Recording stopped, processing audio...');
        
        // Create a blob with the appropriate type
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const recordedBlob = new Blob(audioChunks.current, { type: mimeType });
        console.log(`Created audio blob: ${recordedBlob.size} bytes, type: ${mimeType}`);
        
        setAudioBlob(recordedBlob);
        
        // Stop all tracks to fully release the microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Reset recording state
        setIsRecording(false);
      };

      // Start recording with smaller timeslices for more frequent data
      mediaRecorder.start(250);
      setIsRecording(true);
      console.log('Recording started successfully');
      
      // Auto-stop recording after 30 seconds (especially helpful for iOS)
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          console.log('Maximum recording duration reached (30sec), stopping automatically');
          stopRecording();
        }
      }, 30000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      
      // Provide more specific error messages
      let errorMessage = 'Could not access microphone';
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Please allow microphone access in your browser settings';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found on your device';
        }
      }
      
      toast.error(errorMessage);
      setIsRecording(false);
    }
  };

  const stopRecording = (): void => {
    console.log('Stopping recording...');
    const mediaRecorder = mediaRecorderRef.current;
    
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try {
        mediaRecorder.stop();
        // State will be updated in the onstop handler
        console.log('Stop command issued to mediaRecorder');
      } catch (error) {
        console.error("Error stopping recording:", error);
        // Force state reset if the stop method fails
        setIsRecording(false);
      }
    } else {
      console.warn('Cannot stop recording: No active recorder or already inactive');
      // Ensure the UI is consistent
      setIsRecording(false);
    }
  };

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        
        // Also stop any active media tracks
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, [isRecording]);

  return { isRecording, audioBlob, startRecording, stopRecording };
}