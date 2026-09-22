/**
 * Custom Next.js image loader with CDN support
 */
interface ImageLoaderProps {
  src: string
  width: number
  quality?: number
}

export function portfolioImageLoader({ src, width, quality = 80 }: ImageLoaderProps): string {
  if (src.startsWith('http')) return src
  return `${src}?w=${width}&q=${quality}&auto=format`
}
