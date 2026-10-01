/**
 * Centralized permission → menu actions for the wireframe.
 * Never use display names for ownership — ids only.
 * Forbidden: Archiver, Épingler (and synonyms).
 */

import { isAdminRole, getRole, ROLE_ADMIN_KAPAN } from './role.js'
import {
  ADMIN_CITY,
  SIM_VIEWER_ID,
  getPublication,
  getDirectory,
  getEvent,
  getParticipant,
  EVENT_INSCRIPTIONS,
} from './demo-data.js'

/** Personal saved / hidden state (simulated, per viewer) */
const personal = {
  saved: new Set(),
  hidden: new Set(),
}

export function isSaved(id) {
  return personal.saved.has(id)
}

export function toggleSaved(id) {
  if (personal.saved.has(id)) personal.saved.delete(id)
  else personal.saved.add(id)
  return isSaved(id)
}

export function isHidden(id) {
  return personal.hidden.has(id)
}

export function toggleHidden(id) {
  if (personal.hidden.has(id)) personal.hidden.delete(id)
  else personal.hidden.add(id)
  return isHidden(id)
}

export function getInscription(eventId) {
  return EVENT_INSCRIPTIONS[eventId] || 'none'
}

export function setInscription(eventId, status) {
  EVENT_INSCRIPTIONS[eventId] = status
}

function adminOfCity(city, role = getRole()) {
  return isAdminRole(role) && city === ADMIN_CITY
}

function viewerId() {
  return SIM_VIEWER_ID
}

/**
 * @returns {{ id: string, label: string, go?: string, sim?: string, danger?: boolean, section?: string }[]}
 * Order: consultation → perso → gestion → sensible
 */
export function publicationMenuActions(contentId, role = getRole()) {
  const c = getPublication(contentId)
  if (!c) return [{ id: 'close', label: 'Fermer', sim: 'menu-close' }]

  const admin = adminOfCity(c.city, role)
  const own = c.authorId === viewerId()
  const actions = []

  // consultation
  actions.push({ id: 'share', label: 'Partager', go: 'infos-partage' })
  actions.push({
    id: 'save',
    label: isSaved(c.id) ? 'Retirer des enregistrements' : 'Enregistrer',
    sim: `save:${c.id}`,
  })
  if (c.reactionCount > 0) {
    actions.push({ id: 'reactions', label: 'Voir les réactions', go: 'infos-reactions' })
  }

  if (c.kind === 'official') {
    if (admin) {
      actions.push({ id: 'edit', label: 'Modifier', go: 'mairie-pub-edit', section: 'manage' })
      actions.push({
        id: 'manage-comments',
        label: 'Gérer les commentaires',
        go: 'infos-commentaires',
        section: 'manage',
      })
      actions.push({
        id: 'delete',
        label: 'Supprimer',
        go: 'menu-confirm-delete-pub',
        danger: true,
        section: 'danger',
      })
    } else {
      // habitant: no edit/delete/signal on official for manage; can hide
      actions.push({ id: 'hide', label: 'Masquer pour moi', sim: `hide:${c.id}`, section: 'perso' })
      actions.push({
        id: 'report',
        label: 'Signaler',
        go: 'evenement-signaler',
        danger: true,
        section: 'danger',
      })
    }
    return actions
  }

  // citizen post
  if (own && !admin) {
    actions.push({ id: 'edit', label: 'Modifier', go: 'infos-post-edit', section: 'manage' })
    actions.push({
      id: 'delete',
      label: 'Supprimer',
      go: 'menu-confirm-delete-pub',
      danger: true,
      section: 'danger',
    })
    return actions
  }

  if (admin && !own) {
    // moderate, don't rewrite
    actions.push({ id: 'hide', label: 'Masquer pour moi', sim: `hide:${c.id}`, section: 'perso' })
    actions.push({
      id: 'moderate',
      label: 'Modérer',
      go: 'menu-moderate-pub',
      section: 'manage',
    })
    return actions
  }

  // other citizen, habitant
  actions.push({ id: 'hide', label: 'Masquer pour moi', sim: `hide:${c.id}`, section: 'perso' })
  actions.push({
    id: 'report',
    label: 'Signaler',
    go: 'evenement-signaler',
    danger: true,
    section: 'danger',
  })
  return actions
}

export function directoryMenuActions(contentId, role = getRole()) {
  const c = getDirectory(contentId)
  if (!c) return []
  const admin = adminOfCity(c.city, role)
  const published = c.state === 'published'
  const actions = []

  if (admin) {
    if (published) {
      actions.push({ id: 'view', label: 'Voir la fiche publique', go: 'sante-pharmacie-infos' })
      actions.push({ id: 'share', label: 'Partager', sim: 'partage' })
      actions.push({
        id: 'save',
        label: isSaved(c.id) ? 'Retirer des enregistrements' : 'Enregistrer',
        sim: `save:${c.id}`,
      })
    }
    actions.push({ id: 'edit', label: 'Modifier la fiche', go: 'fiche-annuaire-form', section: 'manage' })
    actions.push({
      id: 'hours',
      label: 'Modifier les horaires',
      go: 'fiche-annuaire-form',
      section: 'manage',
    })
    if (c.reportedErrors) {
      actions.push({
        id: 'errors',
        label: 'Examiner erreurs signalées',
        go: 'admin-moderation',
        section: 'manage',
      })
    }
    if (published) {
      actions.push({ id: 'unpublish', label: 'Dépublier', sim: `unpublish:${c.id}`, section: 'manage' })
    } else if (c.state === 'unpublished') {
      actions.push({ id: 'republish', label: 'Republier', sim: `republish:${c.id}`, section: 'manage' })
    } else {
      actions.push({ id: 'publish', label: 'Publier', sim: `publish:${c.id}`, section: 'manage' })
    }
    actions.push({
      id: 'delete',
      label: 'Supprimer',
      go: 'menu-confirm-delete-dir',
      danger: true,
      section: 'danger',
    })
    return actions
  }

  // habitant — only if published; otherwise unavailable screen handles
  actions.push({ id: 'share', label: 'Partager', sim: 'partage' })
  actions.push({
    id: 'save',
    label: isSaved(c.id) ? 'Retirer des enregistrements' : 'Enregistrer',
    sim: `save:${c.id}`,
  })
  actions.push({
    id: 'report-info',
    label: 'Signaler info incorrecte',
    go: 'menu-signal-fiche-info',
    section: 'perso',
  })
  actions.push({
    id: 'report',
    label: 'Signaler inapproprié',
    go: 'evenement-signaler',
    danger: true,
    section: 'danger',
  })
  return actions
}

export function eventMenuActions(contentId, role = getRole()) {
  const c = getEvent(contentId)
  if (!c) return []
  const admin = adminOfCity(c.city, role)
  const actions = []

  actions.push({ id: 'share', label: 'Partager', sim: 'partage' })
  actions.push({
    id: 'save',
    label: isSaved(c.id) ? 'Retirer des enregistrements' : 'Enregistrer',
    sim: `save:${c.id}`,
  })
  actions.push({
    id: 'calendar',
    label: 'Ajouter au calendrier (simulé)',
    sim: 'calendrier',
  })
  if (c.reactionCount > 0) {
    actions.push({ id: 'reactions', label: 'Voir les réactions', go: 'infos-reactions' })
  }

  if (admin) {
    actions.push({ id: 'edit', label: 'Modifier', go: 'evenement-gerer', section: 'manage' })
    actions.push({
      id: 'manage',
      label: 'Gérer l’événement',
      go: 'evenement-gerer',
      section: 'manage',
    })
    if (c.state === 'draft') {
      actions.push({
        id: 'delete',
        label: 'Supprimer',
        go: 'menu-confirm-delete-evt',
        danger: true,
        section: 'danger',
      })
    } else if (c.state === 'published') {
      actions.push({
        id: 'cancel-evt',
        label: 'Annuler l’événement',
        go: 'menu-confirm-cancel-evt',
        danger: true,
        section: 'danger',
      })
    }
    return actions
  }

  actions.push({ id: 'hide', label: 'Masquer pour moi', sim: `hide:${c.id}`, section: 'perso' })
  actions.push({
    id: 'report',
    label: 'Signaler',
    go: 'evenement-signaler',
    danger: true,
    section: 'danger',
  })
  return actions
}

/** Primary inscription CTA block (not ⋯) — exclusive states */
export function eventInscriptionUi(eventId, role = getRole()) {
  const c = getEvent(eventId)
  if (!c) return { kind: 'none' }
  if (adminOfCity(c.city, role)) {
    return {
      kind: 'admin',
      manageEvent: true,
      manageInscriptions: true,
    }
  }
  if (c.state === 'cancelled') return { kind: 'cancelled', label: 'Événement annulé' }
  if (c.state === 'ended') return { kind: 'ended', label: 'Événement terminé' }
  if (!c.inscriptionsOpen) return { kind: 'closed', label: 'Inscriptions closes' }
  if (c.full) return { kind: 'full', label: 'Complet' }

  const status = getInscription(eventId)
  if (status === 'none') {
    return { kind: 'join', label: 'Participer', sim: `inscription-join:${eventId}` }
  }
  if (status === 'pending') {
    return {
      kind: 'pending',
      badge: 'En attente',
      cancelLabel: 'Annuler ma demande',
      sim: `inscription-cancel:${eventId}`,
    }
  }
  if (status === 'confirmed') {
    return {
      kind: 'confirmed',
      badge: 'Confirmée',
      cancelLabel: 'Annuler ma participation',
      sim: `inscription-cancel:${eventId}`,
    }
  }
  if (status === 'refused') {
    return {
      kind: 'refused',
      badge: 'Refusée',
      explanation: 'Votre demande n’a pas été acceptée pour cet événement.',
    }
  }
  return { kind: 'none' }
}

export function participantMenuActions(participantId, role = getRole()) {
  const p = getParticipant(participantId)
  if (!p) return []
  const evt = getEvent(p.eventId)
  const admin = evt && adminOfCity(evt.city, role)
  const actions = []

  actions.push({ id: 'profile', label: 'Voir son profil', sim: 'profil' })
  actions.push({ id: 'message', label: 'Envoyer un message', go: 'messages-thread' })

  if (admin) {
    if (p.status === 'pending') {
      actions.push({ id: 'view-req', label: 'Consulter la demande', sim: 'consulter-demande', section: 'manage' })
      actions.push({ id: 'accept', label: 'Accepter', sim: `accept:${p.id}`, section: 'manage' })
      actions.push({
        id: 'refuse',
        label: 'Refuser',
        go: 'evenement-annuler-refus',
        danger: true,
        section: 'danger',
      })
    } else if (p.status === 'confirmed') {
      actions.push({
        id: 'view-insc',
        label: 'Consulter l’inscription',
        sim: 'consulter-inscription',
        section: 'manage',
      })
      actions.push({
        id: 'remove',
        label: 'Retirer de l’événement',
        go: 'evenement-supprimer-confirm',
        danger: true,
        section: 'danger',
      })
    } else if (p.status === 'refused') {
      actions.push({ id: 'view', label: 'Consulter', sim: 'consulter-refus', section: 'manage' })
      actions.push({
        id: 'reconsider',
        label: 'Reconsidérer',
        go: 'evenement-annuler-refus',
        section: 'manage',
      })
    }
    return actions
  }

  // habitant: never remove / validate
  actions.push({
    id: 'report',
    label: 'Signaler',
    go: 'evenement-signaler',
    danger: true,
    section: 'danger',
  })
  return actions
}

export function annonceMenuActions({ official = true } = {}, role = getRole()) {
  const admin = isAdminRole(role)
  const actions = [
    { id: 'share', label: 'Partager', sim: 'partage' },
    { id: 'save', label: 'Enregistrer', go: 'enregistrements' },
  ]
  if (admin && official) {
    actions.push({ id: 'edit', label: 'Modifier', go: 'annonce-details', section: 'manage' })
    actions.push({ id: 'avail', label: 'Marquer dispo / indispo', sim: 'dispo', section: 'manage' })
    actions.push({ id: 'unpublish', label: 'Dépublier', sim: 'depublier', section: 'manage' })
    actions.push({
      id: 'delete',
      label: 'Supprimer',
      sim: 'supprimer',
      danger: true,
      section: 'danger',
    })
  } else {
    actions.push({ id: 'contact', label: 'Contacter', sim: 'message' })
    actions.push({
      id: 'report',
      label: 'Signaler',
      go: 'evenement-signaler',
      danger: true,
      section: 'danger',
    })
  }
  return actions
}

export function offreMenuActions(role = getRole()) {
  const admin = isAdminRole(role)
  const actions = [
    { id: 'share', label: 'Partager', sim: 'partage' },
    { id: 'save', label: 'Enregistrer', go: 'enregistrements' },
    { id: 'modalites', label: 'Voir les modalités', go: 'emploi-details' },
  ]
  if (admin) {
    actions.push({ id: 'edit', label: 'Modifier', go: 'emploi-details', section: 'manage' })
    actions.push({ id: 'close', label: 'Clôturer', sim: 'cloturer', section: 'manage' })
    actions.push({
      id: 'delete',
      label: 'Supprimer',
      sim: 'supprimer',
      danger: true,
      section: 'danger',
    })
  } else {
    actions.push({
      id: 'report',
      label: 'Signaler',
      go: 'evenement-signaler',
      danger: true,
      section: 'danger',
    })
  }
  return actions
}

/** Gate management routes — habitant hitting admin form */
export function canAccessManageRoute(screenId, role = getRole()) {
  const manageScreens = new Set([
    'mairie-gerer-page',
    'mairie-nouvelle-publication',
    'mairie-pub-edit',
    'mairie-pub-preview',
    'mairie-pub-options-admin',
    'evenement-gerer',
    'evenement-validation',
    'evenement-validation-valide',
    'evenement-validation-refuse',
    'evenement-annuler-refus',
    'fiche-annuaire-form',
    'menu-moderate-pub',
    'menu-confirm-delete-dir',
    'menu-confirm-delete-evt',
    'menu-confirm-cancel-evt',
    'admin-home',
    'admin-mairie',
    'admin-mairie-page',
    'admin-mairie-pub-form',
    'admin-evenements',
    'admin-evenement-form',
    'admin-annonces',
    'admin-offres',
    'admin-annuaires',
    'admin-annuaire-sante',
    'admin-annuaire-pharmacies',
    'admin-rdv',
    'admin-moderation',
    'admin-equipe',
    'admin-stats',
  ])
  if (!manageScreens.has(screenId)) return true
  return isAdminRole(role)
}

/** Screens that are open menus / confirms — revoke on role switch */
export const MENU_SCREEN_PARENTS = {
  'mairie-pub-options-habitant': 'mairie-accueil',
  'mairie-pub-options-admin': 'mairie-accueil',
  'mairie-presentation-options': 'mairie-presentation',
  'infos-post-options': 'infos-feed',
  'infos-post-options-other': 'infos-feed',
  'content-menu': null, // use menu context parent
  'evenement-options': 'evenement-details',
  'evenement-participant-menu': 'evenement-participants',
  'evenement-supprimer-confirm': 'evenement-participants',
  'evenement-signaler': 'evenement-details',
  'menu-moderate-pub': 'infos-feed',
  'menu-confirm-delete-pub': 'mairie-accueil',
  'menu-confirm-delete-dir': 'sante-pharmacie-infos',
  'menu-confirm-delete-evt': 'evenement-details',
  'menu-confirm-cancel-evt': 'evenement-details',
  'menu-signal-fiche-info': 'sante-pharmacie-infos',
  'dir-fiche-menu': 'sante-pharmacie-infos',
  'annonce-options': 'annonce-details',
  'offre-options': 'emploi-details',
}

export function parentForMenuScreen(screenId, fallbackParent) {
  if (screenId === 'content-menu' && fallbackParent) return fallbackParent
  return MENU_SCREEN_PARENTS[screenId] || null
}

export function isMenuScreen(screenId) {
  return screenId in MENU_SCREEN_PARENTS || screenId === 'content-menu'
}
