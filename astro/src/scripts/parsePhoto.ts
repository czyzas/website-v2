import type { UploadFileEntityResponse } from '@/__generated__/cms';
import { env } from '@/environment';
import type { PhotoProps } from '@/types';

export type PhotoNotParsed = {
  width?: number;
  height?: number;
  alternativeText?: string;
  alt?: string;
  src?: string;
  url?: string;
};

export const parsePhoto = (
  uploadFile: PhotoNotParsed,
  resizeWidth?: number,
): PhotoProps => {
  const {
    width = 1920,
    height = 1080,
    alternativeText = '',
    alt = '',
    src = null,
    url = null,
  } = uploadFile ?? {};

  const photoUrl = src || url;
  if (!photoUrl) {
    throw new Error('No src');
  }

  let newWidth = width;
  let newHeight = height;

  if (resizeWidth) {
    const ratio = width / height;

    newWidth = resizeWidth;
    newHeight = Math.floor(resizeWidth / ratio);
  }

  return {
    src: photoUrl.startsWith('/')
      ? env.PUBLIC_CMS_BASE_URL + photoUrl
      : photoUrl,
    alt: alt || alternativeText || '',
    width: newWidth,
    height: newHeight,
  };
};

export const parsePhotoEntityResponse = (
  uploadFileEntity: UploadFileEntityResponse,
  resizeWidth?: number,
) => {
  const photo = uploadFileEntity?.data?.attributes;

  if (!photo) {
    throw new Error('No photo');
  }

  return parsePhoto(photo, resizeWidth);
};
