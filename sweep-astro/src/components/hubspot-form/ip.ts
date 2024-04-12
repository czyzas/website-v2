import { useEffect, useState } from 'react';

async function queryPublicIp(): Promise<string> {
  const external = await fetch('https://api.ipify.org?format=json');
  const externalResult = (await external.json()) as { ip: string };

  return externalResult.ip;
}

const PublicIpKey = 'sweep-public-ip';

export function usePublicIp(): string | undefined {
  const [ipAddress, setIpAddress] = useState<string>();

  useEffect(() => {
    const currentPublicIp = window.sessionStorage.getItem(PublicIpKey);
    if (currentPublicIp) {
      setIpAddress(currentPublicIp);
    } else {
      queryPublicIp()
        .then((ip) => {
          if (ip) {
            setIpAddress(ip);
            window.sessionStorage.setItem(PublicIpKey, ip);
          }
        })
        .catch((error) => {
          console.error('Error getting public ip', error);
        });
    }
  }, []);

  return ipAddress;
}
