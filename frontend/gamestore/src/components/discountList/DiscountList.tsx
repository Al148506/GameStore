import "../../styles/discountList.css";
import type { DiscountListItem } from "types/discount/discount";
type Props = {
  data: DiscountListItem[];
  loading: boolean;
  onToggle: (id: string) => void;
};

export const DiscountList = ({ data, loading, onToggle }: Props) => {

  if (loading) {
    return (
      <div className="discount-list__loading">
        <div className="discount-list__spinner" />
        <p className="discount-list__loading-text">Cargando descuentos...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="discount-list__empty">
        <svg 
          className="discount-list__empty-icon" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
        <h3 className="discount-list__empty-title">No hay descuentos disponibles</h3>
        <p className="discount-list__empty-text">
          Comienza creando tu primer descuento o cupón promocional
        </p>
      </div>
    );
  }

  return (
    <div className="discount-list">
      <div className="discount-list__table-wrapper">
        <table className="discount-list__table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Fechas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(d => (
              <tr key={d.id}>
                <td>
                  <span className="discount-list__name">{d.name}</span>
                </td>
                <td>
                  <span 
                    className={`discount-list__type ${
                      d.type === "Seasonal" 
                        ? "discount-list__type--seasonal" 
                        : "discount-list__type--coupon"
                    }`}
                  >
                    {d.type === "Seasonal" ? "Temporada" : "Cupón"}
                  </span>
                </td>
                <td>
                  <span className="discount-list__value">
                    <svg 
                      className="discount-list__value-icon" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                      />
                    </svg>
                    {d.value}
                    {d.valueType === "Percentage" ? "%" : "$"}
                  </span>
                </td>
                <td>
                  <div className="discount-list__dates">
                    <div>
                      <span className="discount-list__date-label">Inicio: </span>
                      <span className="discount-list__date-value">
                        {new Date(d.startDate).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="discount-list__date-label">Fin: </span>
                      <span className="discount-list__date-value">
                        {new Date(d.endDate).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    className={`discount-list__status ${
                      d.isActive 
                        ? "discount-list__status--active" 
                        : "discount-list__status--inactive"
                    }`}
                  >
                    <span className="discount-list__status-dot" />
                    {d.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>
                  <div className="discount-list__actions">
                    <button 
                      className={`discount-list__action-btn ${
                        d.isActive 
                          ? "discount-list__action-btn--toggle-deactivate" 
                          : "discount-list__action-btn--toggle"
                      }`}
                      onClick={() => onToggle(d.id)}
                    >
                      {d.isActive ? "Desactivar" : "Activar"}
                    </button>
                    <button 
                      className="discount-list__action-btn discount-list__action-btn--edit"
                    >
                      Editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};