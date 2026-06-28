// components/ui/Skeleton.tsx

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export default function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
}: SkeletonProps) {
  return (
    <>
      <div
        style={{
          width,
          height,
          borderRadius,
          background: "var(--border)",
          animation: "shimmer 1.4s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}