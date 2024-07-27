export async function fetchData<T>(
  url: RequestInfo | URL,
  tag: string,
  config?: RequestInit
) {
  try {
    const res = await fetch(url, config);

    if (res.status !== 200) {
      throw new Error(`Error fetching data with tag ${tag}`);
    }

    const data = (await res.json()) as T;
    return data;
  } catch (error) {
    throw error;
  }
}
