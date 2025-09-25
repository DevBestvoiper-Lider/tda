import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy, Clock, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface QuickMathGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

interface Question {
  question: string;
  correctAnswer: number;
  options: number[];
  difficulty: 'easy' | 'medium' | 'hard';
}

const generateQuestion = (difficulty: 'easy' | 'medium' | 'hard'): Question => {
  let question: string;
  let correctAnswer: number;
  const options: number[] = [];

  switch (difficulty) {
    case 'easy': {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const operation = Math.random() > 0.5 ? '+' : '-';
      
      if (operation === '+') {
        question = `${a} + ${b} = ?`;
        correctAnswer = a + b;
      } else {
        const larger = Math.max(a, b);
        const smaller = Math.min(a, b);
        question = `${larger} - ${smaller} = ?`;
        correctAnswer = larger - smaller;
      }
      break;
    }

    case 'medium': {
      const c = Math.floor(Math.random() * 12) + 1;
      const d = Math.floor(Math.random() * 12) + 1;
      const op = Math.random() > 0.5 ? '*' : '/';
      
      if (op === '*') {
        question = `${c} × ${d} = ?`;
        correctAnswer = c * d;
      } else {
        const dividend = c * d;
        question = `${dividend} ÷ ${c} = ?`;
        correctAnswer = d;
      }
      break;
    }

    case 'hard': {
      const e = Math.floor(Math.random() * 15) + 5;
      const f = Math.floor(Math.random() * 15) + 5;
      const g = Math.floor(Math.random() * 10) + 1;
      question = `${e} + ${f} - ${g} = ?`;
      correctAnswer = e + f - g;
      break;
    }
  }

  // Generate wrong options
  options.push(correctAnswer);
  while (options.length < 4) {
    const wrongAnswer = correctAnswer + Math.floor(Math.random() * 20) - 10;
    if (wrongAnswer !== correctAnswer && wrongAnswer > 0 && !options.includes(wrongAnswer)) {
      options.push(wrongAnswer);
    }
  }

  return {
    question,
    correctAnswer,
    options: options.sort(() => Math.random() - 0.5),
    difficulty
  };
};

export default function QuickMathGame({ onPointsEarned, onBack }: QuickMathGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameActive, setGameActive] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [gameComplete, setGameComplete] = useState(false);

  const totalQuestions = 15;

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setQuestionNumber(1);
    setStreak(0);
    setGameComplete(false);
    generateNewQuestion();
  };

  const generateNewQuestion = useCallback(() => {
    // Increase difficulty based on streak
    let currentDifficulty = difficulty;
    if (streak >= 5) currentDifficulty = 'medium';
    if (streak >= 10) currentDifficulty = 'hard';

    const question = generateQuestion(currentDifficulty);
    setCurrentQuestion(question);
    setTimeLeft(10);
    setSelectedAnswer(null);
    setShowResult(false);
  }, [difficulty, streak]);

  const handleAnswer = useCallback((answer: number) => {
    if (!currentQuestion || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = currentQuestion.difficulty === 'easy' ? 10 : 
                    currentQuestion.difficulty === 'medium' ? 20 : 30;
      const bonusPoints = timeLeft > 7 ? 5 : timeLeft > 4 ? 3 : 0;
      const streakBonus = streak >= 5 ? 10 : 0;
      
      const totalPoints = points + bonusPoints + streakBonus;
      setScore(prev => prev + totalPoints);
      setStreak(prev => prev + 1);
      onPointsEarned(totalPoints);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        setGameComplete(true);
        setGameActive(false);
      } else {
        setQuestionNumber(prev => prev + 1);
        generateNewQuestion();
      }
    }, 1500);
  }, [currentQuestion, selectedAnswer, timeLeft, streak, questionNumber, totalQuestions, onPointsEarned]);

  useEffect(() => {
    if (gameActive && timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-999); // Wrong answer for timeout
    }
  }, [gameActive, timeLeft, showResult, handleAnswer]);

  const resetGame = () => {
    setGameActive(false);
    setGameComplete(false);
    setScore(0);
    setQuestionNumber(1);
    setStreak(0);
    setCurrentQuestion(null);
  };

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
            <div className="text-lg">Respondiste {totalQuestions} preguntas</div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Precisión: {Math.round((score > 0 ? (questionNumber - 1) : 0) / totalQuestions * 100)}%
            </Badge>
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

  if (!gameActive) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            Preguntas Rápidas
          </CardTitle>
          <p className="text-muted-foreground">
            Resuelve cálculos matemáticos lo más rápido posible. 
            ¡Respuestas rápidas te dan puntos extra!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-700">Fácil</div>
                <div className="text-green-600">Suma y resta simple</div>
                <div className="text-xs text-green-500">10 puntos</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="font-semibold text-yellow-700">Medio</div>
                <div className="text-yellow-600">Multiplicación y división</div>
                <div className="text-xs text-yellow-500">20 puntos</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="font-semibold text-red-700">Difícil</div>
                <div className="text-red-600">Operaciones combinadas</div>
                <div className="text-xs text-red-500">30 puntos</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Dificultad inicial:</label>
              <div className="flex gap-2 justify-center">
                <Button
                  variant={difficulty === 'easy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty('easy')}
                >
                  Fácil
                </Button>
                <Button
                  variant={difficulty === 'medium' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty('medium')}
                >
                  Medio
                </Button>
                <Button
                  variant={difficulty === 'hard' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDifficulty('hard')}
                >
                  Difícil
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={startGame} size="lg" className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white shadow">
              <Zap className="h-4 w-4" />
              Comenzar
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
      <div className="relative min-h-screen p-4 bg-[#fffde7] overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full animate-gradient-fade bg-gradient-to-br from-yellow-200 via-orange-100 via-red-100 to-purple-200 opacity-60 blur-2xl" style={{backgroundSize:'200% 200%'}}></div>
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
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Pregunta {questionNumber}/{totalQuestions}
                </CardTitle>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">Racha: {streak}</Badge>
                  <Badge>{score} pts</Badge>
                </div>
              </div>
              <Progress value={(questionNumber - 1) / totalQuestions * 100} className="w-full" />
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className={`text-2xl font-bold ${timeLeft <= 3 ? 'text-red-500' : 'text-blue-500'}`}>
                    {timeLeft}s
                  </span>
                </div>
                <Progress value={(timeLeft / 10) * 100} className={`w-32 mx-auto ${timeLeft <= 3 ? 'bg-red-100' : ''}`} />
              </div>

              {currentQuestion && (
                <div className="text-center space-y-6">
                  <div className="text-4xl font-bold p-6 bg-blue-50 rounded-lg">
                    {currentQuestion.question}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {currentQuestion.options.map((option, index) => (
                      <Button
                        key={index}
                        variant={selectedAnswer === option ? 
                          (isCorrect ? 'default' : 'destructive') : 
                          'outline'
                        }
                        size="lg"
                        className={`h-16 text-xl ${
                          showResult && option === currentQuestion.correctAnswer ? 'bg-green-500 hover:bg-green-600' : ''
                        }`}
                        onClick={() => handleAnswer(option)}
                        disabled={selectedAnswer !== null}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>

                  {showResult && (
                    <div className={`text-center p-4 rounded-lg ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? '¡Correcto! 🎉' : `Incorrecto. La respuesta es ${currentQuestion.correctAnswer}`}
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
