import React, { useEffect, useRef, useState } from "react";
import "./SearchBox.css";
import {
  PRODUCTS,
  SUBCATEGORIES,
  CATEGORIES,
  SEARCH_SUGGESTIONS,
} from "../../../data/dummyData";

type Props = {
  city: string;
  onSearch?: (q: string) => void;
  maxSuggestions?: number;
};

type Scope = "all" | string;

const SearchBox: React.FC<Props> = ({ city, onSearch, maxSuggestions = 5 }) => {
  const [query, setQuery] = useState("");
  const [showSuggest, setShowSuggest] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [scope, setScope] = useState<Scope>(
    () => (localStorage.getItem("search:lastScope") as Scope) || "all"
  );
  const [scopeOpen, setScopeOpen] = useState(false);

  const MIN_CHARS = 1;
  const barRef = useRef<HTMLDivElement | null>(null);

  const readRecent = (): string[] => {
    try {
      const raw = localStorage.getItem("search:recent");
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  };

  const saveRecent = (term: string) => {
    const t = term.trim();
    if (!t) return;
    const deduped = [
      t,
      ...readRecent().filter((x) => x.toLowerCase() !== t.toLowerCase()),
    ].slice(0, maxSuggestions);
    localStorage.setItem("search:recent", JSON.stringify(deduped));
  };

  const getScopeLabel = () =>
    scope === "all"
      ? "All"
      : CATEGORIES.find((c) => c.id === scope)?.name ?? "All";

  const productInScope = (productId: string) => {
    if (scope === "all") return true;
    const sub = SUBCATEGORIES.find(
      (s) => s.id === PRODUCTS.find((p) => p.id === productId)?.subcategoryId
    );
    return sub?.categoryId === scope;
  };

  const pickThumbForCategory = (catId: string) => {
    const subIds = SUBCATEGORIES.filter((sc) => sc.categoryId === catId).map(
      (sc) => sc.id
    );
    const prod = PRODUCTS.find((p) => subIds.includes(p.subcategoryId));
    return prod?.image;
  };

  const pickThumbForSubcategory = (subId: string) =>
    PRODUCTS.find((p) => p.subcategoryId === subId)?.image;

  const pickThumbForText = (text: string) => {
    const t = text.trim().toLowerCase();
    const p =
      PRODUCTS.find((p) => p.name.toLowerCase() === t) ||
      PRODUCTS.find((p) => p.name.toLowerCase().includes(t));
    if (p?.image) return p.image;

    const c = CATEGORIES.find((c) => c.name.toLowerCase() === t);
    if (c) {
      const img = pickThumbForCategory(c.id);
      if (img) return img;
    }

    const sc = SUBCATEGORIES.find((sc) => sc.name.toLowerCase() === t);
    if (sc) {
      const img = pickThumbForSubcategory(sc.id);
      if (img) return img;
    }

    return undefined;
  };

  const buildSuggestions = (q: string): string[] => {
    const str = q.trim().toLowerCase();
    if (str.length < MIN_CHARS) return [];

    const recent = readRecent();
    const trending = (SEARCH_SUGGESTIONS?.trending ?? []) as string[];
    const productNames = PRODUCTS.filter((p) => productInScope(p.id)).map(
      (p) => p.name
    );

    const dedup = (arr: string[]) => {
      const seen = new Set<string>();
      const out: string[] = [];
      for (const s of arr) {
        const k = s.toLowerCase();
        if (!seen.has(k)) {
          seen.add(k);
          out.push(s);
        }
        if (out.length >= maxSuggestions) break;
      }
      return out;
    };

    const match = (s: string) => s.toLowerCase().includes(str);
    return dedup([
      ...recent.filter(match),
      ...productNames.filter(match),
      ...trending.filter(match),
    ]);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      const list = buildSuggestions(query);
      setSuggestions(list);
      setShowSuggest(query.trim().length >= MIN_CHARS && list.length > 0);
      setActiveIndex(-1);
    }, 120);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, scope]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!barRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!barRef.current.contains(e.target)) {
        setShowSuggest(false);
        setScopeOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const submitSearch = (force?: string) => {
    const term = (force ?? query).trim();
    if (!term) return;
    saveRecent(term);
    localStorage.setItem("search:lastScope", scope);
    window.dispatchEvent(
      new CustomEvent("search:submitted", { detail: { term, scope } })
    );
    setShowSuggest(false);
    onSearch?.(term);
  };

  const changeScope = (next: Scope) => {
    setScope(next);
    setScopeOpen(false);
    const list = buildSuggestions(query);
    setSuggestions(list);
    setShowSuggest(query.trim().length >= MIN_CHARS && list.length > 0);
  };

  return (
    <div className="search-bar" ref={barRef}>
      <div className="scope-wrap">
        <button
          className="scope-btn"
          aria-haspopup="menu"
          aria-expanded={scopeOpen}
          onClick={() => setScopeOpen((v) => !v)}
          title="Search scope"
        >
          {getScopeLabel()} <span className="chev">▾</span>
        </button>

        {scopeOpen && (
          <div className="scope-menu" role="menu">
            <button
              className={`scope-item ${scope === "all" ? "sel" : ""}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => changeScope("all")}
            >
              <span className="scope-text">All</span>
            </button>
            {CATEGORIES.map((c) => {
              const catThumb = pickThumbForCategory(c.id);
              return (
                <button
                  key={c.id}
                  className={`scope-item ${scope === c.id ? "sel" : ""}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => changeScope(c.id)}
                >
                  {catThumb && (
                    <img
                      className="scope-thumb"
                      src={catThumb}
                      alt=""
                      loading="lazy"
                      onError={(e) =>
                        ((e.currentTarget as HTMLImageElement).style.display =
                          "none")
                      }
                    />
                  )}
                  <span className="scope-text">{c.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="input-wrap">
        <input
          value={query}
          onChange={(e) => {
            const q = e.target.value;
            setQuery(q);
            const list = buildSuggestions(q);
            setSuggestions(list);
            setShowSuggest(q.trim().length >= MIN_CHARS && list.length > 0);
          }}
          onFocus={() => {
            if (query.trim().length >= MIN_CHARS) {
              const list = buildSuggestions(query);
              setSuggestions(list);
              setShowSuggest(list.length > 0);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (activeIndex >= 0 && suggestions[activeIndex]) {
                submitSearch(suggestions[activeIndex]);
              } else {
                submitSearch();
              }
              return;
            }
            if (!suggestions.length) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
              setShowSuggest(true);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === "Escape") {
              setShowSuggest(false);
            }
          }}
          placeholder={`Search in ${city} • ${getScopeLabel()}`}
        />

        <div
          className={`search-suggest ${showSuggest ? "open" : ""}`}
          role="listbox"
        >
          {suggestions.map((s, idx) => {
            const thumb = pickThumbForText(s);
            return (
              <button
                key={`${s}-${idx}`}
                className={`suggest-item ${
                  idx === activeIndex ? "active" : ""
                }`}
                role="option"
                aria-selected={idx === activeIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  submitSearch(s);
                }}
              >
                {thumb && (
                  <img
                    className="suggest-thumb"
                    src={thumb}
                    alt=""
                    loading="lazy"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).style.display =
                        "none")
                    }
                  />
                )}
                <span className="suggest-text">{s}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button className="search-btn" onClick={() => submitSearch()}>
        🔎
      </button>
    </div>
  );
};

export default SearchBox;
