import type { IDomainChecker, DomainResult } from "./interfaces";

// Mock implementation — swap to real WHOIS/registrar API
export const domainChecker: IDomainChecker = {
  async check(name: string, tlds: string[]): Promise<DomainResult[]> {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 200));

    return tlds.map((tld) => {
      const domain = name.toLowerCase().replace(/[^a-z0-9]/g, "") + tld;
      // .com has 30% availability, others 60%
      const available = tld === ".com" ? Math.random() < 0.3 : Math.random() < 0.6;
      return { domain, tld, available };
    });
  },
};
