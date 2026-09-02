import React from "react";

// Panelden girilen head kodunu (meta/link/script) React elemanlarına çevirir.
// meta ve link etiketleri React 19 tarafından otomatik <head>'e taşınır;
// script etiketleri gerçek script olarak render edilip çalışır.

const ATTR_NAME_MAP: Record<string, string> = {
  "http-equiv": "httpEquiv",
  charset: "charSet",
  crossorigin: "crossOrigin",
  referrerpolicy: "referrerPolicy",
  class: "className",
};

function parseAttrs(raw: string) {
  const attrs: Record<string, string | boolean> = {};
  const re = /([a-zA-Z][a-zA-Z0-9:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const name = ATTR_NAME_MAP[m[1].toLowerCase()] ?? m[1];
    const value = m[2] ?? m[3] ?? m[4];
    attrs[name] = value === undefined ? true : value;
  }
  return attrs;
}

export function HeadCode({ code }: { code: string }) {
  if (!code.trim()) return null;

  const nodes: React.ReactNode[] = [];
  const tagRe =
    /<(meta|link)\b([^>]*?)\/?>(?:\s*<\/\1>)?|<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = tagRe.exec(code))) {
    if (m[1]) {
      nodes.push(
        React.createElement(m[1].toLowerCase(), {
          key: i++,
          ...parseAttrs(m[2] ?? ""),
        })
      );
    } else {
      const inner = (m[4] ?? "").trim();
      nodes.push(
        React.createElement("script", {
          key: i++,
          ...parseAttrs(m[3] ?? ""),
          ...(inner
            ? { dangerouslySetInnerHTML: { __html: inner } }
            : {}),
        })
      );
    }
  }
  return <>{nodes}</>;
}
