import type { Locale } from "./config";
import type { NewsCategory } from "@/types/news";

export interface Dictionary {
  nav: {
    news: string;
    groups: string;
    worldCup: string;
    matches: string;
    teams: string;
    scorers: string;
  };
  topbar: {
    groups: string;
    worldCup: string;
    transfers: string;
    signIn: string;
  };
  search: {
    placeholder: string;
    title: string;
    hint: string;
    noResults: string;
    sections: {
      news: string;
      teams: string;
      players: string;
      matches: string;
    };
  };
  footer: {
    about: string;
    contact: string;
    legal: string;
    rss: string;
  };
  common: {
    back: string;
    retry: string;
    viewAll: string;
    loadError: string;
    noResults: string;
    all: string;
    live: string;
    breaking: string;
    team: string;
    pts: string;
    form: string;
    by: string;
    minRead: string;
  };
  home: {
    latestNews: string;
    topScorers: string;
    topScorersEmpty: string;
    viewAllPlayers: string;
    upcomingMatches: string;
    upcomingEmpty: string;
    noLiveMatches: string;
    hotTransfers: string;
    pollQuestion: string;
  };
  news: {
    title: string;
    noArticles: string;
    categories: Record<NewsCategory | "Tous", string>;
  };
  matches: {
    title: string;
    tabs: { live: string; upcoming: string; finished: string };
    allCompetitions: string;
    noMatches: string;
    noFinished: string;
  };
  rankings: {
    title: string;
    subtitle: string;
    unavailable: string;
  };
  teams: {
    title: string;
    searchPlaceholder: string;
    noTeams: string;
  };
  players: {
    title: string;
    searchPlaceholder: string;
    noPlayers: string;
    positions: Record<string, string>;
  };
  transfers: {
    title: string;
    noTransfers: string;
  };
  competitions: {
    title: string;
    noCompetitions: string;
    topScorers: string;
    groupStandings: string;
  };
  poll: {
    title: string;
    votes: string;
  };
  detail: {
    match: {
      events: string;
      lineups: string;
      stats: string;
      h2h: string;
      noEvents: string;
      noLineups: string;
      noStats: string;
      noH2h: string;
      notFound: string;
      final: string;
      halftime: string;
      starters: string;
      substitutes: string;
      lastMeetings: string;
    };
    player: {
      notFound: string;
      seasonStats: string;
      recentFixtures: string;
      bio: string;
      injured: string;
      backToPlayers: string;
      height: string;
      weight: string;
      yearsOld: string;
    };
    team: {
      notFound: string;
      squad: string;
      upcoming: string;
      results: string;
      backToTeams: string;
      noSquad: string;
      noFixtures: string;
      position: string;
      founded: string;
      capacity: string;
      goalkeepers: string;
      defenders: string;
      midfielders: string;
      attackers: string;
    };
  };
}

const fr: Dictionary = {
  nav: {
    news: "Actualités",
    groups: "Groupes CDM",
    worldCup: "Coupe du Monde",
    matches: "Matchs",
    teams: "Équipes",
    scorers: "Buteurs",
  },
  topbar: {
    groups: "Groupes CDM",
    worldCup: "Coupe du Monde",
    transfers: "Transferts",
    signIn: "Se connecter",
  },
  search: {
    placeholder: "Rechercher...",
    title: "Résultats de recherche",
    hint: "Recherchez des actualités, équipes, joueurs ou matchs.",
    noResults: "Aucun résultat pour cette recherche.",
    sections: {
      news: "Actualités",
      teams: "Équipes",
      players: "Joueurs",
      matches: "Matchs",
    },
  },
  footer: {
    about: "À propos",
    contact: "Contact",
    legal: "Mentions légales",
    rss: "RSS",
  },
  common: {
    back: "Retour",
    retry: "Réessayer",
    viewAll: "Voir tout",
    loadError: "Erreur de chargement",
    noResults: "Aucun résultat trouvé.",
    all: "Tous",
    live: "LIVE",
    breaking: "DIRECT",
    team: "Équipe",
    pts: "Pts",
    form: "Forme",
    by: "Par",
    minRead: "min de lecture",
  },
  home: {
    latestNews: "Dernières nouvelles",
    topScorers: "Meilleurs buteurs · CDM 2026",
    topScorersEmpty: "Classement disponible après le début du tournoi.",
    viewAllPlayers: "Voir tous les joueurs →",
    upcomingMatches: "Prochains matchs · CDM 2026",
    upcomingEmpty: "Aucun match à venir pour le moment.",
    noLiveMatches: "Aucun match en direct · Coupe du Monde 2026",
    hotTransfers: "Transferts chauds",
    pollQuestion: "Qui est le meilleur joueur de la CDM 2026 ?",
  },
  news: {
    title: "Actualités",
    noArticles: "Aucun article dans cette catégorie.",
    categories: {
      Tous: "Tous",
      "Ligue 1": "Ligue 1",
      "Champions League": "Champions League",
      Transferts: "Transferts",
      "Équipe de France": "Équipe de France",
      Afrique: "Afrique",
      International: "International",
      Analyse: "Analyse",
    },
  },
  matches: {
    title: "Centre des matchs · CDM 2026",
    tabs: { live: "Live", upcoming: "À venir", finished: "Résultats" },
    allCompetitions: "Toutes les compétitions",
    noMatches: "Aucun match trouvé.",
    noFinished: "Aucun résultat récent. Les matchs CDM 2026 n'ont pas encore commencé.",
  },
  rankings: {
    title: "Classements",
    subtitle: "Coupe du Monde 2026",
    unavailable: "Classement non disponible.",
  },
  teams: {
    title: "Équipes",
    searchPlaceholder: "Rechercher une équipe...",
    noTeams: "Aucune équipe trouvée.",
  },
  players: {
    title: "Joueurs",
    searchPlaceholder: "Rechercher un joueur...",
    noPlayers: "Aucun joueur trouvé.",
    positions: {
      Tous: "Tous",
      Attaquant: "Attaquant",
      Milieu: "Milieu",
      Défenseur: "Défenseur",
      Gardien: "Gardien",
    },
  },
  transfers: {
    title: "Transferts",
    noTransfers: "Aucun transfert trouvé.",
  },
  competitions: {
    title: "Compétitions · Coupe du Monde",
    noCompetitions: "Aucune compétition trouvée.",
    topScorers: "Meilleurs buteurs",
    groupStandings: "Classement par groupes",
  },
  poll: {
    title: "Sondage du jour",
    votes: "votes · résultats en direct",
  },
  detail: {
    match: {
      events: "Événements",
      lineups: "Compositions",
      stats: "Statistiques",
      h2h: "Face à face",
      noEvents: "Aucun événement disponible.",
      noLineups: "Compositions non disponibles.",
      noStats: "Statistiques non disponibles.",
      noH2h: "Aucun historique disponible.",
      notFound: "Match introuvable.",
      final: "Terminé",
      halftime: "Mi-temps",
      starters: "Titulaires",
      substitutes: "Remplaçants",
      lastMeetings: "Dernières confrontations",
    },
    player: {
      notFound: "Joueur introuvable.",
      seasonStats: "Statistiques de saison",
      recentFixtures: "Derniers matchs",
      bio: "Biographie",
      injured: "Joueur blessé actuellement",
      backToPlayers: "← Retour aux joueurs",
      height: "Taille",
      weight: "Poids",
      yearsOld: "ans",
    },
    team: {
      notFound: "Équipe introuvable.",
      squad: "Effectif",
      upcoming: "Prochains matchs",
      results: "Résultats",
      backToTeams: "← Retour aux équipes",
      noSquad: "Effectif non disponible.",
      noFixtures: "Aucun match disponible.",
      position: "Position",
      founded: "Fondé",
      capacity: "Cap.",
      goalkeepers: "Gardiens",
      defenders: "Défenseurs",
      midfielders: "Milieux",
      attackers: "Attaquants",
    },
  },
};

const en: Dictionary = {
  nav: {
    news: "News",
    groups: "WC Groups",
    worldCup: "World Cup",
    matches: "Matches",
    teams: "Teams",
    scorers: "Top Scorers",
  },
  topbar: {
    groups: "WC Groups",
    worldCup: "World Cup",
    transfers: "Transfers",
    signIn: "Sign in",
  },
  search: {
    placeholder: "Search...",
    title: "Search results",
    hint: "Search news, teams, players, or matches.",
    noResults: "No results found for this search.",
    sections: {
      news: "News",
      teams: "Teams",
      players: "Players",
      matches: "Matches",
    },
  },
  footer: {
    about: "About",
    contact: "Contact",
    legal: "Legal notice",
    rss: "RSS",
  },
  common: {
    back: "Back",
    retry: "Try again",
    viewAll: "View all",
    loadError: "Failed to load data",
    noResults: "No results found.",
    all: "All",
    live: "LIVE",
    breaking: "BREAKING",
    team: "Team",
    pts: "Pts",
    form: "Form",
    by: "By",
    minRead: "min read",
  },
  home: {
    latestNews: "Latest news",
    topScorers: "Top scorers · WC 2026",
    topScorersEmpty: "Rankings available once the tournament starts.",
    viewAllPlayers: "View all players →",
    upcomingMatches: "Upcoming matches · WC 2026",
    upcomingEmpty: "No upcoming matches at the moment.",
    noLiveMatches: "No live matches · World Cup 2026",
    hotTransfers: "Hot transfers",
    pollQuestion: "Who is the best player at WC 2026?",
  },
  news: {
    title: "News",
    noArticles: "No articles in this category.",
    categories: {
      Tous: "All",
      "Ligue 1": "Ligue 1",
      "Champions League": "Champions League",
      Transferts: "Transfers",
      "Équipe de France": "France NT",
      Afrique: "Africa",
      International: "International",
      Analyse: "Analysis",
    },
  },
  matches: {
    title: "Match centre · WC 2026",
    tabs: { live: "Live", upcoming: "Upcoming", finished: "Results" },
    allCompetitions: "All competitions",
    noMatches: "No matches found.",
    noFinished: "No recent results. WC 2026 matches have not started yet.",
  },
  rankings: {
    title: "Standings",
    subtitle: "World Cup 2026",
    unavailable: "Standings not available.",
  },
  teams: {
    title: "Teams",
    searchPlaceholder: "Search for a team...",
    noTeams: "No teams found.",
  },
  players: {
    title: "Players",
    searchPlaceholder: "Search for a player...",
    noPlayers: "No players found.",
    positions: {
      Tous: "All",
      Attaquant: "Forward",
      Milieu: "Midfielder",
      Défenseur: "Defender",
      Gardien: "Goalkeeper",
    },
  },
  transfers: {
    title: "Transfers",
    noTransfers: "No transfers found.",
  },
  competitions: {
    title: "Competitions · World Cup",
    noCompetitions: "No competitions found.",
    topScorers: "Top scorers",
    groupStandings: "Group standings",
  },
  poll: {
    title: "Poll of the day",
    votes: "votes · live results",
  },
  detail: {
    match: {
      events: "Events",
      lineups: "Lineups",
      stats: "Statistics",
      h2h: "Head to head",
      noEvents: "No events available.",
      noLineups: "Lineups not available.",
      noStats: "Statistics not available.",
      noH2h: "No history available.",
      notFound: "Match not found.",
      final: "Full time",
      halftime: "Half time",
      starters: "Starting XI",
      substitutes: "Substitutes",
      lastMeetings: "Last meetings",
    },
    player: {
      notFound: "Player not found.",
      seasonStats: "Season statistics",
      recentFixtures: "Recent matches",
      bio: "Biography",
      injured: "Currently injured",
      backToPlayers: "← Back to players",
      height: "Height",
      weight: "Weight",
      yearsOld: "years old",
    },
    team: {
      notFound: "Team not found.",
      squad: "Squad",
      upcoming: "Upcoming",
      results: "Results",
      backToTeams: "← Back to teams",
      noSquad: "Squad not available.",
      noFixtures: "No matches available.",
      position: "Position",
      founded: "Founded",
      capacity: "Cap.",
      goalkeepers: "Goalkeepers",
      defenders: "Defenders",
      midfielders: "Midfielders",
      attackers: "Forwards",
    },
  },
};

export const dictionaries: Record<Locale, Dictionary> = { fr, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.fr;
}

export const newsFilterIds = [
  "Tous",
  "Ligue 1",
  "Champions League",
  "Transferts",
  "Équipe de France",
  "Afrique",
  "International",
] as const;

export type NewsFilterCategory = (typeof newsFilterIds)[number];
