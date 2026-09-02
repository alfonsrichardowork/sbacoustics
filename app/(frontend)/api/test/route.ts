import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server"
import getAllNavbarContent, { SerializedCategory } from "../../actions/get-all-navbar-content";
import { buildNavbarMenus, NavbarMenus } from "@/components/build-navbar-menu";

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


export async function GET() {
    try {
        const navbarData: SerializedCategory[] = await getAllNavbarContent('sbacoustics')
        const menus = buildNavbarMenus(navbarData)
        const x = getNavbarRoutes(menus)
        return NextResponse.json(x)
    } catch (error) {
    console.error("GET /api/test ERROR:", error)

        return NextResponse.json(
            { error: "Unable" },
            { status: 500 }
        )
    }
}
