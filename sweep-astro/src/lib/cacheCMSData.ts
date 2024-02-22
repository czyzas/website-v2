import path from 'node:path';
import fs from 'node:fs/promises';
import { writeStream } from '../scripts/server/writeStream';
import { readStream } from '../scripts/server/readStream';
import { fileExists } from '../scripts/server/fileExists';

export const CACHE_KEYS = {
  HOMEPAGE: 'homepage',
  CONTACT: 'contact',
  TEXT_PAGE: 'text-page',
  WORK: 'work',
  SLUGS: 'slugs',
} as const;

export type CacheKey = (typeof CACHE_KEYS)[keyof typeof CACHE_KEYS];
export type CachePayload = {
  key: CacheKey;
  [key: string]: string | number | boolean;
};

const CACHE_PATH = './.astro/cms-cache';

const buildCacheFilename = (payload: CachePayload) => {
  const { key, ...payloadData } = payload;

  const payloadEntries = Object.entries(payloadData);
  if (payloadEntries.length === 0) {
    return key;
  }

  const parsedEntries = payloadEntries
    .map(([payloadKey, payloadValue]) => {
      let value = payloadValue;

      if (typeof value === 'boolean') {
        value = payloadValue ? 'true' : 'false';
      } else if (typeof value === 'number') {
        value = String(value);
      }

      return `${payloadKey}=${value}`;
    })
    .join(',');

  return `${key}/[${parsedEntries}]`;
};

export const getCachedCMSData = async <T = unknown>(payload: CachePayload) => {
  try {
    const isDev = import.meta.env.MODE === 'development';
    if (!isDev) return null;

    const cacheFilename = buildCacheFilename(payload);
    const cachePath = path.resolve(`${CACHE_PATH}/${cacheFilename}.json`);

    const cacheExists = await fileExists(cachePath);
    if (!cacheExists) return null;

    const cacheData = await readStream(cachePath);
    return (JSON.parse(cacheData) || {}) as T;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Cache get error', error.message, '\n', error.stack);
    }
  }
};

export const cacheCMSData = async <T = unknown>(
  payload: CachePayload,
  data: T,
) => {
  try {
    const isDev = import.meta.env.MODE === 'development';
    if (!isDev) return;

    const cacheFilename = buildCacheFilename(payload);
    const cachePath = path.resolve(`${CACHE_PATH}/${cacheFilename}.json`);

    await fs
      .mkdir(path.dirname(cachePath), { recursive: true })
      .catch(() => null);

    await writeStream(cachePath, JSON.stringify(data, null, 2));
  } catch (error) {
    if (error instanceof Error) {
      console.error('Caching error', error.message, '\n', error.stack);
    }
  }
};
