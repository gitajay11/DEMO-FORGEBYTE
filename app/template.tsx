// A template re-mounts on every navigation, so its CSS animation plays once
// per route change: a --bg-1 curtain wipes up while the page eases in.
// Reduced motion collapses both to an instant swap (globals.css).
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="curtain" aria-hidden="true" />
      <div className="page-enter">{children}</div>
    </>
  );
}
