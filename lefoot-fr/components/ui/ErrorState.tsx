import Button from "./Button";

interface ErrorStateProps {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, retryLabel, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry && retryLabel && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
