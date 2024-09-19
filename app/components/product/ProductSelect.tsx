import {type VariantOption} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {Pill} from '~/components';

interface ProductSelectProps {
  option: VariantOption;
}

export const ProductSelect: React.FC<ProductSelectProps> = ({option}) => {
  return (
    <div key={option.name} className="flex flex-col gap-2">
      <h5 className="text-secondary text-sm">{option.name}</h5>
      <div className="flex flex-row gap-2">
        {option.values.map(({value, isAvailable, isActive, to}) => {
          return (
            <Link
              key={option.name + value}
              prefetch="intent"
              preventScrollReset
              replace
              to={to}
            >
              <Pill active={isActive} label={value} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};
