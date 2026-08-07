export async function fetchEnvelopeData<T>(url: string): Promise<T | null> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const json = await res.json();
  return json.data as T | null;
}
