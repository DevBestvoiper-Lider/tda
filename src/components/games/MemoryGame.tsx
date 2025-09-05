import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MemoryGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

interface GameCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ['🎮', '🎯', '🌟', '🎈', '🎨', '🎪', '🎭', '🎸'];

export default function MemoryGame({ onPointsEarned, onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // ahora guarda IDs
  const [matches, setMatches] = useState(0); // número de pares encontrados
  const [moves, setMoves] = useState(0); // número de intentos (cada 2 cartas volteadas)
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isBusy, setIsBusy] = useState(false); // para bloquear clicks

  const initializeGame = () => {
    const shuffledEmojis = [...emojis, ...emojis]
      .map((emoji, index) => ({
        id: index + Math.random(), // IDs únicos
        emoji,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameComplete(false);
    setTimeLeft(120);
    setIsBusy(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameComplete(true);
    }
  }, [timeLeft, gameComplete]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsBusy(true);
      setMoves(prev => prev + 1); // solo sumar 1 por intento
      const [firstId, secondId] = flippedCards;
      const firstIdx = cards.findIndex(card => card.id === firstId);
      const secondIdx = cards.findIndex(card => card.id === secondId);
      if (cards[firstIdx].emoji === cards[secondIdx].emoji) {
        setCards(prev => prev.map((card) =>
          card.id === firstId || card.id === secondId
            ? { ...card, isMatched: true }
            : card
        ));
        setMatches(prev => prev + 1); // solo sumar 1 por par encontrado
        setTimeout(() => {
          setFlippedCards([]);
          setIsBusy(false);
        }, 600);
        if (matches + 1 === emojis.length) {
          setGameComplete(true);
          const timeBonus = timeLeft * 2;
          const moveBonus = Math.max(50 - moves, 10);
          const totalPoints = 50 + timeBonus + moveBonus;
          onPointsEarned(totalPoints);
        }
      } else {
        setTimeout(() => {
          setCards(prev => prev.map((card) =>
            card.id === firstId || card.id === secondId
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
          setIsBusy(false);
        }, 1000);
      }
    }
  }, [flippedCards, cards, matches, moves, timeLeft, onPointsEarned]);

  const handleCardClick = (index: number) => {
    if (isBusy || flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched || gameComplete) {
      return;
    }
    const cardId = cards[index].id;
    setCards(prev => prev.map((card) =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative min-h-screen p-4 bg-[#f6fff2] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full animate-gradient-fade bg-gradient-to-br from-green-200 via-yellow-100 via-red-100 to-purple-200 opacity-60 blur-2xl" style={{backgroundSize:'200% 200%'}}></div>
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
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver</span>
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">🧠 Juego de Memoria</h1>
          <Button 
            onClick={initializeGame}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar</span>
          </Button>
        </div>

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Badge variant="outline" className="px-4 py-2 text-lg">
            ⏰ Tiempo: {formatTime(timeLeft)}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            🎯 Movimientos: {moves}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            ✅ Parejas: {matches}/{emojis.length}
          </Badge>
        </div>

        {/* Game Complete Modal */}
        {gameComplete && (
          <Card className="mb-6 border-4 border-green-400 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-700 flex items-center justify-center space-x-2">
                <Trophy className="h-8 w-8" />
                <span>
                  {matches === emojis.length ? '¡Felicidades!' : '¡Tiempo Agotado!'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {matches === emojis.length ? (
                <div>
                  <p className="text-lg text-green-700 mb-4">
                    ¡Completaste el juego en {moves} movimientos!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      +50 puntos base
                    </Badge>
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      +{timeLeft * 2} puntos de tiempo
                    </Badge>
                    <Badge className="bg-purple-500 text-white px-3 py-1">
                      +{Math.max(50 - moves, 10)} puntos de eficiencia
                    </Badge>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-yellow-700">
                  No te preocupes, ¡inténtalo de nuevo! La práctica hace al maestro.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
          {cards.map((card, index) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-lg border-4 text-4xl font-bold transition-all duration-300 transform hover:scale-105 ${
                card.isFlipped || card.isMatched
                  ? 'bg-white border-blue-400 shadow-lg'
                  : 'bg-gradient-to-br from-blue-400 to-purple-500 border-blue-600 hover:from-blue-500 hover:to-purple-600'
              } ${card.isMatched ? 'opacity-75' : ''}`}
              disabled={gameComplete || flippedCards.length === 2}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </button>
          ))}
        </div>

        {/* Instructions */}
        <Card className="mt-8 bg-white/80">
          <CardHeader>
            <CardTitle className="text-xl text-center">📝 Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Haz clic en las cartas para voltearlas y ver el emoji</li>
              <li>Encuentra las parejas de emojis iguales</li>
              <li>Completa todas las parejas antes de que se acabe el tiempo</li>
              <li>¡Menos movimientos = más puntos!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}