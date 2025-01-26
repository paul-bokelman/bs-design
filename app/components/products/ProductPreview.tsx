import type {CollectionProductFragment} from 'storefrontapi.generated';
import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import qs from 'query-string';
import {useVariantUrl} from '~/lib/variants';

type ProductPreviewProps = {
  collectionHandle: string;
  product: CollectionProductFragment;
};

export const ProductPreview: React.FC<ProductPreviewProps> = ({
  collectionHandle,
  product,
}) => {
  const variant = product.variants.nodes[0];
  const parsedURL = qs.parseUrl(
    useVariantUrl(product.handle, variant.selectedOptions),
  );

  const productURL = qs.stringifyUrl({
    url: parsedURL.url,
    query: {collection: collectionHandle, ...parsedURL.query},
  });

  return (
    <Link
      className="flex flex-col gap-2 group"
      key={product.id}
      prefetch="intent"
      to={productURL}
    >
      {product.featuredImage && (
        <Image
          alt={product.featuredImage.altText || product.title}
          aspectRatio="1/1"
          data={product.featuredImage}
          loading="eager"
          sizes="(min-width: 45em) 400px, 1dvw"
          className="rounded-md group-hover:shadow-lg group-hover:scale-[1.01] transition-all group-hover:opacity-80"
        />
      )}

      <div className="flex flex-col text-secondary mt-1">
        <span className="text-xs uppercase">{collectionHandle}</span>
        <h4 className="text-primary leading-none my-1 text-lg font-semibold">
          {product.title}
        </h4>
        <Money data={product.priceRange.minVariantPrice} />
      </div>
    </Link>
  );
};
