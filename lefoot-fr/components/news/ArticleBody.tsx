import ReactMarkdown from "react-markdown";

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="prose prose-gray mt-6 max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
