import {Link} from '@remix-run/react';
import {ProductItemFragment} from 'storefrontapi.generated';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

interface ProductCardProps {
  product: ProductItemFragment;
}

export const ProductCard: React.FC<ProductCardProps> = ({product}) => {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <Link key={product.id} to={variantUrl} prefetch="intent">
      <div className="w-full">
        {product?.featuredImage && (
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            className="rounded-xl group-hover:scale-[1.01] transition-all"
            data={product.featuredImage}
            loading="eager"
          />
        )}
      </div>
      <div className="mt-4 flex flex-col">
        <span className="text-secondary text-sm uppercase">
          {product.title}
        </span>
        <h5 className="text-primary text-lg font-medium">{product.title}</h5>
        <div className="flex items-center">
          <span className="text-secondary text-sm">
            <Money data={product.priceRange.minVariantPrice} />
          </span>
          <span className="text-secondary mx-1">•</span>
          <span className="text-secondary text-sm">4 options</span>
        </div>
      </div>
    </Link>
  );
};
