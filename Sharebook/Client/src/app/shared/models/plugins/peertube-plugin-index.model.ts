export interface SharebookPluginIndex {
  npmName: string;
  description: string;
  homepage: string;
  createdAt: Date;
  updatedAt: Date;

  popularity: number;

  latestVersion: string;

  name?: string;
  installed?: boolean;
}
