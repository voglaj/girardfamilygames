
import { toast as showToast } from '@/components/ui/use-toast'; 

export const addTeamLogic = (teamData, teams, setTeams, toast) => {
  const newTeam = {
    id: Date.now(),
    ...teamData,
    totalScore: 0
  };
  setTeams([...teams, newTeam]);
  if (toast) {
    toast({
      title: "Team Added! 🎉",
      description: `${teamData.name} is ready to compete!`
    });
  }
};

export const updateTeamLogic = (teamId, teamData, teams, setTeams, toast) => {
  setTeams(teams.map(team => team.id === teamId ? { ...team, ...teamData } : team));
  if (toast) {
    toast({
      title: "Team Updated! ✨",
      description: "Team information has been saved!"
    });
  }
};

export const deleteTeamLogic = (teamId, teams, setTeams, toast) => {
  setTeams(teams.filter(team => team.id !== teamId));
  if (toast) {
    toast({
      title: "Team Removed",
      description: "Team has been deleted from the competition"
    });
  }
};

export const addGameLogic = (gameData, games, setGames, toast) => {
  const newGame = {
    id: Date.now(),
    type: gameData.type || 'tournament',
    points: { 
        first: gameData.points?.first !== undefined ? Number(gameData.points.first) : 10,
        second: gameData.points?.second !== undefined ? Number(gameData.points.second) : 5,
        third: gameData.points?.third !== undefined ? Number(gameData.points.third) : 2,
     },
    name: gameData.name,
  };
  setGames([...games, newGame]);
  if (toast) {
    toast({
      title: "Game Added! 🎮",
      description: `${newGame.name} is ready for competition!`
    });
  }
};

export const updateGameLogic = (gameId, gameData, games, setGames, toast) => {
  setGames(games.map(game => game.id === gameId ? { 
    ...game, 
    ...gameData,
    points: {
        first: gameData.points?.first !== undefined ? Number(gameData.points.first) : game.points.first,
        second: gameData.points?.second !== undefined ? Number(gameData.points.second) : game.points.second,
        third: gameData.points?.third !== undefined ? Number(gameData.points.third) : game.points.third,
    }
  } : game));
  if (toast) {
    toast({
      title: "Game Updated! ✨",
      description: "Game information has been saved!"
    });
  }
};

export const deleteGameLogic = (gameId, games, setGames, brackets, setBrackets, toast) => {
  setGames(games.filter(game => game.id !== gameId));
  
  const newBrackets = { ...brackets };
  delete newBrackets[gameId];
  setBrackets(newBrackets);

  if (toast) {
    toast({
      title: "Game Removed",
      description: "Game and all associated data has been deleted"
    });
  }
};

export const generateTournamentBracketLogic = (gameId, teamsToUse, brackets, setBrackets, updateScoresCallback, toast, isSeeded = false) => {
  if (!Array.isArray(teamsToUse) || teamsToUse.length < 2) {
    if (toast) toast({ title: "Not Enough Teams", description: "You need at least 2 teams to generate a tournament bracket.", variant: "destructive" });
    return;
  }

  let processedTeams = teamsToUse.map(t => ({...t, id: t.id.toString()})); // Ensure string IDs
  if (!isSeeded) {
    processedTeams.sort(() => Math.random() - 0.5);
  } else {
    // If seeded, teamsToUse should already be in the correct order with seed property
    // We just ensure the seed property is used if needed, but order is primary
    processedTeams.sort((a, b) => (a.seed || 0) - (b.seed || 0));
  }
  
  const numTeams = processedTeams.length;
  const numRounds = Math.ceil(Math.log2(numTeams));
  const bracketSize = Math.pow(2, numRounds); 
  const byes = bracketSize - numTeams;
  
  let round1Matches = [];
  let teamsForRound1 = [...processedTeams]; 
  
  let teamsReceivingByes = [];
  if (byes > 0) {
    // Assign byes to the highest-seeded teams (those at the start of the processedTeams list)
    teamsReceivingByes = teamsForRound1.splice(0, byes);
  }

  for (let i = 0; i < teamsReceivingByes.length; i++) {
    const byeTeam = teamsReceivingByes[i]; 
    round1Matches.push({
      id: Date.now() + i + 1000, 
      team1: byeTeam,
      team2: { id: 'BYE', name: 'BYE' },
      winner: byeTeam, 
      round: 1,
      matchNumber: i, 
      score1: null, 
      score2: null
    });
  }
  
  let matchNumberOffset = teamsReceivingByes.length;
  for (let i = 0; i < teamsForRound1.length / 2; i++) {
    round1Matches.push({
      id: Date.now() + i + 2000 + matchNumberOffset, 
      team1: teamsForRound1[i*2], 
      team2: teamsForRound1[i*2 + 1],
      winner: null,
      round: 1,
      matchNumber: matchNumberOffset + i,
      score1: null,
      score2: null
    });
  }

  round1Matches.sort((a, b) => a.matchNumber - b.matchNumber); 

  const gameBracket = {
    type: 'tournament',
    rounds: { 1: round1Matches },
    currentRound: 1,
    finalists: [],
    places: { first: null, second: null, third: null }
  };

  for (let r = 2; r <= numRounds; r++) {
    gameBracket.rounds[r] = [];
    const prevRoundMatches = gameBracket.rounds[r-1];
    for(let i = 0; i < prevRoundMatches.length / 2; i++) {
        gameBracket.rounds[r].push({
            id: Date.now() + r*1000 + i + 5000,
            team1: null,
            team2: null,
            winner: null,
            round: r,
            matchNumber: i,
            score1: null,
            score2: null
        });
    }
  }
  
  if (numRounds > 1) {
    round1Matches.forEach(match => {
      if (match.winner && match.winner.id !== 'BYE') { 
        const nextMatchIndex = Math.floor(match.matchNumber / 2);
        if (gameBracket.rounds[2] && gameBracket.rounds[2][nextMatchIndex]) {
          if (match.matchNumber % 2 === 0) { 
            gameBracket.rounds[2][nextMatchIndex].team1 = match.winner;
          } else { 
            gameBracket.rounds[2][nextMatchIndex].team2 = match.winner;
          }
        }
      }
    });
  }

  setBrackets({ ...brackets, [gameId]: gameBracket });
  if (updateScoresCallback) updateScoresCallback();
  if (toast) toast({ title: "Bracket Generated! 🏆", description: `Tournament bracket created ${isSeeded ? "with custom seeding" : "with random seeding"}.` });
};

export const generateOverallScoreGameLogic = (gameId, teams, brackets, setBrackets, updateScoresCallback, toast) => {
  const gameScores = teams.map(team => ({
    teamId: team.id.toString(),
    teamName: team.name,
    score: 0
  }));
  setBrackets({
    ...brackets,
    [gameId]: {
      type: 'overall_score',
      scores: gameScores,
      places: { first: null, second: null, third: null }
    }
  });
  if (updateScoresCallback) updateScoresCallback();
  if (toast) toast({ title: "Game Setup! 🎲", description: "Ready to enter scores for overall game." });
};

export const updateTeamScoresLogic = (teams, games, brackets, getGamePointValue, setTeams) => {
  if (!Array.isArray(teams) || !Array.isArray(games) || typeof brackets !== 'object' || brackets === null) {
    console.error("Invalid data for score update:", { teams, games, brackets });
    return;
  }

  const newTeams = teams.map(team => {
    let totalScore = 0;
    games.forEach(game => {
      const gameId = game.id;
      const bracketData = brackets[gameId];

      if (bracketData && bracketData.places) {
        const firstPlaceId = bracketData.places.first?.id?.toString();
        const secondPlaceId = bracketData.places.second?.id?.toString();
        const thirdPlaceId = bracketData.places.third?.id?.toString();
        const teamIdStr = team.id.toString();

        if (firstPlaceId === teamIdStr) {
          totalScore += getGamePointValue(gameId, 'first');
        }
        if (secondPlaceId === teamIdStr) {
          totalScore += getGamePointValue(gameId, 'second');
        }
        if (thirdPlaceId === teamIdStr) {
          totalScore += getGamePointValue(gameId, 'third');
        }
      }
    });
    return { ...team, totalScore: Number(totalScore) };
  });
  setTeams(newTeams);
};

export const updateTournamentMatchLogic = (gameId, round, matchId, score1, score2, brackets, setBrackets, teams, updateScoresCallback, toast) => {
  const newBrackets = JSON.parse(JSON.stringify(brackets)); // Deep copy
  const gameBracket = newBrackets[gameId];
  if (!gameBracket || !gameBracket.rounds || !gameBracket.rounds[round]) return;

  const matchIndex = gameBracket.rounds[round].findIndex(m => m.id === matchId);
  if (matchIndex === -1) return;

  const currentMatch = gameBracket.rounds[round][matchIndex];
  
  currentMatch.score1 = score1 === null || score1 === '' ? null : parseInt(score1);
  currentMatch.score2 = score2 === null || score2 === '' ? null : parseInt(score2);

  if (currentMatch.team1?.id === 'BYE') {
    currentMatch.winner = currentMatch.team2;
  } else if (currentMatch.team2?.id === 'BYE') {
    currentMatch.winner = currentMatch.team1;
  } else if (currentMatch.score1 !== null && currentMatch.score2 !== null) {
    if (currentMatch.score1 > currentMatch.score2) currentMatch.winner = currentMatch.team1;
    else if (currentMatch.score2 > currentMatch.score1) currentMatch.winner = currentMatch.team2;
    else currentMatch.winner = null; 
  } else {
    currentMatch.winner = null; 
  }

  const numRounds = Object.keys(gameBracket.rounds).length;
  if (currentMatch.winner && currentMatch.winner.id !== 'BYE') {
    if (round < numRounds) {
      const nextRound = round + 1;
      const nextMatchIndex = Math.floor(currentMatch.matchNumber / 2);
      
      if (gameBracket.rounds[nextRound] && gameBracket.rounds[nextRound][nextMatchIndex]) {
        const nextMatchToUpdate = gameBracket.rounds[nextRound][nextMatchIndex];
        if (currentMatch.matchNumber % 2 === 0) {
          nextMatchToUpdate.team1 = currentMatch.winner;
        } else {
          nextMatchToUpdate.team2 = currentMatch.winner;
        }
        
        if(nextMatchToUpdate.team1 && nextMatchToUpdate.team2) { // If both slots filled, check for BYEs
            if(nextMatchToUpdate.team1.id === 'BYE') {
                nextMatchToUpdate.winner = nextMatchToUpdate.team2;
                 // Call recursively ONLY if this auto-win completes the match and potentially advances further
                if (nextRound < numRounds) { // Only recurse if not the final round
                    updateTournamentMatchLogic(gameId, nextRound, nextMatchToUpdate.id, null, null, newBrackets, setBrackets, teams, null, null); // No toast for recursive calls
                }
            } else if (nextMatchToUpdate.team2.id === 'BYE') {
                nextMatchToUpdate.winner = nextMatchToUpdate.team1;
                if (nextRound < numRounds) {
                    updateTournamentMatchLogic(gameId, nextRound, nextMatchToUpdate.id, null, null, newBrackets, setBrackets, teams, null, null);
                }
            }
        }
      }
    } else { 
      gameBracket.places.first = currentMatch.winner;
      const loser = currentMatch.winner.id.toString() === currentMatch.team1?.id?.toString() ? currentMatch.team2 : currentMatch.team1;
      if (loser && loser.id !== 'BYE') {
        gameBracket.places.second = loser;
      } else {
         gameBracket.places.second = null; 
      }

      if (numRounds > 1 && teams.length > 2) {
        const semiFinalRoundKey = (numRounds -1).toString();
        const semiFinalRoundMatches = gameBracket.rounds[semiFinalRoundKey];

        if (semiFinalRoundMatches && semiFinalRoundMatches.length === 2) { 
            const finalTeamIds = [gameBracket.places.first?.id?.toString(), gameBracket.places.second?.id?.toString()].filter(Boolean);
            
            const semiFinalLosers = semiFinalRoundMatches
                .map(match => {
                    if (!match.winner) return null; 
                    const loserOfMatch = match.winner.id.toString() === match.team1?.id?.toString() ? match.team2 : match.team1;
                    return loserOfMatch && loserOfMatch.id !== 'BYE' ? loserOfMatch : null;
                })
                .filter(Boolean); 

            const potentialThirdPlace = semiFinalLosers.find(loser => !finalTeamIds.includes(loser.id?.toString()));
            if (potentialThirdPlace) {
                gameBracket.places.third = potentialThirdPlace;
            }
        } else if (semiFinalRoundMatches && semiFinalRoundMatches.length === 1 && teams.length === 3) { // Case for 3 teams, 1 semi-final
            const winnerOfSemi = semiFinalRoundMatches[0].winner;
            const loserOfSemi = winnerOfSemi?.id.toString() === semiFinalRoundMatches[0].team1?.id.toString() ? semiFinalRoundMatches[0].team2 : semiFinalRoundMatches[0].team1;
            if (loserOfSemi && loserOfSemi.id !== 'BYE' && loserOfSemi.id.toString() !== gameBracket.places.first?.id.toString() && loserOfSemi.id.toString() !== gameBracket.places.second?.id.toString()) {
                 gameBracket.places.third = loserOfSemi;
            }
        }
      } else if (teams.length === 2 && !gameBracket.places.third) {
        gameBracket.places.third = null; // No third place for 2 teams
      } else if (teams.length === 3 && !gameBracket.places.third) { 
         const allTeamIdsInFinal = [gameBracket.places.first?.id?.toString(), gameBracket.places.second?.id?.toString()].filter(Boolean);
         const thirdTeam = teams.find(t => !allTeamIdsInFinal.includes(t.id.toString()));
         if (thirdTeam) gameBracket.places.third = thirdTeam;
      }
    }
  }
  
  setBrackets(newBrackets); // Set the modified newBrackets
  if (updateScoresCallback) updateScoresCallback(); // This will use the latest state from setBrackets
  if (toast && (score1 !== null || score2 !== null)) {
    toast({ title: "Match Scores Submitted! 📊", description: "Result recorded and bracket updated." });
  }
};


export const updateOverallScoreLogic = (gameId, teamId, score, brackets, setBrackets, teams, updateScoresCallback, toast) => {
  const newBrackets = JSON.parse(JSON.stringify(brackets)); // Deep copy
  const gameData = newBrackets[gameId];
  if (gameData && gameData.type === 'overall_score') {
    const teamIndex = gameData.scores.findIndex(s => s.teamId.toString() === teamId.toString());
    if (teamIndex !== -1) {
      gameData.scores[teamIndex].score = parseInt(score) || 0;
    }

    const sortedScores = [...gameData.scores].sort((a, b) => b.score - a.score);
    
    const getTeamById = (id) => teams.find(t => t.id.toString() === id?.toString()) || null;

    gameData.places.first = sortedScores.length > 0 ? getTeamById(sortedScores[0].teamId) : null;
    gameData.places.second = sortedScores.length > 1 && sortedScores[1].teamId !== sortedScores[0].teamId ? getTeamById(sortedScores[1].teamId) : null;
    
    if (sortedScores.length > 2 && sortedScores[2].teamId !== sortedScores[0].teamId && sortedScores[2].teamId !== sortedScores[1]?.teamId) {
        gameData.places.third = getTeamById(sortedScores[2].teamId);
    } else {
        gameData.places.third = null;
    }
    
    setBrackets(newBrackets);
    if (updateScoresCallback) updateScoresCallback();
    if (toast) toast({ title: "Score Updated! 📊", description: "Team score recorded." });
  }
};

export const updateGamePointsSettingLogic = (gameId, points, gameSettings, setGameSettings, toast) => {
  setGameSettings(prev => ({
    ...prev,
    [gameId]: {
      ...(prev[gameId] || {}),
      ...points
    }
  }));
  if (toast) {
    toast({
      title: "Game Settings Updated! ⚙️",
      description: "Point values for the game have been saved."
    });
  }
};
