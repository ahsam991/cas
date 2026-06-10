export const PRIMARY_NAV = [
  { href: "/", label: "Home", startsWith: false },
  { href: "/interview", label: "Interview", startsWith: true },
  { href: "/about", label: "About", startsWith: false },
  { href: "/contact", label: "Contact", startsWith: false },
] as const;

export function isNavActive(pathname: string, href: string, startsWith = true) {
  if (startsWith) return pathname === href || pathname.startsWith(`${href}/`);
  return pathname === href;
}
