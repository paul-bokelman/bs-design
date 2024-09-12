import {Link} from '@remix-run/react';
import {CollectionFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

interface ProductCardProps {
    collection: CollectionFragment;
    title: string;
    category: string;
    numberOfOptions: number;
    price: string;
    index: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({collection, category, numberOfOptions, price, index}) => {
    return (
      <Link
        className='group'
        key={collection.id}
        to={`/collections/${collection.handle}`}
        prefetch="intent"
      >
        {collection?.image && (
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            className="rounded-xl group-hover:scale-[1.01] transition-all"
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
          />
        )}
        <div className="mt-4 flex flex-col">
            <span className="text-secondary text-sm uppercase">{category}</span>
            <h5 className="text-primary text-lg font-medium">Personalized Badge</h5>
            <div className="flex items-center">
              <span className="text-secondary text-sm">${price}</span>
              <span className="text-secondary mx-1">•</span>
              <span className="text-secondary text-sm">{numberOfOptions} options</span>
            </div>
        </div>
      </Link>
    );
  }
