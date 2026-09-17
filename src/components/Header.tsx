export function Header() {
  return (
    <header className="text-center mb-10">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        STACKSLIP
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your Stack Overflow activity, itemized.
      </p>
      <p className="mt-5 text-xs text-muted-foreground/70">
        made by Antonio ·{" "}
        <a
          href="https://ko-fi.com/O4O416CKYY"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          buy him a coffee
        </a>
      </p>
    </header>
  );
}
