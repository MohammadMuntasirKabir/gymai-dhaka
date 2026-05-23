import { MapPin, Phone, Clock, Dumbbell } from "lucide-react";
import { Card } from "../components/ui/Card";
import { partnerGyms } from "../data/gymData";
import { useState } from "react";

export default function Gyms() {
  const [selectedGym, setSelectedGym] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
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

        {/* Google Maps Embed */}
        <Card variant="bordered" className="mb-8 overflow-hidden p-0">
          <iframe
            title="GymAI Partner Gyms in Dhaka"
            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d50000!2d90.4125!3d23.8103!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1700000000000`}
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerGyms.map((gym) => (
            <Card
              key={gym.id}
              variant="bordered"
              className={`group cursor-pointer transition-all hover:border-accent/50 ${
                selectedGym === gym.id ? "border-accent ring-1 ring-accent/30" : ""
              }`}
              onClick={() => setSelectedGym(selectedGym === gym.id ? null : gym.id)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <Dumbbell className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-tight">{gym.name}</h3>
                  <p className="text-sm text-muted">{gym.area}</p>
                </div>
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
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
