type Props = {
  enabled: boolean;
  code?: string;
  maxUses?: number;
  onChange: (data: { code: string; maxUses?: number }) => void;
};

export const CouponFields = ({ enabled, onChange }: Props) => {
  if (!enabled) return null;

  return (
    <div>
      <h4>Coupon</h4>
      <input
        placeholder="Code"
        onChange={e => onChange({ code: e.target.value })}
      />
      <input
        type="number"
        placeholder="Max uses"
        onChange={e => onChange({ code: "", maxUses: Number(e.target.value) })}
      />
    </div>
  );
};
