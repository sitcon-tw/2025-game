/*
 * React Layout Template by naruko_hstk
 * https://naruko.studio/members/naruko_hstk
 * features:
 * 1. main content already set margin x(left and right) auto
 * 2. header set height 16rem
 * 3. footer set height 16rem and fixed at bottom
 * When you need to set layout for child pages just copy to child folder and rename to layout.tsx
 * Don't forget to rename function to YourFolderNameLayout
 */
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="h-16"></header>
      <main className="mx-auto">{children}</main>
      <footer className="fixed bottom-0 h-16"></footer>
    </>
  );
}
