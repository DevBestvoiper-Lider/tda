import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, Heart, Target, Users, BookOpen, Lightbulb } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NavMenu from '@/components/NavMenu';

interface TDAHInfoProps {
  onBack: () => void;
  onNavigate: (page: 'home' | 'about') => void;
}

export default function TDAHInfo({ onBack, onNavigate }: TDAHInfoProps) {
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
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Información sobre TDA</h1>
                <p className="text-gray-600">Conoce más sobre este trastorno y cómo ayudar</p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero Quote */}
        <Card className="mb-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              "Cada niño tiene su propio ritmo, y en cada pequeño paso que da, late un gran sueño esperando hacerse realidad."
            </h2>
            <p className="text-xl opacity-90">
              Un proyecto creado para niños con TDA y sus familias
            </p>
          </CardContent>
        </Card>

        {/* What is TDAH */}
        <Card className="mb-8 shadow-lg border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-2xl text-blue-800 flex items-center space-x-3">
              <Brain className="h-8 w-8" />
              <span>¿Qué es el TDA?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  El <strong>Trastorno por Déficit de Atención (TDA)</strong> es una condición neurobiológica que afecta la capacidad de los niños para prestar atención, controlar impulsos y regular su actividad.
                </p>
                <p className="text-gray-700">
                  No es resultado de mala crianza o falta de disciplina. Es una diferencia en cómo funciona el cerebro que requiere comprensión, paciencia y estrategias específicas.
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-3">Datos importantes:</h4>
                <ul className="space-y-2 text-blue-700">
                  <li>• Afecta entre 3-7% de los niños en edad escolar</li>
                  <li>• Es más común en niños que en niñas</li>
                  <li>• Tiene base genética y neurobiológica</li>
                  <li>• Con el apoyo adecuado, los niños pueden prosperar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Symptoms */}
        <Card className="mb-8 shadow-lg border-2 border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-2xl text-green-800 flex items-center space-x-3">
              <Target className="h-8 w-8" />
              <span>Señales del TDA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-red-50 rounded-lg border-2 border-red-200">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="font-bold text-red-800 mb-3">Falta de Atención</h4>
                <ul className="text-sm text-red-700 space-y-1 text-left">
                  <li>• Se distrae fácilmente</li>
                  <li>• Dificultad para seguir instrucciones</li>
                  <li>• Pierde objetos frecuentemente</li>
                  <li>• Evita tareas que requieren concentración</li>
                </ul>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                <div className="text-4xl mb-4">⚡</div>
                <h4 className="font-bold text-yellow-800 mb-3">Hiperactividad</h4>
                <ul className="text-sm text-yellow-700 space-y-1 text-left">
                  <li>• Se mueve constantemente</li>
                  <li>• Dificultad para estar quieto</li>
                  <li>• Habla excesivamente</li>
                  <li>• Siempre "en movimiento"</li>
                </ul>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="font-bold text-purple-800 mb-3">Impulsividad</h4>
                <ul className="text-sm text-purple-700 space-y-1 text-left">
                  <li>• Interrumpe conversaciones</li>
                  <li>• Actúa sin pensar</li>
                  <li>• Dificultad para esperar turnos</li>
                  <li>• Responde antes de terminar la pregunta</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Help */}
        <Card className="mb-8 shadow-lg border-2 border-purple-200">
          <CardHeader className="bg-purple-50">
            <CardTitle className="text-2xl text-purple-800 flex items-center space-x-3">
              <Heart className="h-8 w-8" />
              <span>¿Cómo Podemos Ayudar?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500 p-2 rounded-full flex-shrink-0">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Ambiente Estructurado</h4>
                    <p className="text-gray-600">Crear rutinas claras y predecibles que ayuden al niño a sentirse seguro y organizado.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 p-2 rounded-full flex-shrink-0">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Refuerzo Positivo</h4>
                    <p className="text-gray-600">Celebrar los logros, por pequeños que sean, para fortalecer la autoestima del niño.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 p-2 rounded-full flex-shrink-0">
                    <Lightbulb className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2">Estrategias de Concentración</h4>
                    <p className="text-gray-600">Usar técnicas como juegos, ejercicios de respiración y pausas activas.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-lg border-2 border-orange-200">
                <h4 className="font-bold text-orange-800 mb-4 text-center">💡 Consejos Prácticos</h4>
                <ul className="space-y-3 text-orange-700">
                  <li className="flex items-center space-x-2">
                    <span className="text-lg">✓</span>
                    <span>Dividir tareas grandes en pasos pequeños</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-lg">✓</span>
                    <span>Usar recordatorios visuales y listas</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-lg">✓</span>
                    <span>Permitir descansos frecuentes</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-lg">✓</span>
                    <span>Mantener comunicación constante</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-lg">✓</span>
                    <span>Buscar apoyo profesional cuando sea necesario</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits of Games */}
        <Card className="mb-8 shadow-lg border-2 border-teal-200">
          <CardHeader className="bg-teal-50">
            <CardTitle className="text-2xl text-teal-800 flex items-center space-x-3">
              <BookOpen className="h-8 w-8" />
              <span>Beneficios de Nuestros Juegos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="font-bold text-blue-800 mb-2">Mejora la Memoria</h4>
                <p className="text-sm text-blue-600">Fortalece la memoria de trabajo y la retención de información</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-bold text-green-800 mb-2">Aumenta la Concentración</h4>
                <p className="text-sm text-green-600">Desarrolla la capacidad de mantener el foco en una tarea</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-3">⏰</div>
                <h4 className="font-bold text-purple-800 mb-2">Gestión del Tiempo</h4>
                <p className="text-sm text-purple-600">Enseña a organizar el tiempo y establecer rutinas</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-3xl mb-3">😌</div>
                <h4 className="font-bold text-pink-800 mb-2">Reduce la Ansiedad</h4>
                <p className="text-sm text-pink-600">Proporciona técnicas de relajación y manejo del estrés</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">¿Listo para comenzar el viaje?</h3>
            <p className="text-lg mb-6 opacity-90">
              Nuestros juegos están diseñados específicamente para ayudar a niños con TDA a desarrollar sus habilidades de concentración de manera divertida y efectiva.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onBack}
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
              >
                Explorar Juegos
              </Button>
              <Badge className="bg-yellow-400 text-yellow-900 px-4 py-2 text-lg">
                🌟 Gratis y Seguro
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Resources */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            <strong>Recuerda:</strong> Si tienes preocupaciones sobre el desarrollo de tu hijo, consulta con un profesional de la salud.
          </p>
          <p className="text-sm text-gray-500">
            Este proyecto es una herramienta de apoyo y no reemplaza el tratamiento médico profesional.
          </p>
        </div>
      </div>
    </div>
  );
}