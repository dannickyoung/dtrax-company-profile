import { createRoot } from "react-dom/client";
import { DeckPlayer } from "@/components/deck/DeckPlayer";
import { PAGE_H, PAGE_W, slides } from "@/decks/handbook/slides";

createRoot(document.getElementById("deck")!).render(<DeckPlayer slides={slides} size={{ width: PAGE_W, height: PAGE_H }} />);
