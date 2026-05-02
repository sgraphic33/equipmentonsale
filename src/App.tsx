import React, { useState, useEffect } from 'react';
import useWeb3Forms from '@web3forms/react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, ShieldCheck, Clock, Zap, Truck, Globe, ArrowRight, CheckCircle2, Factory, Stethoscope, Hammer, Package, HardHat, PhoneCall, Menu, X, Mail, MapPin } from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Inventory from './pages/Inventory';
import InventoryItem from './pages/InventoryItem';

import Admin from './pages/Admin';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    businessName: '',
    phone: '',
    email: '',
    question: ''
  });
  const [captchaVal1, setCaptchaVal1] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaVal2, setCaptchaVal2] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [formErrors, setFormErrors] = useState<{
    phone?: string; 
    email?: string;
    firstName?: string;
    lastName?: string;
    businessName?: string;
    question?: string;
    captcha?: string;
  }>({});

  const { submit: submitWeb3Form } = useWeb3Forms({
    access_key: 'dc7b914d-16de-4f78-b5a3-adc32fa3ab62',
    settings: {
      from_name: 'Equipment On Sale',
      subject: 'New Inquiry from Equipment On Sale'
    },
    onSuccess: (successMessage, data) => {
      setFormStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        businessName: '',
        phone: '',
        email: '',
        question: ''
      });
      setCaptchaVal1(Math.floor(Math.random() * 10) + 1);
      setCaptchaVal2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
    },
    onError: (errorMessage, data) => {
      console.error('Error sending email:', errorMessage, data);
      setFormStatus('idle');
      alert('Failed to send message: ' + (errorMessage || 'Server error.'));
    }
  });

  const validateForm = () => {
    let isValid = true;
    const errors: {
      phone?: string; 
      email?: string;
      firstName?: string;
      lastName?: string;
      businessName?: string;
      question?: string;
      captcha?: string;
    } = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
      isValid = false;
    }
    
    if (!formData.businessName.trim()) {
      errors.businessName = 'Business name is required';
      isValid = false;
    }

    // Very basic phone regex allowing numbers, spaces, dashes, parens, plus
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,20}$/;
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
      isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    if (!formData.question.trim()) {
      errors.question = 'Please provide details for your inquiry';
      isValid = false;
    }
    
    if (parseInt(captchaAnswer) !== captchaVal1 + captchaVal2) {
      errors.captcha = 'Incorrect security code. Please try again.';
      isValid = false;
      // Regenerate captcha on failure
      setCaptchaVal1(Math.floor(Math.random() * 10) + 1);
      setCaptchaVal2(Math.floor(Math.random() * 10) + 1);
      setCaptchaAnswer('');
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setFormStatus('submitting');
    
    submitWeb3Form({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      business_name: formData.businessName,
      message: formData.question
    });
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, customMessage: string = '') => {
    e.preventDefault();
    if (customMessage) {
      setFormData(prev => ({ ...prev, question: customMessage }));
    }
    setIsContactFormOpen(true);
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-[#B73D73] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center max-w-[60%]">
              <Link to="/" className="flex items-center gap-2 sm:gap-3 w-full">
                <img src="/logo.png" alt="Equipment On Sale Logo" className="w-auto max-w-[50vw] sm:max-w-[200px] h-10 sm:h-16 object-contain transition-all duration-300 hover:scale-105 hover:drop-shadow-md cursor-pointer" onError={(e) => {
                  // Fallback if logo.png not found
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }} />
                <div className="hidden font-extrabold text-xl sm:text-2xl tracking-tighter uppercase truncate">
                  <span className="text-[#939598]">E</span>
                  <span className="text-[#B73D73]">O</span>
                  <span className="text-[#B73D73]">S</span>
                </div>
              </Link>
            </div>
            <div className="hidden xl:flex space-x-8">
              <Link to="/#about" className="text-gray-600 hover:text-[#B73D73] font-medium transition-colors">About Us</Link>
              <Link to="/#industries" className="text-gray-600 hover:text-[#B73D73] font-medium transition-colors">Industries</Link>
              <Link to="/inventory" className="text-gray-600 hover:text-[#B73D73] font-medium transition-colors">Inventory</Link>
              <Link to="/#warranty" className="text-gray-600 hover:text-[#B73D73] font-medium transition-colors">Warranty & Logistics</Link>
              <a href="#contact" className="text-gray-600 hover:text-[#B73D73] font-medium transition-colors" onClick={handleContactClick}>Contact</a>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile menu button */}
              <button
                type="button"
                className="flex xl:hidden items-center justify-center p-2 rounded-md text-gray-800 hover:text-[#B73D73] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B73D73] z-50"
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-8 w-8 sm:h-10 sm:w-10" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile nav slide out menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-gray-900/50 backdrop-blur-sm xl:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-full sm:w-[400px] bg-white shadow-xl xl:hidden flex flex-col pt-4"
            >
              <div className="flex items-center justify-between px-6 h-20 border-b border-gray-100">
                <span className="font-extrabold text-[#B73D73] text-2xl">Menu</span>
                <button
                  type="button"
                  className="rounded-md p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B73D73]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-10 w-10" aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 px-6 py-8 space-y-6 overflow-y-auto">
                <Link to="/#about" className="block px-4 py-4 rounded-md text-xl font-medium text-gray-900 hover:text-[#B73D73] hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                <Link to="/#industries" className="block px-4 py-4 rounded-md text-xl font-medium text-gray-900 hover:text-[#B73D73] hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Industries</Link>
                <Link to="/inventory" className="block px-4 py-4 rounded-md text-xl font-medium text-gray-900 hover:text-[#B73D73] hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Inventory</Link>
                <Link to="/#warranty" className="block px-4 py-4 rounded-md text-xl font-medium text-gray-900 hover:text-[#B73D73] hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>Warranty & Logistics</Link>
                <a href="#contact" className="block px-4 py-4 rounded-md text-xl font-medium text-gray-900 hover:text-[#B73D73] hover:bg-gray-50" onClick={(e) => { setIsMobileMenuOpen(false); handleContactClick(e); }}>Contact</a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Routes>
        <Route path="/" element={<Home handleContactClick={handleContactClick} />} />
        <Route path="/inventory" element={<Inventory handleContactClick={handleContactClick} />} />
        <Route path="/inventory/:id" element={<InventoryItem handleContactClick={handleContactClick} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to upgrade without breaking the budget?</h2>
          <p className="text-xl text-gray-400 mb-10">
            Browse our current inventory or let our experts track down exactly what you need.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/inventory" className="px-8 py-4 rounded-sm text-lg font-bold text-white bg-[#B73D73] hover:bg-[#9E3261] transition-colors flex items-center justify-center">
              Browse Inventory <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button onClick={handleContactClick} className="px-8 py-4 rounded-sm text-lg font-bold text-white border-2 border-gray-600 hover:border-white hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center">
              <PhoneCall className="mr-2 h-5 w-5" /> Send an Inquiry
            </button>
          </div>

          <AnimatePresence>
            {isContactFormOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                animate={{ height: "auto", opacity: 1, marginTop: 40 }}
                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                className="overflow-hidden bg-gray-800 rounded-lg text-left"
              >
                <div className="p-8">
                  {formStatus === 'success' ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/50 mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">Message Sent Successfully!</h3>
                      <p className="text-gray-300">
                        Thank you for reaching out. We have received your inquiry and a member of our team will respond within 24 hours.
                      </p>
                      <button 
                        onClick={() => setIsContactFormOpen(false)}
                        className="mt-8 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-sm transition-colors font-medium"
                      >
                        Close Window
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6" noValidate>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name *</label>
                          <input
                            type="text"
                            id="firstName"
                            required
                            className={`w-full bg-gray-900 border ${formErrors.firstName ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all shadow-inner`}
                            value={formData.firstName}
                            onChange={(e) => {
                              setFormData({...formData, firstName: e.target.value});
                              if (formErrors.firstName) setFormErrors({...formErrors, firstName: undefined});
                            }}
                          />
                          {formErrors.firstName && <p className="mt-2 text-sm text-red-500">{formErrors.firstName}</p>}
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name *</label>
                          <input
                            type="text"
                            id="lastName"
                            required
                            className={`w-full bg-gray-900 border ${formErrors.lastName ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all shadow-inner`}
                            value={formData.lastName}
                            onChange={(e) => {
                              setFormData({...formData, lastName: e.target.value});
                              if (formErrors.lastName) setFormErrors({...formErrors, lastName: undefined});
                            }}
                          />
                          {formErrors.lastName && <p className="mt-2 text-sm text-red-500">{formErrors.lastName}</p>}
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-2">Business Name *</label>
                        <input
                          type="text"
                          id="businessName"
                          required
                          className={`w-full bg-gray-900 border ${formErrors.businessName ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all shadow-inner`}
                          value={formData.businessName}
                          onChange={(e) => {
                            setFormData({...formData, businessName: e.target.value});
                            if (formErrors.businessName) setFormErrors({...formErrors, businessName: undefined});
                          }}
                        />
                        {formErrors.businessName && <p className="mt-2 text-sm text-red-500">{formErrors.businessName}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">Phone Number *</label>
                          <input
                            type="tel"
                            id="phone"
                            required
                            className={`w-full bg-gray-900 border ${formErrors.phone ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all shadow-inner`}
                            value={formData.phone}
                            onChange={(e) => {
                              setFormData({...formData, phone: e.target.value});
                              if (formErrors.phone) setFormErrors({...formErrors, phone: undefined});
                            }}
                          />
                          {formErrors.phone && <p className="mt-2 text-sm text-red-500">{formErrors.phone}</p>}
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                          <input
                            type="email"
                            id="email"
                            required
                            className={`w-full bg-gray-900 border ${formErrors.email ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all shadow-inner`}
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({...formData, email: e.target.value});
                              if (formErrors.email) setFormErrors({...formErrors, email: undefined});
                            }}
                          />
                          {formErrors.email && <p className="mt-2 text-sm text-red-500">{formErrors.email}</p>}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-300 mb-2">How can we help? (Max 4000 characters) *</label>
                        <textarea
                          id="question"
                          required
                          maxLength={4000}
                          rows={6}
                          className={`w-full bg-gray-900 border ${formErrors.question ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all shadow-inner resize-none`}
                          value={formData.question}
                          onChange={(e) => {
                            setFormData({...formData, question: e.target.value});
                            if (formErrors.question) setFormErrors({...formErrors, question: undefined});
                          }}
                        ></textarea>
                        {formErrors.question && <p className="mt-2 text-sm text-red-500">{formErrors.question}</p>}
                        <div className="mt-2 text-right text-xs text-gray-500">
                          {formData.question.length} / 4000
                        </div>
                      </div>

                      <div className="bg-gray-800 p-5 rounded-sm border border-gray-700">
                        <label htmlFor="captcha" className="block text-sm font-medium text-gray-300 mb-3">
                          <ShieldCheck className="inline-block w-4 h-4 mr-1 text-[#B73D73] -mt-1" />
                          Security Check: What is {captchaVal1} + {captchaVal2}? *
                        </label>
                        <input
                          type="text"
                          id="captcha"
                          required
                          placeholder="Your answer"
                          className={`w-full sm:w-48 bg-gray-900 border ${formErrors.captcha ? 'border-red-500' : 'border-gray-700'} rounded-sm px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#B73D73] focus:border-transparent transition-all shadow-inner`}
                          value={captchaAnswer}
                          onChange={(e) => {
                            setCaptchaAnswer(e.target.value);
                            if (formErrors.captcha) setFormErrors({...formErrors, captcha: undefined});
                          }}
                        />
                        {formErrors.captcha && <p className="mt-2 text-sm text-red-500">{formErrors.captcha}</p>}
                      </div>

                      <div className="pt-4 flex justify-end">
                        <button
                          type="submit"
                          disabled={formStatus === 'submitting'}
                          className="px-8 py-4 rounded-sm text-lg font-bold text-white bg-[#B73D73] hover:bg-[#9E3261] transition-colors flex items-center justify-center disabled:opacity-70"
                        >
                          {formStatus === 'submitting' ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <Mail className="mr-2 h-5 w-5" /> Submit Inquiry
                            </span>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            <div className="flex flex-col gap-6 max-w-sm">
              <div className="flex items-center gap-6">
                <img src="/logo.png" alt="Equipment On Sale Logo" className="h-14 sm:h-16 object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }} />
                <div className="hidden font-extrabold text-xl tracking-tighter uppercase text-gray-500">
                  EOS
                </div>
                <div className="w-px h-16 bg-gray-800 hidden sm:block"></div>
                <img src="/teamwork-logo.png" alt="Teamwork of America LLC Logo" className="h-16 sm:h-20 object-contain opacity-70 grayscale brightness-[2] hover:grayscale-0 hover:brightness-100 hover:opacity-100 transition-all cursor-pointer drop-shadow-md" />
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                Equipment On Sale &reg; is a business of TW Holding (Teamwork of America LLC). We provide high-quality, lightly used industrial and manufacturing machinery.
              </p>
            </div>

            <div className="flex flex-col gap-4 min-w-[250px]">
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-2">Contact Us</h4>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span><strong className="text-gray-300 font-medium">Headquarters</strong><br/>1560 E Southlake Blvd Ste 100<br/>Southlake, TX 76092</span>
              </div>
              <div className="flex items-center gap-3 text-sm mt-2">
                <PhoneCall className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <a href="tel:817-973-5160" className="hover:text-white transition-colors">817-973-5160</a>
              </div>
              <div className="flex items-center gap-3 text-sm mt-2">
                <Mail className="h-5 w-5 text-gray-600 flex-shrink-0" />
                <a href="mailto:info@equipmentonsale.com" className="hover:text-white transition-colors">info@equipmentonsale.com</a>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
            <div>
              &copy; {new Date().getFullYear()} TW Holding (Teamwork of America LLC). All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/admin" className="hover:text-gray-400 transition-colors">Admin Login</Link>
              <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
