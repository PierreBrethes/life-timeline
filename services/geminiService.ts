
import { GoogleGenAI, Type } from "@google/genai";
import { Milestone } from "../types";

export async function fetchTimelineData(subjectLabel: string): Promise<Milestone[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a chronological timeline of the 10 most important milestones in the history of ${subjectLabel}. 
      Ensure a good mix of ancient/classical discoveries and cutting-edge 21st-century developments. 
      The description should be concise but informative (max 150 chars). 
      ImpactScore should be 1-5.
      Provide a highly descriptive 'imagePrompt' (30-50 words) that describes a cinematic, high-quality, 3D scientific visualization or artistic representation of this specific discovery, suitable for an image generator. Avoid text in the image.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.STRING, description: "The year or era of discovery" },
              title: { type: Type.STRING, description: "The name of the milestone" },
              description: { type: Type.STRING, description: "Brief explanation" },
              impactScore: { type: Type.NUMBER, description: "1 to 5 scale of impact" },
              category: { type: Type.STRING, description: "Sub-field category" },
              imagePrompt: { type: Type.STRING, description: "Detailed prompt for image generation" }
            },
            required: ["year", "title", "description", "impactScore", "category", "imagePrompt"],
          },
        },
      },
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text.trim()) as Milestone[];
  } catch (error) {
    console.error("Error fetching timeline data:", error);
    throw error;
  }
}

export async function generateMilestoneImage(prompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `High-quality, futuristic, scientific digital art: ${prompt}. Cinematic lighting, intricate details, photorealistic but artistic, 16:9 aspect ratio.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Error generating image:", error);
    return ""; // Return empty string to handle gracefully
  }
}
