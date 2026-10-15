import { env } from '../env';

export interface SupplierOrderInput {
  orderId: string;
  productSlug: string;
  quantity: number;
  customer: { name?: string | null; email?: string | null };
  address?: Record<string, string>;
}

export interface SupplierResult {
  ok: boolean;
  provider: string;
  reference?: string;
  note?: string;
}

export interface SupplierAdapter {
  name: string;
  createOrder(input: SupplierOrderInput): Promise<SupplierResult>;
}

/**
 * Adaptador genérico. Se elige por SUPPLIER_PROVIDER.
 * Hoy son stubs honestos: no envían nada real. Cuando tengas la API del
 * proveedor y la clave en SUPPLIER_API_KEY, se implementa la llamada real aquí
 * sin tocar el resto del sistema.
 */
function makeStub(name: string): SupplierAdapter {
  return {
    name,
    async createOrder(input: SupplierOrderInput): Promise<SupplierResult> {
      if (!env.supplierApiKey) {
        return { ok: false, provider: name, note: 'SUPPLIER_API_KEY no configurada' };
      }
      return {
        ok: false,
        provider: name,
        note: `Adaptador "${name}" pendiente de implementar con la API real (pedido ${input.orderId})`,
      };
    },
  };
}

const adapters: Record<string, SupplierAdapter> = {
  none: {
    name: 'none',
    async createOrder(): Promise<SupplierResult> {
      return { ok: false, provider: 'none', note: 'Sin proveedor configurado (SUPPLIER_PROVIDER=none)' };
    },
  },
  cjdropshipping: makeStub('cjdropshipping'),
  zendrop: makeStub('zendrop'),
};

export function supplier(): SupplierAdapter {
  return adapters[env.supplierProvider] ?? adapters.none;
}
