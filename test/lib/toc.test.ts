import { extractToc } from '@/lib/toc'

describe('extractToc', () => {
  const content = '# Intro\n## Section 1\n### Sub 1.1\n## Section 2'

  it('extracts all headings', () => expect(extractToc(content)).toHaveLength(4))
  it('captures correct levels', () => {
    const toc = extractToc(content)
    expect(toc[0].level).toBe(1)
    expect(toc[1].level).toBe(2)
    expect(toc[2].level).toBe(3)
  })
  it('generates kebab-case IDs', () => {
    expect(extractToc('## Hello World')[0].id).toBe('hello-world')
  })
})
