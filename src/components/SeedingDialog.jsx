import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ListOrdered, Shuffle, CheckSquare, GripVertical } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function SeedingDialog({ open, onOpenChange, game, teams, onConfirmSeeding, onClose }) {
  const [seededTeams, setSeededTeams] = useState([]);
  const [seedMethod, setSeedMethod] = useState('manual');
  const [isDragging, setIsDragging] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(typeof window !== 'undefined');
  }, []);

  const initializeTeams = useCallback(() => {
    const currentTeams = Array.isArray(teams) ? teams : [];
    const initialSeededTeams = currentTeams.map((team, index) => ({
      ...team,
      id: team.id.toString(),
      seed: index + 1,
      originalIndex: index,
    }));
    setSeededTeams(initialSeededTeams);
    setSeedMethod('manual');
  }, [teams]);

  useEffect(() => {
    if (open && isBrowser) {
      initializeTeams();
    } else if (!open) {
      setSeededTeams([]); 
    }
  }, [open, initializeTeams, isBrowser]);

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    }

    const newSeededTeams = reorder(
      seededTeams,
      result.source.index,
      result.destination.index
    ).map((team, index) => ({
      ...team,
      seed: index + 1,
    }));

    setSeededTeams(newSeededTeams);
    setSeedMethod('manual');
  };

  const handleShuffleSeeds = () => {
    setSeedMethod('random');
    const currentTeams = Array.isArray(teams) ? teams : [];
    const shuffled = [...currentTeams]
      .map(t => ({ ...t, id: t.id.toString() }))
      .sort(() => Math.random() - 0.5);

    setSeededTeams(shuffled.map((team, index) => ({
      ...team,
      seed: index + 1,
      originalIndex: currentTeams.findIndex(t => t.id.toString() === team.id.toString()),
    })));
    toast({ title: "Seeds Randomized!", description: "Team order has been shuffled." });
  };

  const handleManualSortReset = () => {
    initializeTeams();
  };

  const handleSubmit = () => {
    if (!game || !game.id || !game.type) {
      toast({ title: "Error", description: "Game data is incomplete.", variant: "destructive"});
      return;
    }
    // Sort teams by seed before submitting
    const finalOrderedTeams = [...seededTeams]
      .sort((a, b) => a.seed - b.seed)
      .map((team, index) => ({
        ...team,
        seed: index + 1,
      }));
    onConfirmSeeding(game.id, game.type, finalOrderedTeams);
    onClose();
  };

  if (!game || !isBrowser) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
      else onOpenChange(isOpen);
    }}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center">
            <ListOrdered className="mr-2 h-6 w-6 text-blue-400" /> Set Tournament Seeding
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure seeding for "{game.name}". Drag teams to order.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <div className="flex justify-end space-x-2 mb-3">
            <Button onClick={handleManualSortReset} variant={seedMethod === 'manual' && !isDragging ? "secondary" : "outline"} size="sm" className="text-xs">
              Reset Order
            </Button>
            <Button onClick={handleShuffleSeeds} variant={seedMethod === 'random' ? "secondary" : "outline"} size="sm" className="text-xs">
              <Shuffle className="mr-1.5 h-4 w-4" /> Randomize
            </Button>
          </div>

          {seededTeams && seededTeams.length > 0 ? (
            <div className="space-y-2 bg-gray-700/30 p-2 rounded-md">
              {seededTeams.map((team, index) => (
                <div
                  key={team.id}
                  className="flex items-center space-x-3 p-3 rounded-md bg-gray-700/70 hover:bg-gray-600/90"
                >
                  <span className="w-8 text-center font-semibold text-sm bg-gray-600/50 py-1 px-2 rounded">
                    <input
                      type="number"
                      min={1}
                      max={seededTeams.length}
                      value={team.seed}
                      onChange={e => {
                        const newSeed = parseInt(e.target.value, 10);
                        setSeededTeams(prev =>
                          prev.map(t =>
                            t.id === team.id ? { ...t, seed: newSeed } : t
                          )
                        );
                      }}
                      className="w-10 text-center bg-transparent border border-gray-500 rounded text-white"
                    />
                  </span>
                  <span className="flex-1 text-sm font-medium">{team.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 text-gray-400">
              {teams && teams.length === 0 ? "No teams added. Add teams in 'Teams' tab." : "Loading teams..."}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            disabled={!seededTeams || seededTeams.length === 0}
          >
            <CheckSquare className="mr-2 h-5 w-5" /> Confirm & Generate
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto text-gray-300 border-gray-600 hover:bg-gray-700 hover:text-white" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SeedingDialog;
