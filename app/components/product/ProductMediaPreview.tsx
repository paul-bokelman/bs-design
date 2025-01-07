import type {ProductPreviewMediaFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

type ProductMediaPreviewProps = ProductPreviewMediaFragment;

export const ProductMediaPreview: React.FC<ProductMediaPreviewProps> = (
  media,
) => {
  if (!media) {
    return <div className="w-full h-full bg-secondary" />;
  }
  return (
    <Image
      alt={media.previewImage?.altText || 'Product Image'}
      aspectRatio="1/1"
      data={media.previewImage || undefined}
      key={media.id}
      sizes="(min-width: 1024px) 50vw, 100vw"
      className="h-full w-full rounded-lg"
    />
  );
};
