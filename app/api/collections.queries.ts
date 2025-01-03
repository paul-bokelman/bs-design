const CollectionFragment = `#graphql
  fragment Collection on Collection {
    id
    handle
    description
    image {
      id
      altText
      url
      width
      height
    }
    title
    products(first: 250) {
      nodes {
        id
      }
    }
  }
` as const;

export const Collections = `#graphql
 query StoreCollections(
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
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
  ${CollectionFragment}
` as const;
