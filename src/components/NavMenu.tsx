import { Menu, Home, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavMenuProps {
  onNavigate: (page: 'home' | 'about') => void;
}

export default function NavMenu({ onNavigate }: NavMenuProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Abrir menú de navegación">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-2 mt-6">
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-lg"
              onClick={() => onNavigate('home')}
            >
              <Home className="mr-2 h-5 w-5" />
              Inicio
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button
              variant="ghost"
              className="justify-start text-lg"
              onClick={() => onNavigate('about')}
            >
              <Info className="mr-2 h-5 w-5" />
              Acerca de
            </Button>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
