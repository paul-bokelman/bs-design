import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction, useLoaderData, Link} from '@remix-run/react';
import {ArrowRight} from 'lucide-react';
import {ArrowLink} from '~/components';
import logo from '~/assets/bs-logo.png';
import galleryImage from '~/assets/gallery-image.jpg';

export const meta: MetaFunction = () => {
  return [{title: 'BS Design'}];
};

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
async function loadCriticalData({context}: LoaderFunctionArgs) {
  return {};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full mt-28">
      <img src={logo} alt="BS Logo" height={150} width={150} />
      <h1 className="text-primary uppercase text-sm font-medium">
        Beth-Shannon Design
      </h1>
      <p className="text-secondary text-center mt-2">
        Handmade, personalized, and custom designed products for you and your
        loved ones.
      </p>
      <ArrowLink to="/collections" className="mt-8">
        Explore Collections
      </ArrowLink>
      <div className="relative w-[calc(100vw+80px)] mt-24 grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="absolute w-full h-full bg-gradient-to-b from-black via-transparent to-black z-[2]" />
        {Array.from({length: 10}).map((_, index) => (
          <Link key={index} to="/collections" className="relative group">
            <img
              src={galleryImage}
              alt="Gallery"
              className="bg-secondary/10 rounded-md h-60 w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-full bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-8">
              <div className="flex flex-row items-center gap-2">
                <span className="text-primary text-lg font-medium">
                  Personalized Badge
                </span>
                <ArrowRight className="text-primary" size={20} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
