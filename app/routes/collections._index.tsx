import React from 'react';
import {useLoaderData} from '@remix-run/react';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {CollectionCard} from '~/components';
import * as queries from '~/api';

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(queries.Collections, {
      variables: {
        first: 250,
      },
    }),
  ]);

  return {collections};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-0 mb-6">
      <h1 className="text-primary">Collections</h1>
      <p className="text-secondary text-sm mb-4">
        Showing {collections.nodes.length} of {collections.nodes.length}{' '}
        collections
      </p>

      {collections.nodes.length != 0 ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
          {collections.nodes.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <p className="text-secondary">
          No collections found, please try again later
        </p>
      )}
    </div>
  );
}
