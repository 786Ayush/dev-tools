import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">404</p>
      <h1 className="mt-4 text-4xl font-bold text-white">This page could not be found.</h1>
      <p className="mt-4 text-slate-300">
        The tool or page you are looking for may have moved or no longer exists.
      </p>
      <Link href="/" className="mt-6 rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-950 hover:bg-cyan-400">
        Return home
      </Link>
    </div>
  );
}
