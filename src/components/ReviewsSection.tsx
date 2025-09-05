import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Review {
  name: string;
  text: string;
  date: string;
}

const LOCAL_KEY = 'tda_reviews';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setReviews(JSON.parse(stored));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim() || !text.trim()) {
      setError('Por favor, completa tu nombre y tu reseña.');
      return;
    }
    const newReview: Review = {
      name: name.trim(),
      text: text.trim(),
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    setName('');
    setText('');
    setSuccess('¡Gracias por tu reseña!');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-12 bg-white/90">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Reseñas de Usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            maxLength={32}
          />
          <Textarea
            placeholder="¿Qué te ha parecido la página?"
            value={text}
            onChange={e => setText(e.target.value)}
            rows={3}
            maxLength={300}
            className="w-full"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white w-full">Enviar Reseña</Button>
        </form>
        <div className="space-y-4">
          {reviews.length === 0 && <div className="text-gray-500 text-center">Aún no hay reseñas. ¡Sé el primero!</div>}
          {reviews.map((review, idx) => (
            <div key={idx} className="border rounded p-3 bg-orange-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-orange-700">{review.name}</span>
                <Badge className="bg-yellow-200 text-yellow-800">{review.date}</Badge>
              </div>
              <div className="text-gray-800">{review.text}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
