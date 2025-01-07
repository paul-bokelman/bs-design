import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="text-secondary">
      {compareAtPrice ? (
        <div className="flex gap-2">
          {price ? <Money data={price} /> : null}
          <Money
            data={compareAtPrice}
            className="text-secondary-faded line-through"
          />
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
