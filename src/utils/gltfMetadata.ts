/** Parses glTF asset.extras / asset.copyright into display metadata. Sketchfab uses "Author (url)" and "License (url)". */
const TEXT_AND_URL = /^(.+?)\s*\((https?:\S+)\)\s*$/

export type ModelMetadata = {
  author?: string
  authorURL?: string
  license?: string
  licenseURL?: string
}

type AssetLike = {
  extras?: Record<string, unknown>
  copyright?: string
}

export const parseAssetMetadata = (asset: AssetLike | undefined): ModelMetadata | null => {
  if (!asset) return null
  const extras = asset.extras as Record<string, string> | undefined
  const out: ModelMetadata = {}

  if (extras?.author) {
    const m = extras.author.match(TEXT_AND_URL)
    if (m) {
      out.author = m[1].trim()
      out.authorURL = m[2].replace(/\)$/, '')
    } else {
      out.author = extras.author
      if (extras.source && extras.source.startsWith('http')) out.authorURL = extras.source
    }
  }
  if (extras?.license) {
    const m = extras.license.match(TEXT_AND_URL)
    if (m) {
      out.license = m[1].trim()
      out.licenseURL = m[2].replace(/\)$/, '')
    } else {
      out.license = extras.license
    }
  }
  if (asset.copyright && !out.license) out.license = asset.copyright

  return Object.keys(out).length ? out : null
}
