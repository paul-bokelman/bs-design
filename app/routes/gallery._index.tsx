import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@remix-run/react';
import logo from '~/assets/bs-logo.png';

export const meta: MetaFunction = () => {
  return [{title: 'BS Design | Gallery'}];
};

export async function loader(args: LoaderFunctionArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context}: LoaderFunctionArgs) {
  return {};
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  return {};
}

export default function Homepage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full mt-28">
      <img src={logo} alt="BS Logo" height={32} width={32} />
      <h1 className="text-primary uppercase text-3xl font-bold">Gallery</h1>
      <p className="text-secondary text-center mt-2">
        View our latest projects and designs
      </p>
    </div>
  );
}
