const KNOWN: { match: RegExp; source: string }[] = [
  { match: /tiktok/i, source: 'tiktok' },
  { match: /instagram|facebook|fb\.|meta/i, source: 'meta' },
  { match: /pinterest/i, source: 'pinterest' },
  { match: /youtube|youtu\.be/i, source: 'youtube' },
  { match: /google|googleadservices/i, source: 'google' },
  { match: /twitter|x\.com|t\.co/i, source: 'x' },
  { match: /snapchat/i, source: 'snapchat' },
  { match: /reddit/i, source: 'reddit' },
];

/** Normaliza el origen de una visita a una red/canal reconocible. */
export function normalizeSource(source?: string | null, referrer?: string | null): string {
  const value = (source ?? '').trim().toLowerCase();
  if (value) {
    const hit = KNOWN.find((k) => k.match.test(value));
    return hit ? hit.source : value;
  }
  const ref = (referrer ?? '').trim();
  if (!ref) return 'direct';
  const hit = KNOWN.find((k) => k.match.test(ref));
  return hit ? hit.source : 'other';
}
