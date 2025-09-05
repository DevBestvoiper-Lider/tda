import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy, Shuffle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ColorMatchGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

interface ColorItem {
  id: string;
  color: string;
  bgColor: string;
  name: string;
  emoji: string;
  matched: boolean;
  position: 'left' | 'right';
}

const colorPairs = [
  { color: 'text-red-600', bgColor: 'bg-red-500', name: 'Rojo', emoji: '🔴' },
  { color: 'text-blue-600', bgColor: 'bg-blue-500', name: 'Azul', emoji: '🔵' },
  { color: 'text-green-600', bgColor: 'bg-green-500', name: 'Verde', emoji: '🟢' },
  { color: 'text-yellow-600', bgColor: 'bg-yellow-500', name: 'Amarillo', emoji: '🟡' },
  { color: 'text-purple-600', bgColor: 'bg-purple-500', name: 'Morado', emoji: '🟣' },
  { color: 'text-pink-600', bgColor: 'bg-pink-500', name: 'Rosa', emoji: '🩷' },
  { color: 'text-orange-600', bgColor: 'bg-orange-500', name: 'Naranja', emoji: '🟠' },
  { color: 'text-cyan-600', bgColor: 'bg-cyan-500', name: 'Celeste', emoji: '🔷' }
];

export default function ColorMatchGame({ onPointsEarned, onBack }: ColorMatchGameProps) {
  const [leftColors, setLeftColors] = useState<ColorItem[]>([]);
  const [rightColors, setRightColors] = useState<ColorItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matches, setMatches] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [level, setLevel] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [record, setRecord] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initializeGame = () => {
    const numPairs = Math.min(4 + level - 1, colorPairs.length);
    const selectedPairs = colorPairs.slice(0, numPairs);
    
    const leftItems: ColorItem[] = selectedPairs.map((pair, index) => ({
      id: `left-${index}`,
      ...pair,
      matched: false,
      position: 'left'
    }));

    const rightItems: ColorItem[] = selectedPairs
      .map((pair, index) => ({
        id: `right-${index}`,
        ...pair,
        matched: false,
        position: 'right'
      }))
      .sort(() => Math.random() - 0.5);

    setLeftColors(leftItems);
    setRightColors(rightItems);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatches(0);
    setAttempts(0);
    setGameComplete(false);
    setShowCelebration(false);
  };

  useEffect(() => {
    initializeGame();
  }, [level]);

  // Cargar récord al iniciar nivel
  useEffect(() => {
    const rec = localStorage.getItem(`colormatch_record_level_${level}`);
    setRecord(rec ? parseInt(rec) : null);
    setElapsed(0);
    setStartTime(Date.now());
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed(Date.now() - (startTime || Date.now()));
    }, 100);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [level]);

  // Detener timer al completar
  useEffect(() => {
    if (gameComplete && startTime) {
      if (timerRef.current) clearInterval(timerRef.current);
      const timeMs = Date.now() - startTime;
      setElapsed(timeMs);
      // Guardar récord si es mejor
      const rec = localStorage.getItem(`colormatch_record_level_${level}`);
      if (!rec || timeMs < parseInt(rec)) {
        localStorage.setItem(`colormatch_record_level_${level}`, timeMs.toString());
        setRecord(timeMs);
      }
    }
  }, [gameComplete, startTime, level]);

  const handleColorSelect = (item: ColorItem) => {
    if (item.matched) return;

    if (item.position === 'left') {
      setSelectedLeft(selectedLeft === item.id ? null : item.id);
    } else {
      setSelectedRight(selectedRight === item.id ? null : item.id);
    }
  };

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      setAttempts(prev => prev + 1);
      
      const leftItem = leftColors.find(item => item.id === selectedLeft);
      const rightItem = rightColors.find(item => item.id === selectedRight);

      if (leftItem && rightItem && leftItem.name === rightItem.name) {
        // Match found!
        setLeftColors(prev => prev.map(item => 
          item.id === selectedLeft ? { ...item, matched: true } : item
        ));
        setRightColors(prev => prev.map(item => 
          item.id === selectedRight ? { ...item, matched: true } : item
        ));
        setMatches(prev => prev + 1);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 1000);

        const newMatches = matches + 1;
        if (newMatches === leftColors.length) {
          setGameComplete(true);
          const levelBonus = level * 20;
          const efficiencyBonus = Math.max(50 - attempts, 10);
          const totalPoints = newMatches * 10 + levelBonus + efficiencyBonus;
          onPointsEarned(totalPoints);
        }
      }

      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 1000);
    }
  }, [selectedLeft, selectedRight, leftColors, rightColors, matches, attempts, level, onPointsEarned]);

  const nextLevel = () => {
    setLevel(prev => prev + 1);
  };

  const resetGame = () => {
    setLevel(1);
    initializeGame();
  };

  const shuffleRight = () => {
    if (selectedLeft || selectedRight) return;
    
    setRightColors(prev => 
      [...prev].sort(() => Math.random() - 0.5)
    );
  };

  return (
    <div className="relative min-h-screen p-4 bg-[#fff2fa] overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full animate-gradient-fade bg-gradient-to-br from-pink-200 via-yellow-100 via-red-100 to-purple-200 opacity-60 blur-2xl" style={{backgroundSize:'200% 200%'}}></div>
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
          <h1 className="text-3xl font-bold text-gray-800">🌈 Empareja Colores</h1>
          <div className="flex space-x-2">
            <Button 
              onClick={shuffleRight}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={selectedLeft !== null || selectedRight !== null}
            >
              <Shuffle className="h-4 w-4" />
              <span>Mezclar</span>
            </Button>
            <Button 
              onClick={resetGame}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reiniciar</span>
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <Badge variant="outline" className="px-4 py-2 text-lg">
            📊 Nivel: {level}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            ✅ Parejas: {matches}/{leftColors.length}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            🎯 Intentos: {attempts}
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            ⏱️ Tiempo: {(elapsed/1000).toFixed(1)}s
          </Badge>
          <Badge variant="outline" className="px-4 py-2 text-lg">
            🏅 Récord: {record !== null ? (record/1000).toFixed(1) + 's' : '—'}
          </Badge>
        </div>

        {/* Celebration */}
        {showCelebration && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce z-50">
            🎉✨🌟
          </div>
        )}

        {/* Game Complete */}
        {gameComplete && (
          <Card className="mb-6 border-4 border-green-400 bg-green-50">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-700 flex items-center justify-center space-x-2">
                <Trophy className="h-8 w-8" />
                <span>¡Nivel {level} Completado!</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-green-600 mb-4">
                ¡Encontraste todas las parejas en {attempts} intentos!
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge className="bg-green-500 text-white px-3 py-1">
                  +{matches * 10} puntos base
                </Badge>
                <Badge className="bg-blue-500 text-white px-3 py-1">
                  +{level * 20} puntos de nivel
                </Badge>
                <Badge className="bg-purple-500 text-white px-3 py-1">
                  +{Math.max(50 - attempts, 10)} puntos de eficiencia
                </Badge>
              </div>
              <div className="space-x-4">
                <Button onClick={nextLevel} className="bg-green-500 hover:bg-green-600 text-white">
                  Siguiente Nivel
                </Button>
                <Button onClick={resetGame} variant="outline">
                  Volver al Nivel 1
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Game Board */}
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          {/* Left Column */}
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-center text-xl">Colores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leftColors.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleColorSelect(item)}
                    className={`w-full p-4 rounded-lg border-4 transition-all duration-300 transform hover:scale-105 ${
                      item.matched
                        ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                        : selectedLeft === item.id
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                    disabled={item.matched}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <span className="text-4xl">{item.emoji}</span>
                      <span className={`text-xl font-bold ${item.color}`}>
                        {item.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-center text-xl">Círculos de Colores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rightColors.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleColorSelect(item)}
                    className={`w-full p-4 rounded-lg border-4 transition-all duration-300 transform hover:scale-105 ${
                      item.matched
                        ? 'bg-gray-100 border-gray-300 opacity-50 cursor-not-allowed'
                        : selectedRight === item.id
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    }`}
                    disabled={item.matched}
                  >
                    <div className="flex items-center justify-center">
                      <div className={`w-16 h-16 rounded-full ${item.bgColor} shadow-lg`}></div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-white/80">
          <CardHeader>
            <CardTitle className="text-xl text-center">📝 Instrucciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Selecciona un color de la columna izquierda</li>
              <li>Luego selecciona el círculo del mismo color en la columna derecha</li>
              <li>Si coinciden, se marcarán como emparejados</li>
              <li>Encuentra todas las parejas para completar el nivel</li>
              <li>¡Cada nivel tiene más colores para emparejar!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}