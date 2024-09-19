import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/layout';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {Button} from '~/components/input';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page'
      ? 'flex flex-col gap-4 justify-between flex-shrink-0 w-full pt-4 mt-4 text-secondary border-t border-secondary/30'
      : 'flex flex-col gap-2 justify-between flex-shrink-0 w-full pt-4 pb-8 mt-4 text-secondary border-t border-secondary/30';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <span className="text-secondary flex flex-row items-center gap-2">
        Total:
        {cart.cost?.subtotalAmount?.amount ? (
          <Money data={cart.cost?.subtotalAmount} />
        ) : (
          '-'
        )}
      </span>
      {/* <CartDiscounts discountCodes={cart.discountCodes} /> */}
      <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
    </div>
  );
}
function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <a href={checkoutUrl} target="_self">
      <Button size="sm">Continue to Checkout</Button>
    </a>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button>Remove</button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}
