import { readLocalJSON } from "@/lib/data";
import { footballConfig } from "./config";
import {
  getTournamentById,
  getTeamById,
  getPlayerById,
  getTournaments,
} from "./services";
import type { Tournament } from "@/types/tournament";
import type { Team } from "@/types/team";
import type { Player } from "@/types/player";

export async function fetchTournamentWithFallback(id: string): Promise<Tournament | null> {
  try {
    const tournament = await getTournamentById(id);
    if (tournament) return tournament;
  } catch (error) {
    if (!footballConfig.mockFallback) throw error;
  }
  if (!footballConfig.mockFallback) return null;
  const mock = readLocalJSON<Tournament[]>("tournaments.json");
  return mock.find((t) => t.id === id) ?? null;
}

export async function fetchTeamWithFallback(id: string): Promise<Team | null> {
  try {
    const team = await getTeamById(id);
    if (team) return team;
  } catch (error) {
    if (!footballConfig.mockFallback) throw error;
  }
  if (!footballConfig.mockFallback) return null;
  const mock = readLocalJSON<Team[]>("teams.json");
  return mock.find((t) => t.id === id) ?? null;
}

export async function fetchPlayerWithFallback(id: string): Promise<Player | null> {
  try {
    const player = await getPlayerById(id);
    if (player) return player;
  } catch (error) {
    if (!footballConfig.mockFallback) throw error;
  }
  if (!footballConfig.mockFallback) return null;
  const mock = readLocalJSON<Player[]>("players.json");
  return mock.find((p) => p.id === id) ?? null;
}

export async function listTournamentIds(): Promise<string[]> {
  try {
    const tournaments = await getTournaments();
    if (tournaments.length) return tournaments.map((t) => t.id);
  } catch {
    /* fallback */
  }
  const mock = readLocalJSON<Tournament[]>("tournaments.json");
  return mock.map((t) => t.id);
}

export async function listTeamIds(): Promise<string[]> {
  try {
    const { getTeams } = await import("./services");
    const teams = await getTeams();
    if (teams.length) return teams.map((t) => t.id);
  } catch {
    /* fallback */
  }
  const mock = readLocalJSON<Team[]>("teams.json");
  return mock.map((t) => t.id);
}

export async function listPlayerIds(): Promise<string[]> {
  try {
    const { getPlayers } = await import("./services");
    const players = await getPlayers();
    if (players.length) return players.map((p) => p.id);
  } catch {
    /* fallback */
  }
  const mock = readLocalJSON<Player[]>("players.json");
  return mock.map((p) => p.id);
}
