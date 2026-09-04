
import '@/app/legacy/(sbacoustics)/about/about.css'
import SwiperCarouselAboutUsOld from '../../components/swipercarouselaboutusold';
import DOMPurify from 'isomorphic-dompurify'; 
import prismadb from "@/lib/prismadb";
import "@/app/css/styles.scss";

export default async function AboutUsPage() {
  const allData = await prismadb.brand.findFirst({
    where: {
      id: process.env.NEXT_PUBLIC_SB_ACOUSTICS_ID
    },
    select: {
      aboutUsImages: true,
      sbe_desc: true,
      brand_desc: true,
      mission_values_desc: true
    }
  })

  if(!allData) {
    return null
  }
  return (
    <>
      <div style={{ backgroundColor: "#ffffff" }}>


      <section className="about-us-section-parent">
        <div>
          <div className="about-us-section-parent-div">
            <div className="about-us-section-child-grid">
              <div className="about-us-section-first-order">
                <div className="about-us-section-first-head">
                  <h2 className="about-us-section-first-head-text">SB Acoustics</h2>
                </div>
                <div style={{
                  marginBlockStart: '24px',
                  marginBlockEnd: '24px',
                  color: '#475569'
                }}>
                  <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.brand_desc, {
                      ALLOWED_TAGS: [
                          'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                      ],
                      ALLOWED_ATTR: [
                          'href', 'target', 'rel', 'class', 'id', 'style'
                      ],
                  }) }}></h3>
                </div>
              </div>
              <div className="about-us-section-second-relative">
                <div className="about-us-section-second-relative-head">
                  <div className="about-us-section-second-relative-desc">SB Acoustics</div>
                </div>
                <SwiperCarouselAboutUsOld 
                  images={allData.aboutUsImages
                    .filter((val) => val.type === 'BRAND')
                    .map((val, index) => ({
                      src: val.url,
                      alt: `SB Acoustics About Us ${index + 1}`,
                    }))
                  }
                />
              </div>
            </div>
          </div>
          </div>
        </section>

  
      <section className="about-us-section-parent-2">
        <div>
          <div className="about-us-section-parent-div">
            <div className="about-us-section-child-grid">
              <div>
                <div className="about-us-section-second-head">
                  <div className="about-us-section-first-head-text">
                    Sinar Baja Electric
                  </div>
                </div>
                <SwiperCarouselAboutUsOld 
                  images={allData.aboutUsImages
                    .filter((val) => val.type === 'SBE')
                    .map((val, index) => ({
                      src: val.url,
                      alt: `Sinar Baja Electric About Us ${index + 1}`,
                    }))
                  }
                />
              </div>
              <div className="about-us-section-second-order">
                <div className="about-us-section-first-head">
                  <h2 className="about-us-section-first-head-text">
                    Sinar Baja Electric
                  </h2>
                </div>
                <div style={{
                  marginBlockStart: '24px',
                  marginBlockEnd: '24px',
                  color: '#475569'
                }}>
                  <h3 className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.sbe_desc, {
                    ALLOWED_TAGS: [
                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'target', 'rel', 'class', 'id', 'style'
                    ],
                  }) }}></h3>
                </div>
                <div style={{
                  marginTop: '32px'
                }}>
                <div className="about-us-button-wrap">
                  <a className="about-us-button" href="https://sinarbajaelectric.com/">Learn More About Sinar Baja Electric</a>
                </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        <section>
          <div className="about-us-section-parent-div" style={{ paddingBlock: '24px' }}>
            <div className="about-us-mission-header">
              <h2 className="about-us-title">
                Our Mission &amp; Values
              </h2>
                <p className={`tiptap`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(allData.mission_values_desc, {
                    ALLOWED_TAGS: [
                        'a', 'b', 'i', 'u', 'em', 'strong', 'p', 'div', 'span', 'ul', 'ol', 'li', 'br'
                    ],
                    ALLOWED_ATTR: [
                        'href', 'target', 'rel', 'class', 'id', 'style'
                    ],
                }) }}></p>
            </div>
            <div className="about-us-cards">
              {allData.aboutUsImages
                .filter((val) => val.type === 'VALUES')
                .map((val, index) => 
                <article className="about-us-card" key={index}>
                  <img src={val.url} alt={`SB Acoustics About Us Mission ${index}`} width={500} height={400} />
                  <div className="about-us-card-content">
                    <h3>
                      {val.name}
                    </h3>
                    <p>
                      {val.desc}
                    </p>
                  </div>
                </article>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
