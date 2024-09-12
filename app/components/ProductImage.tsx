import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return <div className="w-full h-full bg-secondary" />;
  }
  return (
    <Image
      alt={image.altText || 'Product Image'}
      aspectRatio="1/1"
      data={image}
      key={image.id}
      className="h-full w-full rounded-lg"
    />
  );
}
