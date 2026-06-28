// components/ui/SkeletonSkillCard.tsx
import Skeleton from "@/components/ui/skeleton";

export default function SkeletonSkillCard() {
  return (
    <div style={{
      border: "1px solid var(--border)",
      borderRadius: 16,
      padding: "28px 16px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      background: "var(--surface)",
    }}>
      <Skeleton width={48} height={48} borderRadius={12} />
      <Skeleton width={80} height={13} />
      <Skeleton width={60} height={22} borderRadius={6} />
    </div>
  );
}