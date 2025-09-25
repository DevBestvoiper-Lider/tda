import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, GamepadIcon, Clock, Heart, Star, Target, ArrowRight, BookOpen, Zap, Search, Volume2, Eye, Palette } from 'lucide-react';
import SimonGame from '@/components/games/SimonGame';
import FocusTimer from '@/components/games/FocusTimer';
import BreathingExercise from '@/components/games/BreathingExercise';
import QuickMathGame from '@/components/games/QuickMathGame';
import WordSearchGame from '@/components/games/WordSearchGame';
import AudioColorGame from '@/components/games/AudioColorGame';
import AnimalShadowGame from '@/components/games/AnimalShadowGame';
// import ColorPatternGame from '@/components/games/ColorPatternGame';
import ConcentrationTracker from '@/components/ConcentrationTracker';
import TDAHInfo from '@/components/TDAHInfo';
import ReviewsSection from '@/components/ReviewsSection';

type PageType = 'home' | 'info' | 'games' | 'memory' | 'simon' | 'timer' | 'colors' | 'breathing' | 'quickmath' | 'wordsearch' | 'audiocolor' | 'animalshadow' | 'colorpattern';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [totalPoints, setTotalPoints] = useState(0);

  const games = [
    // {
    //   id: 'memory' as const,
    //   title: 'Juego de Memoria',
    //   description: 'Encuentra las parejas de cartas iguales',
    //   icon: Brain,
    //   color: 'bg-blue-500',
    //   difficulty: 'Fácil'
    // },
    {
      id: 'simon' as const,
      title: 'Simón Dice',
      description: 'Repite la secuencia de colores',
      icon: Target,
      color: 'bg-green-500',
      difficulty: 'Medio'
    },
    {
      id: 'quickmath' as const,
      title: 'Preguntas Rápidas',
      description: 'Resuelve cálculos matemáticos a velocidad',
      icon: Zap,
      color: 'bg-yellow-500',
      difficulty: 'Dinámico'
    },
    {
      id: 'wordsearch' as const,
      title: 'Sopa de Letras',
      description: 'Encuentra palabras ocultas en la grilla',
      icon: Search,
      color: 'bg-indigo-500',
      difficulty: 'Medio'
    },
    {
      id: 'audiocolor' as const,
      title: 'Ejercicio Auditivo',
      description: 'Asocia sonidos con colores',
      icon: Volume2,
      color: 'bg-pink-500',
      difficulty: 'Innovador'
    },
    {
      id: 'animalshadow' as const,
      title: 'Encuentra la Sombra',
      description: 'Encuentra la sombra correcta de cada animal',
      icon: Eye,
      color: 'bg-orange-500',
      difficulty: 'Visual'
    },
    // {
    //   id: 'colorpattern' as const,
    //   title: 'Patrón de Colores',
    //   description: 'Completa secuencias y patrones lógicos',
    //   icon: Palette,
    //   color: 'bg-teal-500',
    //   difficulty: 'Lógico'
    // },
    {
      id: 'timer' as const,
      title: 'Cronómetro de Concentración',
      description: 'Practica técnicas de enfoque',
      icon: Clock,
      color: 'bg-purple-500',
      difficulty: 'Fácil'
    },
    // {
    //   id: 'colors' as const,
    //   title: 'Empareja Colores',
    //   description: 'Conecta los colores iguales',
    //   icon: Star,
    //   color: 'bg-amber-500',
    //   difficulty: 'Fácil'
    // },
    {
      id: 'breathing' as const,
      title: 'Ejercicio de Respiración',
      description: 'Relájate y concéntrate en tu respiración',
      icon: Heart,
      color: 'bg-red-500',
      difficulty: 'Relajante'
    }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'info':
        return <TDAHInfo onBack={() => setCurrentPage('home')} />;
      // case 'memory':
      //   return <MemoryGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      // case 'colorpattern':
      //   return <ColorPatternGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'simon':
        return <SimonGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'quickmath':
        return <QuickMathGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'wordsearch':
        return <WordSearchGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'audiocolor':
        return <AudioColorGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'animalshadow':
        return <AnimalShadowGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      // case 'colorpattern':
      //   return <ColorPatternGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'timer':
        return <FocusTimer onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      // case 'colors':
      //   return <ColorMatchGame onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'breathing':
        return <BreathingExercise onPointsEarned={(points) => setTotalPoints(prev => prev + points)} onBack={() => setCurrentPage('games')} />;
      case 'games':
        return (
          <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
            {/* Header */}
            <header className="bg-white shadow-lg border-b-4 border-rainbow-gradient">
              <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800">MenteFocus</h1>
                      <p className="text-gray-600">Juegos para mejorar la concentración</p>
                    </div>
                  </button>
                  <ConcentrationTracker points={totalPoints} />
                </div>
              </div>
            </header>

            {/* Games Section */}
            <section className="container mx-auto px-4 py-12">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">
                Elige tu juego favorito
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {games.map((game) => {
                  const IconComponent = game.icon;
                  return (
                    <Card key={game.id} className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200 hover:border-blue-300">
                      <CardHeader className="text-center pb-4">
                        <div className={`${game.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-xl font-bold text-gray-800">{game.title}</CardTitle>
                        <CardDescription className="text-gray-600">{game.description}</CardDescription>
                        <Badge variant="outline" className="mx-auto w-fit mt-2">
                          {game.difficulty}
                        </Badge>
                      </CardHeader>
                      <CardContent className="text-center">
                        <Button 
                          onClick={() => setCurrentPage(game.id)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-all duration-300"
                        >
                          <GamepadIcon className="mr-2 h-5 w-5" />
                          ¡Jugar Ahora!
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
            {/* Header with Logo */}
            <header className="bg-white shadow-sm">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-full py-2">
                      <img src="/logo-institucional.png" alt="Logos Profesionales Salesianos y Don Bosco Tech" className="h-14 md:h-16 max-w-xs md:max-w-md object-contain mx-auto" />
                    </div>
                  </div>
                  <ConcentrationTracker points={totalPoints} />
                </div>
              </div>
            </header>

            {/* Main Hero Section */}
            <section className="container mx-auto px-4 py-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="space-y-6">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                      Cada niño tiene su propio ritmo, y en cada pequeño paso que da, late un gran sueño esperando hacerse realidad.
                    </h1>
                    
                    <p className="text-xl text-red-500 font-medium">
                      Un proyecto creado para niños con TDA
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={() => setCurrentPage('info')}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold rounded-sm"
                      >
                        <BookOpen className="mr-2 h-5 w-5" />
                        Leer más
                      </Button>
                      <Button 
                        onClick={() => setCurrentPage('games')}
                        variant="outline"
                        className="border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white px-8 py-3 text-lg font-semibold rounded-sm"
                      >
                        <GamepadIcon className="mr-2 h-5 w-5" />
                        Ver Juegos
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Right Content - Logo and Images */}
                <div className="relative">
                  <div className="flex flex-col items-center space-y-8">
                    {/* Circular images arranged like in the reference */}
                    <div className="relative w-80 h-80">
                      {/* Top circle - children playing */}
                      <div className="absolute top-0 right-8 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-blue-200">
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          👨‍👩‍👧‍👦
                        </div>
                      </div>
                      
                      {/* Left circle - children in circle */}
                      <div className="absolute top-20 left-0 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-green-100 to-green-200">
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🎯
                        </div>
                      </div>
                      
                      {/* Bottom circle - play area */}
                      <div className="absolute bottom-8 left-12 w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-yellow-100 to-yellow-200">
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🎮
                        </div>
                      </div>
                    </div>

                    {/* Main Logo */}
                    <div className="text-center">
                      <div className="relative">
                        <h2 className="text-4xl lg:text-5xl font-bold">
                          <span className="text-blue-600">Pequeños</span>
                        </h2>
                        <h2 className="text-4xl lg:text-5xl font-bold">
                          <span className="text-orange-500">Pasos,</span>
                        </h2>
                        <h2 className="text-4xl lg:text-5xl font-bold">
                          <span className="text-pink-500">Grandes</span>
                        </h2>
                        <h2 className="text-4xl lg:text-5xl font-bold">
                          <span className="text-blue-800">Sueños</span>
                        </h2>
                        
                        {/* Footprint decoration */}
                        <div className="absolute -right-4 top-0 text-3xl">
                          <span className="text-orange-500">🦶</span>
                        </div>
                        <div className="absolute -right-8 top-8 text-2xl rotate-12">
                          <span className="text-blue-500">👣</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="bg-white py-12">
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
                  <div className="p-6">
                    <div className="text-4xl mb-4">🎯</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">10 Juegos</h3>
                    <p className="text-gray-600">Diseñados específicamente para mejorar la concentración</p>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl mb-4">🧠</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Enfoque TDA</h3>
                    <p className="text-gray-600">Actividades basadas en técnicas terapéuticas comprobadas</p>
                  </div>
                  <div className="p-6">
                    <div className="text-4xl mb-4">⭐</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Motivación</h3>
                    <p className="text-gray-600">Sistema de puntos y logros para mantener el interés</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
              <div className="container mx-auto px-4 text-center">
                <p className="text-lg mb-4">
                  Un proyecto hecho con ❤️ para niños especiales
                </p>
                <p className="text-gray-400">
                  Profesionales Salesianos & Don Bosco Tech - Cartagena
                </p>
              </div>
            </footer>
            <ReviewsSection />
          </div>
        );
    }
  };

  return renderCurrentPage();
}