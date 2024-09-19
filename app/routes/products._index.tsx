import React from 'react';
import {useLoaderData} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {Pill, ProductCard} from '~/components';

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: LoaderFunctionArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(PRODUCTS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  const [activePills, setActivePills] = React.useState<string[]>(['Glass']);

  const testPills = [
    {
      active: true,
      label: 'Glass',
    },
    {
      active: false,
      label: 'Fabrics',
    },
    {
      active: false,
      label: 'Ceramics',
    },
    {
      active: false,
      label: 'Wood',
    },
    {
      active: false,
      label: 'Metal',
    },
  ];

  const handlePillClick = (label: string) => {
    setActivePills((prev) =>
      prev.includes(label)
        ? prev.filter((pill) => pill !== label)
        : [...prev, label],
    );
    console.log(`Toggled pill: ${label}`);
  };

  return (
    <div>
      <h1 className="text-primary">Products</h1>
      <div className="flex flex-row gap-2 w-full overflow-x-scroll">
        {testPills.map((pill) => (
          <Pill
            key={pill.label}
            active={activePills.includes(pill.label)}
            label={pill.label}
            onClick={() => handlePillClick(pill.label)}
          />
        ))}
      </div>
      <p className="text-secondary text-sm my-4">Showing 4 of 120 products</p>
      <PaginatedResourceSection
        connection={collections}
        resourcesClassName="collections-grid"
      >
        {({node: collection, index}) => (
          <ProductCard
            category="Glass"
            title="Personalized Badge"
            numberOfOptions={4}
            price="19.99"
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

const PRODUCTS_QUERY = `#graphql
  fragment TestProduct on Collection {
    id
    handle
    products(first: 10) {
      edges {
        node {
          title
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }

  query StoreProducts(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...TestProduct
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;
