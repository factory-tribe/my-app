/**
 * Extract ID from a relationship field
 * Handles both string IDs and objects with an id property
 */
export const extractID = <T extends { id: number | string }>(
  doc: number | string | T,
): number | string => {
  if (typeof doc === 'string' || typeof doc === 'number') {
    return doc
  }

  return doc.id
}



