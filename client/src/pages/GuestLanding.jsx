
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // This import is crucial
// import { Star, Users, Zap, Target, CheckCircle, ArrowRight, Play } from 'lucide-react';

// const GuestLanding = () => {
//   const [currentTestimonial, setCurrentTestimonial] = useState(0);
//   const [isVisible, setIsVisible] = useState({});

//   const testimonials = [
//     {
//       name: "Sarah Chen",
//       role: "Software Engineer at Google",
//       image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
//       content: "AI Interview Pro transformed my interview skills completely. I went from nervous wreck to confident candidate in just 2 weeks. The real-time feedback is incredible!",
//       rating: 5,
//       company: "Google"
//     },
//     {
//       name: "Marcus Johnson",
//       role: "Product Manager at Meta",
//       image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
//       content: "The AI's ability to adapt to different interview styles is phenomenal. It prepared me for behavioral, technical, and case study interviews seamlessly.",
//       rating: 5,
//       company: "Meta"
//     },
//     {
//       name: "Emily Rodriguez",
//       role: "Data Scientist at Netflix",
//       image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
//       content: "I practiced over 100 mock interviews and improved my confidence by 300%. The personalized feedback helped me identify and fix my weak points.",
//       rating: 5,
//       company: "Netflix"
//     }
//   ];

//   const features = [
//     {
//       icon: <Zap className="w-8 h-8" />,
//       title: "Real-Time AI Feedback",
//       description: "Get instant, personalized feedback on your responses, body language, and communication style during practice sessions."
//     },
//     {
//       icon: <Target className="w-8 h-8" />,
//       title: "Industry-Specific Prep",
//       description: "Tailored questions and scenarios for tech, finance, consulting, and more. Practice with real interview questions from top companies."
//     },
//     {
//       icon: <Users className="w-8 h-8" />,
//       title: "Proven Success Rate",
//       description: "95% of our users report improved interview performance. Join thousands who've landed their dream jobs."
//     }
//   ];

//   const stats = [
//     { number: "50K+", label: "Success Stories" },
//     { number: "95%", label: "Success Rate" },
//     { number: "500+", label: "Company Questions" },
//     { number: "24/7", label: "AI Availability" }
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(interval);
//   }, [testimonials.length]);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     document.querySelectorAll('[id^="section-"]').forEach((el) => {
//       observer.observe(el);
//     });

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white text-gray-900 overflow-hidden font-sans">
//       {/* Hero Section */}
//       <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
//         <div className="max-w-6xl mx-auto text-center z-10">
//           <div className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200">
//             <Zap className="w-4 h-4 mr-2 text-purple-600" />
//             <span className="text-sm font-semibold text-purple-800">AI-Powered Interview Training</span>
//           </div>

//           <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
//             Master Every Interview
//             <br />
//             <span className="text-4xl md:text-6xl text-purple-700">Land Your Dream Job</span>
//           </h1>

//           <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
//             Practice with advanced AI that adapts to your industry, provides **real-time feedback**, and helps you build unshakeable confidence.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
//             {/* Changed to Link component */}
//             <Link to="/login" className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-300 flex items-center">
//               Start Free Trial
//               <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </Link>

//             <button className="group px-8 py-4 border-2 border-gray-300 rounded-xl font-bold text-gray-800 text-lg transition-all duration-300 hover:bg-gray-100 hover:scale-105 flex items-center">
//               <Play className="mr-2 w-5 h-5 text-gray-600" />
//               Watch Demo
//             </button>
//           </div>

//           {/* Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8 rounded-xl bg-white shadow-xl border border-gray-100">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-3xl md:text-4xl font-extrabold text-purple-700">
//                   {stat.number}
//                 </div>
//                 <div className="text-gray-600 mt-2 font-medium">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="section-features" className={`py-20 px-6 bg-gray-50 transition-all duration-1000 ${isVisible['section-features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Why AI Interview Pro?</h2>
//             <p className="text-xl text-gray-700 max-w-2xl mx-auto">
//               Revolutionary technology meets proven interview strategies to give you the ultimate competitive advantage.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-3 gap-8">
//             {features.map((feature, index) => (
//               <div key={index} className="group p-8 rounded-2xl bg-white shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-2">
//                 <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
//                   {feature.icon}
//                 </div>
//                 <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
//                 <p className="text-gray-700 leading-relaxed">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section id="section-testimonials" className={`py-20 px-6 bg-purple-50 transition-all duration-1000 ${isVisible['section-testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Success Stories</h2>
//             <p className="text-xl text-gray-700 max-w-2xl mx-auto">
//               Join thousands of professionals who transformed their careers with AI Interview Pro.
//             </p>
//           </div>

//           <div className="relative max-w-4xl mx-auto">
//             <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-purple-200">
//               <div className="flex items-center mb-6">
//                 <img
//                   src={testimonials[currentTestimonial].image}
//                   alt={testimonials[currentTestimonial].name}
//                   className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-400 shadow-md"
//                 />
//                 <div>
//                   <h4 className="font-bold text-lg text-gray-900">{testimonials[currentTestimonial].name}</h4>
//                   <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
//                   <div className="flex items-center mt-1">
//                     {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
//                       <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6 italic">
//                 "{testimonials[currentTestimonial].content}"
//               </blockquote>

//               <div className="flex items-center justify-between">
//                 <div className="text-sm text-gray-500">
//                   Now at **{testimonials[currentTestimonial].company}**
//                 </div>
//                 <div className="flex space-x-2">
//                   {testimonials.map((_, index) => (
//                     <button
//                       key={index}
//                       onClick={() => setCurrentTestimonial(index)}
//                       className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                         index === currentTestimonial ? 'bg-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
//                       }`}
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section id="section-cta" className={`py-20 px-6 bg-white transition-all duration-1000 ${isVisible['section-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-12 shadow-xl border border-purple-200">
//             <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
//               Ready to Ace Your Next Interview?
//             </h2>
//             <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
//               Join **50,000+ professionals** who've already transformed their careers. Start your free trial today.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 text-gray-700 font-medium">
//               <div className="flex items-center">
//                 <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                 <span>7-day free trial</span>
//               </div>
//               <div className="flex items-center">
//                 <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                 <span>No credit card required</span>
//               </div>
//               <div className="flex items-center">
//                 <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//                 <span>Cancel anytime</span>
//               </div>
//             </div>

//             {/* Changed to Link component */}
//             <Link to="/login" className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-300 flex items-center mx-auto">
//               Start Your Success Journey
//               <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="py-12 px-6 border-t border-gray-100 bg-gray-50">
//         <div className="max-w-6xl mx-auto text-center">
//           <div className="text-2xl font-extrabold mb-4 text-purple-700">
//             AI Interview Pro
//           </div>
//           <p className="text-gray-600 mb-6">Empowering careers through intelligent interview preparation.</p>
//           <div className="flex justify-center space-x-6 text-sm text-gray-500">
//             <a href="#" className="hover:text-purple-600 transition-colors font-medium">Privacy Policy</a>
//             <a href="#" className="hover:text-purple-600 transition-colors font-medium">Terms of Service</a>
//             <a href="#" className="hover:text-purple-600 transition-colors font-medium">Contact Us</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default GuestLanding;

import React, { useState, useEffect, useRef } from 'react'; // Import useRef for video
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Zap, Target, CheckCircle, ArrowRight } from 'lucide-react'; // Removed Play icon as it's no longer needed for the button

const GuestLanding = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const videoRef = useRef(null); // Ref for the video element

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "AI Interview Pro transformed my interview skills completely. I went from nervous wreck to confident candidate in just 2 weeks. The real-time feedback is incredible!",
      rating: 5,
      company: "Google"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager at Meta",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      content: "The AI's ability to adapt to different interview styles is phenomenal. It prepared me for behavioral, technical, and case study interviews seamlessly.",
      rating: 5,
      company: "Meta"
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist at Netflix",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "I practiced over 100 mock interviews and improved my confidence by 300%. The personalized feedback helped me identify and fix my weak points.",
      rating: 5,
      company: "Netflix"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-Time AI Feedback",
      description: "Get instant, personalized feedback on your responses, body language, and communication style during practice sessions."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Industry-Specific Prep",
      description: "Tailored questions and scenarios for tech, finance, consulting, and more. Practice with real interview questions from top companies."
    },
    {
      // New feature: Cutting-Edge AI Models
      icon: <CheckCircle className="w-8 h-8" />, // Changed icon to CheckCircle, feel free to pick another
      title: "Powered by State-of-the-Art AI",
      description: "Leveraging the latest advancements in AI and NLP, our models provide highly accurate and nuanced feedback for unparalleled preparation."
    }
  ];


  const stats = [
    { number: "50K+", label: "Success Stories" },
    { number: "95%", label: "Success Rate" },
    { number: "500+", label: "Company Questions" },
    { number: "24/7", label: "AI Availability" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
            // If the video section becomes visible, play the video
            if (entry.target.id === 'section-demo' && videoRef.current) {
              videoRef.current.play();
            }
          } else {
            // If the video section leaves the viewport, pause the video
            if (entry.target.id === 'section-demo' && videoRef.current) {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden font-sans">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto text-center z-10">
          <div className="mb-8 inline-flex items-center px-4 py-2 rounded-full bg-purple-100 border border-purple-200">
            <Zap className="w-4 h-4 mr-2 text-purple-600" />
            <span className="text-sm font-semibold text-purple-800">AI-Powered Interview Training</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight">
            Master Every Interview
            <br />
            <span className="text-4xl md:text-6xl text-purple-700">Land Your Dream Job</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Practice with advanced AI that adapts to your industry, provides **real-time feedback**, and helps you build unshakeable confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/signup" className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-300 flex items-center">
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <section id="section-demo" className={`py-20 px-6 bg-gray-50 transition-all duration-1000 ${isVisible['section-demo'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900">
            See AI Interview Pro in Action
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto">
            Watch a quick demo to understand how our intelligent platform provides real-time feedback and helps you refine your responses.
          </p>
          <div className="relative w-full max-w-4xl mx-auto bg-black rounded-xl shadow-2xl overflow-hidden aspect-video">
            <video
              ref={videoRef}
              controls
              muted // Start muted for better user experience
              loop // Loop the video
              playsInline // Important for iOS auto-play
              className="w-full h-full object-cover"
            >
              <source src="/aiXinterve_demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto py-8 rounded-xl bg-white shadow-xl border border-gray-100">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-purple-700">
                  {stat.number}
                </div>
                <div className="text-gray-600 mt-2 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Demo Section */}
      

      {/* Features Section */}
      <section id="section-features" className={`py-20 px-6 bg-white transition-all duration-1000 ${isVisible['section-features'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Why AI Interview Pro?</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Revolutionary technology meets proven interview strategies to give you the ultimate competitive advantage.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-8 rounded-2xl bg-gray-50 shadow-lg border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-2">
                <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="section-testimonials" className={`py-20 px-6 bg-purple-50 transition-all duration-1000 ${isVisible['section-testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">Success Stories</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Join thousands of professionals who transformed their careers with AI Interview Pro.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-purple-200">
              <div className="flex items-center mb-6">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-purple-400 shadow-md"
                />
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6 italic">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Now at **{testimonials[currentTestimonial].company}**
                </div>
                <div className="flex space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial ? 'bg-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="section-cta" className={`py-20 px-6 bg-white transition-all duration-1000 ${isVisible['section-cta'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-3xl p-12 shadow-xl border border-purple-200">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join **50,000+ professionals** who've already transformed their careers. Start your free trial today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 text-gray-700 font-medium">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                <span>Cancel anytime</span>
              </div>
            </div>

            {/* Changed to Link component, directly to signup */}
            <Link to="/signup" className="group px-10 py-5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold text-white text-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-300 flex items-center justify-center mx-auto">
              Start Your Success Journey
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-extrabold mb-4 text-purple-700">
            AI Interview Pro
          </div>
          <p className="text-gray-600 mb-6">Empowering careers through intelligent interview preparation.</p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-600 transition-colors font-medium">Privacy Policy</a>
            <a href="#" className="hover:text-purple-600 transition-colors font-medium">Terms of Service</a>
            <a href="#" className="hover:text-purple-600 transition-colors font-medium">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GuestLanding;