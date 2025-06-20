import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Trophy, Users, Gamepad as GamepadIcon, BarChart3, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import TeamDialog from '@/components/TeamDialog';
import GameDialog from '@/components/GameDialog';
import SeedingDialog from '@/components/SeedingDialog';
import DashboardTab from '@/components/DashboardTab';
import TeamsTab from '@/components/TeamsTab';
import GamesTab from '@/components/GamesTab';
import BracketsTab from '@/components/BracketsTab';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { 
  addTeamLogic, 
  updateTeamLogic, 
  deleteTeamLogic, 
  addGameLogic, 
  updateGameLogic, 
  deleteGameLogic, 
  generateTournamentBracketLogic, 
  generateOverallScoreGameLogic, 
  updateTournamentMatchLogic, 
  updateOverallScoreLogic, 
  updateTeamScoresLogic 
} from '@/lib/logic';
import { toast } from '@/components/ui/use-toast';

export const DEFAULT_POINT_VALUES = {
  first: 10,
  second: 5,
  third: 2
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [teams, setTeams] = useLocalStorage('girardGames_teams', []);
  const [games, setGames] = useLocalStorage('girardGames_games', []);
  const [brackets, setBrackets] = useLocalStorage('girardGames_brackets', {});
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [showGameDialog, setShowGameDialog] = useState(false);
  const [showSeedingDialog, setShowSeedingDialog] = useState(false);
  const [gameForSeeding, setGameForSeeding] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editingGame, setEditingGame] = useState(null);
  const [seedingDialogKey, setSeedingDialogKey] = useState(0); 

  const getGamePointValue = (gameId, place) => {
    const game = games.find(g => g.id === gameId);
    if (game && game.points && typeof game.points[place] !== 'undefined') {
      return Number(game.points[place]);
    }
    return Number(DEFAULT_POINT_VALUES[place]) || 0;
  };
  
  const triggerScoreUpdate = () => {
    updateTeamScoresLogic(teams, games, brackets, getGamePointValue, setTeams);
  };

  const handleAddTeam = teamData => {
    addTeamLogic(teamData, teams, setTeams, toast);
  };

  const handleUpdateTeam = (teamId, teamData) => {
    updateTeamLogic(teamId, teamData, teams, setTeams, toast);
  };

  const handleDeleteTeam = teamId => {
    deleteTeamLogic(teamId, teams, setTeams, toast);
    triggerScoreUpdate();
  };

  const handleAddGame = gameData => {
    addGameLogic(gameData, games, setGames, toast);
    triggerScoreUpdate();
  };

  const handleUpdateGame = (gameId, gameData) => {
    updateGameLogic(gameId, gameData, games, setGames, toast);
    triggerScoreUpdate();
  };

  const handleDeleteGame = gameId => {
    deleteGameLogic(gameId, games, setGames, brackets, setBrackets, toast);
    triggerScoreUpdate();
  };

  const handleOpenSeedingDialog = (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (game && game.type === 'tournament') {
      setGameForSeeding(game);
      setShowSeedingDialog(true);
      setSeedingDialogKey(prev => prev + 1); 
    } else if (game) {
      generateOverallScoreGameLogic(gameId, teams, brackets, setBrackets, triggerScoreUpdate, toast);
    }
  };
  
  const handleGenerateBracket = (gameId, gameType, seededTeams = null) => {
    if (gameType === 'tournament') {
      generateTournamentBracketLogic(gameId, seededTeams || teams, brackets, setBrackets, triggerScoreUpdate, toast, !!seededTeams);
    } else {
      generateOverallScoreGameLogic(gameId, teams, brackets, setBrackets, triggerScoreUpdate, toast);
    }
    setShowSeedingDialog(false);
    setGameForSeeding(null);
  };

  const handleUpdateTournamentMatch = (gameId, round, matchId, score1, score2) => {
    updateTournamentMatchLogic(gameId, round, matchId, score1, score2, brackets, setBrackets, teams, triggerScoreUpdate, toast);
  };

  const handleUpdateOverallScore = (gameId, teamId, score) => {
    updateOverallScoreLogic(gameId, teamId, score, brackets, setBrackets, teams, triggerScoreUpdate, toast);
  };

  const getLeaderboard = () => {
    return [...teams].sort((a, b) => b.totalScore - a.totalScore).map((team, index) => ({
      ...team,
      rank: index + 1
    }));
  };

  useEffect(() => {
    triggerScoreUpdate();
  }, [games, brackets, teams.length]); // Added teams.length to re-calculate if teams are added/deleted


  return (
    <div className="min-h-screen bg-gray-500">
      <Helmet>
        <title>Girard Family Games 2025 - 4th of July Edition!</title>
        <meta name="description" content="Celebrate freedom and family competition with a patriotic theme!" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-500 via-blue-500 to-red-500 bg-clip-text text-transparent mb-2">🇺🇸 Girard Family Games 2025 🇺🇸</h1>
          <p className="text-xl text-gray-800 font-semibold">Last Year's Champs: Cole and Nate... Who will be our new champion?</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <div className="bg-white/90 backdrop-blur-md rounded-full p-1.5 sm:p-2 shadow-xl border border-gray-300">
              <div className="flex space-x-1 sm:space-x-2 flex-wrap justify-center">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'teams', label: 'Teams', icon: Users },
                  { id: 'games', label: 'Games', icon: GamepadIcon },
                  { id: 'brackets', label: 'Brackets', icon: Trophy },
                ].map(tab => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full text-sm sm:text-base px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-200 ease-in-out
                      ${activeTab === tab.id ? 'bg-brand-blue text-brand-white shadow-md scale-105' : 'text-brand-blue hover:bg-red-100 hover:text-brand-red'}`}
                  >
                    <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-brand-white' : 'text-brand-blue'}`} />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {activeTab === 'dashboard' && <DashboardTab teams={teams} games={games} brackets={brackets} getLeaderboard={getLeaderboard} />}
          {activeTab === 'teams' && (
            <TeamsTab
              teams={teams}
              onAddTeam={() => { setEditingTeam(null); setShowTeamDialog(true); }}
              onEditTeam={(team) => { setEditingTeam(team); setShowTeamDialog(true); }}
              onDeleteTeam={handleDeleteTeam}
            />
          )}
          {activeTab === 'games' && (
            <GamesTab
              games={games}
              teams={teams}
              onAddGame={() => { setEditingGame(null); setShowGameDialog(true); }}
              onEditGame={(game) => { setEditingGame(game); setShowGameDialog(true); }}
              onDeleteGame={handleDeleteGame}
              onGenerateBracket={handleOpenSeedingDialog}
            />
          )}
          {activeTab === 'brackets' && (
            <BracketsTab
              brackets={brackets}
              games={games}
              teams={teams}
              onUpdateTournamentMatch={handleUpdateTournamentMatch}
              onUpdateOverallScore={handleUpdateOverallScore}
              getGamePointValue={getGamePointValue}
            />
          )}
        </Tabs>

        <TeamDialog
          open={showTeamDialog}
          onOpenChange={setShowTeamDialog}
          onSave={editingTeam ? (data) => handleUpdateTeam(editingTeam.id, data) : handleAddTeam}
          team={editingTeam}
          onClose={() => { setShowTeamDialog(false); setEditingTeam(null); }}
        />

        <GameDialog
          open={showGameDialog}
          onOpenChange={setShowGameDialog}
          onSave={editingGame ? (data) => handleUpdateGame(editingGame.id, data) : handleAddGame}
          game={editingGame}
          defaultPointValues={DEFAULT_POINT_VALUES}
          onClose={() => { setShowGameDialog(false); setEditingGame(null); }}
        />
        
        {gameForSeeding && showSeedingDialog && (
          <SeedingDialog
            key={`seeding-dialog-${seedingDialogKey}`}
            open={showSeedingDialog}
            onOpenChange={setShowSeedingDialog}
            game={gameForSeeding}
            teams={teams}
            onConfirmSeeding={handleGenerateBracket}
            onClose={() => { setShowSeedingDialog(false); setGameForSeeding(null); }}
          />
        )}
      </div>
      
      <Toaster />
    </div>
  );
}

export default App;
