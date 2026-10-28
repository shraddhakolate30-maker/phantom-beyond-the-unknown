import { AtmosphereBackground } from './components/AtmosphereBackground';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AtmosphereProvider } from './context/AtmosphereContext';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { useRouter } from './lib/router';
import { HomePage } from './pages/HomePage';
import { WallPage } from './pages/WallPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { SharePage } from './pages/SharePage';
import { ForgePage } from './pages/ForgePage';
import { WeekPage } from './pages/WeekPage';
import { AtmospherePage } from './pages/AtmospherePage';
import { StoryPage } from './pages/StoryPage';

function AppShell() {
  useAmbientAudio();
  const route = useRouter();

  let page: React.ReactNode;
  switch (route.name) {
    case 'home':
      page = <HomePage />;
      break;
    case 'wall':
      page = <WallPage initialCategory={route.category} />;
      break;
    case 'discover':
      page = <DiscoverPage />;
      break;
    case 'share':
      page = <SharePage />;
      break;
    case 'forge':
      page = <ForgePage />;
      break;
    case 'week':
      page = <WeekPage />;
      break;
    case 'atmosphere':
      page = <AtmospherePage />;
      break;
    case 'story':
      page = <StoryPage id={route.id} />;
      break;
    default:
      page = <HomePage />;
  }

  return (
    <div className="relative min-h-screen">
      <AtmosphereBackground />
      <Navbar current={route} />
      <main className="relative z-10">{page}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AtmosphereProvider>
      <AppShell />
    </AtmosphereProvider>
  );
}
