import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy, Eye, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AnimalShadowGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

interface Animal {
  id: string;
  name: string;
  emoji: string;
  shadow: string;
  category: 'farm' | 'wild' | 'pets' | 'sea';
  difficulty: 'easy' | 'medium' | 'hard';
}

const ANIMALS: Animal[] = [
  // Easy - Farm animals
  { id: '1', name: 'Vaca', emoji: '🐄', shadow: '🐄', category: 'farm', difficulty: 'easy' },
  { id: '2', name: 'Cerdo', emoji: '🐷', shadow: '🐷', category: 'farm', difficulty: 'easy' },
  { id: '3', name: 'Gallina', emoji: '🐔', shadow: '🐔', category: 'farm', difficulty: 'easy' },
  { id: '4', name: 'Caballo', emoji: '🐴', shadow: '🐴', category: 'farm', difficulty: 'easy' },
  { id: '5', name: 'Oveja', emoji: '🐑', shadow: '🐑', category: 'farm', difficulty: 'easy' },
  
  // Medium - Pets
  { id: '6', name: 'Gato', emoji: '🐱', shadow: '🐱', category: 'pets', difficulty: 'medium' },
  { id: '7', name: 'Perro', emoji: '🐶', shadow: '🐶', category: 'pets', difficulty: 'medium' },
  { id: '8', name: 'Conejo', emoji: '🐰', shadow: '🐰', category: 'pets', difficulty: 'medium' },
  { id: '9', name: 'Hámster', emoji: '🐹', shadow: '🐹', category: 'pets', difficulty: 'medium' },
  { id: '10', name: 'Pájaro', emoji: '🐦', shadow: '🐦', category: 'pets', difficulty: 'medium' },
  
  // Hard - Wild animals
  { id: '11', name: 'León', emoji: '🦁', shadow: '🦁', category: 'wild', difficulty: 'hard' },
  { id: '12', name: 'Elefante', emoji: '🐘', shadow: '🐘', category: 'wild', difficulty: 'hard' },
  { id: '13', name: 'Jirafa', emoji: '🦒', shadow: '🦒', category: 'wild', difficulty: 'hard' },
  { id: '14', name: 'Tigre', emoji: '🐅', shadow: '🐅', category: 'wild', difficulty: 'hard' },
  { id: '15', name: 'Mono', emoji: '🐵', shadow: '🐵', category: 'wild', difficulty: 'hard' },
  
  // Sea animals
  { id: '16', name: 'Delfín', emoji: '🐬', shadow: '🐬', category: 'sea', difficulty: 'medium' },
  { id: '17', name: 'Pulpo', emoji: '🐙', shadow: '🐙', category: 'sea', difficulty: 'medium' },
  { id: '18', name: 'Ballena', emoji: '🐋', shadow: '🐋', category: 'sea', difficulty: 'hard' },
  { id: '19', name: 'Tiburón', emoji: '🦈', shadow: '🦈', category: 'sea', difficulty: 'hard' },
  { id: '20', name: 'Pez', emoji: '🐠', shadow: '🐠', category: 'sea', difficulty: 'easy' }
];

export default function AnimalShadowGame({ onPointsEarned, onBack }: AnimalShadowGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
  const [shadowOptions, setShadowOptions] = useState<Animal[]>([]);
  const [selectedShadow, setSelectedShadow] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(12);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const getAnimalsByDifficulty = useCallback((diff: typeof difficulty) => {
    if (diff === 'mixed') return ANIMALS;
    return ANIMALS.filter(animal => animal.difficulty === diff);
  }, []);

  const generateRound = useCallback(() => {
    const availableAnimals = getAnimalsByDifficulty(difficulty);
    const randomAnimal = availableAnimals[Math.floor(Math.random() * availableAnimals.length)];
    
    // Create shadow options (3 wrong + 1 correct)
    const wrongOptions = availableAnimals
      .filter(animal => animal.id !== randomAnimal.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    const allOptions = [...wrongOptions, randomAnimal].sort(() => Math.random() - 0.5);
    
    setCurrentAnimal(randomAnimal);
    setShadowOptions(allOptions);
    setSelectedShadow(null);
    setShowResult(false);
    setTimeLeft(15);
  }, [difficulty]);

  const startGame = () => {
    setGameStarted(true);
    setGameComplete(false);
    setScore(0);
    setRound(1);
    setStreak(0);
    setHintsUsed(0);
    generateRound();
  };

  const handleShadowSelect = useCallback((shadowId: string) => {
    if (selectedShadow || !currentAnimal) return;
    
    setSelectedShadow(shadowId);
    const correct = shadowId === currentAnimal.id;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      let points = 15;
      
      // Difficulty bonus
      if (currentAnimal.difficulty === 'medium') points += 5;
      if (currentAnimal.difficulty === 'hard') points += 10;
      
      // Time bonus
      if (timeLeft > 10) points += 10;
      else if (timeLeft > 5) points += 5;
      
      // Streak bonus
      if (streak >= 3) points += 5;
      if (streak >= 5) points += 10;
      
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      onPointsEarned(points);
    } else {
      setStreak(0);
    }
    
    setTimeout(() => {
      if (round >= totalRounds) {
        setGameComplete(true);
      } else {
        setRound(prev => prev + 1);
        generateRound();
      }
    }, 2000);
  }, [selectedShadow, currentAnimal, timeLeft, streak, round, totalRounds, onPointsEarned]);

  const useHint = () => {
    if (hintsUsed >= 2 || !currentAnimal || selectedShadow) return;
    
    // Remove one wrong option
    const wrongOptions = shadowOptions.filter(option => option.id !== currentAnimal.id);
    const optionToRemove = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
    
    setShadowOptions(prev => prev.filter(option => option.id !== optionToRemove.id));
    setHintsUsed(prev => prev + 1);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameComplete(false);
    setCurrentAnimal(null);
    setShadowOptions([]);
    setSelectedShadow(null);
    setScore(0);
    setRound(1);
    setStreak(0);
    setHintsUsed(0);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleShadowSelect('timeout');
    }
  }, [gameStarted, timeLeft, showResult, gameComplete]);

  if (gameComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <CardTitle className="text-2xl">¡Juego Completado!</CardTitle>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-green-600">{score} puntos</div>
            <div className="text-lg">Completaste {totalRounds} rondas</div>
            <div className="flex gap-2 justify-center">
              <Badge variant="secondary">Racha máxima: {streak}</Badge>
              {hintsUsed > 0 && <Badge variant="outline">Pistas: {hintsUsed}</Badge>}
            </div>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={resetGame} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Jugar de Nuevo
            </Button>
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!gameStarted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            🔍 Encuentra la Sombra
          </CardTitle>
          <p className="text-muted-foreground">
            Observa el animal y encuentra su sombra correspondiente. ¡Entrena tu percepción visual!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Selecciona la dificultad:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={difficulty === 'easy' ? 'default' : 'outline'}
                onClick={() => setDifficulty('easy')}
                size="sm"
              >
                🟢 Fácil
              </Button>
              <Button
                variant={difficulty === 'medium' ? 'default' : 'outline'}
                onClick={() => setDifficulty('medium')}
                size="sm"
              >
                🟡 Medio
              </Button>
              <Button
                variant={difficulty === 'hard' ? 'default' : 'outline'}
                onClick={() => setDifficulty('hard')}
                size="sm"
              >
                🔴 Difícil
              </Button>
              <Button
                variant={difficulty === 'mixed' ? 'default' : 'outline'}
                onClick={() => setDifficulty('mixed')}
                size="sm"
              >
                🌈 Mixto
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg mb-1">🟢 Fácil</div>
              <div className="text-green-700">Animales de granja</div>
              <div className="text-xs text-green-600">15 puntos base</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <div className="text-lg mb-1">🟡 Medio</div>
              <div className="text-yellow-700">Mascotas y marinos</div>
              <div className="text-xs text-yellow-600">20 puntos base</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-lg mb-1">🔴 Difícil</div>
              <div className="text-red-700">Animales salvajes</div>
              <div className="text-xs text-red-600">25 puntos base</div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">💡 Consejos:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Observa la forma y características únicas de cada animal</p>
                <p>• Las respuestas rápidas otorgan puntos extra</p>
                <p>• Mantén una racha para bonificaciones</p>
                <p>• Usa las pistas sabiamente (máximo 2 por juego)</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={startGame} size="lg" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow">
              <Shuffle className="h-4 w-4" />
              Comenzar Juego
            </Button>
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={onBack} className="mb-4 flex items-center gap-2">
        <ArrowLeft className="h-5 w-5" /> Volver
      </Button>
      <div className="relative min-h-screen p-4 bg-[#fffaf2] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full animate-gradient-fade bg-gradient-to-br from-orange-200 via-yellow-100 via-red-100 to-purple-200 opacity-60 blur-2xl" style={{backgroundSize:'200% 200%'}}></div>
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
          <Card className="w-full max-w-3xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  🔍 Ronda {round}/{totalRounds}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className={`text-lg font-bold ${timeLeft <= 5 ? 'text-red-500' : ''}`}>
                    ⏰ {timeLeft}s
                  </div>
                  <Badge variant="outline">Racha: {streak}</Badge>
                  <Badge>{score} pts</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Progress value={(round - 1) / totalRounds * 100} className="flex-1 mr-4" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={useHint}
                  disabled={hintsUsed >= 2 || selectedShadow !== null}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Pista ({2 - hintsUsed})
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentAnimal && (
                <div className="text-center space-y-4">
                  <div className="text-xl font-semibold">¿Cuál es la sombra de este animal?</div>
                  
                  {/* Animal to match */}
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <div className="text-8xl mb-2">{currentAnimal.emoji}</div>
                    <div className="text-2xl font-bold text-blue-800">{currentAnimal.name}</div>
                    <Badge variant="secondary" className="mt-2">
                      {currentAnimal.category === 'farm' && '🚜 Granja'}
                      {currentAnimal.category === 'pets' && '🏠 Mascota'}
                      {currentAnimal.category === 'wild' && '🌍 Salvaje'}
                      {currentAnimal.category === 'sea' && '🌊 Marino'}
                    </Badge>
                  </div>

                  {/* Shadow options */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {shadowOptions.map((animal) => (
                      <Button
                        key={animal.id}
                        variant={selectedShadow === animal.id ? 
                          (isCorrect ? 'default' : 'destructive') : 
                          'outline'
                        }
                        onClick={() => handleShadowSelect(animal.id)}
                        disabled={selectedShadow !== null}
                        className={`h-24 flex flex-col gap-2 transition-all hover:scale-105 ${
                          showResult && animal.id === currentAnimal.id ? 
                          'bg-green-500 hover:bg-green-600 text-white' : ''
                        }`}
                      >
                        <div 
                          className="text-4xl filter grayscale brightness-0"
                          style={{ 
                            filter: 'brightness(0) saturate(100%)',
                            opacity: 0.8 
                          }}
                        >
                          {animal.shadow}
                        </div>
                        <div className="text-xs opacity-75">Sombra {shadowOptions.indexOf(animal) + 1}</div>
                      </Button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`text-center p-4 rounded-lg transition-all ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <div className="space-y-2">
                          <div className="text-lg font-bold">¡Correcto! 🎉</div>
                          <div className="text-sm">
                            {timeLeft > 10 && '⚡ Bono de velocidad +10'}
                            {streak >= 3 && ' 🔥 Bono de racha +5'}
                          </div>
                        </div>
                      ) : (
                        <div className="text-lg font-bold">
                          Incorrecto. La sombra correcta era del {currentAnimal.name}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
