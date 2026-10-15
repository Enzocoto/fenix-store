import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { CartProvider } from './state/CartProvider';
import { I18nProvider } from './i18n/I18nProvider';

function renderApp() {
  return render(
    <I18nProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </I18nProvider>,
  );
}

function go(route: string) {
  window.location.hash = route;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
}

async function addToCart() {
  go('/product');
  const buttons = await screen.findAllByRole('button', { name: /add to cart/i });
  return buttons[0];
}

describe('store', () => {
  it('shows the home page by default', () => {
    renderApp();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/cleaner back seat/i);
  });

  it('switches between English and Spanish', async () => {
    const user = userEvent.setup();
    renderApp();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/cleaner back seat/i);

    const group = screen.getByRole('group', { name: /language/i });
    await user.click(within(group).getByRole('button', { name: 'ES' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/asiento siempre limpio/i);
  });

  it('navigates to the product page on hash change', async () => {
    renderApp();
    go('/product');
    expect(await screen.findByRole('heading', { level: 1, name: /backseat hammock cover/i })).toBeInTheDocument();
  });

  it('opens the separate owner portal with multi-store demo data', async () => {
    const user = userEvent.setup();
    renderApp();
    go('/portal');
    await user.click(await screen.findByRole('button', { name: /explorar portal demo/i }));
    expect(screen.getByRole('heading', { level: 1, name: /tu portfolio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /productos/i })).toBeInTheDocument();
    expect(screen.getAllByText(/fenix dog gear/i).length).toBeGreaterThan(0);
  });

  it('adds an item to the cart from the product page', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(await addToCart());

    expect(screen.getByRole('status')).toHaveTextContent(/added to cart/i);
    expect(screen.getByLabelText(/view cart, 1 item/i)).toBeInTheDocument();
  });

  it('updates quantity and subtotal on the cart page, then empties', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(await addToCart());

    go('/cart');
    expect((await screen.findAllByText(/\$39\.99/)).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /increase quantity/i }));
    expect(screen.getAllByText(/\$79\.98/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /^remove$/i }));
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it('requires shipping fields before a demo checkout', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(await addToCart());

    go('/checkout');
    await user.click(await screen.findByRole('button', { name: /place demo order/i }));
    expect(screen.getByText(/please enter a name/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText('Full name'), 'Jane Rider');
    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText(/street address/i), '1 Main St');
    await user.type(screen.getByLabelText('City'), 'Austin');
    await user.type(screen.getByLabelText('State'), 'TX');
    await user.type(screen.getByLabelText(/zip code/i), '78701');
    await user.click(screen.getByRole('button', { name: /place demo order/i }));

    expect(await screen.findByRole('heading', { level: 1 })).toHaveTextContent(/order demo-/i);
  });

  it('does not invent reviews or discount claims', async () => {
    renderApp();
    go('/product');
    await screen.findAllByRole('button', { name: /add to cart/i });
    expect(screen.queryByText(/best seller #1/i)).toBeNull();
    expect(screen.queryByText(/\bverified buyer\b/i)).toBeNull();
  });
});
