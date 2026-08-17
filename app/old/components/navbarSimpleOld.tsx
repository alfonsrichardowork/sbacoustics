// 'use client'

// import { getHref } from "@/app/(frontend)/utils/getHref"
// import { usePathname } from "next/navigation"

// function filterList(event: React.KeyboardEvent<HTMLInputElement>) {
//   var search = event.currentTarget.value.toLowerCase()
//   var results = document.getElementById('search-results')
//   var items = document.getElementsByClassName('search-item')
//   var visible = 0

//   if (!results) {
//     return
//   }

//   var i = 0
//   for (i = 0; i < items.length; i++) {
//     var item = items[i] as HTMLElement
//     var text = item.innerHTML.toLowerCase()

//     if (search !== '' && text.indexOf(search) > -1) {
//       item.style.display = 'block'
//       visible = visible + 1
//     } else {
//       item.style.display = 'none'
//     }
//   }

//   if (search !== '' && visible > 0) {
//     results.style.display = 'block'
//   } else {
//     results.style.display = 'none'
//   }
// }

// function MenuItem({ label, first, href, children }: { label: string; first?: boolean; href?: string; children?: React.ReactNode }) {
//   return (
//     <li className="legacy-menu-item">
//       <a href={href} className="legacy-menu-link">
//         {label}
//         {children ? <span className="legacy-arrow" aria-hidden="true">{first ? 'v' : '>'}</span> : null}
//       </a>
//       {children ? <ul className="legacy-submenu">{children}</ul> : null}
//     </li>
//   )
// }

// export default function NavbarSimpleOld() {
//     const pathname = usePathname();
//     return (
//         <header className="legacy-header">
//         <nav className="legacy-nav" aria-label="Main navigation">
//             <div className="legacy-nav-inner">
//             <a
//                 href={`/old${getHref(pathname, '')}`}
//                 className="legacy-brand"
//             >
//                 <div className="legacy-brand-container">
//                     <img
//                         src={pathname.includes('sbaudience')
//                             ? '/images/sbaudience/logo_sbaudience.webp'
//                             : pathname.includes('sbautomotive')
//                             ? '/images/sbautomotive/logo_sbautomotive_black.webp'
//                             : '/images/sbacoustics/logo_sbacoustics.png'}
//                         className="legacy-brand-logo"
//                         alt={
//                             pathname.includes('sbaudience')
//                                 ? 'SB Audience Logo'
//                                 : pathname.includes('sbautomotive')
//                                 ? 'SB Automotive Logo'
//                                 : 'SB Acoustics Logo'
//                         }
//                         width={200}
//                         height={50}
//                         loading="eager"
//                     />
//                 </div>
//             </a>

//             <ul className="legacy-menu">
//                 <MenuItem label="Drivers" href="/old/drivers" first>
//                   <MenuItem label="Woofer">
//                       <MenuItem label="4 inch Woofer" />
//                       <MenuItem label="6 inch Woofer" />
//                       <MenuItem label="8 inch Woofer" />
//                   </MenuItem>
//                   <MenuItem label="Midrange">
//                       <MenuItem label="4 inch Midrange" />
//                       <MenuItem label="6 inch Midrange" />
//                   </MenuItem>
//                   <MenuItem label="Tweeter">
//                       <MenuItem label="Dome Tweeters" />
//                       <MenuItem label="Horn Tweeters" />
//                   </MenuItem>
//                   <MenuItem label="Subwoofer" />
//                   </MenuItem>
//                 <MenuItem label="Kits" href="/old/kits" first>
//                   <MenuItem label="2-Way Kits" />
//                   <MenuItem label="3-Way Kits" />
//                   <MenuItem label="DIY Kits">
//                     <MenuItem label="Bookshelf Kits" />
//                     <MenuItem label="Floorstanding Kits" />
//                   </MenuItem>
//                 </MenuItem>
//                 <MenuItem label="New Products" href="/old/new-products" first>
//                   <MenuItem label="Latest Drivers" />
//                   <MenuItem label="Latest Kits" />
//                   <MenuItem label="Coming Soon" />
//                 </MenuItem>
//                 <li className="legacy-menu-item"><a className="legacy-menu-link" href="/old/technical">Technical</a></li>
//                 <li className="legacy-menu-item"><a     className="legacy-menu-link" href="/old/distributors">Distributors</a></li>
//                 <li className="legacy-menu-item"><a className="legacy-menu-link" href="/old/contact">Contact</a></li>
//             </ul>

//             <div className="legacy-search-wrap">
//                 <input id="site-search" className="legacy-search" type="text" placeholder="Search products" onKeyUp={filterList} />
//                 <div id="search-results" className="legacy-results" aria-live="polite">
//                 <a className="search-item" href="/old/drivers/woofer">Woofer</a>
//                 <a className="search-item" href="/old/drivers/midrange">Midrange</a>
//                 <a className="search-item" href="/old/drivers/tweeter">Tweeter</a>
//                 <a className="search-item" href="/old/drivers/subwoofer">Subwoofer</a>
//                 <a className="search-item" href="/old/kits/2-way-kits">2-Way Kits</a>
//                 <a className="search-item" href="/old/kits/3-way-kits">3-Way Kits</a>
//                 <a className="search-item" href="/old/kits/diy-kits">DIY Kits</a>
//                 <a className="search-item" href="/old/new-products/latest-drivers">Latest Drivers</a>
//                 <a className="search-item" href="/old/new-products/latest-kits">Latest Kits</a>
//                 <a className="search-item" href="/old/new-products/coming-soon">Coming Soon</a>
//                 </div>
//             </div>
//             </div>
//         </nav>
//         </header>
//     )
// }







/**
 * Legacy navbar — no Tailwind, no CSS classes, no modern CSS features.
 * Every style is an inline style object so it renders on very old Safari.
 * Hover / open states are handled in JavaScript because inline styles
 * cannot express :hover.
 */
"use client"
import getAllNavbarContent, { SerializedCategory } from "@/app/(frontend)/actions/get-all-navbar-content";
import getAllNewProducts from "@/app/(frontend)/actions/get-all-new-products";
import { getHref } from "@/app/(frontend)/utils/getHref";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

export interface NewProduct {
  productId: string;
  image_url: string;
  name: string;
  href: string;
  navbarNotes: string;
}

export type MenuNode = {
  title: string;
  href: string;
  isNew?: boolean;
  image?: string;
  navbarNotes?: string;
  children?: MenuNode[];
};

function newProductToMenuNode(product: NewProduct): MenuNode {
  return {
    title: product.name,
    href: product.href,
    isNew: true,
    image: product.image_url,
    navbarNotes: product.navbarNotes,
  };
}

function toMenuNode(category: SerializedCategory): MenuNode {
  const products: MenuNode[] = (category.products ?? []).map((product) => ({
    title: product.name,
    href: `/old/products/${product.slug}`,
    isNew: product.isNewProduct,
    image: product.cover_img_url ?? undefined,
  }));

  return {
    title: category.displayName || category.name,
    href: `/categories/${category.slug}`,
    children: [...category.children.map(toMenuNode), ...products],
  };
}

const TOP_LINKS: MenuNode[] = [
  { title: "Technical", href: "/technical" },
  { title: "Distributors", href: "/distributors" },
  { title: "Contact", href: "/contact" },
];

function flattenNodes(nodes: MenuNode[]): MenuNode[] {
  return nodes.reduce<MenuNode[]>((items, node) => {
    items.push(node);
    if (node.children) items.push(...flattenNodes(node.children));
    return items;
  }, []);
}

/* --------------------------------- colors -------------------------------- */

const RED = "#e6001b";
const TEXT = "#000000";
const WHITE = "#ffffff";
const BORDER = "#708090";
const LINE = "#d7dce0";

/* --------------------------------- styles -------------------------------- */

const headerStyle: CSSProperties = {
  background: WHITE,
  borderBottom: "2px solid #3f3f46",
  color: TEXT,
  fontFamily: "Arial, Helvetica, sans-serif",
  position: "relative",
  zIndex: 10,
  boxShadow: "0 1px 6px rgba(0,0,0,0.12)",
};

const navInnerStyle: CSSProperties = {
  margin: "0 auto",
  maxWidth: 1280,
  minHeight: 72,
  padding: "12px 24px",
  boxSizing: "border-box",
  display: "block",
  width: "100%",
};

const rowStyle: CSSProperties = {
  display: "table",
  width: "100%",
  tableLayout: "fixed",
};

const cellStyle: CSSProperties = {
  display: "table-cell",
  verticalAlign: "middle",
};

const brandLogoStyle: CSSProperties = {
  cursor: "pointer",
  maxWidth: 150,
  height: 32,
  position: "relative",
  zIndex: 101,
  display: "block",
};

const menuStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  whiteSpace: "nowrap",
  textAlign: "center",
};

const menuItemStyle: CSSProperties = {
  position: "relative",
  listStyle: "none",
  display: "inline-block",
  verticalAlign: "middle",
};

function menuLinkStyle(hovered: boolean, small?: boolean): CSSProperties {
  return {
    background: WHITE,
    border: "1px solid transparent",
    color: hovered ? RED : TEXT,
    display: "block",
    fontSize: 14,
    lineHeight: "20px",
    padding: small ? "9px 12px" : "12px 13px",
    textDecoration: "none",
    whiteSpace: "nowrap",
    cursor: "pointer",
  };
}

const arrowStyle: CSSProperties = {
  color: RED,
  fontWeight: "bold",
  marginLeft: 14,
};

const newTagStyle: CSSProperties = {
  color: RED,
  fontSize: 11,
  fontWeight: "bold",
  paddingLeft: 8,
};

function submenuStyle(depth: number): CSSProperties {
  return {
    background: WHITE,
    border: "1px solid " + BORDER,
    listStyle: "none",
    margin: 0,
    minWidth: 190,
    padding: "4px 0",
    position: "absolute",
    left: depth === 0 ? 0 : "100%",
    top: depth === 0 ? "100%" : -1,
    zIndex: 20,
    textAlign: "left",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  };
}

/* ------------------------------ dropdown item ----------------------------- */

function DropdownItem({ node, depth }: { node: MenuNode; depth: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!(node.children && node.children.length > 0);

  return (
    <li
      style={menuItemStyle}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <a
        href={node.href}
        style={menuLinkStyle(open, depth > 0)}
        onFocus={() => setOpen(true)}
      >
        {node.title}
        {node.isNew ? <span style={newTagStyle}>NEW</span> : null}
        {hasChildren ? <span style={arrowStyle}>{depth === 0 ? "v" : ">"}</span> : null}
      </a>
      {hasChildren && open ? (
        <ul style={submenuStyle(depth)}>
          {node.children!.map((child, i) => (
            <DropdownItem key={child.title + i} node={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function PlainItem({ node }: { node: MenuNode }) {
  const [hover, setHover] = useState(false);
  return (
    <li style={menuItemStyle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <a href={node.href} style={menuLinkStyle(hover)}>
        {node.title}
      </a>
    </li>
  );
}

/* --------------------------------- search --------------------------------- */

function SearchBox({ items, full }: { items: MenuNode[]; full?: boolean }) {
  const [term, setTerm] = useState("");
  const [focused, setFocused] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(-1);

  const query = term.toLowerCase();
  const results =
    query === ""
      ? []
      : items.filter((item) => item.title.toLowerCase().indexOf(query) > -1).slice(0, 12);

  return (
    <div style={{ position: "relative", width: full ? "100%" : 210 }}>
      <label htmlFor="legacy-search" style={{ display: "block", fontSize: 12, marginBottom: 3 }}>
        Search products
      </label>
      <input
        id="legacy-search"
        type="text"
        value={term}
        autoComplete="off"
        onChange={(e) => setTerm(e.currentTarget.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 150)}
        style={{
          background: WHITE,
          border: "1px solid " + (focused ? RED : BORDER),
          boxSizing: "border-box",
          color: "#20262e",
          fontSize: 14,
          padding: "9px 10px",
          width: "100%",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      />
      {results.length > 0 && focused ? (
        <div
          style={{
            background: WHITE,
            border: "1px solid " + BORDER,
            left: 0,
            right: 0,
            maxHeight: 250,
            overflowY: "auto",
            position: "absolute",
            zIndex: 30,
          }}
        >
          {results.map((item, i) => (
            <a
              key={item.href + i}
              href={item.href}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(-1)}
              style={{
                borderBottom: "1px solid " + LINE,
                color: hoverIndex === i ? RED : TEXT,
                display: "block",
                padding: "9px 10px",
                textDecoration: "none",
                fontSize: 14,
              }}
            >
              {item.title}
              {item.isNew ? <span style={newTagStyle}>NEW</span> : null}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* ------------------------------- mobile menu ------------------------------ */

function MobileNode({ node, depth }: { node: MenuNode; depth: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = !!(node.children && node.children.length > 0);

  return (
    <div
      style={{
        borderLeft: depth > 0 ? "2px solid " + RED : "none",
        paddingLeft: depth > 0 ? 10 : 0,
        background: depth > 0 ? "#f5f5f5" : "transparent",
      }}
    >
      {hasChildren ? (
        <div
          onClick={() => setOpen(!open)}
          style={{
            cursor: "pointer",
            padding: "10px 8px",
            fontSize: 15,
            borderBottom: "1px solid " + LINE,
            color: open ? RED : TEXT,
          }}
        >
          {node.title}
          <span style={{ float: "right", color: RED, fontWeight: "bold" }}>{open ? "-" : "+"}</span>
        </div>
      ) : (
        <a
          href={node.href}
          style={{
            display: "block",
            padding: "10px 8px",
            fontSize: 15,
            textDecoration: "none",
            color: TEXT,
            borderBottom: "1px solid " + LINE,
          }}
        >
          {node.title}
          {node.isNew ? <span style={newTagStyle}>NEW</span> : null}
        </a>
      )}
      {hasChildren && open ? (
        <div>
          <a
            href={node.href}
            style={{
              display: "block",
              background: RED,
              color: WHITE,
              textAlign: "center",
              padding: 6,
              margin: "6px 8px",
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Show All {node.title}
          </a>
          {node.children!.map((child, i) => (
            <MobileNode key={child.title + i} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

/* --------------------------------- navbar --------------------------------- */

export default function NavbarLegacy() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<SerializedCategory[]>([])
  const [newProducts, setnewProductsMenu] = useState<NewProduct[]>([])
  const [newKits, setnewKitsMenu] = useState<NewProduct[]>([])
  const pathname = usePathname()
  useEffect(() => {
    const fetchData = async () => {
      try {
        const navbarData: SerializedCategory[] = await getAllNavbarContent(pathname)
        const [tempNewKits, tempNewProduct]: [NewProduct[], NewProduct[]] = await getAllNewProducts(pathname)
        setCategories(navbarData)
        setnewProductsMenu(tempNewProduct)
        setnewKitsMenu(tempNewKits)
        const update = () => setIsDesktop(window.innerWidth >= 900);
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
      } catch (error) {
        console.error('Error fetching navbar products:', error);
      } finally {
        // setLoading(false);
      }
    }
    fetchData();  
  }, []);


  const menuNodes = useMemo(() => {
    const categoryNodes = categories.map(toMenuNode);
    const newProductNodes = [
      ...newProducts.map(newProductToMenuNode),
      ...newKits.map(newProductToMenuNode),
    ];

    return [
      ...categoryNodes,
      ...(newProductNodes.length > 0
        ? [{ title: "New Products", href: "/new-products", children: newProductNodes }]
        : []),
    ];
  }, [categories, newProducts, newKits]);
  const searchItems = useMemo(() => flattenNodes(menuNodes), [menuNodes]);

  return (
    <div style={headerStyle}>
      <div style={navInnerStyle}>
        <div style={rowStyle}>
          {/* brand */}
          <div style={{ ...cellStyle, width: "25%" }}>
            <a
              href={`/old${getHref(pathname, '')}`}
              className="legacy-brand"
            >
                <div className="legacy-brand-container">
                    <img
                        src={pathname.includes('sbaudience')
                            ? '/images/sbaudience/logo_sbaudience.webp'
                            : pathname.includes('sbautomotive')
                            ? '/images/sbautomotive/logo_sbautomotive_black.webp'
                            : '/images/sbacoustics/logo_sbacoustics.png'}
                        className="legacy-brand-logo"
                        alt={
                            pathname.includes('sbaudience')
                                ? 'SB Audience Logo'
                                : pathname.includes('sbautomotive')
                                ? 'SB Automotive Logo'
                                : 'SB Acoustics Logo'
                        }
                        width={200}
                        height={50}
                        loading="eager"
                    />
                </div>
            </a>
          </div>

          {/* desktop menu */}
          {isDesktop ? (
            <div style={{ ...cellStyle, width: "50%", position: "relative", zIndex: 100 }}>
              <ul style={menuStyle}>
                {menuNodes.map((node, index) => (
                  <DropdownItem key={node.href + index} node={node} depth={0} />
                ))}
                {TOP_LINKS.map((link) => (
                  <PlainItem key={link.href} node={link} />
                ))}
              </ul>
            </div>
          ) : (
            <div style={{ ...cellStyle, width: "50%", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                  background: WHITE,
                  border: "1px solid " + BORDER,
                  color: TEXT,
                  cursor: "pointer",
                  fontSize: 14,
                  padding: "8px 12px",
                  fontFamily: "Arial, Helvetica, sans-serif",
                }}
              >
                {mobileOpen ? "Close" : "Menu"}
              </button>
            </div>
          )}

          {/* search */}
          <div style={{ ...cellStyle, width: "25%" }}>
            <SearchBox items={searchItems} />
          </div>
        </div>

        {/* mobile drawer */}
        {!isDesktop && mobileOpen ? (
          <div style={{ borderTop: "1px solid " + LINE, marginTop: 10, paddingTop: 6 }}>
            {menuNodes.map((node, index) => (
              <MobileNode key={node.href + index} node={node} depth={0} />
            ))}
            {TOP_LINKS.map((link) => (
              <MobileNode key={link.href} node={link} depth={0} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
