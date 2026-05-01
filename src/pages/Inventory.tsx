import React, { useState, useEffect } from 'react';
import { Search, Filter, PhoneCall, ArrowRight, ChevronLeft, ChevronRight, Video, Maximize2, X, Share2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';

const CATEGORIES = ["All", "Printing", "Medical", "Metal Work", "Packaging", "Construction"];

export default function Inventory({ handleContactClick }: { handleContactClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, customMessage?: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const path = 'inventory';
    const unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  const filteredInventory = items.filter(item => {
    if (item.isHidden) return false;
    const searchString = `${item.make} ${item.model} ${item.description} ${item.sn} ${item.inventoryId}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Equipment on Sale Inventory",
    "description": "Equipment Seller, from Equipment On Sale is a premier destination for specialized off-lease and used equipment inventory of available for sale commercial and industrial equipment for your business.",
    "url": window.location.href,
    "hasPart": items.filter(i => !i.isHidden).map(item => ({
      "@type": "Product",
      "name": `${item.year ? item.year + ' ' : ''}${item.make} ${item.model}`,
      "description": item.description,
      "sku": item.inventoryId,
      "brand": {
        "@type": "Brand",
        "name": item.make
      },
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": item.price,
        "availability": item.status === 'Sold' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
        "itemCondition": item.condition && item.condition.toLowerCase().includes('new') ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
        "url": `${window.location.origin}/inventory/${item.id}`
      }
    }))
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <Helmet>
        <title>Inventory | Equipment on Sale | Premium Lightly Used Machinery</title>
        <meta name="description" content="Equipment Seller, from Equipment On Sale is a premier destination for specialized off-lease and used equipment inventory of available for sale commercial and industrial equipment for your business." />
        <meta name="keywords" content="off lease, used, equipment, CNC machines, 3D printer, packaging equipment, compact construction, bobcat, construction, agriculture, material handling, forklifts, hyster, yale, office technology, machine tools, computers, laptops, trucks, trailers, marine, golf, turf, landscape" />
        <meta property="og:title" content="Inventory | Equipment on Sale | Premium Lightly Used Machinery" />
        <meta property="og:description" content="Equipment Seller, from Equipment On Sale is a premier destination for specialized off-lease and used equipment inventory of available for sale commercial and industrial equipment for your business." />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      {/* Page Header */}
      <div className="bg-gray-900 text-white py-16 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ fontFamily: 'Verdana, sans-serif' }}>
            Current <span className="text-[#B73D73]">Inventory</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Browse our selection of premium, lightly used machinery. Don't see what you need? We can leverage our network to source it for you.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:gap-8 gap-6">
          {/* Filters Area */}
          <div className="lg:w-1/4 flex flex-col">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-2">
              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="flex items-center justify-between w-full bg-white p-4 rounded-sm border border-gray-200 shadow-sm font-bold text-gray-900"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#B73D73]" />
                  Filters
                </div>
                <ChevronRight className={`h-5 w-5 transform transition-transform ${isFiltersOpen ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Sidebar / Filters */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFiltersOpen ? 'max-h-[1000px] opacity-100 mt-2' : 'max-h-0 opacity-0 lg:max-h-none lg:opacity-100 lg:mt-0'}`}>
              <div className="bg-white p-6 rounded-sm border border-gray-200 sticky top-28 shadow-sm">
                <div className="hidden lg:flex items-center gap-2 font-bold text-lg mb-6 border-b border-gray-100 pb-4">
                  <Filter className="h-5 w-5 text-[#B73D73]" />
                  Filters
                </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search equipment..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Categories</label>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-sm text-sm transition-colors ${
                        selectedCategory === category 
                          ? 'bg-[#B73D73]/10 text-[#B73D73] font-bold' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-sm border border-gray-200">
              <span className="text-gray-600 font-medium">
                {isLoading ? "Loading..." : `Showing ${filteredInventory.length} machine${filteredInventory.length !== 1 ? 's' : ''}`}
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={async () => {
                    if (navigator.share) {
                      try {
                        await navigator.share({
                          title: 'Equipment on Sale Inventory',
                          text: 'Check out our current equipment inventory!',
                          url: window.location.href
                        });
                      } catch (err) {}
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }
                  }}
                  className="flex justify-center items-center text-gray-700 bg-white border-2 border-gray-300 hover:border-[#B73D73] hover:text-[#B73D73] px-5 py-2.5 rounded-sm font-bold transition-all shadow-sm w-full sm:w-auto"
                >
                  {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />} 
                  {isCopied ? 'Copied!' : 'Share Inventory'}
                </button>
                <select className="border-2 border-gray-300 rounded-sm px-4 py-2.5 font-medium focus:outline-none focus:border-[#B73D73] focus:ring-1 focus:ring-[#B73D73] w-full sm:w-auto bg-white">
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {filteredInventory.length > 0 ? (
              <div className="space-y-6">
                {filteredInventory.map((item, index) => (
                  <InventoryItemCard key={item.id} item={item} index={index} handleContactClick={handleContactClick} />
                ))}
              </div>
            ) : !isLoading && (
              <div className="bg-white border border-gray-200 rounded-sm p-12 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No inventory found</h3>
                <p className="text-gray-500 mb-6">We couldn't find any machines matching your current filters.</p>
                <div className="bg-gray-50 p-6 rounded-sm border border-dashed border-gray-300 max-w-md mx-auto">
                  <p className="text-sm text-gray-700 mb-4">Let our experts find exactly what you need through our global network.</p>
                  <button onClick={handleContactClick} className="inline-flex items-center px-4 py-2 bg-[#B73D73] text-white font-bold rounded-sm hover:bg-[#9E3261] transition-colors">
                    <PhoneCall className="h-4 w-4 mr-2" /> Request Custom Sourcing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InventoryItemCardProps {
  key?: React.Key;
  item: any;
  index: number;
  handleContactClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, customMessage?: string) => void;
}

function InventoryItemCard({ item, index, handleContactClick }: InventoryItemCardProps) {
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const photos = item.photos || [];
  const hasVideo = !!item.video;
  const medias = [...photos];
  if (hasVideo) medias.push({ type: 'video', url: item.video });
  const totalMedia = medias.length;

  const nextMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentMediaIdx((curr) => (curr + 1) % totalMedia);
  };
  const prevMedia = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentMediaIdx((curr) => (curr - 1 + totalMedia) % totalMedia);
  };

  const currentMedia = totalMedia > 0 ? medias[currentMediaIdx] : null;

  return (
    <>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white border border-gray-200 rounded-sm overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={() => window.open(`/inventory/${item.id}`, '_blank')}
    >
      {/* ... rest of the code ... */}
      {/* Media Gallery Slider */}
      <div className="relative w-full md:w-1/3 bg-gray-100 min-h-[300px] flex items-center justify-center shrink-0 border-r border-gray-200 group overflow-hidden">
        {totalMedia > 0 ? (
          <>
            {typeof currentMedia === 'string' ? (
              <img 
                src={currentMedia} 
                alt={item.make} 
                className="w-full h-full object-cover mix-blend-multiply cursor-pointer hover:scale-105 transition-transform duration-500" 
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4" onClick={(e) => e.stopPropagation()}>
                <Video className="w-12 h-12 mb-2 opacity-80" />
                <a href={currentMedia?.url} target="_blank" rel="noreferrer" className="text-sm underline hover:text-[#B73D73] transition-colors break-all text-center">Watch Video</a>
              </div>
            )}
            
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFullscreen(true); }}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/80 transition-all z-10"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            
            {totalMedia > 1 && (
              <>
                <button onClick={prevMedia} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/80 transition-all z-10">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMedia} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/80 transition-all z-10">
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {medias.map((_, i) => (
                    <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentMediaIdx ? 'bg-white' : 'bg-white/40'}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-gray-400 font-medium">No Image Available</div>
        )}
        <span className="absolute top-4 left-4 bg-[#B73D73] text-white text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-wide z-10">
          {item.category}
        </span>
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col flex-grow relative">
        {item.status && item.status !== 'Available' && (
          <div className="absolute top-0 right-0">
             <span className={`inline-block px-4 py-1 text-xs font-bold uppercase tracking-wider text-white ${item.status === 'Sold' ? 'bg-red-600' : 'bg-orange-500'}`}>
                {item.status}
             </span>
          </div>
        )}
        <div className="flex justify-between items-start mb-2 mt-4 sm:mt-0">
          <h3 className="text-2xl font-bold text-gray-900 leading-tight tracking-tight pr-2">
            {item.make} {item.model}
            {(item.quantity && item.quantity > 1) ? <span className="ml-2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-sm">Qty: {item.quantity}</span> : null}
          </h3>
          <div className="font-extrabold text-2xl text-[#B73D73] shrink-0">${item.price?.toLocaleString()}</div>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{item.description}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 mt-auto">
          <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">ID / SKU</span>
            <span className="text-sm font-bold text-gray-800">{item.inventoryId}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Year</span>
            <span className="text-sm font-bold text-gray-800">{item.year || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Serial Num</span>
            <span className="text-sm font-bold text-gray-800 truncate" title={item.sn}>{item.sn || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex flex-col">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Condition</span>
            <span className="text-sm font-bold text-gray-800 truncate" title={item.condition}>{item.condition || 'N/A'}</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 flex flex-col md:col-span-2">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Location</span>
            <span className="text-sm font-bold text-gray-800 truncate" title={item.location}>{item.location || 'N/A'}</span>
          </div>
          {item.note && (
            <div className="bg-yellow-50 p-3 rounded-sm border border-yellow-100 flex flex-col md:col-span-2">
              <span className="text-xs text-yellow-600 uppercase font-bold tracking-wider mb-1">Notes</span>
              <span className="text-sm font-bold text-yellow-900 truncate" title={item.note}>{item.note}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={(e) => { e.stopPropagation(); handleContactClick(e, `I would like to inquire about the ${item.make} ${item.model} (ID: ${item.inventoryId}).`); }}
            className="flex-1 flex justify-center items-center text-white bg-gray-900 px-6 py-3 rounded-sm font-bold hover:bg-gray-800 transition-colors shadow-sm"
          >
            Inquire About Machine <ArrowRight className="h-4 w-4 ml-2" />
          </button>
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              const shareText = `Check out this ${item.make} ${item.model} (Condition: ${item.condition || 'N/A'}) on Equipment on Sale!`;
              const url = window.location.href; // In a real app we might link directly to an item
              if (navigator.share) {
                try {
                  await navigator.share({
                    title: `${item.make} ${item.model}`,
                    text: shareText,
                    url: url
                  });
                } catch (err) {}
              } else {
                navigator.clipboard.writeText(`${shareText}\n${url}`);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              }
            }}
            className="flex-none flex justify-center items-center text-gray-700 bg-white border-2 border-gray-300 hover:border-[#B73D73] hover:text-[#B73D73] px-6 py-3 rounded-sm font-bold transition-all shadow-sm"
          >
            {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
            {isCopied ? 'Copied' : 'Share'}
          </button>
        </div>
      </div>
    </motion.div>

    <AnimatePresence>
      {isFullscreen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center relative select-none"
            onClick={e => e.stopPropagation()}
          >
            {typeof currentMedia === 'string' ? (
              <img 
                src={currentMedia} 
                alt={item.make} 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center text-white">
                <Video className="w-24 h-24 mb-6 opacity-80" />
                <a href={currentMedia?.url} target="_blank" rel="noreferrer" className="text-xl underline hover:text-[#B73D73] transition-colors break-all text-center">Open Video in New Tab</a>
              </div>
            )}
            
            {totalMedia > 1 && (
              <>
                <button 
                  onClick={prevMedia} 
                  className="absolute left-0 p-4 text-white/50 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-12 h-12" />
                </button>
                <button 
                  onClick={nextMedia} 
                  className="absolute right-0 p-4 text-white/50 hover:text-white transition-colors"
                >
                  <ChevronRight className="w-12 h-12" />
                </button>
                <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 flex gap-2">
                   {medias.map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentMediaIdx(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === currentMediaIdx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                      aria-label={`Go to slide ${i+1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
