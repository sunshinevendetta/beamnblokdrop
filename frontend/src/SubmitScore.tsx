import React, { useState, useEffect } from 'react';
import { useWriteContract } from 'wagmi';

const SubmitScore: React.FC = () => {
  const [score, setScore] = useState<number | null>(null);
  const { writeContract, isPending } = useWriteContract();

  useEffect(() => {
    window.submitScore = (newScore: number) => {
      setScore(newScore);
    };
  }, []);

  const handleSubmit = async () => {
    if (!score) return;
    try {
      await writeContract({
        address: '0xeB3Ee9620A860E779F0CDcC4F3752A6e4b994e40',
        abi: [
          {
            name: 'submitScore',
            type: 'function',
            inputs: [{ name: 'score', type: 'uint256' }],
            outputs: [],
            stateMutability: 'nonpayable',
          },
        ],
        functionName: 'submitScore',
        args: [score],
      });
      alert('Score submitted successfully!');
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  if (score === null) return null;

  return (
    <div>
      <p>Your Score: {score}</p>
      <button onClick={handleSubmit} disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit Score'}
      </button>
    </div>
  );
};

export default SubmitScore;