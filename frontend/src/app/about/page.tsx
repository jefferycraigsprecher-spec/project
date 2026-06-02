import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Testimonials from '@/components/sections/Testimonials';
import HeroVideoSlider from '@/components/sections/HeroVideoSlider';
import { Award, Users, Globe, CheckCircle, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Link from 'next/link';

const aboutSlides = [
  {
    title: 'Built on trusted logistics and premium customer care.',
    subtitle: 'For 15 years, we’ve guided brands and businesses through secure international freight, local delivery, and strategic supply chain solutions.',
    video: '/videos/airplane_takeoff.mp4',
    poster: '/images/hero-poster.png',
    image: '/images/services/service1.jpg',
    primaryLabel: 'Meet the Team',
    primaryLink: '/about',
    secondaryLabel: 'Contact Sales',
    secondaryLink: '/contact',
  },
  {
    title: 'Our mission is to make complex shipping effortless.',
    subtitle: 'We combine advanced tracking, dedicated support, and global carrier partnerships to keep every shipment moving with confidence.',
    video: '/videos/airplane_takeoff.mp4',
    poster: '/images/hero-poster.png',
    image: '/images/services/service2.jpg',
    primaryLabel: 'View Services',
    primaryLink: '/services',
    secondaryLabel: 'Get Started',
    secondaryLink: '/contact',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-slate-950 text-white font-sans">
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroVideoSlider slides={aboutSlides} />

        {/* Mission & Vision */}
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
                <Award className="h-12 w-12 text-brand-400 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-slate-300 leading-8">
                  To deliver world-class logistics services that empower businesses and individuals to move goods reliably, transparently, and affordably across the globe. We're committed to providing exceptional care for every shipment.
                </p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
                <Globe className="h-12 w-12 text-brand-400 mb-6" />
                <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                <p className="text-slate-300 leading-8">
                  To be the most trusted and innovative courier partner for businesses worldwide, setting industry standards for reliability, speed, and customer satisfaction. Built in Ohio. Built for America. Trusted globally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="bg-slate-900/50 px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Years in Business', value: '15+' },
                { label: 'Global Partners', value: '500+' },
                { label: 'Shipments Delivered', value: '2M+' },
                { label: 'Countries Served', value: '160+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl sm:text-5xl font-bold text-brand-400 mb-3">{stat.value}</p>
                  <p className="text-slate-300 text-sm uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <p className="text-brand-400 font-semibold uppercase tracking-widest mb-3">Core Values</p>
              <h2 className="text-4xl font-bold">What Drives Us Every Day</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Reliability',
                  description: 'Every shipment is treated with utmost care. On-time delivery isn\'t a goal—it\'s a promise.',
                },
                {
                  title: 'Transparency',
                  description: 'Real-time tracking, clear pricing, and honest communication build trust with every customer.',
                },
                {
                  title: 'Innovation',
                  description: 'Cutting-edge technology and continuous improvement keep us ahead in the logistics industry.',
                },
                {
                  title: 'Customer Focus',
                  description: '24/7 support and personalized solutions ensure your logistics needs are always our priority.',
                },
                {
                  title: 'Sustainability',
                  description: 'Eco-conscious operations and responsible practices for a better future.',
                },
                {
                  title: 'Integrity',
                  description: 'Ethical business practices and fair dealings with partners and customers alike.',
                },
              ].map((value) => (
                <div
                  key={value.title}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:bg-white/10 transition"
                >
                  <CheckCircle className="h-8 w-8 text-brand-400 mb-4" />
                  <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                  <p className="text-slate-300 text-sm leading-7">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="bg-slate-900/50 px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <p className="text-brand-400 font-semibold uppercase tracking-widest mb-3">Our Location</p>
              <h2 className="text-4xl font-bold mb-6">Columbus Headquarters</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <MapPin className="h-10 w-10 text-brand-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Address</h3>
                <p className="text-slate-300 text-lg">1450 Industrial Parkway</p>
                <p className="text-slate-300 text-lg">Columbus, Ohio, USA</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                <Clock className="h-10 w-10 text-brand-400 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Business Hours</h3>
                <p className="text-slate-300">Monday–Friday: 6:00 AM – 8:00 PM ET</p>
                <p className="text-slate-300">Saturday: 8:00 AM – 4:00 PM ET</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Experience Excellence?</h2>
            <p className="text-xl text-slate-300 mb-10">
              Join thousands of businesses that trust Midwest Shipment for their logistics needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-brand-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-brand-400"
              >
                Get in Touch
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-10 py-4 text-lg font-semibold text-white transition hover:bg-white/20"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </section>
      <Testimonials />

      </main>

      <Footer />
    </div>
  );
}