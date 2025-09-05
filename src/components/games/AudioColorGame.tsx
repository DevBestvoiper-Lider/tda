import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy, Volume2, VolumeX, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AudioColorGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

interface SoundColorPair {
  sound: string;
  color: string;
  colorName: string;
  emoji: string;
  bgColor: string;
  frequency: number;
}

const SOUND_COLOR_PAIRS: SoundColorPair[] = [
  { sound: 'high', color: 'text-red-600', colorName: 'Rojo', emoji: '🔴', bgColor: 'bg-red-500', frequency: 800 },
  { sound: 'medium', color: 'text-blue-600', colorName: 'Azul', emoji: '🔵', bgColor: 'bg-blue-500', frequency: 400 },
  { sound: 'low', color: 'text-green-600', colorName: 'Verde', emoji: '🟢', bgColor: 'bg-green-500', frequency: 200 },
  { sound: 'rapid', color: 'text-yellow-600', colorName: 'Amarillo', emoji: '🟡', bgColor: 'bg-yellow-500', frequency: 600 },
  { sound: 'slow', color: 'text-purple-600', colorName: 'Morado', emoji: '🟣', bgColor: 'bg-purple-500', frequency: 300 },
  { sound: 'musical', color: 'text-pink-600', colorName: 'Rosa', emoji: '🩷', bgColor: 'bg-pink-500', frequency: 500 }
];

const ANIMAL_SOUNDS = [
  { name: 'Gato', sound: 'meow', emoji: '🐱', color: 'orange' },
  { name: 'Perro', sound: 'woof', emoji: '🐶', color: 'brown' },
  { name: 'Vaca', sound: 'moo', emoji: '🐄', color: 'black' },
  { name: 'Gallina', sound: 'cluck', emoji: '🐔', color: 'yellow' },
  { name: 'Cerdo', sound: 'oink', emoji: '🐷', color: 'pink' },
  { name: 'Pato', sound: 'quack', emoji: '🦆', color: 'blue' }
];

export default function AudioColorGame({ onPointsEarned, onBack }: AudioColorGameProps) {
  const [gameMode, setGameMode] = useState<'setup' | 'learning' | 'testing' | 'complete'>('setup');
  const [currentPair, setCurrentPair] = useState<SoundColorPair | null>(null);
  const [currentAnimal, setCurrentAnimal] = useState<typeof ANIMAL_SOUNDS[0] | null>(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds] = useState(10);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameType, setGameType] = useState<'frequencies' | 'animals'>('frequencies');
  const [isPlaying, setIsPlaying] = useState(false);
  const [learnedPairs, setLearnedPairs] = useState<SoundColorPair[]>([]);
  const [currentLearnIndex, setCurrentLearnIndex] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
    };
    
    const handleUserInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    
    return () => {
      document.removeEventListener('click', handleUserInteraction);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playFrequency = (frequency: number, duration: number = 1000) => {
    if (!audioContextRef.current) return;
    
    setIsPlaying(true);
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    
    setTimeout(() => setIsPlaying(false), duration);
  };

  const playAnimalSound = (animal: typeof ANIMAL_SOUNDS[0]) => {
    setIsPlaying(true);
    
    // Since we can't actually play real animal sounds, we'll create different tone patterns
    const patterns = {
      meow: () => {
        playFrequency(400, 200);
        setTimeout(() => playFrequency(300, 300), 250);
      },
      woof: () => {
        playFrequency(200, 300);
        setTimeout(() => playFrequency(250, 200), 100);
      },
      moo: () => {
        playFrequency(150, 800);
      },
      cluck: () => {
        playFrequency(600, 100);
        setTimeout(() => playFrequency(500, 100), 150);
        setTimeout(() => playFrequency(600, 100), 300);
      },
      oink: () => {
        playFrequency(300, 200);
        setTimeout(() => playFrequency(400, 200), 250);
      },
      quack: () => {
        playFrequency(350, 300);
        setTimeout(() => playFrequency(300, 200), 350);
      }
    };
    
    patterns[animal.sound as keyof typeof patterns]?.();
    setTimeout(() => setIsPlaying(false), 1000);
  };

  const startLearningMode = () => {
    setGameMode('learning');
    setCurrentLearnIndex(0);
    const pairsToLearn = gameType === 'frequencies' ? SOUND_COLOR_PAIRS.slice(0, 4) : ANIMAL_SOUNDS.slice(0, 4);
    setLearnedPairs(pairsToLearn as SoundColorPair[]);
  };

  const nextLearningItem = () => {
    if (currentLearnIndex < learnedPairs.length - 1) {
      setCurrentLearnIndex(prev => prev + 1);
    } else {
      setGameMode('testing');
      startTestingRound();
    }
  };

  const startTestingRound = () => {
    setShowResult(false);
    setSelectedAnswer(null);
    
    if (gameType === 'frequencies') {
      const randomPair = learnedPairs[Math.floor(Math.random() * learnedPairs.length)];
      setCurrentPair(randomPair);
      // Auto-play the sound
      setTimeout(() => playFrequency(randomPair.frequency), 500);
    } else {
      const randomAnimal = ANIMAL_SOUNDS[Math.floor(Math.random() * ANIMAL_SOUNDS.length)];
      setCurrentAnimal(randomAnimal);
      // Auto-play the sound
      setTimeout(() => playAnimalSound(randomAnimal), 500);
    }
  };

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    
    let correct = false;
    if (gameType === 'frequencies' && currentPair) {
      correct = answer === currentPair.colorName;
    } else if (gameType === 'animals' && currentAnimal) {
      correct = answer === currentAnimal.color;
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      const points = 15;
      setScore(prev => prev + points);
      onPointsEarned(points);
    }
    
    setTimeout(() => {
      if (round >= totalRounds) {
        setGameMode('complete');
      } else {
        setRound(prev => prev + 1);
        startTestingRound();
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameMode('setup');
    setScore(0);
    setRound(1);
    setCurrentPair(null);
    setCurrentAnimal(null);
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentLearnIndex(0);
    setLearnedPairs([]);
  };

  if (gameMode === 'complete') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <CardTitle className="text-2xl">¡Entrenamiento Completado!</CardTitle>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-green-600">{score} puntos</div>
            <div className="text-lg">Completaste {totalRounds} rondas de entrenamiento auditivo</div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Precisión: {Math.round((score / (totalRounds * 15)) * 100)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={resetGame} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Entrenar de Nuevo
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

  if (gameMode === 'setup') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Volume2 className="h-6 w-6 text-blue-500" />
            Entrenamiento Auditivo
          </CardTitle>
          <p className="text-muted-foreground">
            Entrena tu memoria auditiva y discriminación sensorial asociando sonidos con colores
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Selecciona el tipo de entrenamiento:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant={gameType === 'frequencies' ? 'default' : 'outline'}
                onClick={() => setGameType('frequencies')}
                className="h-20 flex flex-col gap-2"
              >
                <div className="text-lg">🎵 Frecuencias y Colores</div>
                <div className="text-xs text-muted-foreground">
                  Asocia tonos musicales con colores
                </div>
              </Button>
              <Button
                variant={gameType === 'animals' ? 'default' : 'outline'}
                onClick={() => setGameType('animals')}
                className="h-20 flex flex-col gap-2"
              >
                <div className="text-lg">🐾 Sonidos de Animales</div>
                <div className="text-xs text-muted-foreground">
                  Asocia sonidos de animales con colores
                </div>
              </Button>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona?</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>1. Primero aprenderás las asociaciones sonido-color</p>
                <p>2. Luego se te presentarán sonidos aleatorios</p>
                <p>3. Deberás elegir el color correcto para cada sonido</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={startLearningMode} size="lg" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Comenzar Entrenamiento
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

  if (gameMode === 'learning') {
    const currentItem = learnedPairs[currentLearnIndex];
    
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Modo Aprendizaje</CardTitle>
          <Progress value={((currentLearnIndex + 1) / learnedPairs.length) * 100} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {currentLearnIndex + 1} de {learnedPairs.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          {gameType === 'frequencies' && currentItem && (
            <>
              <div className="space-y-4">
                <div className="text-2xl font-bold">Aprende esta asociación:</div>
                <div className={`text-6xl ${currentItem.bgColor} w-32 h-32 mx-auto rounded-full flex items-center justify-center`}>
                  {currentItem.emoji}
                </div>
                <div className="text-xl font-semibold">{currentItem.colorName}</div>
              </div>
              
              <Button
                onClick={() => playFrequency(currentItem.frequency)}
                disabled={isPlaying}
                size="lg"
                className="flex items-center gap-2"
              >
                {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                {isPlaying ? 'Reproduciendo...' : 'Escuchar Sonido'}
              </Button>
            </>
          )}

          {gameType === 'animals' && currentItem && (
            <>
              <div className="space-y-4">
                <div className="text-2xl font-bold">Aprende esta asociación:</div>
                <div className="text-6xl">{ANIMAL_SOUNDS[currentLearnIndex].emoji}</div>
                <div className="text-xl font-semibold">{ANIMAL_SOUNDS[currentLearnIndex].name}</div>
                <div className={`w-32 h-8 mx-auto rounded-full bg-${ANIMAL_SOUNDS[currentLearnIndex].color}-500`}></div>
                <div className="text-lg">Color: {ANIMAL_SOUNDS[currentLearnIndex].color}</div>
              </div>
              
              <Button
                onClick={() => playAnimalSound(ANIMAL_SOUNDS[currentLearnIndex])}
                disabled={isPlaying}
                size="lg"
                className="flex items-center gap-2"
              >
                {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                {isPlaying ? 'Reproduciendo...' : 'Escuchar Sonido'}
              </Button>
            </>
          )}

          <Button onClick={nextLearningItem} size="lg">
            {currentLearnIndex < learnedPairs.length - 1 ? 'Siguiente' : 'Comenzar Prueba'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (gameMode === 'testing') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-blue-500" />
              Ronda {round}/{totalRounds}
            </CardTitle>
            <Badge>{score} pts</Badge>
          </div>
          <Progress value={(round - 1) / totalRounds * 100} className="w-full" />
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="space-y-4">
            <div className="text-xl font-semibold">Escucha el sonido y elige el color correcto:</div>
            
            <Button
              onClick={() => {
                if (gameType === 'frequencies' && currentPair) {
                  playFrequency(currentPair.frequency);
                } else if (gameType === 'animals' && currentAnimal) {
                  playAnimalSound(currentAnimal);
                }
              }}
              disabled={isPlaying}
              size="lg"
              className="flex items-center gap-2"
            >
              {isPlaying ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              {isPlaying ? 'Reproduciendo...' : 'Reproducir Sonido'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {gameType === 'frequencies' ? 
              learnedPairs.map((pair) => (
                <Button
                  key={pair.colorName}
                  variant={selectedAnswer === pair.colorName ? 
                    (isCorrect ? 'default' : 'destructive') : 
                    'outline'
                  }
                  onClick={() => handleAnswer(pair.colorName)}
                  disabled={selectedAnswer !== null}
                  className={`h-20 flex flex-col gap-2 ${
                    showResult && currentPair && pair.colorName === currentPair.colorName ? 
                    'bg-green-500 hover:bg-green-600' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${pair.bgColor}`}></div>
                  <span>{pair.colorName}</span>
                </Button>
              )) :
              ['orange', 'brown', 'black', 'yellow', 'pink', 'blue'].map((color) => (
                <Button
                  key={color}
                  variant={selectedAnswer === color ? 
                    (isCorrect ? 'default' : 'destructive') : 
                    'outline'
                  }
                  onClick={() => handleAnswer(color)}
                  disabled={selectedAnswer !== null}
                  className={`h-20 flex flex-col gap-2 ${
                    showResult && currentAnimal && color === currentAnimal.color ? 
                    'bg-green-500 hover:bg-green-600' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full bg-${color}-500`}></div>
                  <span className="capitalize">{color}</span>
                </Button>
              ))
            }
          </div>

          {showResult && (
            <div className={`text-center p-4 rounded-lg ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isCorrect ? '¡Correcto! 🎉' : 'Incorrecto. ¡Sigue practicando!'}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}
