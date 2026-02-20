import type { IDomainChecker, DomainResult } from "./interfaces";

export const domainChecker: IDomainChecker = {
  async check(name: string, tlds: string[]): Promise<DomainResult[]> {
    const apiKey = process.env.WHOISXML_API_KEY;
    if (!apiKey) throw new Error("WHOISXML_API_KEY not set");

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "");

    const results = await Promise.allSettled(
      tlds.map(async (tld): Promise<DomainResult> => {
        const domain = slug + tld;
        const url = `https://domain-availability.whoisxmlapi.com/api/v1?apiKey=${apiKey}&domainName=${domain}&credits=DA&outputFormat=JSON`;
        const res = await fetch(url);
        if (!res.ok) return { domain, tld, available: false };
        const data = await res.json();
        const available = data?.DomainInfo?.domainAvailability === "AVAILABLE";
        return { domain, tld, available };
      })
    );

    return results.map((r, i) => {
      if (r.status === "fulfilled") return r.value;
      const domain = slug + tlds[i];
      return { domain, tld: tlds[i], available: false };
    });
  },
};
