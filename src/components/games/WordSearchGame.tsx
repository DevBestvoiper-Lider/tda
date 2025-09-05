import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw, Trophy, Eye, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface WordSearchGameProps {
  onPointsEarned: (points: number) => void;
  onBack: () => void;
}

interface WordPosition {
  word: string;
  startRow: number;
  startCol: number;
  direction: 'horizontal' | 'vertical' | 'diagonal';
  found: boolean;
}

interface Cell {
  letter: string;
  isSelected: boolean;
  isPartOfWord: boolean;
  isFoundWord: boolean;
  foundWordIndex?: number;
  wordIndex?: number;
}

const WORDS_BY_CATEGORY = {
  animals: ['GATO', 'PERRO', 'LEON', 'OSO', 'PATO', 'RANA', 'PEZ'],
  colors: ['ROJO', 'AZUL', 'VERDE', 'ROSA', 'NEGRO', 'BLANCO'],
  fruits: ['MANZANA', 'PERA', 'UVA', 'KIWI', 'MANGO', 'FRESA'],
  school: ['LIBRO', 'LAPIZ', 'MESA', 'SILLA', 'TIZA', 'BORRADOR']
};

const GRID_SIZE = 12;

export default function WordSearchGame({ onPointsEarned, onBack }: WordSearchGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [selectedCells, setSelectedCells] = useState<{row: number, col: number}[]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [category, setCategory] = useState<keyof typeof WORDS_BY_CATEGORY>('animals');
  const [gameStarted, setGameStarted] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const generateRandomLetter = () => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  const canPlaceWord = (word: string, row: number, col: number, direction: string, currentGrid: Cell[][]) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
      diagonalUp: [-1, 1]
    };

    const [dRow, dCol] = directions[direction as keyof typeof directions];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      
      if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) {
        return false;
      }
      
      if (currentGrid[newRow][newCol].letter !== '' && currentGrid[newRow][newCol].letter !== word[i]) {
        return false;
      }
    }
    
    return true;
  };

  const placeWord = (word: string, row: number, col: number, direction: string, currentGrid: Cell[][]) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1],
      diagonalUp: [-1, 1]
    };

    const [dRow, dCol] = directions[direction as keyof typeof directions];
    
    for (let i = 0; i < word.length; i++) {
      const newRow = row + i * dRow;
      const newCol = col + i * dCol;
      currentGrid[newRow][newCol].letter = word[i];
      currentGrid[newRow][newCol].isPartOfWord = true;
    }
  };

  const generateGrid = (selectedWords: string[]) => {
    // Initialize empty grid
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        letter: '',
        isSelected: false,
        isPartOfWord: false,
        isFoundWord: false
      }))
    );

    const newWordPositions: WordPosition[] = [];
    const directions = ['horizontal', 'vertical', 'diagonal', 'diagonalUp'];

    // Place words
    for (const word of selectedWords) {
      let placed = false;
      let attempts = 0;
      
      while (!placed && attempts < 100) {
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * GRID_SIZE);
        
        if (canPlaceWord(word, row, col, direction, newGrid)) {
          placeWord(word, row, col, direction, newGrid);
          newWordPositions.push({
            word,
            startRow: row,
            startCol: col,
            direction: direction as 'horizontal' | 'vertical' | 'diagonal',
            found: false
          });
          placed = true;
        }
        attempts++;
      }
    }

    // Fill empty cells with random letters
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].letter === '') {
          newGrid[row][col].letter = generateRandomLetter();
        }
      }
    }

    setGrid(newGrid);
    setWordPositions(newWordPositions);
  };

  const startGame = () => {
    const selectedWords = WORDS_BY_CATEGORY[category].slice(0, 6);
    setWords(selectedWords);
    setFoundWords([]);
    setSelectedCells([]);
    setGameComplete(false);
    setScore(0);
    setTimeLeft(300);
    setGameStarted(true);
    setHintsUsed(0);
    generateGrid(selectedWords);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameStarted || gameComplete) return;

    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedCells([{row, col}]);
      setGrid(prev => prev.map((gridRow, r) =>
        gridRow.map((cell, c) => ({
          ...cell,
          isSelected: r === row && c === col
        }))
      ));
    }
  };

  const handleCellEnter = (row: number, col: number) => {
    if (!isSelecting || selectedCells.length === 0) return;

    const startCell = selectedCells[0];
    const newSelectedCells = getSelectedCellsInLine(startCell.row, startCell.col, row, col);
    
    setSelectedCells(newSelectedCells);
    setGrid(prev => prev.map((gridRow, r) =>
      gridRow.map((cell, c) => ({
        ...cell,
        isSelected: newSelectedCells.some(selected => selected.row === r && selected.col === c)
      }))
    ));
  };

  const getSelectedCellsInLine = (startRow: number, startCol: number, endRow: number, endCol: number) => {
    const cells: {row: number, col: number}[] = [];
    
    const deltaRow = endRow - startRow;
    const deltaCol = endCol - startCol;
    const distance = Math.max(Math.abs(deltaRow), Math.abs(deltaCol));
    
    if (distance === 0) {
      return [{row: startRow, col: startCol}];
    }
    
    const stepRow = deltaRow === 0 ? 0 : deltaRow / Math.abs(deltaRow);
    const stepCol = deltaCol === 0 ? 0 : deltaCol / Math.abs(deltaCol);
    
    // Only allow straight lines (horizontal, vertical, diagonal)
    if (Math.abs(deltaRow) !== Math.abs(deltaCol) && deltaRow !== 0 && deltaCol !== 0) {
      return [{row: startRow, col: startCol}];
    }
    
    for (let i = 0; i <= distance; i++) {
      const row = startRow + i * stepRow;
      const col = startCol + i * stepCol;
      cells.push({row, col});
    }
    
    return cells;
  };

  const handleCellRelease = () => {
    if (!isSelecting) return;
    
    setIsSelecting(false);
    
    // Check if selected cells form a word
    const selectedWord = selectedCells.map(cell => grid[cell.row][cell.col].letter).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    const foundWord = words.find(word => word === selectedWord || word === reversedWord);
    
    if (foundWord && !foundWords.includes(foundWord)) {
      setFoundWords(prev => [...prev, foundWord]);
      const points = foundWord.length * 10 + (timeLeft > 240 ? 20 : timeLeft > 120 ? 10 : 0);
      setScore(prev => prev + points);
      onPointsEarned(points);
      
      // Mark word as found in positions
      setWordPositions(prev => prev.map(pos => 
        pos.word === foundWord ? {...pos, found: true} : pos
      ));
      
      // Mark cells as part of found word with a unique color
      const wordIndex = foundWords.length; // This will be the index for the new found word
      setGrid(prev => prev.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const isPartOfFoundWord = selectedCells.some(selected => 
            selected.row === rowIndex && selected.col === colIndex
          );
          return {
            ...cell,
            isSelected: false,
            isFoundWord: isPartOfFoundWord ? true : cell.isFoundWord,
            foundWordIndex: isPartOfFoundWord ? wordIndex : cell.foundWordIndex
          };
        })
      ));
    } else {
      // Clear selection if no word found
      setSelectedCells([]);
      setGrid(prev => prev.map(row =>
        row.map(cell => ({
          ...cell,
          isSelected: false
        }))
      ));
    }
  };

  const useHint = () => {
    if (hintsUsed >= 2 || foundWords.length === words.length) return;
    
    const unFoundWords = wordPositions.filter(pos => !pos.found);
    if (unFoundWords.length === 0) return;
    
    const randomWord = unFoundWords[Math.floor(Math.random() * unFoundWords.length)];
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      diagonal: [1, 1]
    };
    
    const [dRow, dCol] = directions[randomWord.direction as keyof typeof directions] || [0, 1];
    
    // Highlight first 2 letters of the word
    const hintCells: {row: number, col: number}[] = [];
    for (let i = 0; i < Math.min(2, randomWord.word.length); i++) {
      hintCells.push({
        row: randomWord.startRow + i * dRow,
        col: randomWord.startCol + i * dCol
      });
    }
    
    setGrid(prev => prev.map((row, r) =>
      row.map((cell, c) => ({
        ...cell,
        isSelected: hintCells.some(hint => hint.row === r && hint.col === c) && !cell.isFoundWord
      }))
    ));
    
    setTimeout(() => {
      setGrid(prev => prev.map(row =>
        row.map(cell => ({
          ...cell,
          isSelected: false
        }))
      ));
    }, 2000);
    
    setHintsUsed(prev => prev + 1);
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameComplete(true);
    }
  }, [gameStarted, timeLeft, gameComplete]);

  useEffect(() => {
    if (foundWords.length === words.length && words.length > 0) {
      setGameComplete(true);
    }
  }, [foundWords, words]);

  if (gameComplete) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <CardTitle className="text-2xl">
              {foundWords.length === words.length ? '¡Felicitaciones!' : '¡Tiempo agotado!'}
            </CardTitle>
          </div>
          <div className="space-y-2">
            <div className="text-4xl font-bold text-green-600">{score} puntos</div>
            <div className="text-lg">Encontraste {foundWords.length} de {words.length} palabras</div>
            {hintsUsed > 0 && (
              <Badge variant="outline">Pistas usadas: {hintsUsed}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={startGame} className="flex items-center gap-2">
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
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            🔍 Sopa de Letras
          </CardTitle>
          <p className="text-muted-foreground">
            Encuentra todas las palabras ocultas en la grilla. Pueden estar en horizontal, vertical o diagonal.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">Selecciona una categoría:</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(WORDS_BY_CATEGORY) as (keyof typeof WORDS_BY_CATEGORY)[]).map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  onClick={() => setCategory(cat)}
                  className="capitalize"
                >
                  {cat === 'animals' && '🐾 Animales'}
                  {cat === 'colors' && '🎨 Colores'}
                  {cat === 'fruits' && '🍎 Frutas'}
                  {cat === 'school' && '🏫 Escuela'}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={startGame} size="lg">
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
    <div className="relative min-h-screen py-8 bg-[#fff8f2] overflow-hidden">
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
        <Card className="w-full max-w-6xl mx-auto bg-white/90">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 via-yellow-400 to-purple-600 animate-gradient-x">🔍 Sopa de Letras</span>
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span className={timeLeft < 60 ? 'text-red-500 font-bold' : 'text-purple-700'}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <Badge className="bg-gradient-to-r from-orange-400 via-red-400 to-purple-500 text-white border-0 shadow">{score} pts</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Progress value={(foundWords.length / words.length) * 100} className="flex-1 mr-4 bg-yellow-100" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={useHint}
                disabled={hintsUsed >= 2 || foundWords.length === words.length}
                className="flex items-center gap-1 border-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-purple-400 text-white shadow hover:from-yellow-500 hover:to-purple-600"
              >
                <Eye className="h-4 w-4" />
                Pista ({2 - hintsUsed})
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Grid */}
              <div className="flex-1">
                <div 
                  className="grid grid-cols-12 gap-1 p-4 bg-gray-50 rounded-lg select-none"
                  style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
                >
                  {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                      // Define colors for found words
                      const foundWordColors = [
                        'bg-green-200 border-green-400 text-green-800',
                        'bg-blue-200 border-blue-400 text-blue-800',
                        'bg-purple-200 border-purple-400 text-purple-800',
                        'bg-orange-200 border-orange-400 text-orange-800',
                        'bg-pink-200 border-pink-400 text-pink-800',
                        'bg-teal-200 border-teal-400 text-teal-800'
                      ];
                      
                      let cellClasses = `
                        w-8 h-8 flex items-center justify-center text-sm font-bold cursor-pointer
                        border rounded transition-colors
                      `;
                      
                      if (cell.isSelected) {
                        cellClasses += ' bg-yellow-200 border-yellow-500 text-yellow-800';
                      } else if (cell.isFoundWord && cell.foundWordIndex !== undefined) {
                        const colorIndex = cell.foundWordIndex % foundWordColors.length;
                        cellClasses += ` ${foundWordColors[colorIndex]}`;
                      } else {
                        cellClasses += ' bg-white hover:bg-gray-100 border-gray-300';
                      }
                      
                      return (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={cellClasses}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                          onMouseEnter={() => handleCellEnter(rowIndex, colIndex)}
                          onMouseUp={handleCellRelease}
                        >
                          {cell.letter}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Word list */}
              <div className="lg:w-64">
                <h3 className="font-semibold mb-3">Palabras a encontrar:</h3>
                <div className="space-y-2">
                  {words.map((word, index) => {
                    const foundIndex = foundWords.indexOf(word);
                    const isFound = foundIndex !== -1;
                    
                    // Same color scheme as the grid
                    const foundWordColors = [
                      'bg-green-100 border-green-300 text-green-800',
                      'bg-blue-100 border-blue-300 text-blue-800',
                      'bg-purple-100 border-purple-300 text-purple-800',
                      'bg-orange-100 border-orange-300 text-orange-800',
                      'bg-pink-100 border-pink-300 text-pink-800',
                      'bg-teal-100 border-teal-300 text-teal-800'
                    ];
                    
                    const colorClass = isFound 
                      ? foundWordColors[foundIndex % foundWordColors.length]
                      : 'bg-white border-gray-300';
                    
                    return (
                      <div
                        key={word}
                        className={`p-2 rounded border flex items-center justify-between ${colorClass} ${
                          isFound ? 'line-through' : ''
                        }`}
                      >
                        <span>{word} ({word.length} letras)</span>
                        {isFound && (
                          <span className="text-xs">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
