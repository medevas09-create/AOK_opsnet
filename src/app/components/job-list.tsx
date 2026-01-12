import { MapPin, Clock, AlertCircle, CheckCircle, Circle, MessageCircle } from 'lucide-react';

export interface Job {
  id: string;
  customerName: string;
  address: string;
  phone: string;
  packageType: string;
  scheduledTime: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

interface JobListProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onChatSupport?: (job: Job) => void;
}

export function JobList({ jobs, onSelectJob, onChatSupport }: JobListProps) {
  const getStatusIcon = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return 'Selesai';
      case 'in-progress':
        return 'Sedang Dikerjakan';
      default:
        return 'Belum Dikerjakan';
    }
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700';
      case 'in-progress':
        return 'bg-orange-50 text-orange-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getPriorityBadge = (priority: Job['priority']) => {
    const colors = {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-blue-100 text-blue-700',
    };
    
    const labels = {
      high: 'Prioritas Tinggi',
      medium: 'Prioritas Sedang',
      low: 'Prioritas Rendah',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[priority]}`}>
        {labels[priority]}
      </span>
    );
  };

  const pendingJobs = jobs.filter(j => j.status === 'pending').length;

  return (
    <div>
      {pendingJobs > 0 && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <p className="text-blue-700">
              Anda memiliki <span className="font-semibold">{pendingJobs}</span> tugas baru yang belum dikerjakan
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(job.status)}
                <h3 className="font-semibold">{job.customerName}</h3>
              </div>
              {getPriorityBadge(job.priority)}
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600">{job.address}</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <p className="text-gray-600">{job.scheduledTime}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(job.status)}`}>
                {getStatusText(job.status)}
              </span>
              <span className="text-sm text-gray-500">{job.packageType}</span>
            </div>

            {job.notes && (
              <div className="mt-3 p-2 bg-gray-50 rounded-lg text-sm text-gray-600">
                <p className="italic">"{job.notes}"</p>
              </div>
            )}

            {onChatSupport && job.status !== 'completed' && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChatSupport(job);
                  }}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat dengan CS Support
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}