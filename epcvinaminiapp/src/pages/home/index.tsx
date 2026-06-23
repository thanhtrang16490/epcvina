import HeroSection from "./hero";
import Services from "./services";
import Stats from "./stats";
import Projects from "./projects";
import Contact from "./contact";

const HomePage: React.FunctionComponent = () => {
  return (
    <div className="min-h-full bg-gray-50">
      <HeroSection />
      <Stats />
      <Services />
      <Projects />
      <Contact />
    </div>
  );
};

export default HomePage;
