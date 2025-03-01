import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-8 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page non trouvée</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        Désolé, la page que vous recherchez n'existe pas.
      </p>
      <Link href="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  );
}