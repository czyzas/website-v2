import type { HTMLAttributes } from 'astro/types';

export type DefaultLink = {
  url: string;
  title: string;
  /**
   * @default _self
   */
  target?: '_self' | '_blank';
};

export type DynamicTagAttributes<
  T extends keyof astroHTML.JSX.DefinedIntrinsicElements,
> = Partial<astroHTML.JSX.IntrinsicAttributes & HTMLAttributes<T>>;

export type CTAProps = {
  content: string;
  buttonLink: DefaultLink;
};

export type MapType = {
  coordinates: { lat: number; lng: number };
  geohash: string;
};

export type EstateCardProps = {
  photo: PhotoProps | null;
  city: string;
  size: string;
  title: string;
  slug: string;
};

export type CardWithIconProps = {
  icon: PhotoProps | null;
  title: string;
  content: string;
};

export type QuotationProps = {
  content: string;
  authorName: string;
  authorOccupation?: string;
};

export type PhotoProps = Omit<ImageMetadata, 'format'> & {
  alt: string;
};

export type MapPin = {
  title: string;
  slug: string;
  lat: number;
  lng: number;
};
