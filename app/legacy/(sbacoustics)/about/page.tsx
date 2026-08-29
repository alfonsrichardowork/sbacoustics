
import '@/app/legacy/(sbacoustics)/about/about.css'
import SwiperCarouselAboutUsOld from '../../components/swipercarouselaboutusold';

export default function AboutUsPage() {
  const years = new Date().getFullYear() - 1981
  return (
    <>
      <div style={{ backgroundColor: "#ffffff" }}>

        <section className="about-us-section about-us-section-white">
          <div className="about-us-container">
            <div className="about-us-two-column about-us-align-center about-us-gap-large">
              <div className="about-us-copy about-us-copy-first">
                <div className="about-us-desktop-heading">
                  <h2 className="about-us-title">SB Acoustics</h2>
                </div>
                <div className="about-us-text-stack">
                  <h3>SB Acoustics was born from the union of two established names in audio: the Danish design engineers of Danesian Audio, whose patented tweeter and subwoofer innovations have shaped some of the industry&apos;s most distinctive transducer designs, and Sinar Baja Electric, a vertically integrated manufacturer with over {years} years of experience crafting exceptional transducers.</h3>
                  <h3>In-house capabilities span tooling, coil winding, diaphragm production, die-cast baskets, stamping, and specialty finishing, among other processes — giving us tight control over quality and consistency from raw material to finished component. Together, we&apos;ve built a product line that balances outstanding acoustic performance with affordability.</h3>
                </div>
              </div>
              <div className="about-us-carousel about-us-carousel-first">
                <div className="about-us-mobile-heading">
                  <div className="about-us-title">SB Acoustics</div>
                </div>
                <SwiperCarouselAboutUsOld images={[
                  { src: "/images/sbacoustics/aboutus/SB_Acoustics_1.jpg", alt: "SB Acoustics About Us 1" },
                  { src: "/images/sbacoustics/aboutus/SB_Acoustics_2.jpg", alt: "SB Acoustics About Us 2" },
                  { src: "/images/sbacoustics/aboutus/SB_Acoustics_3.jpg", alt: "SB Acoustics About Us 3" },
                  { src: "/images/sbacoustics/aboutus/SB_Acoustics_4.jpg", alt: "SB Acoustics About Us 4" },
                  { src: "/images/sbacoustics/aboutus/SB_Acoustics_5.jpg", alt: "SB Acoustics About Us 5" },
                ]} />
              </div>
            </div>
          </div>
        </section>

        <section className="about-us-section about-us-section-zinc">
          <div className="about-us-container">
            <div className="about-us-two-column about-us-align-center about-us-gap-large">
              <div className="about-us-carousel">
                <div className="about-us-mobile-heading">
                  <div className="about-us-title">
                    Sinar Baja Electric
                  </div>
                </div>
                <SwiperCarouselAboutUsOld images={[{ src: "/images/sbacoustics/aboutus/Sinar_baja_electric_1.jpg", alt: "Sinar Baja Electric About Us 1" }, { src: "/images/sbacoustics/aboutus/Sinar_baja_electric_2.jpg", alt: "Sinar Baja Electric About Us 2" }, { src: "/images/sbacoustics/aboutus/Sinar_baja_electric_3.jpg", alt: "Sinar Baja Electric About Us 3" }, { src: "/images/sbacoustics/aboutus/Sinar_baja_electric_4.jpg", alt: "Sinar Baja Electric About Us 4" }, { src: "/images/sbacoustics/aboutus/Sinar_baja_electric_5.jpg", alt: "Sinar Baja Electric About Us 5" }]} />
              </div>
              <div className="about-us-copy about-us-copy-second">
                <div className="about-us-desktop-heading">
                  <h2 className="about-us-title">
                    Sinar Baja Electric
                  </h2>
                </div>
                <div className="about-us-text-stack">
                  <h3>Founded in 1981, we&apos;ve grown into a leading name in loudspeaker manufacturing, with a reputation for high-quality products that meet the demands of discerning customers worldwide. Four decades of craftsmanship remain the backbone of everything we build.</h3>
                  <h3>As a privately held group, we stay true to our core values of innovation, quality, and customer satisfaction. We are a preferred OEM/ODM supplier for prestigious brands across the lifestyle hi-fi, high-end, automotive, and professional audio sectors.</h3>
                  <h3>We continue to invest in cutting-edge R&amp;D, quality control, and mass production — pushing the boundaries of what&apos;s possible in transducer design and manufacturing.</h3>
                </div>
                <div className="about-us-button-wrap">
                  <a className="about-us-button" href="https://sinarbajaelectric.com/">Learn More About Sinar Baja Electric</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="about-us-section about-us-section-white">
          <div className="about-us-container">
            <div className="about-us-mission-header">
              <h2 className="about-us-title">
                Our Mission &amp; Values
              </h2>
              <p>We dedicate passion and purpose to create and deliver high-valued products, where end user and OEM customer expectation are exceeded</p>
            </div>
            <div className="about-us-cards">
              {[["Acoustics_excellence.jpg", "Acoustic Excellence", "Combining innovative Danish design expertise with precision Indonesian manufacturing, to create transducers deliver uncompromised acoustic performance"], ["Innovation.jpg", "Innovation", `Over ${years} years of experience in manufacturing, paired with cutting-edge R&D, enables us to continuously advance technology in transducers and manufacturing`], ["global_reach.jpg", "Global Reach", "Serving prestigious brands worldwide across Europe, Australia, Asia, and the United States through our comprehensive distribution network"]].map(([image, title, text]) => 
              <article className="about-us-card" key={title}>
                <img src={`/images/sbacoustics/aboutus/${image}`} alt={`SB Acoustics About Us ${title}`} width={500} height={400} />
                <div className="about-us-card-content">
                  <h3>
                    {title}
                  </h3>
                  <p>
                    {text}
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
