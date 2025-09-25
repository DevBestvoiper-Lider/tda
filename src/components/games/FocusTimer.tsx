import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, RotateCcw, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FocusTimerProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

export default function FocusTimer({ onPointsEarned, onBack }: FocusTimerProps) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5);

  const durations = [
    { minutes: 5, label: '5 min', emoji: '🌱', description: 'Principiante' },
    { minutes: 10, label: '10 min', emoji: '🌿', description: 'Intermedio' },
    { minutes: 15, label: '15 min', emoji: '🌳', description: 'Avanzado' },
    { minutes: 20, label: '20 min', emoji: '🦅', description: 'Experto' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (!isBreak) {
        // Focus session completed
        const points = selectedDuration * 5; // 5 points per minute
        onPointsEarned(points);
        setCompletedSessions(prev => prev + 1);
        setIsBreak(true);
        setTimeLeft(2 * 60); // 2-minute break
      } else {
        // Break completed
        setIsBreak(false);
        setTimeLeft(selectedDuration * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isBreak, selectedDuration, onPointsEarned]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak ? 2 * 60 : selectedDuration * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(selectedDuration * 60);
  };

  const selectDuration = (minutes: number) => {
    if (!isActive) {
      setSelectedDuration(minutes);
      setTimeLeft(minutes * 60);
      setIsBreak(false);
    }
  };

  const motivationalMessages = [
    "¡Estás haciendo un gran trabajo! 🌟",
    "Tu cerebro se está fortaleciendo 🧠💪",
    "¡Sigue así, campeón! 🏆",
    "La concentración es tu superpoder 🦸‍♂️",
    "¡Cada minuto cuenta! ⏰✨"
  ];

  const getRandomMessage = () => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  };

  return (
    <div>
      <Button variant="outline" onClick={onBack} className="mb-4 flex items-center gap-2">
        <ArrowLeft className="h-5 w-5" /> Volver
      </Button>
      <div className="relative min-h-screen p-4 bg-[#f2fbff] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full animate-gradient-fade bg-gradient-to-br from-cyan-200 via-yellow-100 via-red-100 to-purple-200 opacity-60 blur-2xl" style={{backgroundSize:'200% 200%'}}></div>
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
            <h1 className="text-3xl font-bold text-gray-800">⏰ Cronómetro de Concentración</h1>
            <Button 
              onClick={resetTimer}
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
              🎯 Sesiones completadas: {completedSessions}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-lg">
              ⭐ Puntos ganados: {completedSessions * selectedDuration * 5}
            </Badge>
          </div>

          {/* Duration Selection */}
          {!isActive && (
            <Card className="mb-6 bg-white/80">
              <CardHeader>
                <CardTitle className="text-xl text-center">Elige tu tiempo de concentración</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {durations.map((duration) => (
                    <button
                      key={duration.minutes}
                      onClick={() => selectDuration(duration.minutes)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                        selectedDuration === duration.minutes
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-purple-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{duration.emoji}</div>
                      <div className="font-bold text-lg">{duration.label}</div>
                      <div className="text-sm text-gray-600">{duration.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timer Display */}
          <Card className={`mb-6 border-4 ${isBreak ? 'border-green-400 bg-green-50' : 'border-purple-400 bg-purple-50'}`}>
            <CardHeader className="text-center">
              <CardTitle className={`text-3xl ${isBreak ? 'text-green-700' : 'text-purple-700'}`}>
                {isBreak ? '🌸 Tiempo de Descanso' : '🎯 Tiempo de Concentración'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-8xl font-mono font-bold mb-6 ${isBreak ? 'text-green-600' : 'text-purple-600'}`}>
                {formatTime(timeLeft)}
              </div>
              
              <Progress 
                value={getProgress()} 
                className={`mb-6 h-4 ${isBreak ? 'bg-green-200' : 'bg-purple-200'}`}
              />

              <div className="flex justify-center space-x-4 mb-6">
                {!isActive ? (
                  <Button 
                    onClick={startTimer}
                    className={`px-8 py-3 text-lg ${isBreak ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'} text-white`}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Comenzar
                  </Button>
                ) : (
                  <Button 
                    onClick={pauseTimer}
                    variant="outline"
                    className="px-8 py-3 text-lg"
                  >
                    <Pause className="mr-2 h-5 w-5" />
                    Pausar
                  </Button>
                )}
              </div>

              {isActive && (
                <p className="text-lg font-semibold text-gray-700 animate-pulse">
                  {getRandomMessage()}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Session Complete */}
          {completedSessions > 0 && (
            <Card className="mb-6 bg-yellow-50 border-2 border-yellow-300">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-yellow-700 flex items-center justify-center space-x-2">
                  <Trophy className="h-8 w-8" />
                  <span>¡Felicidades por tus sesiones completadas!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{completedSessions}</div>
                    <div className="text-sm text-gray-600">Sesiones completadas</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedSessions * selectedDuration}</div>
                    <div className="text-sm text-gray-600">Minutos concentrado</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{completedSessions * selectedDuration * 5}</div>
                    <div className="text-sm text-gray-600">Puntos ganados</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-xl text-center">💡 Consejos para concentrarte mejor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-bold text-blue-800 mb-2">🧘‍♂️ Durante la concentración:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Siéntate cómodamente</li>
                    <li>• Respira profundamente</li>
                    <li>• Enfócate en una tarea</li>
                    <li>• Evita distracciones</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">🌈 Durante el descanso:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Estírate un poco</li>
                    <li>• Bebe agua</li>
                    <li>• Mira hacia la ventana</li>
                    <li>• Respira profundo</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}