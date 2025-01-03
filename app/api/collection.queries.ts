/* --------------------------- COLLECTION PRODUCTS -------------------------- */

const CollectionProductMoneyFragment = `#graphql
  fragment CollectionProductMoney on MoneyV2 {
    amount
    currencyCode
  }
` as const;

const CollectionProductFragment = `#graphql
  fragment CollectionProduct on Product {
      id
      handle
      title
      featuredImage {
        id
        altText
        url
        width
        height
      }
      priceRange {
        minVariantPrice {
          ...CollectionProductMoney
        }
        maxVariantPrice {
          ...CollectionProductMoney
        }
      }
      variants(first: 1) {
        nodes {
          selectedOptions {
            name
            value
          }
        }
      }
    }
` as const;

export const CollectionProducts = `#graphql
  query CollectionProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $filters: [ProductFilter!]
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
        filters: $filters
      ) {
        nodes {
          ...CollectionProduct
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          startCursor
          endCursor
        }
      }
    }
  }
  ${CollectionProductMoneyFragment}
  ${CollectionProductFragment}
` as const;

/* -------------------------- TOTAL PRODUCTS COUNT -------------------------- */

export const CollectionTotalProducts = `#graphql
  query CollectionTotalProducts(
    $handle: String!
  ) {
    collection(handle: $handle) {
      products(first: 250) {
        nodes {
          id
        }
      }
    }
  }
` as const;

/* --------------------------------- FILTER --------------------------------- */

export const CollectionFilterFragment = `#graphql
  fragment CollectionFilter on ProductConnection {
    filters {
      id
      label
      type
      values {
        id
        label
        count
        input
      }
    }
  }
` as const;

export const CollectionFilters = `#graphql
  query CollectionFilters($handle: String!) {
    collection(handle: $handle) {
        products(first: 1) {
          ...CollectionFilter
      }
    }
  }
  ${CollectionFilterFragment}
` as const;
