import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside, CartLineItem, CartSummary} from '~/components/layout';
import cn from 'classnames';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const cartHasItems = cart?.totalQuantity! > 0;

  return (
    <div className="flex flex-col h-full">
      {!linesCount && <CartEmpty layout={layout} />}
      <div className="flex flex-col h-full">
        <div
          aria-labelledby="cart-lines"
          className="rounded-lg flex-grow overflow-y-auto"
        >
          <div
            className={cn({
              'flex flex-col h-full gap-4 pb-4': layout === 'aside',
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4':
                layout === 'page',
            })}
          >
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </div>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({}: {layout?: CartMainProps['layout']}) {
  const {close} = useAside();
  return (
    <div className="flex flex-col gap-2">
      <span className="text-lg text-primary">Your cart is empty</span>
      <p className="text-sm text-secondary">
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <Link
        className="text-sm text-secondary underline"
        to="/collections"
        onClick={close}
        prefetch="viewport"
      >
        Continue shopping →
      </Link>
    </div>
  );
}
