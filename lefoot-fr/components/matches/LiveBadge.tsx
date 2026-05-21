import Badge from "@/components/ui/Badge";

export default function LiveBadge() {
  return (
    <Badge variant="live" className="gap-1">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
      LIVE
    </Badge>
  );
}
