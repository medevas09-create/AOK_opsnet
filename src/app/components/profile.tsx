import { User, Phone, Mail, Calendar, Briefcase, MapPin } from 'lucide-react';

interface Employee {
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  position: string;
  joinDate: string;
  area: string;
}

interface ProfileProps {
  employee: Employee;
}

export function Profile({ employee }: ProfileProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-2xl mb-1">{employee.name}</h2>
        <p className="text-gray-500">{employee.position}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Briefcase className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">ID Karyawan</p>
            <p className="mt-1">{employee.employeeId}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Nomor Handphone</p>
            <p className="mt-1">{employee.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="mt-1">{employee.email}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Area Kerja</p>
            <p className="mt-1">{employee.area}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-600">Tanggal Bergabung</p>
            <p className="mt-1">{employee.joinDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
