import { useI18n } from '../hooks/useI18n';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
}

export function QuantityStepper({ value, onChange, min = 1, max = 20, label }: QuantityStepperProps) {
  const { t } = useI18n();
  return (
    <div className="stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label={t('product.decreaseQty')}
        disabled={value <= min}
      >
        &minus;
      </button>
      <span className="stepper__value" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label={t('product.increaseQty')}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
