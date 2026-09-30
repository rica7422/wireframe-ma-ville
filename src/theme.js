/** Ma Ville section colors — docs/ma-ville-charte.md */

export const SECTION = {
  mairie: '#29676D',
  infos: '#1648DF',
  evenements: '#8B5CF6',
  annonces: '#DB2777',
  emplois: '#1D4ED8',
  groupes: '#8B5CF6',
  clubs: '#1D4ED8',
  rencontres: '#D97706',
  education: '#1B7842',
  economie: '#AF734A',
  cinemas: '#1D3C65',
  permanences: '#C2410C',
  aide: '#0B2C71',
  associations: '#4F46E5',
  banques: '#1D4ED8',
  transports: '#0891B2',
  bibliotheques: '#047857',
  sante: '#C93E84',
  securite: '#475569',
  tourisme: '#CC8040',
  meteo: '#CA8A04',
  urgence: '#DC2626',
  signalement: '#9F1239',
  patrimoine: '#CC8040',
  restaurants: '#AF734A',
  neutral: '#001339',
}

/** Soft tint for backgrounds */
export function soft(hex, pct = 14) {
  return `color-mix(in srgb, ${hex} ${pct}%, #ffffff)`
}

/**
 * Map a screen id → section key used for phone accents + nav dots.
 */
export function sectionFor(id) {
  if (!id) return 'neutral'
  if (id.startsWith('mairie-')) return 'mairie'
  if (id === 'infos-citoyen' || id.startsWith('infos-')) return 'infos'
  if (id.startsWith('evenement')) return 'evenements'
  if (id.startsWith('annonce')) return 'annonces'
  if (id.startsWith('emploi')) return 'emplois'
  if (id.startsWith('sante-')) return 'sante'
  if (id === 'urgence-numeros') return 'urgence'
  if (id.startsWith('communautes-groupes') || id === 'communautes-groupes') return 'groupes'
  if (id.startsWith('communautes-clubs')) return 'clubs'
  if (id.startsWith('communautes-rencontres')) return 'rencontres'
  if (id.startsWith('dir-education')) return 'education'
  if (id.startsWith('dir-economie')) return 'economie'
  if (id.startsWith('dir-cinemas')) return 'cinemas'
  if (id.startsWith('dir-permanences')) return 'permanences'
  if (id.startsWith('dir-aide')) return 'aide'
  if (id.startsWith('dir-associations')) return 'associations'
  if (id.startsWith('dir-banques')) return 'banques'
  if (id.startsWith('dir-transports')) return 'transports'
  if (id.startsWith('dir-bibliotheques')) return 'bibliotheques'
  if (id.startsWith('dir-securite')) return 'securite'
  if (
    id.startsWith('dir-tourisme') ||
    id.startsWith('dir-nature') ||
    id.startsWith('dir-activites')
  )
    return 'tourisme'
  if (id.startsWith('page-meteo') || id.startsWith('meteo-')) return 'meteo'
  if (id.startsWith('page-signalement') || id.startsWith('dir-signalement')) return 'signalement'
  if (id.startsWith('dir-patrimoine')) return 'patrimoine'
  if (id.startsWith('dir-restaurants')) return 'restaurants'
  return 'neutral'
}

export function themeFor(id) {
  return sectionFor(id)
}

export function colorFor(idOrSection) {
  const key = SECTION[idOrSection] ? idOrSection : sectionFor(idOrSection)
  return SECTION[key] || SECTION.neutral
}
