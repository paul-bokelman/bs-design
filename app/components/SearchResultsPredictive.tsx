import {Link, useFetcher, type Fetcher} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from './layout/Aside';
import {ArrowRight} from 'lucide-react';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <div className="flex flex-col gap-2" key="collections">
      <div className="flex flex-row items-center gap-2">
        <h5 className="text-primary font-medium">Collections</h5>
        <div className="flex-1 rounded-full h-[1px] bg-secondary/50" />
      </div>
      <div className="flex flex-col gap-4">
        {collections.map((collection) => {
          const colllectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <div className="flex flex-row gap-2 group items-center">
              <Link
                key={collection.id}
                className="flex flex-row gap-2"
                onClick={closeSearch}
                to={colllectionUrl}
              >
                <span className="text-secondary group-hover:text-primary transition-all">
                  {collection.title}
                </span>
              </Link>
              <ArrowRight className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 w-4 h-4 mr-8 text-secondary group-hover:text-primary" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <div className="predictive-search-result" key="pages">
      <h5>Pages</h5>
      <ul>
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={page.id}>
              <Link onClick={closeSearch} to={pageUrl}>
                <div>
                  <span>{page.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="flex flex-col gap-2 w-full" key="products">
      <div className="flex flex-row items-center gap-2">
        <h5 className="text-primary font-medium">Products</h5>
        <div className="flex-1 rounded-full h-[1px] bg-secondary/50" />
      </div>
      <div className="flex flex-col gap-4">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const image = product?.variants?.nodes?.[0].image;
          return (
            <div className="flex flex-row gap-2 items-center justify-between w-full group">
              <Link
                className="flex flex-row gap-2"
                key={product.id}
                to={productUrl}
                onClick={closeSearch}
              >
                {image && (
                  <Image
                    className="group-hover:scale-[1.02] transition-all"
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={50}
                    height={50}
                  />
                )}
                <div className="flex flex-col">
                  <p className="text-secondary font-semibold group-hover:text-primary transition-all">
                    {product.title}
                  </p>
                  <p className="text-secondary text-sm">
                    {product?.variants?.nodes?.[0].price && (
                      <Money data={product.variants.nodes[0].price} />
                    )}
                  </p>
                </div>
              </Link>
              <ArrowRight className="group-hover:opacity-100 opacity-0 transition-opacity duration-300 w-4 h-4 mr-8 text-secondary group-hover:text-primary" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  inputRef,
}: PartialPredictiveSearchResult<'queries', 'inputRef'>) {
  if (!queries.length) return null;

  return (
    <div className="predictive-search-result" key="queries">
      <h5>Queries</h5>
      <ul>
        {queries.map((suggestion) => {
          if (!suggestion) return null;

          return (
            <li className="predictive-search-result-item" key={suggestion.text}>
              <div
                role="presentation"
                onClick={() => {
                  if (!inputRef.current) return;
                  inputRef.current.value = suggestion.text;
                  inputRef.current.focus();
                }}
                dangerouslySetInnerHTML={{
                  __html: suggestion?.styledText,
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) {
    return null;
  }

  return (
    <p className="text-secondary text-sm">
      No results found for <q className="text-primary">{term.current}</q>
    </p>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}
