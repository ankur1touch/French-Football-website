interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 ${className ?? ""}`}
    >
      {message}
    </div>
  );
}
