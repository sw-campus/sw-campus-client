declare module 'colorthief' {
  type Color = [number, number, number]

  export default class ColorThief {
    /**
     * Gets the dominant color from an image
     * @param sourceImage - HTMLImageElement, URL string, or Buffer
     * @param quality - Optional, 1 is highest quality, 10 is default
     */
    getColor(sourceImage: HTMLImageElement | string, quality?: number): Color

    /**
     * Gets a palette of colors from an image
     * @param sourceImage - HTMLImageElement, URL string, or Buffer
     * @param colorCount - Optional, number of colors in palette (2-256, default 10)
     * @param quality - Optional, 1 is highest quality, 10 is default
     */
    getPalette(sourceImage: HTMLImageElement | string, colorCount?: number, quality?: number): Color[]
  }
}
