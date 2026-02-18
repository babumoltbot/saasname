import type { ISocialChecker, SocialResult } from "./interfaces";

// Mock implementation — swap to real social API checks
export const socialChecker: ISocialChecker = {
  async check(name: string): Promise<SocialResult[]> {
    await new Promise((r) => setTimeout(r, 150));

    const handle = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    const platforms = ["twitter", "linkedin", "instagram"] as const;

    return platforms.map((platform) => ({
      platform,
      handle: `@${handle}`,
      // Random availability: ~50%
      available: Math.random() < 0.5,
    }));
  },
};
