import path from 'node:path';
import fs from 'node:fs/promises';
import { writeStream } from '../scripts/server/writeStream';
import { readStream } from '../scripts/server/readStream';
import { fileExists } from '../scripts/server/fileExists';

export const CACHE_KEYS = {
  HOMEPAGE: 'homepage',
  PAGE: 'page',
  CONTACT: 'contact',
  INDUSTRIES_LIST: 'industries-list',
} as const;

export type CachePayload = string | string[];

const CACHE_PATH = './.astro/cms-cache';

const buildCacheFilename = (payload: CachePayload) => {
  let filename = Array.isArray(payload) ? payload.join('/') : payload;
  if (filename.endsWith('/')) filename += 'index';
  return filename;
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
      console.error(
        new Date().toLocaleTimeString(),
        `\x1B[31m[cache]\x1B[0m`,
        `Error getting cache: ${error.message}`,
        '\n',
        error.stack
      );
    }
  }
};

export const cacheCMSData = async <T = unknown>(
  payload: CachePayload,
  data: T
) => {
  try {
    const isDev = import.meta.env.MODE === 'development';
    if (!isDev) return;

    const cacheFilename = buildCacheFilename(payload);
    const cachePath = path.resolve(`${CACHE_PATH}/${cacheFilename}.json`);

    await fs
      .mkdir(path.dirname(cachePath), { recursive: true })
      .catch(() => null);

    await writeStream(cachePath, JSON.stringify(data));
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        new Date().toLocaleTimeString(),
        `\x1B[31m[cache]\x1B[0m`,
        `Error creating cache: ${error.message}`,
        '\n',
        error.stack
      );
    }
  }
};
