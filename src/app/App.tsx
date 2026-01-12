import { useState } from 'react';
import { Login } from './components/login';
import { Profile } from './components/profile';
import { JobList, type Job } from './components/job-list';
import { TaskForm } from './components/task-form';
import { ChatSupport, ChatButton } from './components/chat-support';
import { ListTodo, User as UserIcon, LogOut, Bell } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'jobs' | 'profile'>('jobs');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [chatJob, setChatJob] = useState<Job | null>(null);
  
  // Mock employee data
  const [employee] = useState({
    name: 'Ahmad Ridwan',
    employeeId: 'ISP-2024-001',
    phone: '+62 812-3456-7890',
    email: 'ahmad.ridwan@isp.com',
    position: 'Teknisi Instalasi',
    joinDate: '15 Januari 2024',
    area: 'Jakarta Selatan',
  });

  // Mock jobs data
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 'JOB-001',
      customerName: 'Budi Santoso',
      address: 'Jl. Merdeka No. 45, Jakarta Selatan',
      phone: '+62 821-9876-5432',
      packageType: 'Paket 50 Mbps',
      scheduledTime: '10:00 - 12:00 WIB',
      status: 'pending',
      priority: 'high',
      notes: 'Mohon hubungi pelanggan 30 menit sebelum instalasi',
    },
    {
      id: 'JOB-002',
      customerName: 'Siti Nurhaliza',
      address: 'Komplek Permata Hijau Blok C5, Jakarta Selatan',
      phone: '+62 813-2468-1357',
      packageType: 'Paket 100 Mbps',
      scheduledTime: '13:00 - 15:00 WIB',
      status: 'pending',
      priority: 'medium',
    },
    {
      id: 'JOB-003',
      customerName: 'Eko Prasetyo',
      address: 'Jl. Sudirman Kav. 12, Jakarta Pusat',
      phone: '+62 856-7891-2345',
      packageType: 'Paket 25 Mbps',
      scheduledTime: '15:30 - 17:00 WIB',
      status: 'in-progress',
      priority: 'low',
    },
    {
      id: 'JOB-004',
      customerName: 'Maya Indah',
      address: 'Apartemen Green Park Tower A Lt. 15',
      phone: '+62 877-5544-3322',
      packageType: 'Paket 75 Mbps',
      scheduledTime: '08:00 - 10:00 WIB',
      status: 'completed',
      priority: 'medium',
      notes: 'Instalasi berhasil, pelanggan puas',
    },
  ]);

  const handleLogin = (username: string, password: string) => {
    // Mock login - dalam produksi gunakan API autentikasi real
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('jobs');
    setSelectedJob(null);
  };

  const handleSelectJob = (job: Job) => {
    if (job.status !== 'completed') {
      setSelectedJob(job);
      // Update status ke in-progress saat job dipilih
      setJobs(prevJobs =>
        prevJobs.map(j =>
          j.id === job.id && j.status === 'pending'
            ? { ...j, status: 'in-progress' }
            : j
        )
      );
    }
  };

  const handleCompleteJob = (
    jobId: string,
    photo: string,
    location: { lat: number; lng: number; address: string }
  ) => {
    setJobs(prevJobs =>
      prevJobs.map(j =>
        j.id === jobId
          ? { ...j, status: 'completed', notes: `Selesai di ${location.address}` }
          : j
      )
    );
    setSelectedJob(null);
    
    // Tampilkan notifikasi sukses
    alert('Tugas berhasil diselesaikan!');
  };

  const pendingCount = jobs.filter(j => j.status === 'pending').length;

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl">ISP Operations</h1>
            <div className="flex items-center gap-2">
              {pendingCount > 0 && (
                <div className="relative">
                  <Bell className="w-6 h-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="bg-white rounded-lg p-1 inline-flex gap-1 shadow-sm">
            <button
              onClick={() => setCurrentView('jobs')}
              className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                currentView === 'jobs'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ListTodo className="w-5 h-5" />
              Daftar Tugas
            </button>
            <button
              onClick={() => setCurrentView('profile')}
              className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
                currentView === 'profile'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Profil
            </button>
          </div>
        </div>

        {currentView === 'jobs' ? (
          <JobList jobs={jobs} onSelectJob={handleSelectJob} onChatSupport={(job) => setChatJob(job)} />
        ) : (
          <Profile employee={employee} />
        )}
      </div>

      {/* Task Form Modal */}
      {selectedJob && (
        <TaskForm
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onComplete={handleCompleteJob}
        />
      )}

      {/* Chat Support Modal */}
      {chatJob && (
        <ChatSupport
          job={chatJob}
          onClose={() => setChatJob(null)}
        />
      )}
    </div>
  );
}