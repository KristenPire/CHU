/**
 * Lightweight Markdown renderer for exam content.
 *
 * Handles:  fenced code blocks (```lang ... ```) and inline code (`...`).
 * Everything else is rendered as plain text.
 * Code blocks get syntax highlighting via highlight.js.
 */

import { useMemo } from "react";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import bash from "highlight.js/lib/languages/bash";

hljs.registerLanguage("cpp", cpp);
hljs.registerLanguage("c", cpp);
hljs.registerLanguage("bash", bash);

// ── Styles matching the terminal theme ──

const codeBlockStyle = {
  background: "#0d0d24",
  border: "1px solid #2a2a4a",
  borderRadius: 4,
  padding: "12px 14px",
  margin: "8px 0",
  overflowX: "auto",
  fontSize: 13,
  lineHeight: 1.55,
  fontFamily: "'Courier New', Consolas, monospace",
};

const inlineCodeStyle = {
  background: "#1a1a3a",
  border: "1px solid #2a2a4a",
  borderRadius: 3,
  padding: "1px 5px",
  fontSize: "0.92em",
  color: "#00d4ff",
  fontFamily: "'Courier New', Consolas, monospace",
};

// ── Parser ──

const BLOCK_RE = /```(\w*)\n([\s\S]*?)```/g;
const INLINE_RE = /`([^`]+)`/g;

function highlight(code, lang) {
  if (lang && hljs.getLanguage(lang)) {
    return hljs.highlight(code, { language: lang }).value;
  }
  return hljs.highlightAuto(code).value;
}

function renderInline(text, key) {
  // Split on inline code
  const parts = [];
  let last = 0;
  let m;
  const re = new RegExp(INLINE_RE.source, "g");
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <code key={`${key}-${m.index}`} style={inlineCodeStyle}>
        {m[1]}
      </code>,
    );
    last = re.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export function Md({ children }) {
  const elements = useMemo(() => {
    if (!children) return null;
    const src = String(children);
    const result = [];
    let last = 0;
    let m;
    const re = new RegExp(BLOCK_RE.source, "g");

    while ((m = re.exec(src)) !== null) {
      // Text before this code block
      if (m.index > last) {
        const text = src.slice(last, m.index);
        result.push(<span key={`t-${last}`}>{renderInline(text, last)}</span>);
      }
      // Code block
      const lang = m[1] || "";
      const code = m[2].replace(/\n$/, "");
      result.push(
        <pre key={`cb-${m.index}`} style={codeBlockStyle}>
          <code dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
        </pre>,
      );
      last = re.lastIndex;
    }

    // Remaining text
    if (last < src.length) {
      result.push(
        <span key={`t-${last}`}>{renderInline(src.slice(last), last)}</span>,
      );
    }
    return result;
  }, [children]);

  return <>{elements}</>;
}
