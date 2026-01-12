import { useState, useEffect, useRef } from 'react';
import { Camera, MapPin, CheckCircle, X, Loader, Navigation } from 'lucide-react';
import type { Job } from './job-list';

interface TaskFormProps {
  job: Job;
  onClose: () => void;
  onComplete: (jobId: string, photo: string, location: { lat: number; lng: number; address: string }) => void;
}

export function TaskForm({ job, onClose, onComplete }: TaskFormProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [notes, setNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-detect lokasi saat form dibuka
    getLocation();
  }, []);

  const getLocation = () => {
    setIsGettingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Simulasi reverse geocoding untuk mendapatkan alamat
          // Dalam produksi, gunakan API seperti Google Maps Geocoding
          const address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          
          setLocation({
            lat: latitude,
            lng: longitude,
            address: address,
          });
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback ke lokasi default jika gagal
          setLocation({
            lat: -6.2088,
            lng: 106.8456,
            address: 'Lokasi tidak tersedia (menggunakan default Jakarta)',
          });
          setIsGettingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      // Fallback jika geolocation tidak didukung
      setLocation({
        lat: -6.2088,
        lng: 106.8456,
        address: 'Geolocation tidak didukung browser',
      });
      setIsGettingLocation(false);
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (photo && location) {
      onComplete(job.id, photo, location);
    } else {
      alert('Mohon ambil foto dan pastikan lokasi terdeteksi');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl">Form Update Tugas</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="mb-2">Detail Pelanggan</h3>
            <p className="text-sm text-gray-700">{job.customerName}</p>
            <p className="text-sm text-gray-600">{job.address}</p>
            <p className="text-sm text-gray-600">{job.phone}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto Wajib */}
            <div>
              <label className="block mb-2">
                Foto Lokasi / Instalasi <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {photo ? (
                  <div className="relative">
                    <img
                      src={photo}
                      alt="Captured"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPhoto(null)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <Camera className="w-12 h-12 text-gray-400" />
                    <p className="text-gray-600">Klik untuk ambil/upload foto</p>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
              </div>
            </div>

            {/* Lokasi Auto-Detect */}
            <div>
              <label className="block mb-2">
                Lokasi <span className="text-red-500">*</span>
              </label>
              <div className="bg-gray-50 rounded-lg p-4">
                {isGettingLocation ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader className="w-5 h-5 animate-spin" />
                    <p>Mendeteksi lokasi...</p>
                  </div>
                ) : location ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <p>Lokasi terdeteksi</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Latitude: {location.lat.toFixed(6)}</p>
                      <p>Longitude: {location.lng.toFixed(6)}</p>
                      <p className="mt-2">Alamat: {location.address}</p>
                    </div>
                    <button
                      type="button"
                      onClick={getLocation}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm mt-2"
                    >
                      <Navigation className="w-4 h-4" />
                      Refresh Lokasi
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={getLocation}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                  >
                    <MapPin className="w-5 h-5" />
                    Deteksi Lokasi
                  </button>
                )}
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label htmlFor="notes" className="block mb-2">
                Catatan (Opsional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                placeholder="Tambahkan catatan mengenai instalasi..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!photo || !location}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Selesaikan Tugas
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
