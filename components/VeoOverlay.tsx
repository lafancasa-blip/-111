
import React, { useState, useRef } from 'react';
import { generateVeoVideo, hasApiKeySet, openApiKeySelector } from '../services/gemini';

interface VeoOverlayProps {
  onClose: () => void;
}

const VeoOverlay: React.FC<VeoOverlayProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleGenerate = async () => {
    if (!preview) return;
    
    setLoading(true);
    setStatus('Checking API Key...');
    
    try {
      const isSet = await hasApiKeySet();
      if (!isSet) {
          await openApiKeySelector();
          // Assuming user succeeded as per guidelines
      }

      setStatus('Submitting to Veo AI...');
      const url = await generateVeoVideo(preview, aspectRatio);
      setVideoUrl(url);
      setStatus('Success!');
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
          setStatus('Invalid API Key. Please re-select a paid project key.');
          await openApiKeySelector();
      } else {
          setStatus('Generation failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6">
      <div className="bg-[#0a2018] border border-[#d4af37]/30 p-8 rounded-lg max-w-2xl w-full shadow-2xl overflow-hidden">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-luxury text-[#d4af37]">Veo AI Animator</h2>
          <button onClick={onClose} className="text-[#d4af37]/60 hover:text-[#d4af37]">&times;</button>
        </div>

        {!videoUrl ? (
          <div className="space-y-6">
            <div 
              className="border-2 border-dashed border-[#d4af37]/20 rounded-xl aspect-video flex flex-col items-center justify-center bg-[#05140f] overflow-hidden cursor-pointer hover:bg-[#071a14] transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {preview ? (
                <img src={preview} alt="Upload" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <p className="text-[#d4af37]/60 text-sm mb-2">Upload a photo of your signature space</p>
                  <p className="text-[10px] text-[#d4af37]/40 uppercase tracking-widest">Supports PNG, JPG</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setAspectRatio('16:9')}
                className={`px-4 py-2 text-[10px] border transition-all ${aspectRatio === '16:9' ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' : 'border-white/10 text-white/40'}`}
              >
                16:9 Landscape
              </button>
              <button 
                onClick={() => setAspectRatio('9:16')}
                className={`px-4 py-2 text-[10px] border transition-all ${aspectRatio === '9:16' ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]' : 'border-white/10 text-white/40'}`}
              >
                9:16 Portrait
              </button>
            </div>

            <button
              disabled={!file || loading}
              onClick={handleGenerate}
              className={`w-full py-4 text-sm font-semibold tracking-widest uppercase transition-all ${loading || !file ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#d4af37] text-black hover:bg-[#c4a130]'}`}
            >
              {loading ? 'Processing magic...' : 'Animate with Veo AI'}
            </button>
            
            {status && <p className="text-center text-[10px] uppercase tracking-widest text-[#d4af37]/60 animate-pulse">{status}</p>}
            
            <p className="text-[10px] text-white/30 text-center italic">
              Note: Video generation may take up to 2 minutes. Requires a paid API key from <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-white">GCP Billing</a>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <video src={videoUrl} controls autoPlay loop className="w-full rounded-lg shadow-xl" />
            <div className="flex gap-4">
              <button 
                onClick={() => {setVideoUrl(null); setFile(null); setPreview(null);}}
                className="flex-1 py-3 text-[10px] tracking-widest uppercase border border-[#d4af37]/30 text-[#d4af37]"
              >
                Start Over
              </button>
              <a 
                href={videoUrl} 
                download="arix-signature-video.mp4"
                className="flex-1 py-3 text-[10px] tracking-widest uppercase bg-[#d4af37] text-black text-center"
              >
                Download Video
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VeoOverlay;
