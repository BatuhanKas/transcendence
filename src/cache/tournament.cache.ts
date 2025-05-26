import { TournamentData } from '../models/tournament';

const tournamentCache = new Map<number, TournamentData>();

export default tournamentCache;
