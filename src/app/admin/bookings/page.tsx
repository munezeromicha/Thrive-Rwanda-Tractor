// src/app/admin/bookings/page.tsx
import { getBookings } from '@/actions/booking';
import Link from 'next/link';

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  
  // Group bookings by status
  const groupedBookings = bookings.reduce((acc: any, booking: any) => {
    const status = booking.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(booking);
    return acc;
  }, {});
  
  // Status order for display
  const statusOrder = ['pending', 'paid', 'confirmed', 'completed', 'cancelled'];
  
  return (
    <div className="min-h-screen bg-[#F7FEF9] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manage Bookings
          </h1>
          
          <Link href="/admin" className="text-[#166534] hover:underline">
            Back to Dashboard
          </Link>
        </div>
        
        {/* Status filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <Link 
              href="/admin/bookings"
              className="px-4 py-2 rounded-md bg-[#166534] text-white font-medium text-sm"
            >
              All Bookings ({bookings.length})
            </Link>
            
            {statusOrder.map((status) => (
              <Link 
                key={status}
                href={`/admin/bookings?status=${status}`}
                className={`px-4 py-2 rounded-md font-medium text-sm 
                  ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                   status === 'paid' ? 'bg-green-100 text-green-800' :
                   status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                   status === 'completed' ? 'bg-gray-100 text-gray-800' :
                   'bg-red-100 text-red-800'}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({groupedBookings[status]?.length || 0})
              </Link>
            ))}
          </div>
        </div>
        
        {/* Bookings table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking: any) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking._id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.fullName}</div>
                      <div className="text-sm text-gray-500">{booking.district}, {booking.sector}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(booking.equipmentId as any).name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {(booking.equipmentId as any).price.toLocaleString()} RWF
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/admin/bookings/${booking._id}`} className="text-[#166534] hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {bookings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}