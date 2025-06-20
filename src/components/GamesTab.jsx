
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit3, Trash2, ListChecks, Gamepad2, Users } from 'lucide-react';

function GamesTab({ games, teams, onAddGame, onEditGame, onDeleteGame, onGenerateBracket }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Manage Games</h2>
        <Button onClick={onAddGame} className="bg-red-500 hover:bg-red-600 text-white">
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Game
        </Button>
      </div>

      {games.length === 0 ? (
        <Card className="bg-white/5 border-white/10 p-12 text-center">
          <Gamepad2 className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No games created yet.</p>
          <p className="text-white/40">Click "Add New Game" to get started!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">{game.name}</CardTitle>
                  <CardDescription className="text-white/70">
                    Type: <span className={`font-semibold ${game.type === 'tournament' ? 'text-purple-300' : 'text-sky-300'}`}>
                      {game.type === 'tournament' ? 'Tournament Bracket' : 'Overall Score'}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-white/80 mb-1">Points for Places:</p>
                  <ul className="text-sm text-white/70 list-disc list-inside">
                    <li>1st: {game.points?.first ?? 'N/A'} pts</li>
                    <li>2nd: {game.points?.second ?? 'N/A'} pts</li>
                    <li>3rd: {game.points?.third ?? 'N/A'} pts</li>
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4 border-t border-white/10">
                  <Button variant="outline" onClick={() => onEditGame(game)} className="w-full sm:w-auto border-blue-400 text-blue-300 hover:bg-blue-400/20 hover:text-blue-200">
                    <Edit3 className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => onGenerateBracket(game.id, game.type)} 
                    className="w-full sm:w-auto border-purple-400 text-purple-300 hover:bg-purple-400/20 hover:text-purple-200 disabled:opacity-50"
                    disabled={teams.length < 2 && game.type === 'tournament'}
                  >
                    <ListChecks className="mr-2 h-4 w-4" /> 
                    {game.type === 'tournament' ? (teams.length < 2 ? 'Need Teams' : 'Setup Bracket') : 'Setup Scores'}
                  </Button>
                  <Button variant="destructive" onClick={() => onDeleteGame(game.id)} className="w-full sm:w-auto bg-red-600/80 hover:bg-red-600 text-white">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
       {games.length > 0 && teams.length < 2 && games.some(g => g.type === 'tournament') && (
         <Card className="bg-yellow-500/10 border-yellow-600/30 p-4 mt-6">
            <div className="flex items-center">
                <Users className="w-6 h-6 text-yellow-400 mr-3" />
                <div>
                    <CardTitle className="text-yellow-300 text-base">Team Requirement</CardTitle>
                    <CardDescription className="text-yellow-400/80 text-sm">
                        You need at least 2 teams to generate a tournament bracket. Please add teams in the 'Teams' tab.
                    </CardDescription>
                </div>
            </div>
        </Card>
      )}
    </motion.div>
  );
}

export default GamesTab;
