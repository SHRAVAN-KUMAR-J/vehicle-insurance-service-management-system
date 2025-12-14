import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Common/Navbar';
import { Shield, Car, FileCheck, ArrowRight, Star, Clock, CheckCircle } from 'lucide-react';

function Home() {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState({});

  const features = [
    {
      title: "Easy Vehicle Registration",
      description: "Register your vehicles seamlessly with our intuitive system",
      image: "https://img.freepik.com/vecteurs-premium/vecteur-icone-inspection-liste-controle-vehicule-voiture-liste-controle-entretien-technique-service-automatique-plat_101884-2179.jpg",
      icon: "🚗"
    },
    {
      title: "Chat and Support For Customers",
      description: "Customer can communicate our staffs to clear all doughts regarding vehicle insurance service",
      image: "https://img.freepik.com/free-vector/man-broadcasting-live-event_23-2148525849.jpg?semt=ais_hybrid&w=740&q=80",
      icon: "💬"
    },
    {
      title: "Insurance PDF Documentation",
      description: "Customer can easy to get Insurance pdf by Admin Approval",
      image: "https://img.freepik.com/vecteurs-premium/icone-permis-conduire-carte-informations-diagnostic-automobile_101884-1382.jpg",
      icon: "📋"
    }
  ];

  const services = [
    {
      title: "Insurance Renewal",
      description: "Never miss a renewal date with our smart reminder system",
      image: "https://smcinsurance.com/SocialImages/ArticleImages/september-2023/car-insurance-renewal.jpg",
      features: ["Auto Reminders", "Quick Processing", "Digital Policies"]
    },
    {
      title: "Policy Management",
      description: "Manage all your insurance policies from start to expiry",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsoMjc_Rg2ikuWYZ2UU7bVoS8r4hqd7wFmOg&s",
      features: ["Start to Expiry Tracking", "Multiple Vehicles", "Family Coverage"]
    },
    {
      title: "Smart Reminders",
      description: "Get timely reminders for renewals and services",
      image: "https://m.media-amazon.com/images/I/61ZkHi89zTL.png",
      features: ["SMS & Email Alerts", "Customizable Schedule", "Priority Notifications"]
    },
    {
      title: "Vehicle Maintenance",
      description: "Complete vehicle service and maintenance tracking",
      image: "https://media.istockphoto.com/id/1463610112/vector/mechanic-checking-the-list-of-a-car-on-a-clipboard.jpg?s=612x612&w=0&k=20&c=RrDmg1wuyu7p4Pb3pCm_0ndSxMbzKiscZuDbs8so6TE=",
      features: ["Service History", "Maintenance Schedule", "Service Centers"]
    }
  ];

  const insuranceTypes = [
    {
      type: "Comprehensive Car Insurance",
      image: "https://static.pbcdn.in/cdn/images/bu/motor/is-buying-car-insurance-online-safe.jpg",
      coverage: ["Third Party Liability", "Own Damage", "Theft Protection"],
      premium: "Starting at ₹2,999/year"
    },
    {
      type: "Third Party Insurance",
      image: "https://cms-img.coverfox.com/types-of-motor-insurance-policies.webp",
      coverage: ["Third Party Injury", "Property Damage", "Legal Compliance"],
      premium: "Starting at ₹1,999/year"
    },
    {
      type: "Two-Wheeler Insurance",
      image: "https://www.okbima.com/assets/uploads/blog/1071d6b35e0eff84e9245263fbb3b545.webp",
      coverage: ["Accident Cover", "Theft Protection", "Personal Accident"],
      premium: "Starting at ₹499/year"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    // Staggered section animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setSectionsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }, index * 300); // Staggered delay of 300ms per section
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.anim-section');
    sections.forEach(section => observer.observe(section));

    return () => {
      clearInterval(interval);
      document.documentElement.style.scrollBehavior = '';
      observer.disconnect();
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        id="hero"
        className={`anim-section relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden ${sectionsVisible.hero ? 'visible' : ''}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Floating Icons Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Shield className="absolute top-1/4 left-1/4 w-8 h-8 text-blue-300 opacity-20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}} />
          <Car className="absolute top-1/3 right-1/4 w-10 h-10 text-purple-300 opacity-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}} />
          <FileCheck className="absolute bottom-1/3 left-1/3 w-6 h-6 text-indigo-300 opacity-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}} />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div 
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Left Content */}
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Trust Badge */}
              <motion.div 
                className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/40 rounded-full px-4 py-2 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold text-yellow-400">India's Most Trusted Platform</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl font-extrabold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Vehicle Insurance 
                </span>
                <span className="block mt-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                 Management
                </span>
              </motion.h1>

              <motion.p 
                className="text-xl text-blue-100 leading-relaxed"
                variants={itemVariants}
                viewport={{ once: true }}
              >
                Comprehensive vehicle insurance and service management platform. 
                Protect your vehicle with India's most trusted insurance partners.
              </motion.p>

              {/* Feature Pills */}
              <motion.div 
                className="flex flex-wrap gap-3"
                variants={itemVariants}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium">Instant Coverage</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">with document</span>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4"
                variants={itemVariants}
                viewport={{ once: true }}
              >
                <button className="group relative bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-2xl">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>
                
                <button className="group border-2 border-white/40 backdrop-blur-sm px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-slate-900 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  Learn More
                  <FileCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
              </motion.div>
            </motion.div>

            {/* Right Content - Vehicle Insurance Illustration */}
            <motion.div 
              className="relative" 
              variants={itemVariants}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-[500px] flex items-center justify-center">
                {/* Glowing Circle Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Main Image Container */}
                <motion.div 
                  className="relative z-10 w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src="https://png.pngtree.com/png-clipart/20220926/original/pngtree-car-insurance-logo-png-image_8633135.png"
                    alt="Vehicle Insurance Protection"
                    className="w-full h-full object-contain drop-shadow-2xl animate-float"
                  />
                </motion.div>
                
                {/* Floating Feature Cards */}
                <motion.div 
                  className="absolute top-10 left-0 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-float" 
                  style={{animationDelay: '0.5s'}}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <Shield className="w-8 h-8 text-blue-600 mb-2" />
                  <p className="text-slate-900 font-bold text-sm">Reminder setup</p>
                  <p className="text-slate-600 text-xs">/for customers</p>
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-20 right-0 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl animate-float" 
                  style={{animationDelay: '1s'}}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  viewport={{ once: true }}
                >
                  <Car className="w-8 h-8 text-purple-600 mb-2" />
                  <p className="text-slate-900 font-bold text-sm">Quick Renewal</p>
                  <p className="text-slate-600 text-xs">/by Staff</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Vehicle Insurance Portal Intro Section */}
      <motion.section 
        id="intro"
        className={`anim-section py-20 bg-white overflow-hidden ${sectionsVisible.intro ? 'visible' : ''}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Left Side Image with Animation */}
            <motion.div 
              className="flex justify-center"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-20 blur-lg animate-pulse"></div>
                <img
                  src="https://ithought.co.in/wp-content/uploads/2023/06/vehicle-insurance-comprehensive-ithoughtplan.png"
                  alt="Vehicle Insurance Portal"
                  className="w-full max-w-lg rounded-xl shadow-2xl relative transform transition-all duration-1000 hover:scale-105"
                  loading="lazy"
                />
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-bounce opacity-80"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                />
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-bounce opacity-80"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 0.8 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </motion.div>
            </motion.div>

            {/* Right Side Content with Staggered Animation */}
            <motion.div className="space-y-6" variants={containerVariants}>
              {/* Animated Title */}
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-gray-800"
                variants={itemVariants}
                viewport={{ once: true }}
              >
                Vehicle Insurance{' '}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Portal
                </span>
              </motion.h2>

              {/* Animated Description */}
              <motion.div className="space-y-4" variants={itemVariants}>
                <motion.p 
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Our <span className="font-semibold text-blue-600">smart insurance portal</span> provides seamless insurance management between Customers, Staff, and Administrators. 
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  Customers can easily register their vehicles and make insurance payments securely. Our dedicated staff team verifies payments and uploads insurance documents, while administrators ensure everything runs smoothly with final approvals.
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-600 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                >
                  Our automated reminder system keeps customers informed through email and in-app notifications when renewal time approaches, ensuring continuous coverage.
                </motion.p>
              </motion.div>

              {/* Feature Highlights */}
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={containerVariants}
                viewport={{ once: true }}
              >
                <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">👩🏻‍💻 Staff member suport</span>
                </motion.div>
                <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">💾 PDF Certificates</span>
                </motion.div>
                <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">⏰ Auto Reminders</span>
                </motion.div>
                <motion.div className="flex items-center space-x-2" variants={itemVariants}>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">💼 24/7 Support</span>
                </motion.div>
              </motion.div>

              {/* Animated Button */}
              <motion.div variants={itemVariants}>
                <Link
                  to="/about"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 transform hover:-translate-y-1"
                >
                  <span>Discover More</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features"
        className={`anim-section py-20 bg-gray-50 ${sectionsVisible.features ? 'visible' : ''}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-800 mb-4"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              Why Choose Our Platform?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              Experience the future of vehicle insurance management with our comprehensive digital platform
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-xl transform transition-all duration-500 hover:scale-105 border-l-4 ${
                  index === 0 ? 'border-blue-500' : 
                  index === 1 ? 'border-green-500' : 'border-purple-500'
                }`}
                variants={itemVariants}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {feature.description}
                </p>
                <div className="h-48 overflow-hidden rounded-lg">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover transform hover:scale-110 transition duration-500"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Insurance Types Section */}
      <motion.section 
        id="insurance"
        className={`anim-section py-20 bg-gradient-to-br from-indigo-600 to-blue-700 text-white ${sectionsVisible.insurance ? 'visible' : ''}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-4"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              Insurance Plans
            </motion.h2>
            <motion.p 
              className="text-xl text-blue-100"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              Choose the perfect coverage for your vehicle
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {insuranceTypes.map((insurance, index) => (
              <motion.div 
                key={index}
                className="bg-white text-gray-800 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300"
                variants={itemVariants}
                viewport={{ once: true }}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={insurance.image} 
                    alt={insurance.type}
                    className="w-full h-full object-cover hover:scale-110 transition duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">{insurance.type}</h3>
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-700 mb-3">Coverage Includes:</h4>
                    <ul className="space-y-2">
                      {insurance.coverage.map((item, idx) => (
                        <li key={idx} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-bold text-blue-700">{insurance.premium}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        id="cta"
        className={`anim-section py-20 bg-gray-900 text-white ${sectionsVisible.cta ? 'visible' : ''}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl font-bold mb-6"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              Ready to Protect Your Vehicle?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              Join thousands of satisfied customers who trust us with their vehicle insurance and service needs.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
              viewport={{ once: true }}
            >
              <Link 
                to="/register" 
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Start Your Journey
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transform hover:scale-105 transition-all duration-300"
              >
                Existing Customer
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        id="footer"
        className={`anim-section bg-gray-800 text-white py-12 ${sectionsVisible.footer ? 'visible' : ''}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} viewport={{ once: true }}>
              <h3 className="text-xl font-bold mb-4">Vehicle Insurance System</h3>
              <p className="text-gray-400">
                Your trusted partner for comprehensive vehicle insurance and service management.
              </p>
            </motion.div>
            <motion.div variants={itemVariants} viewport={{ once: true }}>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition">Home</Link></li>
                <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
                <li><Link to="/about" className="hover:text-white transition">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} viewport={{ once: true }}>
              <h4 className="font-semibold mb-4">Insurance Types</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Car Insurance</a></li>
                <li><a href="#" className="hover:text-white transition">Bike Insurance</a></li>
                <li><a href="#" className="hover:text-white transition">Commercial Vehicle</a></li>
                <li><a href="#" className="hover:text-white transition">Third Party</a></li>
              </ul>
            </motion.div>
            <motion.div variants={itemVariants} viewport={{ once: true }}>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +91 98765 43210</li>
                <li>✉️ support@vehicleinsurance.com</li>
                <li>📍 123 Insurance Street, Mumbai, India</li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div 
            className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2024 Vehicle Insurance System. All rights reserved.</p>
          </motion.div>
        </div>
      </motion.footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out;
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out;
        }
        
        .anim-section {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .anim-section.visible {
          animation: fadeInUp 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default Home;