import React from 'react';
import type {CollectionFilterFragment} from 'storefrontapi.generated';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  useLoaderData,
  type MetaFunction,
  Link,
  useNavigate,
  useLocation,
} from '@remix-run/react';
import {ProductPreview, ProductsFilter} from '~/components/products/';
import {Button} from '~/components/input';
import * as queries from '~/api';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BS Design | Products`}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const {storefront} = context;
  const handle = params.handle as string;
  const query = new URLSearchParams(request.url.split('?')[1]);

  const numberOfProducts = query.get('first')
    ? parseInt(query.get('first')!)
    : 12;

  const filters = query.getAll('filters').map((f) => JSON.parse(f));

  const [
    {collection},
    {collection: collectionCount},
    {collection: collectionFilter},
  ] = await Promise.all([
    storefront.query(queries.CollectionProducts, {
      variables: {
        handle,
        first: numberOfProducts,
        filters,
      },
    }),
    storefront.query(queries.CollectionTotalProducts, {variables: {handle}}),
    storefront.query(queries.CollectionFilters, {variables: {handle}}),
  ]);

  if (!collection || !collectionCount) {
    throw new Response('Not Found', {status: 404});
  }

  return {
    collection,
    filters: collectionFilter?.products.filters,
    totalProducts: collectionCount.products.nodes.length,
    handle: params.handle as string,
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Products() {
  const {collection, filters, totalProducts, handle} =
    useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = React.useState(false);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const currentParams = new URLSearchParams(location.search);

    if (currentParams.get('first')) {
      currentParams.set(
        'first',
        (parseInt(currentParams.get('first')!) + 12).toString(),
      );
    } else {
      currentParams.append('first', '24');
    }

    navigate(`${location.pathname}?${currentParams.toString()}`, {
      replace: true,
      preventScrollReset: true,
    });
  };

  React.useEffect(() => {
    setIsLoading(false);
  }, [collection]);

  if (collection.products.nodes.length === 0) {
    return (
      <div className="flex flex-col">
        <h1 className="text-primary capitalize">{handle} Collection</h1>
        <p className="text-secondary text-sm">
          Showing 0 of {totalProducts} products
        </p>

        <p className="text-secondary mt-12">
          This collection is empty, please try again later
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col">
        <h1 className="text-primary capitalize">{handle} Collection</h1>
        {filters && (
          <ProductsFilter
            filters={filters as CollectionFilterFragment['filters']}
          />
        )}
      </div>
      <p className="text-secondary text-sm -mb-2">
        Showing {collection.products.nodes.length} of {totalProducts} products
      </p>

      <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-x-6 gap-y-12">
        {collection.products.nodes.map((product) => (
          <ProductPreview
            key={product.id}
            collectionHandle={handle}
            product={product}
          />
        ))}
      </div>

      <div className="flex w-full justify-center items-center mt-12 mb-6">
        {collection.products.pageInfo.hasNextPage ? (
          <Button
            variant="primary"
            onClick={async () => await handleLoadMore()}
            disabled={!collection.products.pageInfo.hasNextPage || isLoading}
            loading={isLoading}
            loadingText="Loading..."
          >
            Load More
          </Button>
        ) : (
          <p className="text-secondary text-sm mb-4">
            Loaded {collection.products.nodes.length} of {totalProducts}{' '}
            products
          </p>
        )}
      </div>
    </div>
  );
}
