import type {CollectionFragment} from 'storefrontapi.generated';
import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {ArrowLink} from './ArrowLink';

interface CollectionCardProps {
  collection: CollectionFragment;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({collection}) => {
  return (
    <Link
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="relative group bg-secondary/10 rounded-xl overflow-hidden border border-secondary/10 hover:border-primary/30 min-h-32 h-full flex flex-row items-center transition-all"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          className="h-full group-hover:scale-[1.02] transition-all"
          data={collection.image}
          loading="eager"
        />
      )}
      <div className="absolute z-[2] bg-black/85 px-12 pt-20 pb-8 left-0 bottom-0 h-full w-full flex justify-center ">
        <div className="relative flex justify-between h-full">
          <div className="flex flex-col gap-2">
            <h3 className="text-primary font-bold text-xl uppercase">
              {collection.title}
            </h3>
            <p className="text-secondary text-sm">{collection.description}</p>
            <span className="absolute bottom-0 opacity-0 group-hover:opacity-100 text-primary transition-opacity">
              View Collection
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};
