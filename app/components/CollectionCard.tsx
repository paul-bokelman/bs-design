import {Link} from '@remix-run/react';
import {CollectionFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

interface CollectionCardProps {
  collection: CollectionFragment;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({collection}) => {
  return (
    <Link
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="bg-secondary/10 rounded-md border border-secondary/10 px-4 py-2 h-32"
    >
      {/* {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          className="rounded-xl group-hover:scale-[1.01] transition-all"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
        />
      )} */}
      <span className="text-secondary text-sm uppercase">
        {collection.title}
      </span>
    </Link>
  );
};
