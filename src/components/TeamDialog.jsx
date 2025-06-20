import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';

function TeamDialog({ open, onOpenChange, onSave, team, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    player1: '',
    player2: '',
    extraPlayers: '',
    walkoutSong: '',
    scoutingReport: ''
  });

  useEffect(() => {
    if (open) {
      if (team) {
        setFormData(team);
      } else {
        setFormData({
          name: '',
          player1: '',
          player2: '',
          extraPlayers: '',
          walkoutSong: '',
          scoutingReport: ''
        });
      }
    }
  }, [team, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.player1 || !formData.player2) {
      toast({
        title: "Missing Information",
        description: "Please fill in team name and both players"
      });
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white mb-4">
              {team ? 'Edit Team' : 'Add New Team'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white">Team Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter team name"
              />
            </div>
            
            <div>
              <Label className="text-white">Player 1 *</Label>
              <Input
                value={formData.player1}
                onChange={(e) => setFormData({...formData, player1: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter player 1 name"
              />
            </div>
            
            <div>
              <Label className="text-white">Player 2 *</Label>
              <Input
                value={formData.player2}
                onChange={(e) => setFormData({...formData, player2: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Enter player 2 name"
              />
            </div>
            
            <div>
              <Label className="text-white">Extra Players</Label>
              <Input
                value={formData.extraPlayers}
                onChange={(e) => setFormData({...formData, extraPlayers: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Additional team members"
              />
            </div>
            
            <div>
              <Label className="text-white">Walkout Song</Label>
              <Input
                value={formData.walkoutSong}
                onChange={(e) => setFormData({...formData, walkoutSong: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Team entrance song"
              />
            </div>
            
            <div>
              <Label className="text-white">Scouting Report</Label>
              <Input
                value={formData.scoutingReport}
                onChange={(e) => setFormData({...formData, scoutingReport: e.target.value})}
                className="bg-white/10 border-white/20 text-white"
                placeholder="Team strengths and strategy"
              />
            </div>
            
            <DialogFooter className="pt-4">
              <div className="flex space-x-3 w-full">
                <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500">
                  {team ? 'Update Team' : 'Add Team'}
                </Button>
                <DialogClose asChild>
                  <Button type="button" variant="ghost" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default TeamDialog;