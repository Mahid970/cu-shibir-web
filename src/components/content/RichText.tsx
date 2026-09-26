import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  type JSXConvertersFunction,
  RichText as LexicalRichText,
} from '@payloadcms/richtext-lexical/react'
import type { ReactNode } from 'react'

// Arabic letters + harakat/Quranic marks; a run may contain spaces between Arabic words.
const ARABIC_RUN = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+(?:[\s\u00A0]+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+)*)/

/** Lexical text-format bit flags. */
const FORMAT = { bold: 1, italic: 2, strikethrough: 4, underline: 8, code: 16, subscript: 32, superscript: 64 }

function applyFormat(content: ReactNode, format: number, key: string | number): ReactNode {
  let out = content
  if (format & FORMAT.bold) out = <strong>{out}</strong>
  if (format & FORMAT.italic) out = <em>{out}</em>
  if (format & FORMAT.strikethrough) out = <s>{out}</s>
  if (format & FORMAT.underline) out = <u>{out}</u>
  if (format & FORMAT.code) out = <code>{out}</code>
  if (format & FORMAT.subscript) out = <sub>{out}</sub>
  if (format & FORMAT.superscript) out = <sup>{out}</sup>
  return <span key={key}>{out}</span>
}

/**
 * Quranic Arabic embedded in Bangla paragraphs is wrapped in lang="ar" dir="rtl" so it gets
 * the Amiri Quran face and correct bidi — the legacy site rendered it in the Bangla font.
 */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  text: ({ node }) => {
    const parts = node.text.split(ARABIC_RUN).filter(Boolean)
    const children = parts.map((part, i) =>
      ARABIC_RUN.test(part) && part.trim() ? (
        <span key={i} lang="ar" dir="rtl" className="ayah-inline">
          {part}
        </span>
      ) : (
        part
      ),
    )
    return applyFormat(children, node.format, node.text.slice(0, 12))
  },
})

export function RichText({ data, className = 'prose-read' }: { data: SerializedEditorState | null | undefined; className?: string }) {
  if (!data) return null
  return <LexicalRichText data={data} converters={converters} className={className} />
}
