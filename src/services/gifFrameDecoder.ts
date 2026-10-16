import omggif from 'omggif';

export interface DecodedGif {
  width: number;
  height: number;
  frames: ImageData[];
  delays: number[];
  totalFrames: number;
}

const gifCache = new Map<string, Promise<DecodedGif | null>>();

export function getDecodedGif(url: string): Promise<DecodedGif | null> {
  if (gifCache.has(url)) {
    return gifCache.get(url)!;
  }

  const promise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch GIF: ${response.status}`);
      }
      const buffer = await response.arrayBuffer();
      const reader = new omggif.GifReader(new Uint8Array(buffer));

      const width = reader.width;
      const height = reader.height;
      const totalFrames = reader.numFrames();

      const runningBuffer = new Uint8ClampedArray(width * height * 4);
      const frames: ImageData[] = [];
      const delays: number[] = [];

      for (let i = 0; i < totalFrames; i++) {
        const info = reader.frameInfo(i);
        reader.decodeAndBlitFrameRGBA(i, runningBuffer);

        // Clone the composite frame buffer
        const frameCopy = new Uint8ClampedArray(runningBuffer);
        frames.push(new ImageData(frameCopy, width, height));

        // Delay in ms (1/100ths of a sec, default to 80ms if 0)
        const delayMs = info.delay && info.delay > 0 ? info.delay * 10 : 80;
        delays.push(delayMs);
      }

      return {
        width,
        height,
        frames,
        delays,
        totalFrames
      };
    } catch (err) {
      console.warn('GIF decode error for', url, err);
      return null;
    }
  })();

  gifCache.set(url, promise);
  return promise;
}
