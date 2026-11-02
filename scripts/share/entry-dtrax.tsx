import { createRoot } from "react-dom/client";
import { DeckPlayer } from "@/components/deck/DeckPlayer";
import { slides } from "@/decks/dtrax/slides";

createRoot(document.getElementById("deck")!).render(<DeckPlayer slides={slides} />);
