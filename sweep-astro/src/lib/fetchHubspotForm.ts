import { ofetch } from 'ofetch';
import type { IHubspotFormDefinition } from '@/components/hubspot-form/shared';
import { HUBSPOT_FORM_ENDPOINT } from '@/constants';
import { env } from '@/environment';
import { cacheCMSData, getCachedCMSData } from './cacheCMSData';

export async function fetchHubspotForm(guid: string) {
  try {
    const cacheKey = ['hubspot-form', guid];
    if (import.meta.env.DEV) {
      // In dev mode its good to cache actual data to prevent fetching it over and over again
      const cache = await getCachedCMSData<IHubspotFormDefinition>(cacheKey);
      if (cache) {
        console.info(
          new Date().toLocaleTimeString(),
          `\x1B[33m[cache]\x1B[0m`,
          `Cache hit (${cacheKey.join('/')})`
        );
        return cache;
      }

      console.info(
        new Date().toLocaleTimeString(),
        `\x1B[35m[cache]\x1B[0m`,
        `Cache missed, fetching... (${cacheKey.join('/')})`
      );
    }

    const data = await ofetch<IHubspotFormDefinition>(
      `${HUBSPOT_FORM_ENDPOINT}/${guid}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${env.PUBLIC_HUBSPOT_ACCESS_TOKEN}`,
        },
      }
    );

    // set cache in dev mode
    if (import.meta.env.DEV) {
      await cacheCMSData(cacheKey, data);
    }

    return data;
  } catch (error) {
    console.error(
      '[HUBSPOT ERROR]',
      error instanceof Error ? error.message : 'Unknown error'
    );

    return undefined;
  }
}
