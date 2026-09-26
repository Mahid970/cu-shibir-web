/**
 * Text normalisation shared by the search index (stored on save) and search queries, so that
 * the same word always matches however it was typed:
 * - NFC (য় / ড় / ঢ় typed as one code point or as letter + nukta end up identical),
 * - zero-width joiners removed, Bangla digits → Latin, lower case,
 * - punctuation (including SQL LIKE wildcards % and _) becomes a space.
 */
export function normalizeForSearch(input: string): string {
  return input
    .normalize('NFC')
    .replace(/[‌‍]/g, '')
    .replace(/[০-৯]/g, (d) => String('০১২৩৪৫৬৭৮৯'.indexOf(d)))
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ')
    .trim()
}

type LexicalNode = { text?: unknown; children?: LexicalNode[]; type?: string }

/** Plain text of a Lexical rich-text document (paragraphs separated by spaces). */
export function lexicalToText(doc: unknown): string {
  const out: string[] = []
  const walk = (node: LexicalNode | undefined) => {
    if (!node || typeof node !== 'object') return
    if (typeof node.text === 'string') out.push(node.text)
    if (Array.isArray(node.children)) node.children.forEach(walk)
    if (node.type === 'paragraph' || node.type === 'heading' || node.type === 'listitem') out.push(' ')
  }
  walk((doc as { root?: LexicalNode } | null)?.root)
  return out.join('').replace(/\s+/g, ' ').trim()
}

/** Short excerpt around the first match, for result lists. */
export function snippet(text: string, query: string, length = 140): string {
  const plain = text.replace(/\s+/g, ' ').trim()
  const word = query.trim().split(/\s+/)[0]
  const at = word ? plain.normalize('NFC').toLowerCase().indexOf(word.normalize('NFC').toLowerCase()) : -1
  if (at < 0 || plain.length <= length) return plain.length > length ? `${plain.slice(0, length).trimEnd()}…` : plain
  const start = Math.max(0, at - Math.floor(length / 3))
  const piece = plain.slice(start, start + length).trim()
  return `${start > 0 ? '…' : ''}${piece}${start + length < plain.length ? '…' : ''}`
}
