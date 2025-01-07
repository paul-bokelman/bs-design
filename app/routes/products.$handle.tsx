import {Suspense} from 'react';
import {defer, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {
  ProductFragment,
  ProductVariantFragment,
} from 'storefrontapi.generated';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
} from '@shopify/hydrogen';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {getVariantUrl} from '~/lib/variants';
import {
  ProductMediaPreview,
  ProductForm,
  ProductPrice,
} from '~/components/product';
import {ChevronLeftIcon} from 'lucide-react';
import * as query from '~/api';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BS Design | ${data?.product.title ?? ''}`}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({
  context,
  params,
  request,
}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(query.Product, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  const firstVariant = product.variants.nodes[0];
  const firstVariantIsDefault = Boolean(
    firstVariant.selectedOptions.find(
      (option: SelectedOption) =>
        option.name === 'Title' && option.value === 'Default Title',
    ),
  );

  if (firstVariantIsDefault) {
    product.selectedVariant = firstVariant;
  } else {
    // if no selected variant was returned from the selected options,
    // we redirect to the first variant's url with it's selected options applied
    if (!product.selectedVariant) {
      throw redirectToFirstVariant({product, request});
    }
  }

  return {product};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: LoaderFunctionArgs) {
  // In order to show which variants are available in the UI, we need to query
  // all of them. But there might be a *lot*, so instead separate the variants
  // into it's own separate query that is deferred. So there's a brief moment
  // where variant options might show as available when they're not, but after
  // this deffered query resolves, the UI will update.
  const variants = context.storefront
    .query(query.ProductVariants, {
      variables: {handle: params.handle!},
    })
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    variants,
  };
}

function redirectToFirstVariant({
  product,
  request,
}: {
  product: ProductFragment;
  request: Request;
}) {
  const url = new URL(request.url);
  const firstVariant = product.variants.nodes[0];

  return redirect(
    getVariantUrl({
      pathname: url.pathname,
      handle: product.handle,
      selectedOptions: firstVariant.selectedOptions,
      searchParams: new URLSearchParams(url.search),
    }),
    {status: 302},
  );
}

export default function Product() {
  const {product, variants} = useLoaderData<typeof loader>();

  const selectedVariant = useOptimisticVariant(
    product.selectedVariant,
    variants,
  );

  const {title, descriptionHtml, media} = product;

  return (
    <div className="w-full lg:h-[36rem] flex justify-center items-center mb-12 lg:mb-0">
      <div className="flex flex-col gap-6 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/collections"
          className="text-secondary flex flex-row gap-1 items-center"
        >
          <span className="text-sm">Collections / Wood / {title}</span>
        </Link>
        <div className="block lg:hidden">
          <ProductTitlePartial
            title={title}
            category="FABRICS"
            price={selectedVariant?.price}
            compareAtPrice={selectedVariant?.compareAtPrice}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center md:justify-start justify-center h-full md:h-full lg:h-[25rem]">
          <div className="flex flex-col md:flex-row items-center gap-2 h-full w-full lg:w-auto">
            {/* large screen size */}
            <div className="hidden md:flex flex-col gap-2 lg:h-full overflow-y-auto no-scrollbar rounded-md md:h-[30rem]">
              {media.edges.map((edge) => (
                <div key={edge.node.id} className="h-16 w-16">
                  <ProductMediaPreview {...edge.node} />
                </div>
              ))}
            </div>
            {/* <div className="block lg:hidden absolute h-[30rem] w-[calc(100%-96px)] bg-white rounded-lg" /> */}
            <div className="relative w-full md:h-[30rem] lg:h-full md:max-w-auto md:max-h-auto md:w-auto">
              <ProductMediaPreview {...media.edges[0].node} />
            </div>
            {/* below medium screen size */}
            <div className="flex mt-4 md:hidden flex-row gap-2 w-full overflow-x-auto rounded-md">
              <div className="flex flex-nowrap gap-2">
                {media.edges.map((edge) => (
                  <div key={edge.node.id} className="h-16 w-16 flex-shrink-0">
                    <ProductMediaPreview {...edge.node} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col h-full justify-start w-full lg:w-1/2">
            <div className="hidden lg:block text-left">
              <ProductTitlePartial
                title={title}
                category="FABRICS"
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />
            </div>
            <Suspense
              fallback={
                <ProductForm
                  product={product}
                  selectedVariant={selectedVariant}
                  variants={[]}
                />
              }
            >
              <Await
                errorElement="There was a problem loading product variants"
                resolve={variants}
              >
                {(data) => (
                  <ProductForm
                    product={product}
                    selectedVariant={selectedVariant}
                    variants={data?.product?.variants.nodes || []}
                  />
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
      {/* <div
        className="text-secondary"
        dangerouslySetInnerHTML={{__html: descriptionHtml}}
      /> */}
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const ProductTitlePartial = ({
  title,
  category,
  price,
  compareAtPrice,
}: {
  title: string;
  category: string;
  price: ProductVariantFragment['price'];
  compareAtPrice: ProductVariantFragment['compareAtPrice'];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="lg:hidden text-2xl my-0 text-primary font-medium">
        {title}
      </h1>
      <span className="text-secondary text-sm">{category}</span>
      <h1 className="hidden lg:block md:lg text-2xl my-0 text-primary font-medium">
        {title}
      </h1>
      <ProductPrice price={price} compareAtPrice={compareAtPrice} />
    </div>
  );
};
