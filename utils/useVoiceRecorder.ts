


import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";

export default function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioFormat, setAudioFormat] = useState<string>("webm");
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

  // Get best supported audio format
  const getSupportedMimeType = (): string => {
    const types = [
      'audio/webm', // Best for Chrome, Firefox, Edge
      'audio/wav',  // Wider compatibility
      'audio/ogg',  // Firefox fallback
      'audio/mp4'   // Safari (but will need conversion)
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log(`Found supported format: ${type}`);
        return type;
      }
    }
    
    console.log('No specific format supported, using default');
    return '';
  };

  // Convert to WAV format if needed (especially for Safari/iOS)
  const normalizeAudioFormat = async (blob: Blob): Promise<Blob> => {
    // If we're already using a well-supported format, just return the blob
    if (blob.type === 'audio/webm' || blob.type === 'audio/wav' || blob.type === 'audio/ogg') {
      console.log('Audio format is already compatible, no conversion needed');
      return blob;
    }

    // For Safari's audio/mp4 format, convert to WAV for better compatibility
    console.log(`Converting ${blob.type} to WAV format for better compatibility`);
    
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Read blob as array buffer
      const arrayBuffer = await blob.arrayBuffer();
      
      // Decode audio data
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get audio data
      const numberOfChannels = audioBuffer.numberOfChannels;
      const length = audioBuffer.length;
      const sampleRate = audioBuffer.sampleRate;
      const channelData = [];
      
      // Extract channel data
      for (let i = 0; i < numberOfChannels; i++) {
        channelData.push(audioBuffer.getChannelData(i));
      }
      
      // Create WAV file using Web Audio API
      const wavFile = createWavFile(channelData, sampleRate);
      
      return new Blob([wavFile], { type: 'audio/wav' });
    } catch (error) {
      console.error('Error converting audio format:', error);
      // Fallback to original blob if conversion fails
      return blob;
    }
  };

  // Create WAV file from audio data
  const createWavFile = (channelData: Float32Array[], sampleRate: number): ArrayBuffer => {
    const numberOfChannels = channelData.length;
    const length = channelData[0].length;
    const bitsPerSample = 16; // Using 16-bit depth
    const bytesPerSample = bitsPerSample / 8;
    
    // Create buffer for the WAV file
    const buffer = new ArrayBuffer(44 + length * numberOfChannels * bytesPerSample);
    const view = new DataView(buffer);
    
    // Write WAV header
    // "RIFF" chunk descriptor
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * bytesPerSample, true);
    writeString(view, 8, 'WAVE');
    
    // "fmt " sub-chunk
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Sub-chunk size (16 for PCM)
    view.setUint16(20, 1, true); // Audio format (1 for PCM)
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * bytesPerSample, true); // Byte rate
    view.setUint16(32, numberOfChannels * bytesPerSample, true); // Block align
    view.setUint16(34, bitsPerSample, true);
    
    // "data" sub-chunk
    writeString(view, 36, 'data');
    view.setUint32(40, length * numberOfChannels * bytesPerSample, true);
    
    // Write audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channelData[channel][i]));
        const value = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        view.setInt16(offset, value, true);
        offset += bytesPerSample;
      }
    }
    
    return buffer;
  };
  
  // Helper for writing strings to DataView
  const writeString = (view: DataView, offset: number, string: string): void => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
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
      console.log('Starting recording...');
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

      // Get best supported format
      const mimeType = getSupportedMimeType();
      setAudioFormat(mimeType.split('/')[1] || 'webm');
      
      let mediaRecorder: MediaRecorder;
      if (mimeType) {
        mediaRecorder = new MediaRecorder(stream, { mimeType });
        console.log(`Using ${mimeType} format`);
      } else {
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

      mediaRecorder.onstop = async () => {
        console.log('Recording stopped, processing audio...');
        
        // Create a blob with the appropriate type
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const rawBlob = new Blob(audioChunks.current, { type: mimeType });
        console.log(`Created raw audio blob: ${rawBlob.size} bytes, type: ${mimeType}`);
        
        try {
          // Normalize audio format if needed (especially for Safari)
          const normalizedBlob = await normalizeAudioFormat(rawBlob);
          console.log(`Final audio blob: ${normalizedBlob.size} bytes, type: ${normalizedBlob.type}`);
          setAudioBlob(normalizedBlob);
        } catch (error) {
          console.error('Error normalizing audio format:', error);
          // Fallback to the raw blob if normalization fails
          setAudioBlob(rawBlob);
        }
        
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

  return { isRecording, audioBlob, audioFormat, startRecording, stopRecording };
}