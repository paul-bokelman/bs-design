import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {ArrowLink} from '~/components';

export async function loader({context}: LoaderFunctionArgs) {
  const data = await context.storefront.query(POLICIES_QUERY);
  const policies = Object.values(data.shop || {});

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return json({policies});
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-2 my-8">
      <h1 className="text-primary">Policies</h1>
      <p className="text-secondary/80">
        Read our policies to learn more about how we handle your data and
        orders.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {policies
          .filter((p) => p != null)
          .map((policy) => (
            <ArrowLink key={policy.id} to={`/policies/${policy.handle}`}>
              {policy.title}
            </ArrowLink>
          ))}
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;
