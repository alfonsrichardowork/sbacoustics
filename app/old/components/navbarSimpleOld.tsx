'use client'

import { getHref } from "@/app/(frontend)/utils/getHref"
import { usePathname } from "next/navigation"

function filterList(event: React.KeyboardEvent<HTMLInputElement>) {
  var search = event.currentTarget.value.toLowerCase()
  var results = document.getElementById('search-results')
  var items = document.getElementsByClassName('search-item')
  var visible = 0

  if (!results) {
    return
  }

  var i = 0
  for (i = 0; i < items.length; i++) {
    var item = items[i] as HTMLElement
    var text = item.innerHTML.toLowerCase()

    if (search !== '' && text.indexOf(search) > -1) {
      item.style.display = 'block'
      visible = visible + 1
    } else {
      item.style.display = 'none'
    }
  }

  if (search !== '' && visible > 0) {
    results.style.display = 'block'
  } else {
    results.style.display = 'none'
  }
}

function MenuItem({ label, first, children }: { label: string; first?: boolean; children?: React.ReactNode }) {
  return (
    <li className="legacy-menu-item">
      <a href="#" className="legacy-menu-link">
        {label}
        {children ? <span className="legacy-arrow" aria-hidden="true">{first ? 'v' : '>'}</span> : null}
      </a>
      {children ? <ul className="legacy-submenu">{children}</ul> : null}
    </li>
  )
}

export default function NavbarSimpleOld() {
    const pathname = usePathname();
    return (
        <header className="legacy-header">
        <nav className="legacy-nav" aria-label="Main navigation">
            <div className="legacy-nav-inner">
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

            <ul className="legacy-menu">
                <MenuItem label="Drivers" first>
                <MenuItem label="Woofer">
                    <MenuItem label="4 inch Woofer" />
                    <MenuItem label="6 inch Woofer" />
                    <MenuItem label="8 inch Woofer" />
                </MenuItem>
                <MenuItem label="Midrange">
                    <MenuItem label="4 inch Midrange" />
                    <MenuItem label="6 inch Midrange" />
                </MenuItem>
                <MenuItem label="Tweeter">
                    <MenuItem label="Dome Tweeters" />
                    <MenuItem label="Horn Tweeters" />
                </MenuItem>
                <MenuItem label="Subwoofer" />
                </MenuItem>
                <MenuItem label="Kits" first>
                <MenuItem label="2-Way Kits" />
                <MenuItem label="3-Way Kits" />
                <MenuItem label="DIY Kits">
                    <MenuItem label="Bookshelf Kits" />
                    <MenuItem label="Floorstanding Kits" />
                </MenuItem>
                </MenuItem>
                <MenuItem label="New Products" first>
                <MenuItem label="Latest Drivers" />
                <MenuItem label="Latest Kits" />
                <MenuItem label="Coming Soon" />
                </MenuItem>
                <li className="legacy-menu-item"><a className="legacy-menu-link" href="/old/technical">Technical</a></li>
                <li className="legacy-menu-item"><a     className="legacy-menu-link" href="/old/distributors">Distributors</a></li>
                <li className="legacy-menu-item"><a className="legacy-menu-link" href="/old/contact">Contact</a></li>
            </ul>

            <div className="legacy-search-wrap">
                <input id="site-search" className="legacy-search" type="text" placeholder="Search products" onKeyUp={filterList} />
                <div id="search-results" className="legacy-results" aria-live="polite">
                <a className="search-item" href="#">Woofer</a>
                <a className="search-item" href="#">Midrange</a>
                <a className="search-item" href="#">Tweeter</a>
                <a className="search-item" href="#">Subwoofer</a>
                <a className="search-item" href="#">2-Way Kits</a>
                <a className="search-item" href="#">3-Way Kits</a>
                <a className="search-item" href="#">DIY Kits</a>
                <a className="search-item" href="#">Latest Drivers</a>
                <a className="search-item" href="#">Latest Kits</a>
                <a className="search-item" href="#">Coming Soon</a>
                </div>
            </div>
            </div>
        </nav>
        </header>
    )
}
