import axios from "axios";

export const transcribeAudio = async (audioBlob: Blob): Promise<string | null> => {
  if (!audioBlob) return null;
  
  try {
    const formData = new FormData();
    
    // Use the actual MIME type from the blob
    const fileType = audioBlob.type || 'audio/webm';
    const fileExtension = fileType.includes('webm') ? 'webm' : 
                         fileType.includes('mp3') ? 'mp3' : 'm4a';
    
    // Add the audio blob as a file
    formData.append('audio', audioBlob, `recording.${fileExtension}`);
    
    console.log("Transcribing audio...");
    
    const response = await axios.post('/api/tools/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    const transcribedText = response.data.text;
    console.log("Transcribed Text:", transcribedText);
    
    return transcribedText;
  } catch (error: any) {
    console.error("Error transcribing audio:", 
      error.response?.data || error.message);
    return null;
  }
};






