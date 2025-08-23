import { useEffect, useState } from "react";
import { getCurrentCity } from "../data/dummyData";

export default function useCity() {
  const [city, setCity] = useState<string>(() => getCurrentCity());

  useEffect(() => {
    const sync = () => setCity(getCurrentCity());
    sync(); // initial pull
    window.addEventListener(
      "location:updated",
      sync as unknown as EventListener
    );
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(
        "location:updated",
        sync as unknown as EventListener
      );
      window.removeEventListener("storage", sync);
    };
  }, []);

  return city;
}
