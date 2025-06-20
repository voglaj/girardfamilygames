import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { DEFAULT_POINT_VALUES } from '@/App';

function GameDialog({ open, onOpenChange, onSave, game, onClose, defaultPointValues }) {
  const initialPoints = game?.points || defaultPointValues || DEFAULT_POINT_VALUES;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rules: '',
    type: 'tournament',
    points: { ...initialPoints }
  });

  useEffect(() => {
    if (open) {
      const currentPoints = game?.points || defaultPointValues || DEFAULT_POINT_VALUES;
      if (game) {
        setFormData({
            name: game.name || '',
            description: game.description || '',
            rules: game.rules || '',
            type: game.type || 'tournament',
            points: {
              first: currentPoints.first,
              second: currentPoints.second,
              third: currentPoints.third
            }
        });
      } else {
        setFormData({
          name: '',
          description: '',
          rules: '',
          type: 'tournament',
          points: { ...currentPoints }
        });
      }
    }
  }, [game, open, defaultPointValues]);

  const handlePointChange = (place, value) => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue) || numericValue < 0) {
       setFormData(prev => ({
        ...prev,
        points: {
          ...prev.points,
          [place]: 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        points: {
          ...prev.points,
          [place]: numericValue
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast({
        title: "Missing Information",
        description: "Please enter a game name",
        variant: "destructive"
      });
      return;
    }
    // Ensure points are numbers
    const pointsToSave = {
      first: Number(formData.points.first) || 0,
      second: Number(formData.points.second) || 0,
      third: Number(formData.points.third) || 0,
    };

    onSave({...formData, points: pointsToSave});
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/50 backdrop-blur-md border border-white/20 text-white p-0 max-w-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6"
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white mb-6 text-center">
              {game ? 'Edit Game Details' : 'Add New Game'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white/90 font-medium">Game Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Enter game name (e.g., Cornhole Classic)"
              />
            </div>
            
            <div>
              <Label className="text-white/90 font-medium">Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Brief game description (optional)"
              />
            </div>
            
            <div>
              <Label className="text-white/90 font-medium">Rules</Label>
              <Input
                value={formData.rules}
                onChange={(e) => setFormData({...formData, rules: e.target.value})}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Key rules or scoring (optional)"
              />
            </div>

            <div>
              <Label className="text-white/90 font-medium">Game Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({...formData, type: value})}
              >
                <SelectTrigger className="w-full bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select game type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="tournament" className="hover:bg-gray-700">Tournament Bracket</SelectItem>
                  <SelectItem value="overall_score" className="hover:bg-gray-700">Overall Score (All Play)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Label className="text-white/90 font-medium mb-2 block">Point Values for this Game</Label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="points-first" className="text-sm text-white/80">1st Place</Label>
                  <Input
                    id="points-first"
                    type="number"
                    value={formData.points.first}
                    onChange={(e) => handlePointChange('first', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="points-second" className="text-sm text-white/80">2nd Place</Label>
                  <Input
                    id="points-second"
                    type="number"
                    value={formData.points.second}
                    onChange={(e) => handlePointChange('second', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="points-third" className="text-sm text-white/80">3rd Place</Label>
                  <Input
                    id="points-third"
                    type="number"
                    value={formData.points.third}
                    onChange={(e) => handlePointChange('third', e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-6">
              <div className="flex space-x-3 w-full">
                <DialogClose asChild>
                  <Button type="button" variant="ghost" onClick={handleCancel} className="flex-1 text-white/80 hover:bg-white/20 hover:text-white">
                    Cancel
                  </Button>
                </DialogClose>
                 <Button type="submit" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  {game ? 'Update Game' : 'Add Game'}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

export default GameDialog;