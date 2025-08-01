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
    title: 'Camps Bibliques Internationaux (CBI)',
    subtitle: 'Depuis 2009 - Vision du Pasteur Théodore Andoseh',
    description: 'Formation stratégique de la jeunesse selon la vision reçue de Zacharias Tanee Fomum'
  },
  {
    id: 2,
    gradient: 'from-indigo-600 via-blue-600 to-cyan-600',
    icon: '💪',
    title: 'Équiper des Ministres Compétents',
    subtitle: '"Bâtir et établir fermement dans le Seigneur"',
    description: 'Former une génération de co-ouvriers prêts à relever les défis contemporains'
  },
  {
    id: 3,
    gradient: 'from-purple-600 via-pink-600 to-red-600',
    icon: '🎯',
    title: 'Vision et Mission Globale',
    subtitle: 'Imprégner de la vision reçue',
    description: 'Encourager la consécration totale à la mission de Dieu dans le monde'
  },
  {
    id: 4,
    gradient: 'from-green-600 via-teal-600 to-blue-600',
    icon: '📖',
    title: 'Formation Spirituelle d\'Excellence',
    subtitle: 'Enseignements bibliques approfondis',
    description: 'Construction d\'une génération de disciples pérenne, garants de la continuité spirituelle'
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Gestion du slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Gestion du scroll pour changer la couleur du texte
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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
      {/* Bouton Commencer fixe en bas - s'affiche seulement en scrollant */}
      {isScrolled && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={scrollToTop}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-full shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 animate-fade-in"
          >
            <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
            <span>Commencer</span>
          </Button>
        </div>
      )}

      {/* Hero Section avec définition CBI */}
      <section id="accueil" className="relative w-full h-screen overflow-hidden">
        {/* Logo dans le Hero Section */}
        <div className="absolute top-4 left-8 z-40 flex flex-col items-center space-y-3">
          <div className="w-28 h-28 lg:w-36 lg:h-36 rounded-lg flex items-center justify-center">
            <img
              src="/CMCI0.png"
              alt="CMCI Logo"
              className="w-26 h-26 lg:w-34 lg:h-34 object-contain"
            />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg text-center">
            MyIBC
          </h1>
        </div>

        {/* Boutons d'action dans le Hero */}
        <div className="absolute top-8 right-8 z-40 flex items-center space-x-4">
          <Button
            onClick={handleLogin}
            className="font-medium py-3 px-6 lg:py-4 lg:px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-base lg:text-lg bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            Connexion
          </Button>
          <Button
            onClick={handleRegister}
            className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-blue-900 backdrop-blur-sm font-medium py-3 px-6 lg:py-4 lg:px-8 rounded-lg transition-all duration-300 shadow-lg text-base lg:text-lg"
          >
            <span className="hidden sm:inline">S'enregistrer</span>
            <span className="sm:hidden">Inscription</span>
          </Button>
        </div>

        {/* Navigation mobile en bas */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-50 lg:hidden">
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div className="flex space-x-6">
              <a href="#accueil" className="text-white font-medium text-sm hover:text-yellow-400 transition-colors duration-300">Accueil</a>
              <a href="#galerie" className="text-white font-medium text-sm hover:text-yellow-400 transition-colors duration-300">Galerie</a>
              <a href="#contact" className="text-white font-medium text-sm hover:text-yellow-400 transition-colors duration-300">Contact</a>
            </div>
          </div>
        </div>

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

        {/* Section de définition CBI */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/20">
            <p className="text-white/90 text-sm lg:text-base font-medium">
              CBI = Camps Bibliques Internationaux
            </p>
            <p className="text-white/75 text-xs lg:text-sm mt-1">
              Communauté Missionnaire Chrétienne Internationale (CMCI)
            </p>
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
                Notre Vision CBI
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
                Portée par le Pasteur Théodore Andoseh, leader mondial de la Communauté Missionnaire Chrétienne Internationale (CMCI), 
                notre vision est de former une génération de disciples engagés dans la mission globale de Dieu, 
                équipés selon la vision reçue de Zacharias Tanee Fomum.
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
                      Bâtir et établir fermement
                    </h3>
                    <p className="text-gray-600">
                      Construire les jeunes et les établir solidement dans le Seigneur 
                      pour une croissance spirituelle durable.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
                    <Users className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-blue-900 mb-2">
                      Équiper des ministres compétents
                    </h3>
                    <p className="text-gray-600">
                      Former des co-ouvriers spirituels capables de relever 
                      les défis contemporains avec excellence.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 p-3 rounded-lg flex-shrink-0">
                    <Award className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div>
                    <h3 className="text-lg lg:text-xl font-semibold text-blue-900 mb-2">
                      Imprégner de la vision reçue
                    </h3>
                    <p className="text-gray-600">
                      Transmettre fidèlement la vision de Zacharias Tanee Fomum 
                      et encourager la consécration totale à la mission.
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
                    <div className="text-xl lg:text-2xl font-bold">Vision Camps Bibliques</div>
                    <div className="text-base lg:text-lg opacity-90 mt-2">Formation • Vision • Mission</div>
                    <div className="text-sm opacity-80 mt-2">Depuis 2009</div>
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
              "Ta préparation spirituelle est toujours en vue de ce que tu vois"
            </blockquote>
            <cite className="text-yellow-300 text-base lg:text-lg font-medium">
              Pasteur Théodore Andoseh
            </cite>
            <p className="text-white/80 text-sm lg:text-base mt-4 max-w-3xl mx-auto">
              Une communauté à impact global naît d'un travail stratégique et d'un leadership 
              qui sert avec humilité et zèle.
            </p>
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
      name: "",
      role: "",
      content: "",
      initials: "?",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      name: "",
      role: "",
      content: "",
      initials: "?",
      bgColor: "from-blue-500 to-indigo-600"
    },
    {
      name: "",
      role: "",
      content: "",
      initials: "?",
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
                      <h4 className="font-semibold text-blue-900 text-sm lg:text-base">
                        {testimonial.name || "Témoignage à venir"}
                      </h4>
                      <p className="text-gray-500 text-xs lg:text-sm">
                        {testimonial.role || "Participant CBI"}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-700 italic leading-relaxed text-sm lg:text-base min-h-[100px] flex items-center justify-center">
                    {testimonial.content || (
                      <span className="text-gray-400 text-center">
                        Témoignage en cours de collecte...
                      </span>
                    )}
                  </div>
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
    { number: "2000+", label: "Participants par camp", icon: Users },
    { number: "15", label: "Années d'expérience", icon: Award },
    { number: "2009", label: "Premier camp CMCI", icon: Crown },
    { number: "2012", label: "Phase internationale", icon: Globe }
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
                Impact des CBI
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Quelques chiffres qui témoignent de l'impact transformateur de nos Camps Bibliques Internationaux
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
  const router = useRouter();

  const handleRegister = () => {
    router.push("/auth/register");
  };

  const galleryItems = [
    { 
      image: "/cmci1.png", 
      title: "CBI Koumé 2022", 
      description: "Camp Biblique International - Enseignements et formation spirituelle",
      alt: "International Bible Youth Camp Koumé 2022 - Teaching session"
    },
    { 
      image: "/cmci2.png", 
      title: "Formation des Leaders", 
      description: "Sessions intensives de formation pour futurs leaders spirituels",
      alt: "Leadership training and development session"
    },
    { 
      image: "/cmci3.png", 
      title: "Assemblée Générale", 
      description: "Grande assemblée des participants venus de toute l'Afrique",
      alt: "Large gathering of participants from across Africa"
    },
    { 
      image: "/cmci4.png", 
      title: "Louange et Adoration", 
      description: "Temps de louange collective avec instruments et chorégraphies",
      alt: "Praise and worship session with live music and choreography"
    },
    { 
      image: "/cmci5.png", 
      title: "Études Bibliques", 
      description: "Sessions approfondies d'étude de la Parole de Dieu",
      alt: "In-depth Bible study sessions with participants"
    },
    { 
      image: "/cmci6.png", 
      title: "Communion Fraternelle", 
      description: "Moments précieux de partage entre frères et sœurs en Christ",
      alt: "Fellowship time and sharing among brothers and sisters"
    },
    { 
      image: "/cmci7.png", 
      title: "Enseignement Pastoral", 
      description: "Messages inspirants du Pasteur Théodore Andoseh",
      alt: "Pastor Theodore Andoseh delivering inspirational teaching"
    },
    { 
      image: "/cmci8.png", 
      title: "Prière Collective", 
      description: "Temps de prière intense et intercession communautaire",
      alt: "Collective prayer and community intercession time"
    },
    { 
      image: "/cmci9.png", 
      title: "Ateliers Formation", 
      description: "Ateliers pratiques de formation ministerielle et spirituelle",
      alt: "Practical workshops for ministerial and spiritual training"
    },
    { 
      image: "/cmci10.png", 
      title: "Jeunesse CBI", 
      description: "Jeunes participants engagés dans la vision divine",
      alt: "Young participants committed to the divine vision"
    },
    { 
      image: "/cmci11.png", 
      title: "Célébration Finale", 
      description: "Moment de célébration et d'engagement pour la mission",
      alt: "Final celebration and commitment to the mission"
    }
  ];

  const sectionClass = 'transition-all duration-1000 ' + 
    (isInView ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0');

  return (
    <section ref={ref} id="galerie" className="py-16 lg:py-20 bg-gray-50">
      <div className="w-full bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={sectionClass}>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-blue-900 mb-6">
                Galerie Photos CBI
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto">
                Revivez les moments forts de nos Camps Bibliques Internationaux à travers ces images authentiques 
                qui témoignent de l'impact transformateur de nos formations spirituelles
              </p>
            </div>
            
            {/* Grille responsive optimisée */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {galleryItems.map((item, index) => (
                <div 
                  key={index} 
                  className={`relative group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 ${
                    index === 0 ? 'sm:col-span-2 lg:col-span-2 xl:col-span-2' : 
                    index === 3 ? 'lg:col-span-2 xl:col-span-1' :
                    index === 6 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden ${
                    index === 0 ? 'h-80 lg:h-96' : 
                    index === 3 ? 'h-64 lg:h-80' :
                    'h-56 lg:h-72'
                  }`}>
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading={index < 4 ? "eager" : "lazy"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,${encodeURIComponent(`
                          <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
                              </linearGradient>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grad)"/>
                            <text x="50%" y="40%" text-anchor="middle" fill="white" font-size="32" font-family="Arial">📸</text>
                            <text x="50%" y="60%" text-anchor="middle" fill="white" font-size="14" font-family="Arial">Image non disponible</text>
                            <text x="50%" y="75%" text-anchor="middle" fill="white" font-size="12" font-family="Arial">${item.title}</text>
                          </svg>
                        `)}`;
                      }}
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Contenu overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white font-bold text-lg lg:text-xl mb-2 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-white/90 text-sm lg:text-base leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    
                    {/* Badge CBI */}
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-lg">
                      CBI {2009 + index}
                    </div>

                    {/* Indicateur de zoom */}
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Camera className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
           
            {/* Call to action amélioré */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 lg:p-12 text-white">
                <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                  Rejoignez-nous au prochain CBI
                </h3>
                <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
                  Découvrez plus de moments exceptionnels et créez vos propres souvenirs 
                  lors de nos prochains Camps Bibliques Internationaux
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
                    onClick={handleRegister}
                  >
                    S'inscrire maintenant
                  </Button>
                </div>
              </div>
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
      name: "Pasteur Théodore Andoseh",
      role: "Leader Mondial CMCI",
      initials: "TA",
      bgColor: "from-blue-600 to-indigo-700"
    },
    {
      name: "Équipe Pédagogique",
      role: "Formation Spirituelle",
      initials: "EP",
      bgColor: "from-pink-500 to-rose-600"
    },
    {
      name: "Leaders CBI",
      role: "Encadrement Jeunes",
      initials: "LC",
      bgColor: "from-green-500 to-emerald-600"
    },
    {
      name: "Coordinateurs",
      role: "Organisation & Logistique",
      initials: "CO",
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
                Leadership CBI
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Une équipe dédiée à la transmission de la vision et à la formation de co-ouvriers spirituels
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-6">
                    <div className={`w-40 h-40 lg:w-48 lg:h-48 rounded-full mx-auto bg-gradient-to-br ${member.bgColor} flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                      <div className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold mb-2">{member.initials}</div>
                        <div className="text-xs lg:text-sm opacity-80">🛡️</div>
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
                <h3 className="text-xl lg:text-2xl font-bold mb-6">MyIBC - CMCI</h3>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm lg:text-base">
                  Plateforme de gestion des Camps Bibliques Internationaux de la 
                  Communauté Missionnaire Chrétienne Internationale. Depuis 2009, 
                  nous formons une génération de disciples engagés dans la mission globale de Dieu, 
                  selon la vision du Pasteur Théodore Andoseh.
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
                <h4 className="text-base lg:text-lg font-semibold mb-6">Formation CBI</h4>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Camp des Agneaux</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Camp de la Fondation</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm lg:text-base">Camp des Leaders</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-base lg:text-lg font-semibold mb-6">Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-yellow-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-gray-300 text-sm lg:text-base">
                        Bertoua, Cameroun<br />
                        Communauté Missionnaire Chrétienne Internationale
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-gray-300 text-sm lg:text-base">+237 6XX XXX XXX</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <p className="text-gray-300 text-sm lg:text-base">cmfi.myibc@gmail.com</p>
                  </div>
                </div>
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
                © 2024 MyIBC - Communauté Missionnaire Chrétienne Internationale. Tous droits réservés. Vision Zacharias Tanee Fomum.
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