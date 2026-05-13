import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HfInference } from '@huggingface/inference';
import { Blob } from 'buffer';

export interface HFDetectionResult {
  peopleCount: number;
  confidence: number;
  rawResult: any[];
  processingMs: number;
}

@Injectable()
export class HuggingFaceService {
  private readonly logger = new Logger(HuggingFaceService.name);
  private readonly hf: HfInference;
  private readonly modelId = 'facebook/detr-resnet-50';
  private readonly personThreshold = 0.5;
  private readonly hfToken: string;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('HUGGINGFACE_TOKEN');
    if (!token) {
      this.logger.error('❌ HUGGINGFACE_TOKEN is missing in .env');
    } 
    this.hfToken = token?.trim() || "";
    this.hf = new HfInference(this.hfToken);
    this.logger.log(`🔑 HF Service initialized`);
  }

  async detectPeople(
    imageBuffer: Buffer,
    mimeType = 'image/jpeg',
  ): Promise<HFDetectionResult> {
    const startTime = Date.now();

    try {
      this.logger.log(`🔍 Detecting people using model: ${this.modelId}`);
      
      const url = `https://router.huggingface.co/hf-inference/models/${this.modelId}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.hfToken}`,
          'Content-Type': 'image/jpeg',
        },
        body: Buffer.from(imageBuffer),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `HF API Error ${response.status}: ${errorText}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = `HF API Error ${response.status}: ${errorJson.error || errorText}`;
        } catch (e) {}
        throw new Error(errorMessage);
      }

      const rawResult = await response.json();

      if (!Array.isArray(rawResult)) {
        throw new Error('Invalid response from HuggingFace');
      }

      const people = rawResult.filter(
        (x: any) =>
          x.label?.toLowerCase?.() === 'person' &&
          x.score >= this.personThreshold,
      );

      const confidence =
        people.length > 0
          ? people.reduce((s, p) => s + p.score, 0) / people.length
          : 0;

      return {
        peopleCount: people.length,
        confidence,
        rawResult: rawResult,
        processingMs: Date.now() - startTime,
      };
    } catch (error: any) {
      this.logger.error(`❌ HF Error: ${error.message}`);
      throw new Error(`HuggingFace API Error: ${error.message}`);
    }
  }

  async detectPeopleFromUrl(imageUrl: string): Promise<HFDetectionResult> {
    const img = await fetch(imageUrl);
    if (!img.ok) throw new Error(`Cannot fetch image: ${imageUrl}`);
    const buffer = Buffer.from(await img.arrayBuffer());
    return this.detectPeople(buffer);
  }
}