import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Plus, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";

// Mock data - thay bằng API call thực tế
async function getDashboardData() {
  // const data = await fetch('your-api/patient/dashboard')
  return {
    user: {
      name: "Nguyễn Văn A",
      id: "PT001",
      memberSince: "2024",
    },
    stats: {
      totalForms: 12,
      pending: 2,
      confirmed: 1,
      completed: 9,
    },
    upcomingAppointments: [
      {
        id: "1",
        doctorName: "Dr. Trần Thị B",
        specialty: "Cardiology",
        date: "2025-02-05",
        time: "10:00 AM",
        status: "confirmed",
      },
      {
        id: "2",
        doctorName: "Dr. Lê Văn C",
        specialty: "Dermatology",
        date: "2025-02-10",
        time: "2:30 PM",
        status: "pending",
      },
    ],
    recentForms: [
      {
        id: "MF001",
        date: "2025-01-25",
        doctor: "Dr. Nguyễn D",
        status: "completed",
      },
      {
        id: "MF002",
        date: "2025-01-20",
        doctor: "Dr. Phạm E",
        status: "completed",
      },
    ],
  };
}

export default async function PatientDashboard() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {data.user.name}!
              </h1>
              <p className="text-blue-100">
                Patient ID: {data.user.id} • Member since {data.user.memberSince}
              </p>
            </div>
            <div className="hidden md:block">
              <User className="h-16 w-16 text-blue-200" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {data.stats.totalForms}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Forms</p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {data.stats.pending}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pending</p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {data.stats.confirmed}
            </p>
            <p className="text-sm text-gray-600 mt-1">Confirmed</p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {data.stats.completed}
            </p>
            <p className="text-sm text-gray-600 mt-1">Completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/patient/medical-form/create-medical-form">
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 group-hover:bg-blue-200 p-3 rounded-lg transition-colors">
                        <Plus className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Create New Form
                        </h3>
                        <p className="text-sm text-gray-600">
                          Making a form 
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/patient/medical-form">
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 group-hover:bg-green-200 p-3 rounded-lg transition-colors">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          View All Forms
                        </h3>
                        <p className="text-sm text-gray-600">
                          Manage your forms
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/patient/medical-form">
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 group-hover:bg-green-200 p-3 rounded-lg transition-colors">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          Booking Appointment
                        </h3>
                        <p className="text-sm text-gray-600">
                          Create an appointment
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link href="/patient/appointment">
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 group-hover:bg-green-200 p-3 rounded-lg transition-colors">
                        <FileText className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          View All Appointment
                        </h3>
                        <p className="text-sm text-gray-600">
                          Manage your appointments
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Upcoming Appointments
                </h2>
                <Link href="/patient/medical-form">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {data.upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="bg-blue-50 rounded-lg p-3 h-fit">
                            <Calendar className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {appointment.doctorName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.specialty}
                            </p>
                            <div className="flex gap-3 mt-2 text-sm text-gray-700">
                              <span>📅 {appointment.date}</span>
                              <span>🕐 {appointment.time}</span>
                            </div>
                            <span
                              className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${
                                appointment.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                        <Link href={`/patient/medical-form/${appointment.id}`}>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1/3 width */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Recent Forms
              </h2>
              <div className="space-y-3">
                {data.recentForms.map((form) => (
                  <div
                    key={form.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-gray-100 p-2 rounded">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-gray-800">
                        {form.id}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {form.doctor}
                      </p>
                      <p className="text-xs text-gray-500">{form.date}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                ))}
              </div>
              <Link href="/patient/medical-form">
                <Button variant="link" className="w-full mt-3" size="sm">
                  View All Forms →
                </Button>
              </Link>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Need Help?
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Contact our support team if you have any questions
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}