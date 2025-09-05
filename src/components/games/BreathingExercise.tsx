import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BreathingExerciseProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

const exercises = [
  {
    id: 'basic',
    name: 'Respiración Básica',
    description: 'Perfecta para principiantes',
    emoji: '🌱',
    pattern: { inhale: 4, hold: 2, exhale: 4, pause: 2 },
    cycles: 5
  },
  {
    id: 'calm',
    name: 'Respiración Calmante',
    description: 'Para relajarse profundamente',
    emoji: '🌊',
    pattern: { inhale: 4, hold: 4, exhale: 6, pause: 2 },
    cycles: 8
  },
  {
    id: 'focus',
    name: 'Respiración de Concentración',
    description: 'Para mejorar el enfoque',
    emoji: '🎯',
    pattern: { inhale: 6, hold: 2, exhale: 6, pause: 2 },
    cycles: 6
  },
  {
    id: 'energy',
    name: 'Respiración Energizante',
    description: 'Para sentirse más activo',
    emoji: '⚡',
    pattern: { inhale: 3, hold: 1, exhale: 3, pause: 1 },
    cycles: 10
  }
];

export default function BreathingExercise({ onPointsEarned, onBack }: BreathingExerciseProps) {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(selectedExercise.pattern.inhale);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phaseMessages = {
    inhale: { text: 'Inhala suavemente...', emoji: '🌬️⬆️', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    hold: { text: 'Mantén la respiración...', emoji: '⏸️', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    exhale: { text: 'Exhala lentamente...', emoji: '🌬️⬇️', color: 'text-green-600', bgColor: 'bg-green-50' },
    pause: { text: 'Pausa y relájate...', emoji: '😌', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      moveToNextPhase();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const moveToNextPhase = () => {
    let nextPhase: BreathingPhase;
    let nextDuration: number;

    switch (currentPhase) {
      case 'inhale':
        nextPhase = 'hold';
        nextDuration = selectedExercise.pattern.hold;
        break;
      case 'hold':
        nextPhase = 'exhale';
        nextDuration = selectedExercise.pattern.exhale;
        break;
      case 'exhale':
        nextPhase = 'pause';
        nextDuration = selectedExercise.pattern.pause;
        break;
      case 'pause':
        if (currentCycle >= selectedExercise.cycles) {
          // Exercise complete
          setIsActive(false);
          setIsComplete(true);
          const points = selectedExercise.cycles * 5;
          onPointsEarned(points);
          setCompletedCycles(prev => prev + 1);
          return;
        }
        nextPhase = 'inhale';
        nextDuration = selectedExercise.pattern.inhale;
        setCurrentCycle(prev => prev + 1);
        break;
      default:
        nextPhase = 'inhale';
        nextDuration = selectedExercise.pattern.inhale;
    }

    setCurrentPhase(nextPhase);
    setTimeLeft(nextDuration);
  };

  const startExercise = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(selectedExercise.pattern.inhale);
    setCurrentCycle(1);
    setIsComplete(false);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setTimeLeft(selectedExercise.pattern.inhale);
    setCurrentCycle(1);
    setIsComplete(false);
  };

  const selectExercise = (exercise: typeof exercises[0]) => {
    if (!isActive) {
      setSelectedExercise(exercise);
      setCurrentPhase('inhale');
      setTimeLeft(exercise.pattern.inhale);
      setCurrentCycle(1);
      setIsComplete(false);
    }
  };

  const getCircleSize = () => {
    const totalDuration = selectedExercise.pattern[currentPhase];
    const progress = (totalDuration - timeLeft) / totalDuration;
    
    if (currentPhase === 'inhale') {
      return 100 + (progress * 100); // Grows from 100 to 200
    } else if (currentPhase === 'exhale') {
      return 200 - (progress * 100); // Shrinks from 200 to 100
    }
    return currentPhase === 'hold' ? 200 : 100; // Stay large for hold, small for pause
  };

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
          <h1 className="text-3xl font-bold text-gray-800">🫁 Ejercicio de Respiración</h1>
          <Button 
            onClick={resetExercise}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reiniciar</span>
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Badge variant="outline" className="px-4 py-2 text-lg">
            🔄 Ciclo: {currentCycle}/{selectedExercise.cycles}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            ✅ Ejercicios completados: {completedCycles}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            ⭐ Puntos ganados: {completedCycles * selectedExercise.cycles * 5}
          </Badge>
        </div>

        {/* Exercise Selection */}
        {!isActive && !isComplete && (
          <Card className="mb-6 bg-white/80">
            <CardHeader>
              <CardTitle className="text-xl text-center">Elige tu ejercicio de respiración</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {exercises.map((exercise) => (
                  <button
                    key={exercise.id}
                    onClick={() => selectExercise(exercise)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                      selectedExercise.id === exercise.id
                        ? 'border-teal-500 bg-teal-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-teal-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">{exercise.emoji}</div>
                      <div className="font-bold text-lg mb-1">{exercise.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{exercise.description}</div>
                      <div className="text-xs text-gray-500">
                        {exercise.cycles} ciclos • {exercise.pattern.inhale}s-{exercise.pattern.hold}s-{exercise.pattern.exhale}s-{exercise.pattern.pause}s
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Breathing Visualization */}
        <Card className={`mb-6 border-4 ${phaseMessages[currentPhase].bgColor} ${
          currentPhase === 'inhale' ? 'border-blue-400' :
          currentPhase === 'hold' ? 'border-purple-400' :
          currentPhase === 'exhale' ? 'border-green-400' : 'border-yellow-400'
        }`}>
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${phaseMessages[currentPhase].color}`}>
              {phaseMessages[currentPhase].emoji} {phaseMessages[currentPhase].text}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {/* Breathing Circle */}
            <div className="flex justify-center items-center mb-8" style={{ height: '300px' }}>
              <div
                className={`rounded-full border-4 transition-all duration-1000 ease-in-out ${
                  currentPhase === 'inhale' ? 'border-blue-400 bg-blue-100' :
                  currentPhase === 'hold' ? 'border-purple-400 bg-purple-100' :
                  currentPhase === 'exhale' ? 'border-green-400 bg-green-100' : 'border-yellow-400 bg-yellow-100'
                }`}
                style={{
                  width: `${getCircleSize()}px`,
                  height: `${getCircleSize()}px`,
                  opacity: isActive ? 0.8 : 0.5
                }}
              />
            </div>

            {/* Timer */}
            <div className={`text-6xl font-mono font-bold mb-6 ${phaseMessages[currentPhase].color}`}>
              {timeLeft}
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isActive && !isComplete ? (
                <Button 
                  onClick={startExercise}
                  className="bg-purple-500 hover:bg-purple-600 text-white shadow px-8 py-3 text-lg"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Comenzar Ejercicio
                </Button>
              ) : isActive ? (
                <Button 
                  onClick={pauseExercise}
                  variant="outline"
                  className="px-8 py-3 text-lg"
                >
                  <Pause className="mr-2 h-5 w-5" />
                  Pausar
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {/* Exercise Complete */}
        {isComplete && (
          <Card className="mb-6 bg-green-50 border-2 border-green-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-700">🌟 ¡Excelente trabajo!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-green-600 mb-4">
                Completaste {selectedExercise.cycles} ciclos de {selectedExercise.name}
              </p>
              <Badge className="bg-green-500 text-white px-4 py-2 text-lg mb-4">
                +{selectedExercise.cycles * 5} puntos ganados
              </Badge>
              <div className="space-x-4">
                <Button onClick={startExercise} className="bg-green-500 hover:bg-green-600 text-white">
                  Repetir Ejercicio
                </Button>
                <Button onClick={resetExercise} variant="outline">
                  Elegir Otro Ejercicio
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <Card className="bg-white/80">
          <CardHeader>
            <CardTitle className="text-xl text-center">🌈 Beneficios de la Respiración Consciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <h4 className="font-bold text-blue-800">Mejora la Concentración</h4>
                    <p className="text-sm text-blue-600">Ayuda a enfocar la mente y reducir distracciones</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-2xl">😌</span>
                  <div>
                    <h4 className="font-bold text-green-800">Reduce el Estrés</h4>
                    <p className="text-sm text-green-600">Calma la mente y relaja el cuerpo</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-2xl">💤</span>
                  <div>
                    <h4 className="font-bold text-purple-800">Mejora el Sueño</h4>
                    <p className="text-sm text-purple-600">Prepara el cuerpo para un descanso reparador</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <h4 className="font-bold text-yellow-800">Aumenta la Energía</h4>
                    <p className="text-sm text-yellow-600">Proporciona más oxígeno al cerebro</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}