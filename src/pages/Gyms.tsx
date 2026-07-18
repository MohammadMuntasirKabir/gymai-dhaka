import { MapPin, Phone, Clock, Dumbbell, Heart, Star, Search } from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { partnerGyms } from "../data/gymData";
import { useState } from "react";
import { getFavorites, toggleFavorite } from "../lib/gymFavorites";

type Filter = "all" | "favorites";

export default function Gyms() {
  const [selectedGym, setSelectedGym] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [favorites, setFavorites] = useState<Set<string>>(() => getFavorites());
  const [query, setQuery] = useState("");

  function handleToggleFavorite(id: string) {
    setFavorites(new Set(toggleFavorite(id)));
  }

  const normalizedQuery = query.trim().toLowerCase();
  const visibleGyms = partnerGyms.filter((gym) => {
    if (filter === "favorites" && !favorites.has(gym.id)) return false;
    if (normalizedQuery.length > 0) {
      const haystack = `${gym.name} ${gym.area} ${gym.address} ${gym.facilities.join(" ")}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-4">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted">6 locations across Dhaka</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our Partner <span className="text-accent">Gyms</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Train at any of our 6 partner gyms across Dhaka. One membership gives you access to all locations.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center justify-center">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gyms, areas, facilities…"
              aria-label="Search gyms"
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div className="inline-flex rounded-xl border border-border overflow-hidden">
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${filter === "all" ? "bg-accent text-black" : "text-muted hover:text-foreground"}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("favorites")}
              aria-pressed={filter === "favorites"}
              className={`px-4 py-2.5 text-sm font-medium transition-colors flex items-center gap-1.5 ${filter === "favorites" ? "bg-accent text-black" : "text-muted hover:text-foreground"}`}
            >
              <Heart className={`w-3.5 h-3.5 ${filter === "favorites" ? "fill-black" : ""}`} />
              Favorites
            </button>
          </div>
        </div>

        {/* Google Maps Embed */}
        <Card variant="bordered" className="mb-8 overflow-hidden p-0">
          <iframe
            title="GymAI Partner Gyms in Dhaka"
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d90.4125!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1700000000000"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </Card>

        {/* Gym Cards Grid */}
        {visibleGyms.length === 0 ? (
          <Card variant="bordered" className="text-center py-16">
            <p className="text-muted">No gyms match your filters.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleGyms.map((gym) => {
              const isFav = favorites.has(gym.id);
              return (
                <Card
                  key={gym.id}
                  variant="bordered"
                  className={`group transition-all hover:border-accent/50 ${
                    selectedGym === gym.id ? "border-accent ring-1 ring-accent/30" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                        <Dumbbell className="w-5 h-5 text-accent" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-lg leading-tight">{gym.name}</h3>
                        <p className="text-sm text-muted">{gym.area}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(gym.id)}
                      aria-pressed={isFav}
                      aria-label={isFav ? `Remove ${gym.name} from favorites` : `Add ${gym.name} to favorites`}
                      className={`p-2 rounded-lg transition-colors ${isFav ? "text-accent" : "text-muted hover:text-foreground"}`}
                    >
                      <Heart className={`w-5 h-5 ${isFav ? "fill-accent" : ""}`} />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-muted">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{gym.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{gym.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted">
                      <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{gym.hours}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {gym.facilities.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Individual gym map on selection */}
                  {selectedGym === gym.id && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-border">
                      <iframe
                        title={`Location of ${gym.name}`}
                        src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500!2d${gym.lng}!3d${gym.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1700000000000`}
                        width="100%"
                        height="200"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full gap-2"
                    onClick={() => setSelectedGym(selectedGym === gym.id ? null : gym.id)}
                  >
                    <MapPin className="w-4 h-4" />
                    {selectedGym === gym.id ? "Hide Map" : "Show on Map"}
                    {isFav && <Star className="w-3.5 h-3.5 text-accent fill-accent" />}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
