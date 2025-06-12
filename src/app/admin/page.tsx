// src/app/admin/page.tsx
import { getEquipment } from '@/actions/equipment';
import { getBookings } from '@/actions/booking';
import { IBooking } from '@/models/booking';
import { IEquipment } from '@/models/equipment';
import Link from 'next/link';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const equipment = await getEquipment();
  const recentBookings = await getBookings();
  
  // Calculate total stats
  const totalEquipment = equipment.length;
  const totalBookings = recentBookings.length;
  const totalRevenue = recentBookings
    .filter((booking: IBooking) => booking.status === 'paid')
    .reduce((acc: number, booking: IBooking) => {
      const equipmentPrice = (booking.equipmentId as any).price || 0;
      return acc + equipmentPrice;
    }, 0);
  
  return (
    <div className="min-h-screen bg-[#F7FEF9] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          
          <Link 
            href="/admin/upload"
            className="bg-[#166534] hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
          >
            Upload New Equipment
          </Link>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm font-medium mb-2">Total Equipment</h2>
            <p className="text-3xl font-bold text-gray-800">{totalEquipment}</p>
            <div className="mt-2 flex items-center text-sm">
              <Link href="/admin/equipment" className="text-[#166534] hover:underline">
                View All Equipment
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm font-medium mb-2">Total Bookings</h2>
            <p className="text-3xl font-bold text-gray-800">{totalBookings}</p>
            <div className="mt-2 flex items-center text-sm">
              <Link href="/admin/bookings" className="text-[#166534] hover:underline">
                View All Bookings
              </Link>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-gray-500 text-sm font-medium mb-2">Total Revenue</h2>
            <p className="text-3xl font-bold text-gray-800">{totalRevenue.toLocaleString()} RWF</p>
            <div className="mt-2 flex items-center text-sm text-green-600">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              <span>Active Income</span>
            </div>
          </div>
        </div>
        
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-[#166534]">
            <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBookings.slice(0, 5).map((booking: IBooking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.fullName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {(booking.equipmentId as any).name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.district}, {booking.sector}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'paid' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                          booking.status === 'completed' ? 'bg-gray-100 text-gray-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/admin/bookings/${booking._id}`} className="text-[#166534] hover:underline">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {recentBookings.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {recentBookings.length > 5 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link href="/admin/bookings" className="text-[#166534] hover:underline text-sm font-medium">
                View All Bookings
              </Link>
            </div>
          )}
        </div>
        
        {/* Recent Equipment */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-[#166534]">
            <h2 className="text-xl font-semibold text-white">Available Equipment</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {equipment.slice(0, 6).map((item: IEquipment) => (
              <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                <div className="relative h-40 w-full">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.shortDescription}</p>
                  <p className="text-[#166534] font-bold">{item.price.toLocaleString()} RWF</p>
                  
                  <div className="mt-3 flex justify-end">
                    <Link 
                      href={`/admin/equipment/${item._id}`}
                      className="text-[#166534] hover:underline text-sm"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {equipment.length === 0 && (
              <div className="col-span-3 py-8 text-center text-gray-500">
                <p>No equipment available. Upload new equipment to get started.</p>
              </div>
            )}
          </div>
          
          {equipment.length > 6 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <Link href="/admin/equipment" className="text-[#166534] hover:underline text-sm font-medium">
                View All Equipment
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}