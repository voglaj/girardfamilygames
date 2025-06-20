
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trophy, Minus, CheckCircle } from 'lucide-react';

function BracketMatch({ match, onScoreUpdate, isFinal }) {
  const [score1, setScore1] = useState(match.score1 === null || match.score1 === undefined ? '' : String(match.score1));
  const [score2, setScore2] = useState(match.score2 === null || match.score2 === undefined ? '' : String(match.score2));
  const [isSubmitted, setIsSubmitted] = useState(Boolean(match.winner));

  useEffect(() => {
    setScore1(match.score1 === null || match.score1 === undefined ? '' : String(match.score1));
    setScore2(match.score2 === null || match.score2 === undefined ? '' : String(match.score2));
    setIsSubmitted(Boolean(match.winner));
  }, [match.score1, match.score2, match.winner, match.id]);

  const handleScore1Change = (e) => {
    setScore1(e.target.value);
  };

  const handleScore2Change = (e) => {
    setScore2(e.target.value);
  };

  const handleSubmitScores = () => {
    const s1 = score1 === '' ? null : parseInt(score1);
    const s2 = score2 === '' ? null : parseInt(score2);
    
    if ((s1 !== null && s2 !== null && s1 >= 0 && s2 >=0) || (match.team1?.id === 'BYE' || match.team2?.id === 'BYE')) {
        onScoreUpdate(s1, s2);
        setIsSubmitted(true);
    } else {
        // Optionally, add a toast notification for invalid scores
        console.warn("Scores must be valid numbers (or a BYE is present) to submit.");
    }
  };

  const team1Name = match.team1?.name || 'TBD';
  const team2Name = match.team2?.name || 'TBD';
  const isTeam1Bye = team1Name === 'BYE';
  const isTeam2Bye = team2Name === 'BYE';
  const canSubmit = match.team1 && match.team2 && !isTeam1Bye && !isTeam2Bye;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white/5 border border-white/10 rounded-lg p-4 ${isSubmitted ? 'ring-1 ring-green-500/70' : ''} ${match.winner ? 'ring-2 ring-yellow-400/50' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className={`flex items-center justify-between p-2 rounded-md ${
            match.winner?.id === match.team1?.id && !isTeam1Bye ? 'bg-green-600/30 border border-green-500/60' : 'bg-white/5'
          }`}>
            <span className={`text-white font-medium ${isTeam1Bye ? 'italic text-white/60' : ''}`}>{team1Name}</span>
            {!isTeam1Bye && !isTeam2Bye && (
              <Input
                type="number"
                value={score1}
                onChange={handleScore1Change}
                className="w-16 bg-white/10 border-white/20 text-white text-center disabled:bg-white/5 disabled:text-white/50"
                min="0"
                disabled={isSubmitted || isTeam1Bye || isTeam2Bye || !match.team1 || !match.team2}
                placeholder="-"
              />
            )}
            {isTeam1Bye && <Minus className="w-5 h-5 text-white/60" />}
          </div>
          
          <div className="text-center text-xs text-white/50">VS</div>

          <div className={`flex items-center justify-between p-2 rounded-md ${
             match.winner?.id === match.team2?.id && !isTeam2Bye ? 'bg-green-600/30 border border-green-500/60' : 'bg-white/5'
          }`}>
            <span className={`text-white font-medium ${isTeam2Bye ? 'italic text-white/60' : ''}`}>{team2Name}</span>
             {!isTeam1Bye && !isTeam2Bye && (
              <Input
                type="number"
                value={score2}
                onChange={handleScore2Change}
                className="w-16 bg-white/10 border-white/20 text-white text-center disabled:bg-white/5 disabled:text-white/50"
                min="0"
                disabled={isSubmitted || isTeam1Bye || isTeam2Bye || !match.team1 || !match.team2}
                placeholder="-"
              />
            )}
            {isTeam2Bye && <Minus className="w-5 h-5 text-white/60" />}
          </div>
        </div>
        
        {match.winner && match.winner.id !== 'BYE' && (
          <div className="ml-4 text-center flex flex-col items-center pt-1">
            <Trophy className="w-6 h-6 text-yellow-400 mb-1" />
            <span className="text-xs text-yellow-400 font-medium">Winner</span>
             {isFinal && <span className="text-xs text-green-400">(Final)</span>}
          </div>
        )}
      </div>
      {canSubmit && !isSubmitted && (
        <Button 
          onClick={handleSubmitScores} 
          className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5"
          size="sm"
        >
          <CheckCircle className="w-4 h-4 mr-1.5" />
          Submit Scores
        </Button>
      )}
      {isSubmitted && !match.winner && canSubmit && (
         <p className="text-center text-xs text-yellow-400 mt-2">Scores submitted. Waiting for winner determination (e.g. tie).</p>
      )}
       {isSubmitted && match.winner && canSubmit && (
         <p className="text-center text-xs text-green-400 mt-2">Scores locked. Winner decided.</p>
      )}
    </motion.div>
  );
}

export default BracketMatch;
