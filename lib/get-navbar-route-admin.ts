import { NavbarMenus } from "@/components/build-navbar-menu";

export function getNavbarRoutes(menus: NavbarMenus): string[][] {
  const allRoutes = [
    ...menus.firstMenu,
    ...Object.values(menus.subMenuMapping).flat(),
    ...Object.values(menus.subSubMenuMapping).flat(),
    ...Object.values(menus.subSubSubMenuMapping).flat(),
    ...Object.values(menus.subSubSubSubMenuMapping).flat(),
  ]
    .map(item => item.href)
    .filter(
      (href): href is string =>
        !!href && !href.startsWith('/products/')
    );

  return menus.firstMenu.map(first => {
    return [
      ...new Set(
        allRoutes.filter(
          href =>
            href === first.href ||
            href.startsWith(`${first.href}/`)
        )
      ),
    ];
  });
}
