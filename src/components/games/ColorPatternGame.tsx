import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy, Play, Eye, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ColorPatternGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

interface ColorOption {
  id: string;
  name: string;
  bgColor: string;
  emoji: string;
}

const COLORS: ColorOption[] = [
  { id: 'red', name: 'Rojo', bgColor: 'bg-red-500', emoji: '🔴' },
  { id: 'blue', name: 'Azul', bgColor: 'bg-blue-500', emoji: '🔵' },
  { id: 'green', name: 'Verde', bgColor: 'bg-green-500', emoji: '🟢' },
  { id: 'yellow', name: 'Amarillo', bgColor: 'bg-yellow-500', emoji: '🟡' },
  { id: 'purple', name: 'Morado', bgColor: 'bg-purple-500', emoji: '🟣' },
  { id: 'pink', name: 'Rosa', bgColor: 'bg-pink-500', emoji: '🩷' },
  { id: 'orange', name: 'Naranja', bgColor: 'bg-orange-500', emoji: '🟠' },
  { id: 'cyan', name: 'Celeste', bgColor: 'bg-cyan-500', emoji: '🔷' }
];

type PatternType = 'sequence' | 'missing' | 'next' | 'complete';

interface Pattern {
  sequence: string[];
  type: PatternType;
  missing?: number;
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function ColorPatternGame({ onPointsEarned, onBack }: ColorPatternGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPattern, setCurrentPattern] = useState<Pattern | null>(null);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameComplete, setGameComplete] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showPattern, setShowPattern] = useState(true);
  const [displayTime, setDisplayTime] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);

  const generatePattern = useCallback((): Pattern => {
    const numColors = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;
    const patternLength = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const availableColors = COLORS.slice(0, numColors);
    
    const patternTypes: PatternType[] = ['sequence', 'missing', 'next', 'complete'];
    const selectedType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
    
    switch (selectedType) {
      case 'sequence': {
        // Simple repeating pattern: A-B-A-B or A-B-C-A-B-C
        const basePattern = availableColors.slice(0, difficulty === 'easy' ? 2 : 3);
        const sequence: string[] = [];
        
        for (let i = 0; i < patternLength - 1; i++) {
          sequence.push(basePattern[i % basePattern.length].id);
        }
        
        const correctAnswer = basePattern[(patternLength - 1) % basePattern.length].id;
        
        return {
          sequence,
          type: 'sequence',
          correctAnswer,
          difficulty
        };
      }
      
      case 'missing': {
        // Pattern with one missing element
        const basePattern = availableColors.slice(0, difficulty === 'easy' ? 2 : 3);
        const fullSequence: string[] = [];
        
        for (let i = 0; i < patternLength; i++) {
          fullSequence.push(basePattern[i % basePattern.length].id);
        }
        
        const missingIndex = Math.floor(Math.random() * fullSequence.length);
        const correctAnswer = fullSequence[missingIndex];
        fullSequence[missingIndex] = 'missing';
        
        return {
          sequence: fullSequence,
          type: 'missing',
          missing: missingIndex,
          correctAnswer,
          difficulty
        };
      }
      
      case 'next': {
        // Growing pattern: A, A-B, A-B-C
        const sequence: string[] = [];
        const patternColors = availableColors.slice(0, Math.min(round, numColors));
        
        for (let i = 0; i < patternColors.length; i++) {
          sequence.push(patternColors[i].id);
        }
        
        const nextColor = availableColors[patternColors.length % availableColors.length];
        
        return {
          sequence,
          type: 'next',
          correctAnswer: nextColor.id,
          difficulty
        };
      }
      
      case 'complete': {
        // Complete the pattern: A-B-C-A-B-?
        const basePattern = availableColors.slice(0, 3);
        const sequence: string[] = [];
        
        for (let i = 0; i < patternLength - 1; i++) {
          sequence.push(basePattern[i % basePattern.length].id);
        }
        
        const correctAnswer = basePattern[(patternLength - 1) % basePattern.length].id;
        
        return {
          sequence,
          type: 'complete',
          correctAnswer,
          difficulty
        };
      }
      
      default:
        return generatePattern();
    }
  }, [difficulty, round]);

  const startGame = () => {
    setGameStarted(true);
    setGameComplete(false);
    setScore(0);
    setRound(1);
    setStreak(0);
    setHintsUsed(0);
    generateNewRound();
  };

  const generateNewRound = useCallback(() => {
    const pattern = generatePattern();
    setCurrentPattern(pattern);
    setPlayerSequence([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowPattern(true);
    setDisplayTime(3);
    setTimeLeft(20);
  }, [generatePattern]);

  const handleColorSelect = (colorId: string) => {
    if (!currentPattern || selectedAnswer || !showPattern === false) return;
    
    if (currentPattern.type === 'sequence' || currentPattern.type === 'next' || currentPattern.type === 'complete') {
      setSelectedAnswer(colorId);
      checkAnswer(colorId);
    } else if (currentPattern.type === 'missing') {
      setSelectedAnswer(colorId);
      checkAnswer(colorId);
    }
  };

  const checkAnswer = useCallback((answer: string) => {
    if (!currentPattern) return;
    
    const correct = answer === currentPattern.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      let points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      
      // Time bonus
      if (timeLeft > 15) points += 10;
      else if (timeLeft > 10) points += 5;
      
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
        generateNewRound();
      }
    }, 2000);
  }, [currentPattern, difficulty, timeLeft, streak, round, totalRounds, onPointsEarned, generateNewRound]);

  const useHint = () => {
    if (hintsUsed >= 2 || !currentPattern || selectedAnswer) return;
    
    // Show the correct answer briefly
    const correctColor = COLORS.find(color => color.id === currentPattern.correctAnswer);
    if (correctColor) {
      // Highlight the correct answer for 2 seconds
      setHintsUsed(prev => prev + 1);
      
      // Visual hint implementation would go here
      // For now, we'll just reduce the options
      setTimeout(() => {
        // Remove some wrong options (implementation depends on UI)
      }, 100);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameComplete(false);
    setCurrentPattern(null);
    setPlayerSequence([]);
    setSelectedAnswer(null);
    setScore(0);
    setRound(1);
    setStreak(0);
    setHintsUsed(0);
  };

  const getPatternDescription = (pattern: Pattern) => {
    switch (pattern.type) {
      case 'sequence':
        return '¿Cuál es el siguiente color en la secuencia?';
      case 'missing':
        return '¿Qué color falta en el patrón?';
      case 'next':
        return '¿Cuál es el siguiente color en la progresión?';
      case 'complete':
        return '¿Qué color completa el patrón?';
      default:
        return '¿Cuál es el color correcto?';
    }
  };

  useEffect(() => {
    if (gameStarted && displayTime > 0 && showPattern) {
      const timer = setTimeout(() => setDisplayTime(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (displayTime === 0 && showPattern) {
      setShowPattern(false);
    }
  }, [gameStarted, displayTime, showPattern]);

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !showResult && !showPattern && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      checkAnswer('timeout');
    }
  }, [gameStarted, timeLeft, showResult, showPattern, gameComplete]);

  if (gameComplete) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <CardTitle className="text-2xl">¡Excelente trabajo!</CardTitle>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-green-600">{score} puntos</div>
            <div className="text-lg">Completaste {totalRounds} patrones</div>
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
            🎨 Patrón de Colores
          </CardTitle>
          <p className="text-muted-foreground">
            Observa los patrones de colores y completa la secuencia. ¡Entrena tu lógica visual!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Selecciona la dificultad:</label>
            <div className="grid grid-cols-3 gap-2">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="text-lg mb-1">🟢 Fácil</div>
              <div className="text-green-700">3 colores, patrones cortos</div>
              <div className="text-xs text-green-600">10 puntos base</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <div className="text-lg mb-1">🟡 Medio</div>
              <div className="text-yellow-700">4 colores, patrones medios</div>
              <div className="text-xs text-yellow-600">15 puntos base</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="text-lg mb-1">🔴 Difícil</div>
              <div className="text-red-700">5 colores, patrones largos</div>
              <div className="text-xs text-red-600">20 puntos base</div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🧠 Tipos de patrones:</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• <strong>Secuencias:</strong> Patrones que se repiten (A-B-A-B)</p>
                <p>• <strong>Faltantes:</strong> Encuentra el color que falta</p>
                <p>• <strong>Progresiones:</strong> Secuencias que crecen</p>
                <p>• <strong>Completar:</strong> Termina el patrón lógico</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={startGame} size="lg" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
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

  if (showPattern && displayTime > 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Memoriza el patrón</CardTitle>
          <div className="text-3xl font-bold text-blue-600">{displayTime}</div>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {currentPattern && (
            <div className="space-y-4">
              <div className="text-lg font-semibold">{getPatternDescription(currentPattern)}</div>
              <div className="flex justify-center gap-3 flex-wrap">
                {currentPattern.sequence.map((colorId, index) => {
                  if (colorId === 'missing') {
                    return (
                      <div
                        key={index}
                        className="w-16 h-16 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center"
                      >
                        <span className="text-2xl">?</span>
                      </div>
                    );
                  }
                  const color = COLORS.find(c => c.id === colorId);
                  return (
                    <div
                      key={index}
                      className={`w-16 h-16 ${color?.bgColor} rounded-lg flex items-center justify-center text-2xl shadow-md`}
                    >
                      {color?.emoji}
                    </div>
                  );
                })}
                {currentPattern.type !== 'missing' && (
                  <div className="w-16 h-16 border-4 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">?</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative min-h-screen p-4 bg-[#f7f2ff] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full animate-gradient-fade bg-gradient-to-br from-purple-200 via-yellow-100 via-red-100 to-orange-200 opacity-60 blur-2xl" style={{backgroundSize:'200% 200%'}}></div>
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
                🎨 Ronda {round}/{totalRounds}
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
                disabled={hintsUsed >= 2 || selectedAnswer !== null}
                className="flex items-center gap-1"
              >
                <Eye className="h-4 w-4" />
                Pista ({2 - hintsUsed})
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {currentPattern && (
              <div className="text-center space-y-4">
                <div className="text-lg font-semibold">{getPatternDescription(currentPattern)}</div>
                
                {/* Pattern display */}
                <div className="flex justify-center gap-3 flex-wrap">
                  {currentPattern.sequence.map((colorId, index) => {
                    if (colorId === 'missing') {
                      return (
                        <div
                          key={index}
                          className="w-16 h-16 border-4 border-dashed border-gray-400 rounded-lg flex items-center justify-center"
                        >
                          <span className="text-2xl">?</span>
                        </div>
                      );
                    }
                    const color = COLORS.find(c => c.id === colorId);
                    return (
                      <div
                        key={index}
                        className={`w-16 h-16 ${color?.bgColor} rounded-lg flex items-center justify-center text-2xl shadow-md`}
                      >
                        {color?.emoji}
                      </div>
                    );
                  })}
                  {currentPattern.type !== 'missing' && (
                    <div className="w-16 h-16 border-4 border-dashed border-blue-400 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">?</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
