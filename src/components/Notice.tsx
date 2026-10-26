export function ErrorNotice({ children }: { children: React.ReactNode }) {
  return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">{children}</p>
}
