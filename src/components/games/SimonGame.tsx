import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, RotateCcw, Trophy, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SimonGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

const colors = [
  { id: 0, name: 'Rojo', color: 'bg-red-500', activeColor: 'bg-red-300', sound: '🔴', emoji: '❤️' },
  { id: 1, name: 'Verde', color: 'bg-green-500', activeColor: 'bg-green-300', sound: '🟢', emoji: '💚' },
  { id: 2, name: 'Azul', color: 'bg-blue-500', activeColor: 'bg-blue-300', sound: '🔵', emoji: '💙' },
  { id: 3, name: 'Amarillo', color: 'bg-yellow-500', activeColor: 'bg-yellow-300', sound: '🟡', emoji: '💛' }
];

export default function SimonGame({ onPointsEarned, onBack }: SimonGameProps) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [isShowing, setIsShowing] = useState(false);
  const [activeColor, setActiveColor] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'gameover' | 'complete'>('waiting');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showingIndex, setShowingIndex] = useState(-1);

  const maxLevel = 10;

  const addToSequence = useCallback(() => {
    const newColor = Math.floor(Math.random() * 4);
    setSequence(prev => [...prev, newColor]);
  }, []);

  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setGameState('playing');
    setIsShowing(false);
    setTimeout(() => addToSequence(), 500);
  };

  const showSequence = useCallback(async () => {
    setIsShowing(true);
    setPlayerSequence([]);
    
    for (let i = 0; i < sequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setActiveColor(sequence[i]);
      await new Promise(resolve => setTimeout(resolve, 400));
      setActiveColor(null);
    }
    
    setIsShowing(false);
  }, [sequence]);

  useEffect(() => {
    if (sequence.length > 0 && gameState === 'playing') {
      showSequence();
    }
  }, [sequence, showSequence, gameState]);

  const handleColorClick = (colorId: number) => {
    if (isShowing || gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, colorId];
    setPlayerSequence(newPlayerSequence);

    // Check if the current input is correct
    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      setGameState('gameover');
      return;
    }

    // Check if player completed the current sequence
    if (newPlayerSequence.length === sequence.length) {
      const newScore = score + (level * 10);
      setScore(newScore);
      setLevel(level + 1);

      if (level >= 10) {
        setGameState('complete');
        onPointsEarned(newScore + 100); // Bonus for completing 10 levels
      } else {
        setTimeout(() => {
          addToSequence();
        }, 1000);
      }
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(1);
    setScore(0);
    setGameState('waiting');
    setIsShowing(false);
    setActiveColor(null);
  };

  return (
    <div>
      <Button variant="outline" onClick={onBack} className="mb-4 flex items-center gap-2">
        <ArrowLeft className="h-5 w-5" /> Volver
      </Button>
      <div className="relative min-h-screen p-4 bg-[#fff8f2] overflow-hidden">
        {/* Fondo animado sutil */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full animate-gradient-fade bg-gradient-to-br from-orange-200 via-yellow-100 via-red-100 to-purple-200 opacity-70 blur-2xl" style={{backgroundSize:'200% 200%'}}></div>
          <style>{`
            @keyframes gradientFade {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .animate-gradient-fade {
              animation: gradientFade 16s ease-in-out infinite;
            }
          `}</style>
        </div>
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button 
              onClick={onBack}
              variant="outline" 
              className="flex items-center space-x-2 border-0 bg-blue-500 hover:bg-blue-600 text-white shadow"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Volver</span>
            </Button>
            <h1 className="text-3xl font-bold text-blue-700">🎯 Simón Dice</h1>
            <Button 
              onClick={resetGame}
              variant="outline"
              className="flex items-center space-x-2 border-0 bg-blue-400 hover:bg-blue-600 text-white shadow"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reiniciar</span>
            </Button>
          </div>

          {/* Game Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Badge variant="outline" className="px-4 py-2 text-lg">
              📊 Nivel: {level}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              ⭐ Puntuación: {score}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              🎯 Secuencia: {playerSequence.length}/{sequence.length}
            </Badge>
          </div>

          {/* Game Status */}
          {gameState === 'waiting' && (
            <Card className="mb-6 bg-blue-50 border-2 border-blue-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-700">¡Listo para empezar!</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-blue-600 mb-4">
                  Observa la secuencia de colores y repítela en el mismo orden
                </p>
                <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Comenzar Juego
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === 'gameover' && (
            <Card className="mb-6 bg-red-50 border-2 border-red-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-red-700">¡Oops! Inténtalo de nuevo</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-red-600 mb-4">
                  Llegaste al nivel {level} con {score} puntos. ¡No te rindas!
                </p>
                <Button onClick={startGame} className="bg-red-500 hover:bg-red-600 text-white px-6 py-2">
                  Intentar de Nuevo
                </Button>
              </CardContent>
            </Card>
          )}

          {gameState === 'complete' && (
            <Card className="mb-6 bg-green-50 border-2 border-green-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-green-700 flex items-center justify-center space-x-2">
                  <Trophy className="h-8 w-8" />
                  <span>¡Increíble! ¡Eres un maestro!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-lg text-green-600 mb-4">
                  ¡Completaste 10 niveles con {score} puntos!
                </p>
                <Badge className="bg-green-500 text-white px-4 py-2 text-lg mb-4">
                  +{score + 100} puntos totales
                </Badge>
              </CardContent>
            </Card>
          )}

          {/* Game Board */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            {colors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorClick(color.id)}
                className={`aspect-square rounded-lg border-4 text-6xl font-bold transition-all duration-200 transform hover:scale-105 ${
                  activeColor === color.id ? color.activeColor : color.color
                } ${isShowing ? 'cursor-not-allowed' : 'hover:opacity-80'} shadow-lg`}
                disabled={isShowing || gameState === 'gameover' || gameState === 'complete' || gameState === 'waiting'}
              >
                {color.sound}
              </button>
            ))}
          </div>

          {/* Game Status Text */}
          <div className="text-center mb-6">
            {isShowing && (
              <p className="text-xl font-bold text-blue-600 animate-pulse">
                👀 Observa la secuencia...
              </p>
            )}
            {!isShowing && gameState === 'playing' && (
              <p className="text-xl font-bold text-green-600">
                🎮 ¡Tu turno! Repite la secuencia
              </p>
            )}
          </div>

          {/* Instructions */}
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-xl text-center">📝 Instrucciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Observa cuidadosamente la secuencia de colores que se ilumina</li>
                <li>Espera a que termine de mostrarse toda la secuencia</li>
                <li>Repite la misma secuencia haciendo clic en los colores</li>
                <li>Cada nivel añade un color más a la secuencia</li>
                <li>¡Llega al nivel 10 para ser el campeón!</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}