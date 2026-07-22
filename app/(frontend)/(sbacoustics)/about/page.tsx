import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import SwiperCarouselAboutUs from "@/components/single-product-page/swipercarouselaboutus";

export default function AboutUsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_URL ?? 'http://localhost:3000';

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `About Us | SB Acoustics`,
    "url": `${baseUrl}/about`,
    "logo": `${baseUrl}/images/sbacoustics/logo_sbacoustics_white_clean.webp`,
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-white">
        <h1 className="sr-only">About Us | SB Acoustics</h1>
      {/* Hero Section */}

      {/* SB Acoustics Section */}
      <section className="md:py-20 py-10 bg-white">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-8 items-center">
              <div className="md:order-1 order-2">
                <div className="md:flex hidden items-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-black">SB Acoustics</h2>
                </div>
                <div className="space-y-6 text-slate-600">
                  <h3>
                    Built from the foundation of a company with decades of manufacturing experience and partnered with
                    Danish audio design engineers touted for their revolutionary designs. SB Acoustics was formed to bring
                    an alternative to the high-end transducer market.
                  </h3>
                  <h3>
                    Marrying the design talents of Danesian Audio (Denmark), a company filled with industry veterans,
                    responsible for many well known and revolutionary designs, and manufacturing expert Sinar Baja
                    Electric (Indonesia), a vertically integrated company with more than {new Date().getFullYear() - 1981} years of transducer
                    manufacturing experience. We feel we have been able to create an exciting line of products, without
                    compromising acoustic performance for cost. Ultimately, we invite you to judge.
                  </h3>
                </div>
              </div>
              <div className="relative md:order-2 order-1">
                <div className="md:hidden flex items-start mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-black">SB Acoustics</div>
                </div>
                <SwiperCarouselAboutUs images={[
                  {
                    src: "/images/sbacoustics/aboutus/SB_Acoustics_1.jpg",
                    alt: "SB Acoustics About Us 1"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_2.jpg",
                    alt:"SB Acoustics About Us 2"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_3.jpg",
                    alt:"SB Acoustics About Us 3"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_4.jpg",
                    alt:"SB Acoustics About Us 4"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/SB_Acoustics_5.jpg",
                    alt:"SB Acoustics About Us 5"
                  }
                ]} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sinar Baja Electric Section */}
      <section className="md:py-20 py-10 bg-zinc-100">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 grid-cols-1 md:gap-16 gap-8 items-center">
              <div>
                <div className="md:hidden flex items-start mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-black">Sinar Baja Electric</div>
                </div>
                <SwiperCarouselAboutUs images={[
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_1.jpg",
                    alt:"Sinar Baja Electric About Us 1"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_2.jpg",
                    alt:"Sinar Baja Electric About Us 2"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_3.jpg",
                    alt:"Sinar Baja Electric About Us 3"
                  },
                  {
                    src: "/images/sbacoustics/aboutus/Sinar_baja_electric_4.jpg",
                    alt: "Sinar Baja Electric About Us 4"
                  },
                  {
                    src:"/images/sbacoustics/aboutus/Sinar_baja_electric_5.jpg",
                    alt:"Sinar Baja Electric About Us 5"
                  }
                ]} />
              </div>
              <div className="order-1 md:order-2">
                <div className="md:flex hidden items-center mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-black">Sinar Baja Electric</h2>
                </div>
                <div className="space-y-6 text-slate-600">
                  <h3>
                    Established in 1981 and extensively expanded ever since to become the largest loudspeaker manufacturer
                    in Indonesia and is the company behind SB Acoustics. With a population of more than 250 million
                    people, Indonesia is a significant contributor to global manufacturing.
                  </h3>
                  <h3>
                    To this day, Sinar Baja Electric is a privately held group of companies in Surabaya, Indonesia. We
                    develop and manufacture our own range of brands that are offered world wide through our distribution
                    supply chain in major markets such as Europe, Australia, Asia and the United States.
                  </h3>
                  <h3>
                    We are proud to be the preferred OEM/ODM supplier of many prestigious brands from Lifestyle Hi-Fi,
                    High-End, Automotive to Professional Audio, and much more.
                  </h3>
                  <h3>
                    With more than {new Date().getFullYear() - 1981} years of history in loudspeaker manufacturing and innovation, we continues to expand
                    in both quality, capacity, as well as services. With in-house Research & Development through the
                    latest technologies as well as extensive experience in quality control and mass production we are
                    confident we can deliver what you are searching for.
                  </h3>
                </div>
                <div className="mt-8">
                  <Button variant={"default"} asChild>
                    <Link href="https://sinarbajaelectric.com/">
                      Learn More About Sinar Baja Electric
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="md:py-20 py-10 bg-white">
        <div>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">Our Mission & Values</h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                Combining Danish design excellence with Indonesian manufacturing expertise to deliver uncompromising
                acoustic performance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-none">
                <img
                  src="/images/sbacoustics/aboutus/Acoustics_excellence.jpg"
                  alt="SB Acoustics About Us Mission 1"
                  width={500}
                  height={400}
                  className="w-full h-fit object-cover"
                />
                <CardContent className="p-8 text-center bg-zinc-100">
                  <h3 className="text-xl font-bold mb-4 text-black">Acoustic Excellence</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Revolutionary Danish designs meet precision Indonesian manufacturing to create transducers that
                    deliver uncompromising acoustic performance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none">
                <img
                  src="/images/sbacoustics/aboutus/Innovation.jpg"
                  alt="SB Acoustics About Us Mission 2"
                  width={500}
                  height={400}
                  className="w-full h-fit object-cover"
                />
                <CardContent className="p-8 text-center bg-zinc-100">
                  <h3 className="text-xl font-bold mb-4 text-black">Innovation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Over {new Date().getFullYear() - 1981} years of manufacturing experience combined with cutting-edge R&D to continuously push the
                    boundaries of transducer technology.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-none">
                <img
                  src="/images/sbacoustics/aboutus/global_reach.jpg"
                  alt="SB Acoustics About Us Mission 3"
                  width={500}
                  height={400}
                  className="w-full h-fit object-cover"
                />
                <CardContent className="p-8 text-center bg-zinc-100">
                  <h3 className="text-xl font-bold mb-4 text-black">Global Reach</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Serving prestigious brands worldwide across Europe, Australia, Asia, and the United States with our
                    comprehensive distribution network.
                  </p>
                  <br/>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/*
      <section className="md:py-20 py-10 bg-zinc-100">
        <div
          className={`transform transition-all duration-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
        >
          <div className="container mx-auto max-w-4xl text-center">
            <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center mx-auto mb-6">
              <Volume2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Explore Our Audio Excellence</h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Discover how our Danish-Indonesian partnership creates transducers that set new standards in the high-end
              audio market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant={"default"} asChild>
                <Link href={'/products'}>
                  <h3>Explore Our Products</h3>
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
              >
                <Link href={'/contact'}>
                  <h3>Contact</h3>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section> */}
    </div>
    </>
  );
}
