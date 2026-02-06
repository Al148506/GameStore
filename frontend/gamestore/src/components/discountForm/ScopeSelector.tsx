import type { DiscountScopeDto } from "../../types/discount/discount";
import "../../styles/scopeSelector.css";
import { SingleSelectField } from "../common/SingleSelectField";

type Props = {
  scopes?: DiscountScopeDto[];
  genres: { id: number; name: string }[];
  platforms: { id: number; name: string }[];
  onChange: (scopes: DiscountScopeDto[]) => void;
};

export const ScopeSelector = ({
   scopes = [],
  genres,
  platforms,
  onChange,
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

  const updateScope = <K extends keyof DiscountScopeDto>(
    index: number,
    key: K,
    value: DiscountScopeDto[K],
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
        <h4 className="scope-selector__title">Discount Scopes</h4>
        {scopes.length > 0 && (
          <span className="scope-selector__count">{scopes.length}</span>
        )}
      </div>

      {scopes.length === 0 ? (
        <div className="scope-selector__empty">
          No scopes added yet. Click "Add Scope" to define where this discount
          applies.
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
                aria-label={`Scope ${i + 1} target type`}
              >
                <option value="All">All Products</option>
                <option value="Videogame">Specific Videogame</option>
                <option value="Genre">Genre</option>
                <option value="Platform">Platform</option>
              </select>

              {s.targetType === "Genre" && (
                <SingleSelectField
                  options={genreOptions}
                  value={s.targetId}
                  placeholder="Select a genre"
                  onChange={(val) => updateScope(i, "targetId", val)}
                />
              )}

              {s.targetType === "Platform" && (
                <SingleSelectField
                  options={platformOptions}
                  value={s.targetId}
                  placeholder="Select a platform"
                  onChange={(val) => updateScope(i, "targetId", val)}
                />
              )}

              <button
                className="scope-item__remove"
                onClick={() => removeScope(i)}
                aria-label={`Remove scope ${i + 1}`}
              >
                Remove
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
        Add Scope
      </button>
    </div>
  );
};
