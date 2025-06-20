import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trophy, Users, ChevronDown, ChevronUp } from 'lucide-react';
import BracketMatch from '@/components/BracketMatch';

function BracketsTab({ brackets, games, teams, onUpdateTournamentMatch, onUpdateOverallScore, getGamePointValue }) {
  const [expandedGame, setExpandedGame] = useState(null);

  const toggleExpand = (gameId) => {
    setExpandedGame(expandedGame === gameId ? null : gameId);
  };

  const renderTournamentBracket = (gameId, gameBracket) => {
    if (!gameBracket || !gameBracket.rounds) return <p className="text-white/60">Bracket data is missing or corrupt.</p>;
    
    const numRounds = Object.keys(gameBracket.rounds).length;

    return (
      <div className="space-y-6">
        {Object.entries(gameBracket.rounds).map(([roundNumber, matches]) => (
          (matches && matches.length > 0 || parseInt(roundNumber) <= gameBracket.currentRound) && (
            <div key={`round-${roundNumber}`}>
              <h4 className="text-xl font-semibold text-white mb-3">Round {roundNumber}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matches.map((match) => (
                  match.team1 && match.team2 ? (
                    <BracketMatch
                      key={match.id}
                      match={match}
                      onScoreUpdate={(score1, score2) => onUpdateTournamentMatch(gameId, parseInt(roundNumber), match.id, score1, score2)}
                      isFinal={parseInt(roundNumber) === numRounds}
                    />
                  ) : (
                    <div key={match.id} className="bg-white/5 border border-white/10 rounded-lg p-4 min-h-[100px] flex items-center justify-center">
                      <p className="text-white/50">Waiting for players...</p>
                    </div>
                  )
                ))}
              </div>
            </div>
          )
        ))}
        {gameBracket.places && (gameBracket.places.first || gameBracket.places.second || gameBracket.places.third) && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <h4 className="text-xl font-semibold text-white mb-3">Final Standings</h4>
            <ul className="space-y-2">
              {gameBracket.places.first && (
                <li className="flex items-center text-yellow-400">
                  <Trophy className="w-5 h-5 mr-2" /> 1st Place: {gameBracket.places.first.name} (+{getGamePointValue(gameId, 'first')} pts)
                </li>
              )}
              {gameBracket.places.second && (
                <li className="flex items-center text-gray-300">
                  <Trophy className="w-5 h-5 mr-2" /> 2nd Place: {gameBracket.places.second.name} (+{getGamePointValue(gameId, 'second')} pts)
                </li>
              )}
              {gameBracket.places.third && (
                <li className="flex items-center text-orange-400">
                  <Trophy className="w-5 h-5 mr-2" /> 3rd Place: {gameBracket.places.third.name} (+{getGamePointValue(gameId, 'third')} pts)
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderOverallScoreGame = (gameId, gameData) => {
    if (!gameData || !gameData.scores) return <p className="text-white/60">Score data is missing.</p>;

    return (
      <div className="space-y-4">
        {gameData.scores.map(scoreEntry => (
          <div key={scoreEntry.teamId} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
            <span className="text-white font-medium">{teams.find(t => t.id === scoreEntry.teamId)?.name || 'Unknown Team'}</span>
            <Input
              type="number"
              value={scoreEntry.score}
              onChange={(e) => onUpdateOverallScore(gameId, scoreEntry.teamId, e.target.value)}
              className="w-24 bg-white/10 border-white/20 text-white text-center"
              placeholder="Score"
            />
          </div>
        ))}
         {gameData.places && (gameData.places.first || gameData.places.second || gameData.places.third) && (
          <div className="mt-6 pt-4 border-t border-white/20">
            <h4 className="text-lg font-semibold text-white mb-2">Top Performers</h4>
            <ul className="space-y-1">
              {gameData.places.first && (
                <li className="flex items-center text-yellow-400">
                  <Trophy className="w-4 h-4 mr-2" /> 1st: {gameData.places.first.name} (+{getGamePointValue(gameId, 'first')} pts)
                </li>
              )}
              {gameData.places.second && (
                <li className="flex items-center text-gray-300">
                  <Trophy className="w-4 h-4 mr-2" /> 2nd: {gameData.places.second.name} (+{getGamePointValue(gameId, 'second')} pts)
                </li>
              )}
              {gameData.places.third && (
                <li className="flex items-center text-orange-400">
                  <Trophy className="w-4 h-4 mr-2" /> 3rd: {gameData.places.third.name} (+{getGamePointValue(gameId, 'third')} pts)
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <h2 className="text-3xl font-bold text-white">Game Progress & Results</h2>

      {games.length === 0 ? (
         <Card className="bg-white/5 border-white/10 p-12 text-center">
          <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No games available</p>
          <p className="text-white/40">Add games in the 'Games' tab first.</p>
        </Card>
      ) : Object.keys(brackets).length === 0 && games.length > 0 ? (
        <Card className="bg-white/5 border-white/10 p-12 text-center">
          <Trophy className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No brackets or scores setup yet</p>
          <p className="text-white/40">Go to Games tab and generate brackets or setup scores!</p>
        </Card>
      ) : (
        games.map(game => {
          const gameBracketData = brackets[game.id];
          const gameType = game.type;
          if (!gameBracketData) return null; 

          return (
            <Card key={game.id} className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
              <CardHeader className="cursor-pointer hover:bg-white/5 p-4" onClick={() => toggleExpand(game.id)}>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold text-white">{game?.name || 'Unknown Game'}</CardTitle>
                  {expandedGame === game.id ? <ChevronUp className="text-white"/> : <ChevronDown className="text-white"/>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${gameType === 'tournament' ? 'bg-purple-500/70' : 'bg-sky-500/70'} text-white`}>
                  {gameType === 'tournament' ? 'Tournament Bracket' : 'Overall Score'}
                </span>
              </CardHeader>
              
              {expandedGame === game.id && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <CardContent className="p-6">
                    {gameType === 'tournament' 
                        ? renderTournamentBracket(game.id, gameBracketData)
                        : renderOverallScoreGame(game.id, gameBracketData)}
                    </CardContent>
                </motion.div>
              )}
            </Card>
          );
        })
      )}
    </motion.div>
  );
}

export default BracketsTab;