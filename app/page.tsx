import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex items-center justify-center h-full">
      <Link className="text-blue-500 underline" href="/studio">
        Go to Studio
      </Link>
    </main>
  )
}
