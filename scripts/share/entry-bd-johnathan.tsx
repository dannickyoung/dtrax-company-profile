import { createRoot } from "react-dom/client";
import { DeckPlayer } from "@/components/deck/DeckPlayer";
import { asset } from "@/lib/base-path";
import { slidesJohnathan as slides } from "@/decks/bd/slides";

createRoot(document.getElementById("deck")!).render(<DeckPlayer slides={slides} intro={asset("/assets/bd/showcase-intro.mp4")} />);
