import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Factory, Stethoscope, Hammer, Package, HardHat, ShieldCheck, Clock, Zap, Truck, Globe, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Home({ handleContactClick }: { handleContactClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, customMessage?: string) => void }) {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Equipment On Sale",
    "url": window.location.origin,
    "logo": `${window.location.origin}/teamwork-logo.png`,
    "description": "Equipment Seller, from Equipment On Sale is a premier destination for specialized off-lease and used equipment inventory of available for sale commercial and industrial equipment for your business.",
    "sameAs": []
  };

  const webSiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Equipment On Sale",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/inventory`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Helmet>
        <title>Equipment on Sale | Premium Lightly Used Machinery</title>
        <meta name="description" content="Equipment Seller, from Equipment On Sale is a premier destination for specialized off-lease and used equipment inventory of available for sale commercial and industrial equipment for your business." />
        <meta name="keywords" content="off lease, used, equipment, CNC machines, 3D printer, packaging equipment, compact construction, bobcat, construction, agriculture, material handling, forklifts, hyster, yale, office technology, machine tools, computers, laptops, trucks, trailers, marine, golf, turf, landscape" />
        <meta property="og:title" content="Equipment on Sale | Premium Lightly Used Machinery" />
        <meta property="og:description" content="Equipment Seller, from Equipment On Sale is a premier destination for specialized off-lease and used equipment inventory of available for sale commercial and industrial equipment for your business." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Equipment on Sale | Used Machinery" />
        <meta name="twitter:description" content="Equipment Seller, from Equipment On Sale is a premier destination for specialized off-lease and used equipment inventory of available for sale commercial and industrial equipment for your business." />
        <script type="application/ld+json">
          {JSON.stringify(organizationStructuredData)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webSiteStructuredData)}
        </script>
      </Helmet>
      {/* Hero Section */}
      <div className="relative pt-20 pb-32 flex content-center items-center justify-center min-h-[100vh] lg:min-h-[100vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover absolute inset-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes('unsplash.com')) {
                target.src = 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2940&auto=format&fit=crop';
              }
            }}
          />
          <div className="absolute inset-0 bg-gray-900/50 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/40 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="md:w-2/3 lg:w-1/2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block py-1 px-3 rounded bg-white/10 border border-white/20 text-white text-sm font-semibold tracking-wide uppercase mb-4 backdrop-blur-sm">
                Trusted for 20 Years
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[63px] font-extrabold text-white leading-tight mb-6" style={{ fontFamily: 'Verdana, sans-serif' }}>
                Premium Machinery,<br />
                <span className="text-[#B73D73]">Massive Savings.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl leading-relaxed">
                Save up to <strong className="text-white">80% off retail</strong> with our high-quality, lightly used offlease commercial, industrial, and manufacturing equipment. We handle the sourcing, quality control, and logistics so you can focus on growing your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/inventory" className="inline-flex justify-center items-center px-8 py-4 border border-transparent rounded-sm text-base font-bold text-white bg-[#B73D73] hover:bg-[#9E3261] transition-all shadow-lg hover:shadow-xl">
                  Browse Inventory
                </Link>
                <a href="#contact" className="inline-flex justify-center items-center px-8 py-4 border-2 border-white rounded-sm text-base font-bold text-white hover:bg-white hover:text-gray-900 transition-all" onClick={handleContactClick}>
                  Send an Inquiry
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats / Trust Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:divide-x divide-gray-100">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#939598]">20+</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mt-2">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#939598]">2,000+</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mt-2">Machines Sold</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#939598]">80%</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mt-2">Max Savings</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-[#939598]">30</p>
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide mt-2">Day Warranty</p>
            </div>
          </div>
        </div>
      </div>

      {/* About Us */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-bold text-[#B73D73] uppercase tracking-widest mb-3">About Us</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Verdana, sans-serif' }}>
                Equipping your business shouldn't drain your capital.
              </h3>
              <div className="space-y-6 text-gray-600 text-lg">
                <p>
                  For 20 years, <strong className="text-gray-900">Equipment On Sale</strong> has been a trusted leader in providing high-quality, lightly used industrial and manufacturing machinery. We are proud to be a business of <strong className="text-gray-900">TW Holding (Teamwork of America LLC)</strong>.
                </p>
                <div className="py-4">
                  <img src="/teamwork-logo.png" alt="Teamwork of America LLC" className="h-24 sm:h-32 w-auto object-contain mix-blend-multiply opacity-90 transition-opacity hover:opacity-100" />
                </div>
                <p>
                  We specialize in sourcing off-lease, current-model equipment that delivers premium performance while saving you significantly compared to buying new. With an extensive track record locally and internationally, we understand the unique demands of your operations.
                </p>
                <p>
                  When you partner with us, you are not just buying a machine; you are gaining a dedicated equipment sourcing partner backed by a steadfast quality guarantee and ongoing support.
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#B73D73] flex-shrink-0 mr-3" />
                  <span className="text-gray-800 font-medium">Off-lease, current-model machinery</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#B73D73] flex-shrink-0 mr-3" />
                  <span className="text-gray-800 font-medium">Global sourcing network</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#B73D73] flex-shrink-0 mr-3" />
                  <span className="text-gray-800 font-medium">Rigorous vetting process</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-2xl relative z-10">
                <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940&auto=format&fit=crop" alt="Industrial Facility" className="object-cover w-full h-full" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#939598]/20 rounded-sm -z-0"></div>
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-[#B73D73]/10 rounded-sm -z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section id="industries" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-[#B73D73] uppercase tracking-widest mb-3">Industries We Serve</h2>
            <h3 className="text-2xl md:text-3xl lg:text-[31px] font-extrabold text-gray-900 mb-6" style={{ fontFamily: 'Verdana, sans-serif' }}>
              Top-Tier Machinery for Demanding Sectors
            </h3>
            <p className="text-lg text-gray-600">
              Off lease used PRINTING equipment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-all z-10"></div>
                <img 
                  src="/printing-machine.jpg" 
                  alt="Printing Machine" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1607342600236-1e9bf4fc7ef2?q=80&w=2800&auto=format&fit=crop';
                    }
                  }}
                />
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-10 right-8 bg-white p-3 rounded-full shadow-lg z-20">
                  <Factory className="h-8 w-8 text-[#B73D73]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Off lease used PRINTING equipment</h4>
                <p className="text-gray-600">High-performance presses and complete finishing equipment for commercial print operations.</p>
              </div>
            </div>

            <div className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-all z-10"></div>
                <img 
                  src="/regenerated_image_1777443765545.png" 
                  alt="Medical Machinery" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2940&auto=format&fit=crop';
                    }
                  }}
                />
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-10 right-8 bg-white p-3 rounded-full shadow-lg z-20">
                  <Stethoscope className="h-8 w-8 text-[#B73D73]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Off lease used MEDICAL equipment</h4>
                <p className="text-gray-600">Advanced, carefully vetted healthcare and diagnostic machinery.</p>
              </div>
            </div>

            <div className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-all z-10"></div>
                <img 
                  src="/regenerated_image_1777443764382.png" 
                  alt="Metal Work" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356f12?q=80&w=2940&auto=format&fit=crop';
                    }
                  }}
                />
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-10 right-8 bg-white p-3 rounded-full shadow-lg z-20">
                  <Hammer className="h-8 w-8 text-[#B73D73]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Off lease used METAL WORK equipment</h4>
                <p className="text-gray-600">Precision fabrication, CNCs, and heavy-duty machining tools.</p>
              </div>
            </div>

            <div className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-all z-10"></div>
                <img 
                  src="/regenerated_image_1777443764846.png" 
                  alt="Packaging Equipment" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1580982512684-256ed13f2832?q=80&w=2940&auto=format&fit=crop';
                    }
                  }}
                />
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-10 right-8 bg-white p-3 rounded-full shadow-lg z-20">
                  <Package className="h-8 w-8 text-[#B73D73]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Off lease used PACKAGING equipment</h4>
                <p className="text-gray-600">Efficient, scalable automated packaging line solutions.</p>
              </div>
            </div>

            <div className="group border border-gray-100 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300 bg-white">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gray-900/20 group-hover:bg-transparent transition-all z-10"></div>
                <img 
                  src="/regenerated_image_1777443765250.png" 
                  alt="Construction Equipment" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('unsplash.com')) {
                      target.src = 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?q=80&w=2940&auto=format&fit=crop';
                    }
                  }}
                />
              </div>
              <div className="p-8 relative">
                <div className="absolute -top-10 right-8 bg-white p-3 rounded-full shadow-lg z-20">
                  <HardHat className="h-8 w-8 text-[#B73D73]" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Off lease used CONSTRUCTION equipment</h4>
                <p className="text-gray-600">Rugged, job-site-ready machinery and heavy earth-moving equipment.</p>
              </div>
            </div>

            <div className="group border-2 border-dashed border-[#939598]/50 rounded-sm bg-gray-50 flex flex-col justify-center items-center text-center p-8 hover:bg-gray-100 transition-colors">
              <div className="w-16 h-16 rounded-full bg-[#939598]/10 flex items-center justify-center mb-4">
                <Settings className="h-8 w-8 text-[#939598]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Need Something Else?</h4>
              <p className="text-gray-600 mb-6">Our dedicated team will leverage our extensive network to track down the exact equipment you need.</p>
              <a href="#contact" onClick={handleContactClick} className="text-[#B73D73] font-bold text-sm uppercase tracking-wide flex items-center hover:text-[#9E3261]">
                Custom Sourcing <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Advantage */}
      <section id="advantage" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-[#B73D73] uppercase tracking-widest mb-3">Why Choose Us</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              The Equipment On Sale Advantage
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-800 p-8 rounded-sm border border-gray-700">
              <Zap className="h-10 w-10 text-[#B73D73] mb-6" />
              <h4 className="text-xl font-bold mb-3">Massive Savings</h4>
              <p className="text-gray-400">Because our inventory consists of lightly used, off-lease models, you gain access to current tech at up to 80% off the original cost.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-sm border border-gray-700">
              <ShieldCheck className="h-10 w-10 text-[#B73D73] mb-6" />
              <h4 className="text-xl font-bold mb-3">Guaranteed Quality</h4>
              <p className="text-gray-400">We stand behind our inventory. Every machine is thoroughly vetted to ensure it meets our strict performance standards.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-sm border border-gray-700">
              <Clock className="h-10 w-10 text-[#B73D73] mb-6" />
              <h4 className="text-xl font-bold mb-3">Decades of Expertise</h4>
              <p className="text-gray-400">With 20 years in the business and over 2,000 successful sales, we have the deep industry knowledge to serve you effectively.</p>
            </div>
            <div className="bg-gray-800 p-8 rounded-sm border border-gray-700">
              <Settings className="h-10 w-10 text-[#B73D73] mb-6" />
              <h4 className="text-xl font-bold mb-3">Custom Sourcing</h4>
              <p className="text-gray-400">Don't see what you look for? Send an inquiry! We will leverage our network to track down the exact machinery you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty & Logistics (Split Layout) */}
      <section id="warranty" className="py-0 overflow-hidden bg-white">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 p-12 md:p-20 lg:p-24 bg-gray-50 flex flex-col justify-center">
            <ShieldCheck className="h-12 w-12 text-[#939598] mb-6" />
            <h3 className="text-3xl font-extrabold text-gray-900 mb-6">30-Day Performance Warranty</h3>
            <p className="text-lg text-gray-600 mb-6">
              Purchasing machinery is a major investment, and we want you to buy with absolute confidence.
            </p>
            <p className="text-gray-600 mb-8 border-l-4 border-[#B73D73] pl-6 text-lg italic">
              "While we do not offer general returns, we guarantee that your equipment works."
            </p>
            <p className="text-gray-600">
              If an issue arises within the first 30 days, we will evaluate the situation and make it right—whether repairing the machine, covering the cost of repair, replacing the unit, or accepting a return based on the circumstances.
            </p>
            <div className="mt-10">
              <h4 className="font-bold text-gray-900 text-lg mb-3">Unwavering After-Sale Support</h4>
              <p className="text-gray-600">Our relationship doesn't end at delivery. Our team communicates directly with original manufacturers to troubleshoot and find solutions so you are never left disconnected.</p>
            </div>
          </div>
          <div className="lg:w-1/2 p-12 md:p-20 lg:p-24 bg-[#B73D73] text-white flex flex-col justify-center">
            <Globe className="h-12 w-12 text-white/80 mb-6" />
            <h3 className="text-3xl font-extrabold text-white mb-6">Logistics & Delivery</h3>
            <p className="text-lg text-white/90 mb-6">
              We bring the equipment to you—wherever you are. A great deal is only valuable if the equipment arrives safely and on time.
            </p>
            <ul className="space-y-8 mt-4">
              <li className="flex">
                <div className="bg-white/10 p-3 rounded-full h-12 w-12 flex items-center justify-center mr-4 flex-shrink-0">
                  <Truck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">Nationwide Delivery</h4>
                  <p className="text-white/80">Fast, reliable, and secure delivery across the entire country, directly to your facility or job site.</p>
                </div>
              </li>
              <li className="flex">
                <div className="bg-white/10 p-3 rounded-full h-12 w-12 flex items-center justify-center mr-4 flex-shrink-0">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl mb-1">International Shipping</h4>
                  <p className="text-white/80">Operating globally? We provide professional crating and secure packaging services to ensure safe arrival at any international destination.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
