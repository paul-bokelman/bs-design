import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';
import {ChevronLeftIcon} from 'lucide-react';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `Hydrogen | ${data?.policy.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return json({policy});
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2 my-8">
      <Link
        to="/policies"
        className="text-secondary flex flex-row gap-1 items-center"
      >
        <ChevronLeftIcon className="w-4 h-4" />
        <span className="text-sm">View All Policies</span>
      </Link>
      <h1 className="text-primary">{policy.title}</h1>
      <div
        className="text-secondary [&_h2]:text-secondary [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-4
        [&_p]:text-sm [&_p]:font-normal [&_p]:text-secondary/80 [&_h3]:my-4 [&_h3]:text-base
        [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-4 [&_ul] > p, h2, h3, ul [&_ul]:text-secondary/80 [&_table]:my-4"
        dangerouslySetInnerHTML={{__html: policy.body}}
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;
