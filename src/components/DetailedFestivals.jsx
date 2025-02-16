import { ArrowRight, Calendar, User, MapPin, Clock } from "lucide-react";
import Marquee from 'react-fast-marquee';

const festivals = [
    {
        month: 'January',
        events: [
            {
                name: 'Si Donyi Hilo',
                tribe: 'Tagin',
                district: 'Upper Subansiri',
                date: 'Sunday, 5th January - Monday, 6th January',
            },
            {
                name: 'Tongya Festival',
                tribe: 'Monpa',
                district: 'Tawang',
                date: 'Thursday, 9th January',
            },
            {
                name: 'Sarok',
                tribe: 'Aka',
                district: 'Bichom',
                date: 'Saturday, 11th January',
            },
        ],
    },
    {
        month: 'February',
        events: [
            {
                name: 'Reh',
                tribe: 'Idu Mishmi',
                district:
                    'Lower Dibang Valley, DibangValley, Lohit, Upper Siang, East Siang',
                date: 'Saturday, 1st February',
            },
            {
                name: 'Donyi Mari',
                tribe: 'Galo',
                district: 'Leparda Lower Siang, West Siang',
                date: 'Wednesday, 5th February',
            },
            {
                name: 'Lhachhuth',
                tribe: 'Meyor',
                district: 'Anjaw',
                date: 'Wednesday, 5th February',
            },
        ],
    },
    {
        month: 'March',
        events: [
            {
                name: 'Losar',
                tribe: 'Monpa, Shendukpen, Memba, Khamba & Meyor',
                district: 'Tawang, West Kameng, Upper Siang & Anjaw',
                date: 'February March - March',
            },
            {
                name: 'Unying Aran Gidi',
                tribe: 'Adi',
                district: 'Siang, Upper Siang, East Siang, Lower Dibang Valley',
                date: 'Friday, 7th March',
            },
        ],
    },
    {
        month: 'April',
        events: [
            {
                name: 'Mopin',
                tribe: 'Galo',
                district: 'Leparda Lower Siang, West Siang',
                date: 'Saturday, 5th April - Tuesday, 8th April',
            },
            {
                name: 'Poogtukuth',
                tribe: 'Tutsa',
                district: 'Changlang & Tirap',
                date: 'Friday, 11th April',
            },
            {
                name: 'Sangken',
                tribe: 'Tai Khamti',
                district: 'Namsai',
                date: 'Monday, 14th April',
            },
        ],
    },
];

const currentMonth = new Date().toLocaleString('default', { month: 'long' });



export default function DetailedFestivals() {
    return (
        <div id="festivals" className=" py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-16">
                    <div className="relative">
                        <span className="text-sm font-semibold text-teal-600 tracking-wider uppercase mb-2 block">
                            Cultural Calendar
                        </span>
                        <h2 className="text-5xl font-bold text-heading mb-4">
                            {currentMonth} Festivals & Events
                            <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
                        </h2>
                        <p className="text-xl text-subheading max-w-2xl">
                            Experience the vibrant cultural celebrations that showcase our
                            rich heritage and traditions
                        </p>
                    </div>
                    <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-full shadow-md hover:shadow-lg transition-all group">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">View Full Calendar</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {festivals
                        .find((month) => month.month === currentMonth)
                        ?.events.map((event, index) => (
                            <div
                                key={event.name}
                                className="group border relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                style={
                                    {
                                        // transform: `translateY(${index * 20}px)`,
                                        // animation: `fade-in 0.6s ease-out ${index * 0.2}s forwards`,
                                    }
                                }
                            >
                                {/* Decorative Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-bl-full"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-tr-full"></div>

                                <div className="p-8 relative flex flex-col space-between">
                                    {/* Festival Details */}
                                    <div className="space-y-4">
                                        {/* Festival Name */}
                                        <h3 className="text-2xl font-bold text-heading mb-4 group-hover:text-blue-600 transition-colors">
                                            {event.name}
                                        </h3>

                                        {/* Tribe */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">Tribe</p>
                                                <p className="font-medium text-heading">
                                                    {event.tribe}
                                                </p>
                                            </div>
                                        </div>

                                        {/* District */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-teal-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">District</p>
                                                <p className="font-medium text-heading">
                                                    {event.district}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        {/* Date */}
                                        <div className="mt-6 px-4 py-3 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-teal-100">
                                            <div className="flex items-center gap-3">
                                                <Clock className="h-5 w-5 text-blue-600" />
                                                <p className="font-medium text-heading">
                                                    {event.date}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            style={{
                                                animation: `fade-in 0.6s ease-out ${0.2}s forwards`,
                                            }}
                                            className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 text-subheading rounded-xl group-hover:bg-gradient-to-r from-blue-600 to-teal-500 group-hover:text-white transition-all duration-600"
                                        >
                                            <span className="font-medium">
                                                View Festival Details
                                            </span>
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Mobile Calendar Button */}
                <div className="mt-8 flex md:hidden justify-center">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-full shadow-md hover:shadow-lg transition-all group">
                        <Calendar className="h-5 w-5" />
                        <span className="font-medium">View Full Calendar</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}