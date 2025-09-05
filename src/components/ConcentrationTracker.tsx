import { Trophy, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ConcentrationTrackerProps {
  points: number;
}

export default function ConcentrationTracker({ points }: ConcentrationTrackerProps) {
  const getLevel = (points: number) => {
    if (points < 50) return { name: 'Aprendiz', color: 'bg-gray-500', icon: '🥉' };
    if (points < 100) return { name: 'Explorador', color: 'bg-blue-500', icon: '🥈' };
    if (points < 200) return { name: 'Concentrado', color: 'bg-purple-500', icon: '🥇' };
    if (points < 500) return { name: 'Maestro Focus', color: 'bg-yellow-500', icon: '🏆' };
    return { name: 'Súper Héroe', color: 'bg-gradient-to-r from-pink-500 to-purple-600', icon: '👑' };
  };

  const level = getLevel(points);

  return (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200">
      <div className="flex items-center space-x-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{level.icon}</span>
            <Badge className={`${level.color} text-white px-3 py-1`}>
              {level.name}
            </Badge>
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="font-bold text-lg text-gray-800">{points} puntos</span>
          </div>
        </div>
      </div>
    </div>
  );
}