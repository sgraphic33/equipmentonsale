import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PhoneCall, ArrowRight, Video, Maximize2, X, Play, Share2, Check, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';

export default function InventoryItem({ handleContactClick }: { handleContactClick: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, customMessage?: string) => void }) {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMediaIdx, setCurrentMediaIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    const itemRef = doc(db, 'inventory', id);
    const unsubscribe = onSnapshot(itemRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setItem({ id: docSnapshot.id, ...docSnapshot.data() });
      } else {
        setItem(null);
      }
      setIsLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'inventory');
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-medium text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</div>
        <Link to="/inventory" className="text-[#B73D73] hover:underline font-medium flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Link>
      </div>
    );
  }

  const photos = item.photos || [];
  const hasVideo = !!item.video;
  const totalMedia = photos.length + (hasVideo ? 1 : 0);

  const getMediaUrl = (idx: number) => {
    if (idx < photos.length) return photos[idx];
    if (hasVideo && idx === photos.length) return item.video;
    return '';
  };

  const isVideo = (idx: number) => hasVideo && idx === photos.length;

  const itemTitle = `${item.year ? item.year + ' ' : ''}${item.make} ${item.model}`;
  const itemDescription = item.description ? item.description.substring(0, 160) : `Buy the ${itemTitle} at Equipment Seller, from Equipment On Sale. A premier destination for specialized off-lease and used equipment.`;

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": itemTitle,
    "image": photos.length > 0 ? photos : undefined,
    "description": item.description,
    "sku": item.inventoryId,
    "mpn": item.sn,
    "brand": {
      "@type": "Brand",
      "name": item.make
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "USD",
      "price": item.price,
      "itemCondition": item.condition && item.condition.toLowerCase().includes('new') ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      "availability": item.status === 'Sold' ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <Helmet>
        <title>{`${itemTitle} | Equipment on Sale`}</title>
        <meta name="description" content={itemDescription} />
        <meta name="keywords" content={`${item.make}, ${item.model}, ${item.category}, used ${item.category}, off lease, used equipment, buy ${item.model}, equipment on sale, industrial machinery`} />
        <meta property="og:title" content={`${itemTitle} | Equipment on Sale`} />
        <meta property="og:description" content={itemDescription} />
        {photos[0] && <meta property="og:image" content={photos[0]} />}
        <meta property="og:type" content="product" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${itemTitle} | Equipment on Sale`} />
        <meta name="twitter:description" content={itemDescription} />
        {photos[0] && <meta name="twitter:image" content={photos[0]} />}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/inventory" className="inline-flex items-center text-gray-600 hover:text-[#B73D73] mb-6 font-medium transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
        </Link>

        {item.isHidden && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Notice: </strong>
            <span className="block sm:inline">This item is currently hidden from the public inventory list.</span>
          </div>
        )}

        <div className="bg-white rounded-sm shadow-md overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left: Media Area */}
            <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col border-r border-gray-200">
              <div className="relative aspect-[4/3] flex items-center justify-center bg-gray-100 group">
                {totalMedia > 0 ? (
                  <>
                    {isVideo(currentMediaIdx) ? (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4">
                        <Video className="w-12 h-12 mb-4 opacity-80" />
                        {getMediaUrl(currentMediaIdx).includes('youtube.com') || getMediaUrl(currentMediaIdx).includes('youtu.be') ? (
                          <iframe 
                            width="100%" 
                            height="100%" 
                            src={getMediaUrl(currentMediaIdx).replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                            title="YouTube video player" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          ></iframe>
                        ) : (
                          <a href={getMediaUrl(currentMediaIdx)} target="_blank" rel="noreferrer" className="text-white bg-[#B73D73] hover:bg-[#9E3261] px-6 py-2 rounded-sm font-bold transition-colors z-10 text-center">
                            Watch Video in New Tab
                          </a>
                        )}
                      </div>
                    ) : (
                      <img 
                        src={getMediaUrl(currentMediaIdx)} 
                        alt={`${item.make} ${item.model} view ${currentMediaIdx + 1}`} 
                        className="max-w-full max-h-full w-auto h-auto object-contain cursor-pointer mix-blend-multiply"
                        onClick={() => setIsFullscreen(true)}
                      />
                    )}
                    
                    {!isVideo(currentMediaIdx) && (
                      <button 
                        onClick={() => setIsFullscreen(true)}
                        className="absolute bottom-4 right-4 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all opacity-0 md:group-hover:opacity-100 z-10"
                      >
                        <Maximize2 className="h-5 w-5" />
                      </button>
                    )}

                    {totalMedia > 1 && (
                      <>
                        <button 
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-white bg-white/80 hover:bg-gray-900 p-2 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            let prev = currentMediaIdx - 1;
                            if (prev < 0) prev = totalMedia - 1;
                            setCurrentMediaIdx(prev);
                          }}
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        
                        <button 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 hover:text-white bg-white/80 hover:bg-gray-900 p-2 rounded-full shadow-sm transition-all opacity-0 group-hover:opacity-100 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            let next = currentMediaIdx + 1;
                            if (next >= totalMedia) next = 0;
                            setCurrentMediaIdx(next);
                          }}
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 font-medium">No media available</div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {totalMedia > 1 && (
                <div className="p-4 bg-white border-t border-gray-200 overflow-x-auto flex gap-3 pb-4 styled-scrollbar">
                  {photos.map((photo: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentMediaIdx(idx)}
                      className={`relative flex-shrink-0 w-20 h-20 border-2 outline-none rounded-sm overflow-hidden ${currentMediaIdx === idx ? 'border-[#B73D73]' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}
                    >
                      <img src={photo} className="w-full h-full object-cover" alt="Thumbnail" />
                    </button>
                  ))}
                  {hasVideo && (
                    <button 
                      onClick={() => setCurrentMediaIdx(photos.length)}
                      className={`relative flex-shrink-0 w-20 h-20 border-2 outline-none rounded-sm overflow-hidden bg-gray-900 flex items-center justify-center ${currentMediaIdx === photos.length ? 'border-[#B73D73]' : 'border-transparent opacity-60 hover:opacity-100'} transition-all`}
                    >
                      <Video className="w-6 h-6 text-white opacity-50" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Play className="w-5 h-5 text-white" fill="white" />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right: Details Area */}
            <div className="w-full lg:w-1/2 p-6 lg:p-10 flex flex-col relative">
               {item.status && item.status !== 'Available' && (
                <div className="absolute top-0 right-0">
                  <span className={`inline-block px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-sm ${item.status === 'Sold' ? 'bg-red-600' : 'bg-orange-500'}`}>
                    {item.status}
                  </span>
                </div>
              )}

              <div className="mb-2">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider mr-2">{item.category}</span>
                <span className="text-sm text-gray-400">ID: {item.inventoryId}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
                {item.make} <span className="text-[#B73D73]">{item.model}</span>
              </h1>
              <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-8">
                <div className="text-4xl font-black text-gray-900">
                  ${item.price?.toLocaleString()}
                </div>
                {(item.quantity && item.quantity > 1) ? (
                  <div className="text-lg font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-sm">
                    Quantity: {item.quantity}
                  </div>
                ) : null}
              </div>

              <div className="prose max-w-none text-gray-600 mb-8">
                <p className="text-lg leading-relaxed whitespace-pre-wrap">{item.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-10 pb-10 border-b border-gray-100">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Make</div>
                  <div className="font-medium text-gray-900">{item.make}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Model</div>
                  <div className="font-medium text-gray-900">{item.model}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Year</div>
                  <div className="font-medium text-gray-900">{item.year || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Condition</div>
                  <div className="font-medium text-gray-900">{item.condition || 'Good'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Serial Number</div>
                  <div className="font-medium text-gray-900">{item.sn || 'N/A'}</div>
                </div>
                {item.location && (
                   <div className="col-span-2">
                      <div className="text-sm text-gray-500 mb-1">Location</div>
                      <div className="font-medium text-gray-900">{item.location}</div>
                   </div>
                )}
                 {item.note && (
                   <div className="col-span-2">
                      <div className="text-sm text-gray-500 mb-1">Additional Notes</div>
                      <div className="font-medium text-gray-900">{item.note}</div>
                   </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  onClick={(e) => handleContactClick(e, `I would like to inquire about the ${item.make} ${item.model} (ID: ${item.inventoryId}).`)}
                  className="flex-1 flex justify-center items-center text-white bg-gray-900 px-8 py-4 rounded-sm font-bold text-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <PhoneCall className="h-5 w-5 mr-3" /> Inquire About Machine
                </button>
                <button 
                  onClick={async () => {
                    const shareText = `Check out this ${item.make} ${item.model} (Condition: ${item.condition || 'N/A'}) on Equipment on Sale!`;
                    const url = window.location.href;
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
                  className="flex-none flex justify-center items-center text-gray-700 bg-white border-2 border-gray-300 hover:border-[#B73D73] hover:text-[#B73D73] px-6 py-4 rounded-sm font-bold transition-all shadow-sm"
                >
                  {isCopied ? <Check className="h-5 w-5 mr-2" /> : <Share2 className="h-5 w-5 mr-2" />}
                  {isCopied ? 'Copied' : 'Share'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {isFullscreen && !isVideo(currentMediaIdx) && totalMedia > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50 bg-black/50 p-2 rounded-full"
            onClick={() => setIsFullscreen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          
          <img 
            src={getMediaUrl(currentMediaIdx)} 
            className="max-w-full max-h-[90vh] object-contain select-none" 
            alt="Fullscreen view"
          />
          
          {totalMedia > 1 && (
            <>
              <button 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 p-3 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  let prev = currentMediaIdx - 1;
                  while (prev >= 0 && isVideo(prev)) {
                    prev--;
                  }
                  if (prev < 0) {
                     prev = photos.length - 1; // go to last photo
                  }
                  setCurrentMediaIdx(prev);
                }}
              >
                <ArrowLeft className="h-8 w-8" />
              </button>
              
              <button 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 p-3 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  let next = currentMediaIdx + 1;
                  while (next < totalMedia && isVideo(next)) {
                    next++;
                  }
                  if (next >= totalMedia) {
                     next = 0; // go to first photo
                  }
                  setCurrentMediaIdx(next);
                }}
              >
                <ArrowRight className="h-8 w-8" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
