import { getStorageUsage } from "@/lib/db/media";

const WARN_THRESHOLD = 80;
const BLOCK_THRESHOLD = 95;

export async function checkStorageBeforeUpload(): Promise<{
  allowed: boolean;
  warning: string | null;
  percentage: number;
}> {
  const usage = await getStorageUsage();

  if (usage.percentage >= BLOCK_THRESHOLD) {
    return {
      allowed: false,
      warning: `Storage is ${Math.round(usage.percentage)}% full. Please delete some presentations or media to free space.`,
      percentage: usage.percentage,
    };
  }

  if (usage.percentage >= WARN_THRESHOLD) {
    return {
      allowed: true,
      warning: `Storage is ${Math.round(usage.percentage)}% full. Consider removing unused media.`,
      percentage: usage.percentage,
    };
  }

  return {
    allowed: true,
    warning: null,
    percentage: usage.percentage,
  };
}
