// apps/mobile/src/lib/money.ts
// All money is integer pesewas (100 pesewas = GHS 1), matching the Ivie ledger.

export type PriceType = 'fixed' | 'per_hour' | 'from';

/** Example fee config from the PRD. The real values will come from the API's fee config. */
export const FEES = {
  escrowFee: 300, // GHS 3 flat, paid by the buyer
  commissionBp: 1000, // 10% from the provider
};

export function ghs(pesewas: number): string {
  const cedis = pesewas / 100;
  return `GHS ${cedis.toLocaleString('en-GH', {
    minimumFractionDigits: pesewas % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function priceLabel(pesewas: number, type: PriceType): string {
  if (type === 'per_hour') return `${ghs(pesewas)} / hr`;
  if (type === 'from') return `from ${ghs(pesewas)}`;
  return ghs(pesewas);
}

export function breakdown(price: number) {
  const commission = Math.floor((price * FEES.commissionBp + 5000) / 10000);
  return {
    price,
    escrowFee: FEES.escrowFee,
    total: price + FEES.escrowFee,
    commission,
    providerNet: price - commission,
  };
}