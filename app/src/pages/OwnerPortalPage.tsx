import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { api, type PortfolioProduct, type PortfolioResponse, type PortfolioStore } from '../lib/api';
import { formatMoney } from '../lib/money';

const TOKEN_KEY = 'fenix:adminToken';
type PortalTab = 'general' | 'tiendas' | 'productos' | 'finanzas' | 'trafico';

const DEMO_PORTFOLIO: PortfolioResponse = {
  finance: {
    revenueCents: 46000,
    cogsCents: 18200,
    feesCents: 1530,
    grossProfitCents: 27800,
    netProfitCents: 26270,
    margin: 0.604,
    paidOrders: 16,
  },
  visits: 2460,
  totalOrders: 27,
  paidOrders: 16,
  stores: [
    { id: 'fenix-dog-gear', slug: 'fenix-dog-gear', name: 'Fenix Dog Gear', domain: 'dogs.fenix.example', currency: 'USD', active: true, visits: 1840, totalOrders: 21, paidOrders: 12, revenueCents: 34200, netProfitCents: 19558, margin: 0.605, conversion: 0.0065 },
    { id: 'fenix-home', slug: 'fenix-home', name: 'Fenix Home', domain: 'home.fenix.example', currency: 'USD', active: true, visits: 620, totalOrders: 6, paidOrders: 4, revenueCents: 11800, netProfitCents: 6712, margin: 0.602, conversion: 0.0065 },
  ],
  products: [
    { id: 'demo-dog-cover', store_id: 'fenix-dog-gear', storeName: 'Fenix Dog Gear', slug: 'backseat-hammock-cover', name: 'Backseat Hammock Dog Seat Cover', price_cents: 3999, currency: 'USD', visits: 1840, totalOrders: 21, paidOrders: 12, revenueCents: 34200, conversion: 0.0065 },
    { id: 'demo-home-organizer', store_id: 'fenix-home', storeName: 'Fenix Home', slug: 'home-organizer', name: 'Home Organizer', price_cents: 2999, currency: 'USD', visits: 390, totalOrders: 4, paidOrders: 3, revenueCents: 8700, conversion: 0.0077 },
    { id: 'demo-lamp', store_id: 'fenix-home', storeName: 'Fenix Home', slug: 'portable-lamp', name: 'Portable Lamp', price_cents: 3100, currency: 'USD', visits: 230, totalOrders: 2, paidOrders: 1, revenueCents: 3100, conversion: 0.0043 },
  ],
  traffic: {
    bySource: [
      { storeId: 'fenix-dog-gear', source: 'tiktok', visits: 980 },
      { storeId: 'fenix-dog-gear', source: 'pinterest', visits: 420 },
      { storeId: 'fenix-home', source: 'instagram', visits: 180 },
      { storeId: 'fenix-home', source: 'direct', visits: 260 },
    ],
    byCampaign: [
      { storeId: 'fenix-dog-gear', campaign: 'lanzamiento', visits: 640 },
      { storeId: 'fenix-home', campaign: 'verano', visits: 320 },
    ],
  },
};

function money(cents: number): string {
  return formatMoney(cents, 'USD', 'es-US');
}

export function OwnerPortalPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) ?? '');
  const [demo, setDemo] = useState(false);
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [tab, setTab] = useState<PortalTab>('general');
  const [storeFilter, setStoreFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    let active = true;
    api.adminPortfolio(token)
      .then((portfolio) => {
        if (active) setData(portfolio);
      })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem(TOKEN_KEY);
        setToken('');
        setError('La sesión no es válida o la API todavía no está conectada.');
      });
    return () => { active = false; };
  }, [token]);

  function enterDemo() {
    setDemo(true);
    setData(DEMO_PORTFOLIO);
  }

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      const result = await api.adminLogin(email, password);
      localStorage.setItem(TOKEN_KEY, result.token);
      setToken(result.token);
      setDemo(false);
    } catch {
      setError('No se pudo iniciar sesión. Puedes abrir el centro de control en modo demo.');
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
    setDemo(false);
    setData(null);
  }

  if (!data) {
    return (
      <div className="portal-login">
        <div className="portal-login__card">
          <p className="portal-kicker">FENIX / OWNER PORTAL</p>
          <h1>Tu centro de control</h1>
          <p>Una sola vista para controlar todas tus tiendas, productos, ventas, rentabilidad y campañas.</p>
          <form onSubmit={login}>
            <label htmlFor="portal-email">Correo</label>
            <input id="portal-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <label htmlFor="portal-password">Contraseña</label>
            <input id="portal-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            {error ? <p className="field-error">{error}</p> : null}
            <button className="portal-button portal-button--primary" type="submit">Entrar a mi portal</button>
          </form>
          <button className="portal-button portal-button--secondary" type="button" onClick={enterDemo}>
            Explorar portal demo
          </button>
          <a className="portal-login__store-link" href="#/">Ir a la tienda pública</a>
        </div>
      </div>
    );
  }

  const visibleStores = storeFilter === 'all' ? data.stores : data.stores.filter((store) => store.id === storeFilter);
  const visibleProducts = storeFilter === 'all' ? data.products : data.products.filter((product) => product.store_id === storeFilter);
  const visibleRevenue = visibleStores.reduce((sum, store) => sum + store.revenueCents, 0);
  const visibleProfit = visibleStores.reduce((sum, store) => sum + store.netProfitCents, 0);
  const visibleVisits = visibleStores.reduce((sum, store) => sum + store.visits, 0);
  const visibleOrders = visibleStores.reduce((sum, store) => sum + store.paidOrders, 0);
  const visibleGrossProfit = visibleStores.reduce((sum, store) => sum + store.revenueCents * store.margin, 0);
  const visibleSources = data.traffic.bySource.filter((row) => storeFilter === 'all' || row.storeId === storeFilter);
  const visibleCampaigns = data.traffic.byCampaign.filter((row) => storeFilter === 'all' || row.storeId === storeFilter);

  const tabs: { id: PortalTab; label: string }[] = [
    { id: 'general', label: 'Vista general' },
    { id: 'tiendas', label: 'Tiendas' },
    { id: 'productos', label: 'Productos' },
    { id: 'finanzas', label: 'Finanzas' },
    { id: 'trafico', label: 'Tráfico y campañas' },
  ];

  return (
    <div className="portal-shell">
      <aside className="portal-sidebar">
        <div className="portal-brand">FENIX<span>OS</span></div>
        <p className="portal-sidebar__caption">Owner workspace</p>
        <nav className="portal-nav" aria-label="Navegación del portal">
          {tabs.map((item) => (
            <button key={item.id} className={tab === item.id ? 'portal-nav__item portal-nav__item--active' : 'portal-nav__item'} type="button" onClick={() => setTab(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="portal-sidebar__bottom">
          <a href="#/">Ver tienda pública</a>
          <button type="button" onClick={logout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="portal-main">
        <header className="portal-topbar">
          <div>
            <p className="portal-kicker">CENTRO DE CONTROL</p>
            <h1>Tu portfolio</h1>
          </div>
          <div className="portal-actions">
            <label htmlFor="store-filter">Contexto</label>
            <select id="store-filter" value={storeFilter} onChange={(event) => setStoreFilter(event.target.value)}>
              <option value="all">Todas las tiendas</option>
              {data.stores.map((store) => <option key={store.id} value={store.id}>{store.name}</option>)}
            </select>
            {demo ? <span className="portal-demo-badge">MODO DEMO</span> : null}
          </div>
        </header>

        {demo ? <div className="portal-notice">Datos de ejemplo para comprobar la estructura multi-tienda. No representan ventas reales.</div> : null}

        {tab === 'general' ? (
          <section>
            <div className="portal-metric-grid">
              <Metric label="Ingresos" value={money(visibleRevenue)} detail={`${visibleOrders} pedidos pagados`} />
              <Metric label="Beneficio neto" value={money(visibleProfit)} detail="Después de COGS y comisiones" />
              <Metric label="Visitas" value={String(visibleVisits)} detail="Todas las fuentes" />
              <Metric label="Conversión" value={visibleVisits ? `${((visibleOrders / visibleVisits) * 100).toFixed(2)}%` : '0%'} detail="Pedidos / visitas" />
            </div>
            <div className="portal-section-grid">
              <Panel title="Tiendas activas">
                <StoreTable stores={visibleStores} />
              </Panel>
              <Panel title="Productos del portfolio">
                <ProductTable products={visibleProducts} />
              </Panel>
            </div>
          </section>
        ) : null}

        {tab === 'tiendas' ? <Panel title="Todas tus tiendas"><StoreTable stores={visibleStores} detailed /></Panel> : null}
        {tab === 'productos' ? <Panel title="Todos tus productos"><ProductTable products={visibleProducts} detailed /></Panel> : null}
        {tab === 'finanzas' ? (
          <Panel title="Finanzas del contexto seleccionado">
            <div className="portal-metric-grid portal-metric-grid--compact">
              <Metric label="Ingresos" value={money(visibleRevenue)} detail="Ventas pagadas" />
              <Metric label="Beneficio neto" value={money(visibleProfit)} detail="Estimación operativa" />
              <Metric label="Ticket medio" value={money(visibleOrders ? visibleRevenue / visibleOrders : 0)} detail="Por pedido pagado" />
              <Metric label="Margen bruto" value={visibleRevenue ? `${((visibleGrossProfit / visibleRevenue) * 100).toFixed(1)}%` : '0%'} detail="Antes de impuestos" />
            </div>
            <p className="portal-footnote">La rentabilidad real se calculará con el costo confirmado del proveedor, comisiones de pago y gastos que registres.</p>
          </Panel>
        ) : null}
        {tab === 'trafico' ? (
          <Panel title="Tráfico y campañas">
            <div className="portal-channel-grid">
              {visibleSources.length > 0 ? visibleSources.map((source) => (
                <Channel key={`${source.storeId}-${source.source}`} name={source.source ?? 'Sin fuente'} value={String(source.visits)} detail="visitas" />
              )) : <p className="portal-footnote">Todavía no hay visitas atribuidas para este contexto.</p>}
            </div>
            {visibleCampaigns.length > 0 ? <div className="portal-campaigns"><h3>Campañas</h3>{visibleCampaigns.map((campaign) => <div className="portal-campaign" key={`${campaign.storeId}-${campaign.campaign}`}><span>{campaign.campaign ?? 'Sin campaña'}</span><strong>{campaign.visits} visitas</strong></div>)}</div> : null}
            <p className="portal-footnote">Cada tienda enviará sus UTMs al portal. Podrás comparar red, campaña, anuncio, conversión y ventas atribuidas desde un mismo lugar.</p>
          </Panel>
        ) : null}
      </main>
    </div>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="portal-metric"><p>{label}</p><strong>{value}</strong><span>{detail}</span></article>;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="portal-panel"><h2>{title}</h2>{children}</section>;
}

function StoreTable({ stores, detailed = false }: { stores: PortfolioStore[]; detailed?: boolean }) {
  return <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Tienda</th><th>Visitas</th><th>Pedidos</th><th>Ingresos</th>{detailed ? <th>Beneficio</th> : null}</tr></thead><tbody>{stores.map((store) => <tr key={store.id}><td><strong>{store.name}</strong><small>{store.domain}</small></td><td>{store.visits}</td><td>{store.paidOrders}</td><td>{money(store.revenueCents)}</td>{detailed ? <td>{money(store.netProfitCents)}</td> : null}</tr>)}</tbody></table></div>;
}

function ProductTable({ products, detailed = false }: { products: PortfolioProduct[]; detailed?: boolean }) {
  return <div className="portal-table-wrap"><table className="portal-table"><thead><tr><th>Producto</th><th>Tienda</th><th>Pedidos</th><th>Ingresos</th>{detailed ? <th>Conversión</th> : null}</tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><strong>{product.name}</strong><small>{product.slug}</small></td><td>{product.storeName}</td><td>{product.paidOrders}</td><td>{money(product.revenueCents)}</td>{detailed ? <td>{(product.conversion * 100).toFixed(2)}%</td> : null}</tr>)}</tbody></table></div>;
}

function Channel({ name, value, detail }: { name: string; value: string; detail: string }) {
  return <article className="portal-channel"><strong>{name}</strong><span>{value}</span><small>{detail}</small></article>;
}
