import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Compass, Rocket, Heart } from 'lucide-react';
import NavMenu from '@/components/NavMenu';

interface AboutSectionProps {
  onBack: () => void;
  onNavigate: (page: 'home' | 'about') => void;
}

export default function AboutSection({ onBack, onNavigate }: AboutSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <NavMenu onNavigate={onNavigate} />
              <Button
                onClick={onBack}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al inicio</span>
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-800">Acerca de Nosotros</h1>
              <p className="text-gray-600">Conoce el propósito de este proyecto</p>
            </div>
            <div className="w-24" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero */}
        <Card className="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <CardContent className="p-8 text-center md:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Pequeños Pasos, Grandes Sueños
              </h2>
              <p className="text-xl opacity-90">
                Un sistema pensado para acompañar a niños con TDA en su desarrollo diario
              </p>
            </CardContent>
            <img
              src="/about-nino-jugando.jpeg"
              alt="Niño jugando en MenteFocus desde su computador"
              className="w-full h-56 md:h-72 object-cover"
            />
          </div>
        </Card>

        {/* Mission and Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-lg border-2 border-teal-200 overflow-hidden">
            <img
              src="/about-nino-tablet.jpg"
              alt="Niño resolviendo un ejercicio de matemáticas en una tablet"
              className="w-full h-48 object-cover"
            />
            <CardHeader className="bg-teal-50">
              <CardTitle className="text-2xl text-teal-800 flex items-center space-x-3">
                <Rocket className="h-8 w-8" />
                <span>Misión</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Brindar a niños con Trastorno por Déficit de Atención (TDA) herramientas
                lúdicas, accesibles y basadas en técnicas terapéuticas comprobadas, que les
                permitan fortalecer su concentración, autocontrol y confianza, acompañando
                también a sus familias y educadores en ese proceso.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-blue-200 overflow-hidden">
            <img
              src="/about-aula-clase.jpeg"
              alt="Niños usando MenteFocus en un salón de clase"
              className="w-full h-48 object-cover"
            />
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-2xl text-blue-800 flex items-center space-x-3">
                <Compass className="h-8 w-8" />
                <span>Visión</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                Ser un sistema de referencia en apoyo educativo para la comunidad, reconocido
                por transformar la manera en que los niños con TDA desarrollan sus habilidades
                de atención, mediante juegos innovadores y accesibles para cualquier familia,
                escuela o institución que los necesite.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <Card className="shadow-lg border-2 border-pink-200">
          <CardHeader className="bg-pink-50">
            <CardTitle className="text-2xl text-pink-800 flex items-center space-x-3">
              <Heart className="h-8 w-8" />
              <span>Nuestros Valores</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl mb-3">🤝</div>
                <h4 className="font-bold text-gray-800 mb-2">Empatía</h4>
                <p className="text-gray-600 text-sm">
                  Entendemos el ritmo de cada niño y lo respetamos.
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-3">🎮</div>
                <h4 className="font-bold text-gray-800 mb-2">Aprendizaje Divertido</h4>
                <p className="text-gray-600 text-sm">
                  Convertimos el ejercicio de concentración en un juego.
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-3">🌱</div>
                <h4 className="font-bold text-gray-800 mb-2">Crecimiento Constante</h4>
                <p className="text-gray-600 text-sm">
                  Cada pequeño paso cuenta hacia un gran sueño.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impact Gallery */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <Card className="shadow-lg border-2 border-purple-200 overflow-hidden">
            <img
              src="/about-nino-concentrado.jpg"
              alt="Niño concentrado usando su computador con audífonos"
              className="w-full h-56 object-cover"
            />
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-800 mb-2">Concentración desde casa</h4>
              <p className="text-gray-600 text-sm">
                Nuestros juegos se adaptan a la rutina diaria de cada niño, en casa o en el colegio.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-teal-200 overflow-hidden">
            <img
              src="/about-acompanamiento-profesional.png"
              alt="Niño acompañado por un profesional durante una actividad de atención"
              className="w-full h-56 object-cover"
            />
            <CardContent className="p-6">
              <h4 className="font-bold text-gray-800 mb-2">Acompañamiento profesional</h4>
              <p className="text-gray-600 text-sm">
                Trabajamos de la mano con educadores y profesionales de la salud para un apoyo integral.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
