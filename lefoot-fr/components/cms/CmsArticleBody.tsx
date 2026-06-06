import ReactMarkdown from "react-markdown";

interface CmsArticleBodyProps {
  content: string;
}

function isHtml(text: string): boolean {
  return /<[a-z][\s\S]*>/i.test(text);
}

export default function CmsArticleBody({ content }: CmsArticleBodyProps) {
  if (!content) return null;

  if (isHtml(content)) {
    return (
      <div
        className="prose prose-gray mt-6 max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-img:rounded-lg prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className="prose prose-gray mt-6 max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-wide prose-img:rounded-lg prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
