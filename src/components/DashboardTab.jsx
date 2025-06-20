
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Users, Gamepad as GamepadIcon, Trophy, Medal } from 'lucide-react';

function DashboardTab({ teams, games, brackets, getLeaderboard }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-600/80 to-blue-700/80 border-blue-500/50 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Teams</p>
              <p className="text-3xl font-bold text-white">{teams.length}</p>
            </div>
            <Users className="w-10 h-10 text-blue-300" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-600/80 to-red-700/80 border-red-500/50 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Total Games</p>
              <p className="text-3xl font-bold text-white">{games.length}</p>
            </div>
            <GamepadIcon className="w-10 h-10 text-red-300" />
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-600/80 to-gray-700/80 border-gray-500/50 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Active Brackets</p>
              <p className="text-3xl font-bold text-white">{Object.keys(brackets).length}</p>
            </div>
            <Trophy className="w-10 h-10 text-gray-300" />
          </div>
        </Card>
      </div>

      <Card className="bg-white/20 backdrop-blur-lg border-white/30 p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Medal className="w-7 h-7 mr-3 text-yellow-400" />
          Current Leaderboard
        </h2>
        {teams.length === 0 ? (
          <p className="text-white/70 text-center py-8">No teams registered yet. Add some teams to get started!</p>
        ) : (
          <div className="space-y-3">
            {getLeaderboard().map((team, index) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                  index === 0 ? 'bg-gradient-to-r from-yellow-500/40 to-orange-500/40 border-2 border-yellow-400/60' :
                  index === 1 ? 'bg-gradient-to-r from-gray-400/40 to-gray-500/40 border-2 border-gray-400/60' :
                  index === 2 ? 'bg-gradient-to-r from-amber-600/40 to-amber-700/40 border-2 border-amber-500/60' :
                  'bg-white/10 border border-white/20'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500 text-black' :
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-white/25 text-white'
                  }`}>
                    {team.rank}
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">{team.name}</p>
                    <p className="text-sm text-white/70">{team.player1} & {team.player2}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{team.totalScore}</p>
                  <p className="text-sm text-white/70">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default DashboardTab;
