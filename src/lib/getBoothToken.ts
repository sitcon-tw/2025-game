import { MAPPING_URL, MAPPING_URL_BAK } from "./const";

export async function getBoothToken(
  code: string,
  mappingURL: string = MAPPING_URL,
): Promise<string | null> {
  return fetch(`${mappingURL}?code=${code}`).then((res) => {
    return res.status === 200
      ? res.text()
      : mappingURL !== MAPPING_URL_BAK
        ? getBoothToken(code, MAPPING_URL_BAK)
        : null;
  });
}
