"use client";
import Navbar from "@/components/layout/navbar";
import HeroSection from "@/components/sections/herosection";
import ServiceSection from "@/components/sections/servicesection";
import AboutSection from "@/components/sections/aboutsection";
import { useState, useEffect, useRef } from "react";
import SkillSection from "@/components/sections/skillsection";
import ProjectSection from "@/components/sections/projectsection";
import Footer from "@/components/layout/footer";




const PROJECTS = [
  { title: "Bloom Studio", tag: "UI/UX + Dev", year: "2024", desc: "Brand identity & landing page for a florist studio." },
  { title: "Fintrack Dashboard", tag: "Frontend Dev", year: "2024", desc: "Personal finance tracker with interactive charts." },
  { title: "NomadBlog", tag: "WordPress", year: "2023", desc: "Travel blog with custom theme and CMS integration." },
  { title: "LexAI Landing", tag: "UI/UX", year: "2023", desc: "Conversion-focused SaaS landing page design." },
  { title: "Craft Portfolio", tag: "Frontend Dev", year: "2023", desc: "Animated portfolio for a ceramics artist." },
  { title: "ShopEase", tag: "Frontend Dev", year: "2022", desc: "E-commerce storefront with cart and checkout flow." },
];

export default function Home() {
  const [activeSection, setActiveSection] = useState("Home");
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});
  const [animateSkills, setAnimateSkills] = useState(false);
 
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  const getAnimationDelay = (index: number) => `${index * 0.1}s`;

  return (
    <div>
      <link rel="icon" href="/favicon.png" />
        <Navbar />
        <HeroSection />
        {/* <AboutSection /> */}
        <SkillSection />
        {/* <ServiceSection/> */}
        <ProjectSection />
        <Footer />
    </div>
  );
}