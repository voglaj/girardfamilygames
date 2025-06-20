import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';

function TeamsTab({ teams, onAddTeam, onEditTeam, onDeleteTeam }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Team Management</h2>
        <Button
          onClick={onAddTeam}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group"
          >
            <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditTeam(team)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteTeam(team.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2 text-white/80">
                <p><strong>Players:</strong> {team.player1} & {team.player2}</p>
                {team.extraPlayers && <p><strong>Extra Players:</strong> {team.extraPlayers}</p>}
                {team.walkoutSong && <p><strong>Walkout Song:</strong> {team.walkoutSong}</p>}
                {team.scoutingReport && <p><strong>Scouting Report:</strong> {team.scoutingReport}</p>}
                <p><strong>Total Score:</strong> <span className="text-yellow-400 font-bold">{team.totalScore}</span></p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {teams.length === 0 && (
        <Card className="bg-white/5 border-white/10 p-12 text-center">
          <Users className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No teams registered yet</p>
          <p className="text-white/40">Click "Add Team" to get started!</p>
        </Card>
      )}
    </motion.div>
  );
}

export default TeamsTab;