
import { GoogleGenAI } from "@google/genai";

export const generateVeoVideo = async (imageBuffer: string, aspectRatio: '16:9' | '9:16', prompt: string = "Cinematic slow camera orbit around a luxury emerald and gold Christmas tree with floating magical particles.") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // We use veo-3.1-fast-generate-preview for faster generation
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      image: {
        imageBytes: imageBuffer.split(',')[1], // Remove the data:image/png;base64, prefix
        mimeType: 'image/png',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Veo Generation Error:", error);
    throw error;
  }
};

export const hasApiKeySet = async (): Promise<boolean> => {
    // Assuming window.aistudio is available in this environment
    if ((window as any).aistudio) {
        return await (window as any).aistudio.hasSelectedApiKey();
    }
    return true; // Fallback if handled via environment
};

export const openApiKeySelector = async () => {
    if ((window as any).aistudio) {
        await (window as any).aistudio.openSelectKey();
    }
};
