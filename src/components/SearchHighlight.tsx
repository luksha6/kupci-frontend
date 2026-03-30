import { Fragment, memo } from "react";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface SearchHighlightProps {
  text: string;
  query: string;
}

/** Bolds contiguous runs of characters that match the query (case-insensitive). */
export const SearchHighlight = memo(function SearchHighlight({
  text,
  query,
}: SearchHighlightProps) {
  const q = query.trim();
  if (!q) return <>{text}</>;

  const re = new RegExp(`(${escapeRegExp(q)})`, "gi");
  const parts = text.split(re);

  return (
    <>
      {parts.map((part, i) => {
        const isMatch = part.toLowerCase() === q.toLowerCase();
        if (isMatch) {
          return (
            <strong key={`${i}-${part}`} className="search-highlight">
              {part}
            </strong>
          );
        }
        return <Fragment key={`${i}-${part}`}>{part}</Fragment>;
      })}
    </>
  );
});
