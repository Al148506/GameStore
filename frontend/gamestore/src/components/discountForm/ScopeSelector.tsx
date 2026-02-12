import type { DiscountScopeBase } from "../../types/discount/discount";
import "../../styles/scopeSelector.css";
import { SingleSelectField } from "../common/SingleSelectField";

type Props = {
  scopes?: DiscountScopeBase[];
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
  onChange: (scopes: DiscountScopeBase[]) => void;
  error?: string | null;
};

export const ScopeSelector = ({
  scopes = [],
  genres,
  platforms,
  onChange,
  error 
}: Props) => {
  const addScope = () => onChange([...scopes, { targetType: "All" }]);

  const genreOptions = genres.map((g) => ({
    value: g.id,
    label: g.name,
  }));

  const platformOptions = platforms.map((p) => ({
    value: p.id,
    label: p.name,
  }));

  const updateScope = <K extends keyof DiscountScopeBase>(
    index: number,
    key: K,
    value: DiscountScopeBase[K],
  ) => {
    const copy = [...scopes];
    copy[index] = {
      ...copy[index],
      [key]: value,
    };
    onChange(copy);
  };

  const removeScope = (i: number) =>
    onChange(scopes.filter((_, idx) => idx !== i));

  return (
  <div className="scope-selector">
  <div className="scope-selector__header">
    <h4 className="scope-selector__title">Alcances del Descuento</h4>
    {scopes.length > 0 && (
      <span className="scope-selector__count">{scopes.length}</span>
    )}
  </div>

  {error && <div className="form-error scope-selector__error">{error}</div>}

  {scopes.length === 0 ? (
    <div className="scope-selector__empty">
      Aún no se han agregado alcances. Haz clic en "Agregar alcance" para definir dónde se aplicará este descuento.
    </div>
  ) : (
    <div className="scope-selector__list">
      {scopes.map((s, i) => (
        <div key={i} className="scope-item">
          <select
            className="scope-item__select"
            value={s.targetType}
            onChange={(e) =>
              updateScope(
                i,
                "targetType",
                e.target.value as
                  | "All"
                  | "Videogame"
                  | "Genre"
                  | "Platform",
              )
            }
            aria-label={`Tipo de alcance ${i + 1}`}
          >
            <option value="All">Todos los productos</option>
            <option value="Videogame">Videojuego específico</option>
            <option value="Genre">Género</option>
            <option value="Platform">Plataforma</option>
          </select>

          {s.targetType === "Genre" && (
            <SingleSelectField
              options={genreOptions}
              value={s.targetId}
              placeholder="Selecciona un género"
              onChange={(val) => updateScope(i, "targetId", val)}
            />
          )}

          {s.targetType === "Platform" && (
            <SingleSelectField
              options={platformOptions}
              value={s.targetId}
              placeholder="Selecciona una plataforma"
              onChange={(val) => updateScope(i, "targetId", val)}
            />
          )}

          <button
            className="scope-item__remove"
            onClick={() => removeScope(i)}
            aria-label={`Eliminar alcance ${i + 1}`}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  )}

  <button
    className="scope-selector__add-button"
    onClick={addScope}
    type="button"
  >
    <span className="scope-selector__add-icon">+</span>
    Agregar alcance
  </button>
</div>

  );
};
