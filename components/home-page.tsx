"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Heart, Crown, ArrowRight, Star, MapPin, Calendar, CheckCircle, Globe, Clock, ChevronLeft, ChevronRight, BookOpen, Award, Facebook, Instagram, Youtube, Mail, Phone, Camera } from "lucide-react"

// Hook personnalisé pour détecter quand un élément est visible
function useInView<T extends HTMLElement = HTMLElement>(threshold = 0.1): [React.RefObject<T | null>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isInView];
}

// Données du slider
const slides = [
  {
    id: 1,
    gradient: 'from-blue-600 via-purple-600 to-blue-800',
    icon: '🏕️',
    title: 'Éditions Précédentes',
    subtitle: 'Découvrez les moments forts de nos camps bibliques',
    description: 'Des souvenirs inoubliables et des vies transformées par la Parole de Dieu'
  },
  {
    id: 2,
    gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    icon: '💪',
    title: 'Slogans Forts',
    subtitle: '"Jeunes, Soyez Forts dans la Foi"',
    description: 'Des messages puissants qui marquent et transforment les cœurs'
  },
  {
    id: 3,
    gradient: 'from-purple-600 via-pink-600 to-red-600',
    icon: '🎵',
    title: 'Chorégraphies',
    subtitle: 'Louange et Adoration en Mouvement',
    description: 'L\'expression de notre joie à travers la danse et la musique'
  },
  {
    id: 4,
    gradient: 'from-green-600 via-teal-600 to-blue-600',
    icon: '📖',
    title: 'Études Bibliques',
    subtitle: 'Approfondissement de la Parole',
    description: 'Des moments d\'enseignement qui nourrissent l\'âme et fortifient la foi'
  }
];

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const handleRegister = () => {
    router.push("/auth/register")
  }

  // Gestion du slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Gestion du scroll pour le header
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}>
        <div className="w-full" style={{ backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent' }}>
          <nav className="max-w-7xl mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between h-14 lg:h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-blue-900' : 'text-white'
                }`}>
                  MyIBC
                </h1>
              </div>

     

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Button
                  onClick={handleLogin}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 lg:py-3 lg:px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm lg:text-base"
                >
                  Connexion
                </Button>
                <Button
                  onClick={handleRegister}
                  className={`border-2 font-medium py-2 px-4 lg:py-3 lg:px-6 rounded-lg transition-all duration-300 text-sm lg:text-base ${
                    isScrolled 
                      ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700 hover:border-blue-700' 
                      : 'border-white bg-white text-blue-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="hidden sm:inline">S'enregistrer</span>
                  <span className="sm:hidden">Inscription</span>
                </Button>
              </div>
            </div>

            {/* Mobile Navigation - Displayed below header on small screens */}
            <div className="sm:hidden border-t border-white/20 py-2">
              <div className="flex justify-center space-x-4 overflow-x-auto">
                <a href="#accueil" className={`${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } font-medium transition-colors duration-300 hover:text-yellow-400 whitespace-nowrap text-sm py-1`}>Accueil</a>
                <a href="#camps" className={`${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } font-medium transition-colors duration-300 hover:text-yellow-400 whitespace-nowrap text-sm py-1`}>Camps</a>
                <a href="#programmes" className={`${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } font-medium transition-colors duration-300 hover:text-yellow-400 whitespace-nowrap text-sm py-1`}>Programmes</a>
                <a href="#galerie" className={`${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } font-medium transition-colors duration-300 hover:text-yellow-400 whitespace-nowrap text-sm py-1`}>Galerie</a>
                <a href="#contact" className={`${
                  isScrolled ? 'text-gray-700' : 'text-white'
                } font-medium transition-colors duration-300 hover:text-yellow-400 whitespace-nowrap text-sm py-1`}>Contact</a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Slider Section */}
      <section id="accueil" className="relative w-full h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => {
            const slideClass = 'absolute inset-0 transition-all duration-1000 ease-in-out ' + 
              (index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105');

            const contentClass = 'transition-all duration-700 delay-300 ' + 
              (index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0');

            return (
              <div key={slide.id} className={slideClass}>
                <div className="relative w-full h-full">
                  <div className={`w-full h-full bg-gradient-to-br ${slide.gradient}`} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-6xl lg:text-8xl animate-pulse opacity-20">
                      {slide.icon}
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full">
                    <div className="max-w-6xl mx-auto px-6 lg:px-8">
                      <div className="max-w-3xl">
                        <div className={contentClass}>
                          <p className="text-yellow-400 font-semibold text-base lg:text-lg mb-4">
                            {slide.subtitle}
                          </p>
                          <h1 className="text-4xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                            {slide.title}
                          </h1>
                          <p className="text-lg lg:text-2xl text-gray-200 mb-8 leading-relaxed">
                            {slide.description}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                              onClick={handleRegister}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                              Découvrir nos camps
                            </Button>
                            <Button
                              onClick={handleLogin}
                              className="border-2 border-white bg-white text-blue-900 hover:bg-gray-100 hover:text-blue-800 font-medium text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 rounded-lg transition-all duration-300 shadow-lg"
                            >
                              En savoir plus
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 lg:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Slide précédent"
        >
          <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 lg:p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
          aria-label="Slide suivant"
        >
          <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => {
            const dotClass = 'h-2 lg:h-3 rounded-full transition-all duration-300 cursor-pointer ' + 
              (index === currentSlide ? 'bg-yellow-400 w-6 lg:w-8' : 'bg-white/50 hover:bg-white/70 w-2 lg:w-3');

            return (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={dotClass}
                aria-label={`Aller au slide ${index + 1}`}
              />
            );
          })}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 animate-bounce hidden lg:block">
          <div className="flex flex-col items-center text-white/80">
            <span className="text-sm mb-2">Défiler</span>
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <VisionSection />

      {/* Verse Section */}
      <VerseSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Team Section */}
      <TeamSection />

      {/* Footer */}
      <FooterSection />
    </div>
  )
}

// Composant Vision Section
function VisionSection() {
  const [ref, isInView] = useInView();

  const sectionClass = 'transition-all duration-1000 ' + 
    (isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0');

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-white">
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={sectionClass}>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-900 mb-6">
                Notre Vision
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Former une génération de jeunes chrétiens passionnés, équipés et engagés 
                pour transformer leur communauté par l'Évangile de Jésus-Christ.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
                    <Heart className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-blue-900 mb-2">
                      Transformation spirituelle
                    </h3>
                    <p className="text-gray-600">
                      Accompagner chaque participant dans sa croissance spirituelle 
                      et son intimité avec Dieu.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
                    <Users className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-blue-900 mb-2">
                      Communauté fraternelle
                    </h3>
                    <p className="text-gray-600">
                      Créer des liens durables et authentiques entre les participants 
                      de différents horizons.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
                    <Award className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-blue-900 mb-2">
                      Formation d'excellence
                    </h3>
                    <p className="text-gray-600">
                      Offrir un enseignement biblique de qualité adapté à chaque 
                      tranche d'âge et niveau spirituel.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute top-6 right-6 text-4xl lg:text-6xl opacity-20">🌟</div>
                  <div className="absolute bottom-6 left-6 text-3xl lg:text-4xl opacity-20">⛪</div>
                  <div className="text-center text-white z-10">
                    <div className="text-4xl lg:text-6xl mb-4">🎯</div>
                    <div className="text-xl lg:text-2xl font-bold">Notre Vision</div>
                    <div className="text-base lg:text-lg opacity-90 mt-2">Formation • Transformation • Mission</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Verse Section
function VerseSection() {
  const [ref, isInView] = useInView();

  const sectionClass = 'text-center transition-all duration-1000 ' + 
    (isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0');

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-gradient-to-r from-blue-900 to-blue-700 text-white">
      <div className="w-full bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={sectionClass}>
            <BookOpen className="w-12 h-12 lg:w-16 lg:h-16 text-yellow-400 mx-auto mb-6 lg:mb-8" />
            <blockquote className="text-xl lg:text-4xl font-light italic mb-6 lg:mb-8 leading-relaxed">
              "Que personne ne méprise ta jeunesse; mais sois un modèle pour les fidèles, 
              en parole, en conduite, en charité, en foi, en pureté."
            </blockquote>
            <cite className="text-yellow-300 text-base lg:text-lg font-medium">
              1 Timothée 4:12
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Testimonials Section
function TestimonialsSection() {
  const [ref, isInView] = useInView();

  const testimonials = [
    {
      name: "Marie Kouassi",
      role: "Participante 2023",
      content: "Ce camp a complètement transformé ma relation avec Dieu. J'ai découvert ma vocation et ma passion pour l'évangélisation.",
      initials: "MK",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      name: "David Ngono",
      role: "Leader 2024",
      content: "L'expérience de leadership m'a permis de développer mes capacités et de servir avec excellence dans mon église locale.",
      initials: "DN",
      bgColor: "from-blue-500 to-indigo-600"
    },
    {
      name: "Grace Mbarga",
      role: "Participante 2022",
      content: "Les amitiés créées ici durent encore aujourd'hui. C'est bien plus qu'un camp, c'est une famille spirituelle.",
      initials: "GM",
      bgColor: "from-purple-500 to-violet-600"
    }
  ];

  const sectionClass = 'transition-all duration-1000 ' + 
    (isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0');

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-gray-50">
      <div className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={sectionClass}>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-900 mb-6">
                Témoignages
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Découvrez l'impact transformateur de nos camps à travers les témoignages de nos participants
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full mr-4 bg-gradient-to-br ${testimonial.bgColor} flex items-center justify-center text-white font-bold text-base lg:text-lg shadow-lg`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 text-sm lg:text-base">{testimonial.name}</h4>
                      <p className="text-gray-500 text-xs lg:text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic leading-relaxed text-sm lg:text-base">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Stats Section
function StatsSection() {
  const [ref, isInView] = useInView();

  const stats = [
    { number: "500+", label: "Jeunes formés", icon: Users },
    { number: "15", label: "Années d'expérience", icon: Award },
    { number: "25", label: "Pays représentés", icon: Crown },
    { number: "12", label: "Camps organisés", icon: Camera }
  ];

  const sectionClass = 'transition-all duration-1000 ' + 
    (isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0');

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-white">
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={sectionClass}>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-900 mb-6">
                Nos Réalisations
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Quelques chiffres qui témoignent de l'impact de nos camps bibliques
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="bg-yellow-100 w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                      <IconComponent className="w-8 h-8 lg:w-10 lg:h-10 text-yellow-700" />
                    </div>
                    <div className="text-3xl lg:text-5xl font-bold text-blue-900 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium text-sm lg:text-base">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Gallery Section
function GallerySection() {
  const [ref, isInView] = useInView();

  const galleryItems = [
    { gradient: "from-blue-500 to-cyan-600", icon: "🏕️", title: "Camp 1" },
    { gradient: "from-purple-500 to-pink-600", icon: "🎵", title: "Camp 2" },
    { gradient: "from-green-500 to-teal-600", icon: "📖", title: "Camp 3" },
    { gradient: "from-orange-500 to-red-600", icon: "⛪", title: "Camp 4" },
    { gradient: "from-indigo-500 to-blue-600", icon: "🙏", title: "Camp 5" },
    { gradient: "from-pink-500 to-rose-600", icon: "✨", title: "Camp 6" }
  ];

  const sectionClass = 'transition-all duration-1000 ' + 
    (isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0');

  return (
    <section ref={ref} id="galerie" className="py-16 lg:py-20 bg-gray-50">
      <div className="w-full bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={sectionClass}>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-900 mb-6">
                Galerie Photos
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Revivez les moments forts de nos camps à travers ces images
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
              {galleryItems.map((item, index) => (
                <div key={index} className="relative group overflow-hidden rounded-xl">
                  <div className={`w-full h-48 lg:h-64 bg-gradient-to-br ${item.gradient} flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110`}>
                    <div className="text-4xl lg:text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div className="absolute bottom-4 left-4 text-white font-semibold text-sm lg:text-lg">
                      {item.title}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Team Section
function TeamSection() {
  const [ref, isInView] = useInView();

  const team = [
    {
      name: "Pasteur Jean-Paul Koffi",
      role: "Directeur Général",
      initials: "JPK",
      bgColor: "from-blue-600 to-indigo-700"
    },
    {
      name: "Mme Sarah Atangana",
      role: "Coordinatrice Pédagogique",
      initials: "SA",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      name: "Pasteur Michel Ouédraogo",
      role: "Responsable Jeunes",
      initials: "MO",
      bgColor: "from-green-500 to-emerald-600"
    },
    {
      name: "Sœur Grace Talla",
      role: "Responsable Leadership",
      initials: "GT",
      bgColor: "from-purple-500 to-violet-600"
    }
  ];

  const sectionClass = 'transition-all duration-1000 ' + 
    (isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0');

  return (
    <section ref={ref} className="py-16 lg:py-20 bg-white">
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className={sectionClass}>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-900 mb-6">
                Notre Équipe
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Une équipe passionnée et expérimentée au service de votre formation spirituelle
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className={`w-40 h-40 lg:w-48 lg:h-48 rounded-full mx-auto bg-gradient-to-br ${member.bgColor} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <div className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold mb-2">{member.initials}</div>
                        <div className="text-xs lg:text-sm opacity-80">👤</div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-blue-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-yellow-700 font-medium text-sm lg:text-base">
                    {member.role}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Composant Footer Section
function FooterSection() {
  const [ref, isInView] = useInView();

  return (
    <footer ref={ref} id="contact" className="bg-blue-900 text-white">
      <div className="w-full bg-blue-900">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
          <div className={`transition-all duration-1000 ${
            isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
          }`}>
            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
              <div className="lg:col-span-2">
                <h3 className="text-xl lg:text-2xl font-bold mb-6">MyIBC</h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">
                  Plateforme de gestion des camps bibliques internationaux de la CMCI. 
                  Nous nous engageons à former une génération de jeunes chrétiens passionnés 
                  et équipés pour transformer leur communauté.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors duration-300">
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-base lg:text-lg font-semibold mb-6">Liens Rapides</h4>
                <ul className="space-y-3">
                  <li><a href="#camps" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Nos Camps</a></li>
                  <li><a href="#programmes" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Programmes</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Témoignages</a></li>
                  <li><a href="#galerie" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Galerie</a></li>
                  <li><a href="#contact" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Contact</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-base lg:text-lg font-semibold mb-6">Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm lg:text-base">
                        Douala, Cameroun<br />
                        Centre Missionnaire Chrétien International
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-gray-300 text-sm lg:text-base">+237 6XX XXX XXX</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-gray-300 text-sm lg:text-base">contact@myibc.cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-full bg-blue-900">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 lg:py-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h4 className="text-base lg:text-lg font-semibold mb-2">Restez informés</h4>
                <p className="text-gray-300 text-sm lg:text-base">
                  Recevez les dernières nouvelles de nos camps et événements
                </p>
              </div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="px-3 lg:px-4 py-2 lg:py-3 rounded-l-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 min-w-0 flex-1 text-sm lg:text-base"
                />
                <button className="bg-yellow-700 hover:bg-yellow-600 px-4 lg:px-6 py-2 lg:py-3 rounded-r-lg transition-colors duration-300 font-medium text-sm lg:text-base">
                  S'abonner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="w-full bg-blue-900">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-4 lg:py-6">
            <div className="md:flex md:items-center md:justify-between text-center md:text-left">
              <p className="text-gray-400 text-xs lg:text-sm">
                © 2024 MyIBC - CMCI. Tous droits réservés.
              </p>
              <div className="mt-2 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-xs lg:text-sm mr-6 transition-colors duration-300">
                  Politique de confidentialité
                </a>
                <a href="#" className="text-gray-400 hover:text-white text-xs lg:text-sm transition-colors duration-300">
                  Conditions d'utilisation
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}