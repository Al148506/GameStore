// VideogameCard.tsx
import React from "react";
import type { VideogameDto } from "../../types/videogame/videogame";
import Button from "@components/common/Button";
import "../../styles/videogameCard.css";
import { useCart } from "../../hooks/useCart";
import {
  AddToCartIcon,
  RemoveFromCartIcon,
  ClearCartIcon,
  DeleteIcon,
  EditIcon,
} from "../cart/Icons";
import { useAuth } from "@hooks/useAuth";

interface VideogameCardProps {
  game: VideogameDto;
  onCardClick: (game: VideogameDto) => void;
  onEdit: (game: VideogameDto) => void;
  onDelete: (id: number) => void;
}

export function VideogameCard({
  game,
  onCardClick,
  onEdit,
  onDelete,
}: VideogameCardProps) {
  const { addItem, removeItem, cart } = useCart();
  const { isAdmin } = useAuth();
  const isProductInCart = React.useMemo(() => {
    return cart?.items?.some((item) => item.videogameId === game.id) ?? false;
  }, [cart, game.id]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await addItem({
      videogameId: game.id,
      quantity: 1,
      unitPrice: game.price,
    });
  };
  return (
    <div className="videogame-card" onClick={() => onCardClick(game)}>
      {/* Badge de stock */}
      {game.stock === 0 && <div className="stock-badge">Sin stock</div>}
      {/* Imagen con overlay gradiente */}
      <div className="game-card-image-wrapper">
        <img src={game.imageUrl} alt={game.name} className="game-card-image" />
        <div className="image-overlay"></div>
      </div>

      <div className="game-card-content">
        <h2 className="game-title">{game.name}</h2>

        <div className="game-price-section">
          <span className="game-price">${game.price.toFixed(2)} </span>
          <span className="price-label">USD</span>
        </div>
      </div>

      <div className="card-actions">
        {game.stock === 0 ? (
          <Button
            text={
              <>
                <ClearCartIcon /> Agotado
              </>
            }
            variant="disabled"
            onClick={() => console.log("")}
          />
        ) : (
          <>
            <Button
              text={
                isProductInCart ? (
                  <>
                    <RemoveFromCartIcon></RemoveFromCartIcon>Remover
                  </>
                ) : (
                  <>
                    <AddToCartIcon></AddToCartIcon>Agregar
                  </>
                )
              }
              variant={isProductInCart ? "delete" : "add"}
              onClick={
                isProductInCart
                  ? () => {
                      const cartItem = cart?.items.find(
                        (item) => item.videogameId === game.id,
                      );
                      if (cartItem) removeItem(cartItem.id);
                    }
                  : handleAddToCart
              }
            />
          </>
        )}
        {isAdmin && (
          <div className="card-admin-actions">
            <Button
              text={
                <>
                  <EditIcon /> Editar
                </>
              }
              variant="edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(game);
              }}
            />
            <Button
              text={
                <>
                  <DeleteIcon /> Eliminar
                </>
              }
              variant="delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(game.id);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
