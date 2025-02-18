// "use client";

// import { useState } from "react";
// import { useRouter } from "next/router";
// import {
//   Camera,
//   Mail,
//   Phone,
//   MapPin,
//   Edit,
//   Save,
//   Trash2,
//   AlertTriangle,
//   Lock,
//   Eye,
//   EyeOff,
//   X,
//   Heart,
//   Clock,
//   Calendar,
//   Music2,
//   Video,
//   FileText,
// } from "lucide-react";

// export default function UserDashboard() {
//   const router = useRouter();
//   const [isEditing, setIsEditing] = useState(false);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [deleteReason, setDeleteReason] = useState("");

//   const [formData, setFormData] = useState({
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     phone: "+91 9876543210",
//     address: "Itanagar, Arunachal Pradesh",
//     tribe: "Adi",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const stats = [
//     { icon: Heart, label: "Liked Content", value: "45" },
//     { icon: Clock, label: "Hours Watched", value: "120" },
//     { icon: Calendar, label: "Member Since", value: "Jan 2024" },
//   ];

//   const recentActivity = [
//     {
//       type: "music",
//       title: "Traditional Folk Song",
//       time: "2 hours ago",
//       icon: Music2,
//     },
//     {
//       type: "video",
//       title: "Festival Celebration",
//       time: "5 hours ago",
//       icon: Video,
//     },
//     {
//       type: "story",
//       title: "Ancient Tales",
//       time: "1 day ago",
//       icon: FileText,
//     },
//   ];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsEditing(false);
//     console.log("Profile updated with:", formData);
//   };

//   const handlePasswordChange = (e) => {
//     e.preventDefault();
//     setShowChangePassword(false);
//     console.log("Password changed");
//   };

//   const handleDeleteAccount = () => {
//     if (!deleteReason.trim()) return;
//     console.log("Account deleted because:", deleteReason);
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[100px]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* Profile Header */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
//           <div className="flex flex-col md:flex-row items-start gap-6">
//             {/* Profile Picture */}
//             <div className="relative">
//               <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 p-1">
//                 <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-4xl font-bold text-blue-600">
//                   {formData.firstName[0]}
//                 </div>
//               </div>
//               <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
//                 <Camera className="h-5 w-5 text-gray-500 dark:text-gray-400" />
//               </button>
//             </div>

//             {/* Profile Info */}
//             <div className="flex-grow">
//               <div className="flex flex-wrap items-center gap-4 mb-4">
//                 <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
//                   {formData.firstName} {formData.lastName}
//                 </h2>
//                 <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
//                   Member
//                 </span>
//               </div>

//               <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mb-6">
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4" />
//                   <span>{formData.email}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4" />
//                   <span>{formData.phone}</span>
//                 </div>
//               </div>

//               <div className="flex flex-wrap gap-4">
//                 <button
//                   onClick={() => {
//                     if (isEditing) {
//                       handleSubmit();
//                     } else {
//                       setIsEditing(true);
//                     }
//                   }}
//                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-lg hover:from-blue-700 hover:to-teal-600 transition-all shadow-md hover:shadow-lg"
//                 >
//                   {isEditing ? (
//                     <>
//                       <Save className="h-5 w-5" />
//                       <span>Save Changes</span>
//                     </>
//                   ) : (
//                     <>
//                       <Edit className="h-5 w-5" />
//                       <span>Edit Profile</span>
//                     </>
//                   )}
//                 </button>
//                 <button
//                   onClick={() => setShowChangePassword(true)}
//                   className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <Lock className="h-5 w-5" />
//                   <span>Change Password</span>
//                 </button>
//                 <button
//                   onClick={() => setShowDeleteConfirm(true)}
//                   className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
//                 >
//                   <Trash2 className="h-5 w-5" />
//                   <span>Delete Account</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats and Activity */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Stats */}
//           <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
//             {stats.map((stat) => (
//               <div
//                 key={stat.label}
//                 className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500">
//                     <stat.icon className="h-6 w-6 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       {stat.label}
//                     </p>
//                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                       {stat.value}
//                     </h3>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Recent Activity */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//               Recent Activity
//             </h3>
//             <div className="space-y-4">
//               {recentActivity.map((activity, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                 >
//                   <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-teal-500">
//                     <activity.icon className="h-5 w-5 text-white" />
//                   </div>
//                   <div className="flex-grow">
//                     <p className="text-gray-900 dark:text-white font-medium">
//                       {activity.title}
//                     </p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       {activity.time}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Change Password Modal */}
//         {showChangePassword && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                   Change Password
//                 </h3>
//                 <button
//                   onClick={() => setShowChangePassword(false)}
//                   className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//                 >
//                   <X className="h-5 w-5 text-gray-500" />
//                 </button>
//               </div>

//               <form onSubmit={handlePasswordChange} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     Current Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showCurrentPassword ? "text" : "password"}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
//                       placeholder="Enter current password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setShowCurrentPassword(!showCurrentPassword)
//                       }
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                     >
//                       {showCurrentPassword ? (
//                         <EyeOff className="h-5 w-5 text-gray-400" />
//                       ) : (
//                         <Eye className="h-5 w-5 text-gray-400" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     New Password
//                   </label>
//                   <div className="relative">
//                     <input
//                       type={showNewPassword ? "text" : "password"}
//                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
//                       placeholder="Enter new password"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowNewPassword(!showNewPassword)}
//                       className="absolute right-3 top-1/2 -translate-y-1/2"
//                     >
//                       {showNewPassword ? (
//                         <EyeOff className="h-5 w-5 text-gray-400" />
//                       ) : (
//                         <Eye className="h-5 w-5 text-gray-400" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 <div className="flex justify-end gap-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowChangePassword(false)}
//                     className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Change Password
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Delete Account Confirmation Modal */}
//         {showDeleteConfirm && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
//               <div className="flex items-start gap-4 mb-6">
//                 <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-xl">
//                   <AlertTriangle className="h-6 w-6 text-red-600" />
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
//                     Delete Account
//                   </h3>
//                   <p className="text-gray-500 dark:text-gray-400">
//                     This action cannot be undone. All your data will be
//                     permanently deleted.
//                   </p>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Please tell us why you're leaving
//                 </label>
//                 <textarea
//                   value={deleteReason}
//                   onChange={(e) => setDeleteReason(e.target.value)}
//                   rows={3}
//                   className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
//                   placeholder="Your feedback helps us improve"
//                 />
//               </div>

//               <div className="flex justify-end gap-4">
//                 <button
//                   onClick={() => setShowDeleteConfirm(false)}
//                   className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteAccount}
//                   disabled={!deleteReason.trim()}
//                   className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Delete Account
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // new code below
"use client"; // Required if using Next.js 13 App Router; safe to keep in Next.js ≤12

import { useState , useEffect } from "react";
// Next.js Pages Router (<= 12 or in 13): import { useRouter } from "next/router";
// If using Next.js 13 App Router, import { useRouter } from "next/navigation"
import { useRouter } from "next/router";

import {
  Play,
  Music2,
  Heart,
  Clock,
  TrendingUp,
  ChevronRight,
  Eye,
  Crown,
  Star,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// Adjust these imports to their Next.js versions as needed
import UserHeader from "./UserHeader"; 
// import MusicPlayerScreen from "../MusicPlayerScreen"; 
import VideoModal from "../VideoModal";
import WelcomeModal from "./WelcomeModal";

const recentItems = [
  {
    id: "1",
    type: "tribe",
    title: "Adi Tribe",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
    tribe: "Adi",
    date: "2024-02-15",
  },
  {
    id: "2",
    type: "video",
    title: "Traditional Dance Performance",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
    tribe: "Apatani",
    date: "2024-02-16",
    duration: "4:15",
    views: "2.3K",
  },
  {
    id: "3",
    type: "music",
    title: "Festival Celebration Song",
    thumbnail:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/Monpa1.jpg",
    tribe: "Monpa",
    date: "2024-02-17",
    duration: "3:30",
    views: "1.8K",
  },
];

const trendingVideos = [
  {
    title: "Traditional Dance Performance",
    tribe: "Apatani",
    tribeLogo:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
    videoId: "lv_WGEHNtSo",
    views: "2.3K",
    duration: "4:15",
  },
  {
    title: "Cultural Celebration",
    tribe: "Nyishi",
    tribeLogo:
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/nyishi1.jpg",
    videoId: "PTcoEqRmWp0",
    views: "1.8K",
    duration: "3:45",
  },
];

const trendingMusic = [
  {
    "Music Name": "Adi Folk Song",
    "Thumb Image Link":
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/adi1.jpg",
    "Singer Name": "Traditional",
    "Tribe Name": "Adi Tribe",
    Duration: "03:45",
    "Music Link":
      "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81236KONGKU_RAYO_DANCE_OF_ADI.mp3",
    Category: "Folk",
  },
  {
    "Music Name": "Festival Celebration",
    "Thumb Image Link":
      "https://indigenous.arunachal.gov.in/upload/tribes/Content/apatani1.jpg",
    "Singer Name": "Traditional",
    "Tribe Name": "Apatani Tribe",
    Duration: "04:20",
    "Music Link":
      "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81237TRIBAL_SONG.mp3",
    Category: "Festival",
  },
];

export default function UserDashboard() {
  const router = useRouter(); // Next.js replacement for useNavigate
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [userName, setUserName] = useState("");


  useEffect(() => {
    // Check if this is the first visit after signup
    const isNewSignup = sessionStorage.getItem("newSignup");
    if (isNewSignup === "true") {
      const name = sessionStorage.getItem("userName") || "User";
      setUserName(name);
      setShowWelcomeModal(true);
      // Clear the flag so the modal doesn't show again
      sessionStorage.removeItem("newSignup");
    }
  }, []);


  // Example logout
  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
       <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        userName={userName}
      />

      <UserHeader />

      {/* Hero Banner */}
      <div className="relative h-[400px] mt-[100px]">
        <img
          src="https://firebasestorage.googleapis.com/v0/b/kathavachak-95a17.appspot.com/o/Banner%206_v2%20(1).jpg?alt=media&token=f4942c5b-638c-4f1a-b4be-6dbc53d4947d"
          alt="Cultural Heritage Banner"
          className="w-full h-full object-cover transform scale-105 animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-[2px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-12">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                Welcome Back, User!
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Continue exploring the rich cultural heritage of Arunachal
                Pradesh
              </p>
              <div className="flex gap-4 mt-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Crown className="h-5 w-5 text-amber-400" />
                  <span className="text-white/90">Member since Jan 2024</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-amber-400" />
                  <span className="text-white/90">12 Tribes Explored</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative z-10">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Eye,
              label: "Content Viewed",
              value: "120+",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: Heart,
              label: "Items Liked",
              value: "45",
              color: "from-rose-500 to-rose-600",
            },
            {
              icon: Sparkles,
              label: "Festivals Explored",
              value: "8",
              color: "from-amber-500 to-amber-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-subheading">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-heading">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recently Viewed */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Continue Watching
              </h2>
            </div>
            <button className="group flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:-translate-y-1 duration-300"
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-bl-full -z-1" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-teal-500/10 rounded-tr-full -z-1" />

                <div className="relative aspect-video">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {item.type === "video" && (
                        <button
                          onClick={() =>
                            setSelectedVideo({
                              title: item.title,
                              tribe: item.tribe,
                              tribeLogo: item.thumbnail,
                              videoId: "lv_WGEHNtSo", // Example video ID
                              views: item.views,
                              duration: item.duration,
                            })
                          }
                          className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500/80 to-teal-500/80 backdrop-blur-sm p-0.5 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform shadow-xl"
                        >
                          <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                            <Play className="h-10 w-10 text-white fill-current" />
                          </div>
                        </button>
                      )}
                      {item.type === "music" && (
                        <button
                          onClick={() =>
                            setSelectedMusic({
                              "Music Name": item.title,
                              "Thumb Image Link": item.thumbnail,
                              "Singer Name": "Traditional",
                              "Tribe Name": item.tribe,
                              Duration: item.duration || "0:00",
                              "Music Link":
                                "https://indigenous.arunachal.gov.in/upload/adi/2/December2024/audio/81236KONGKU_RAYO_DANCE_OF_ADI.mp3",
                            })
                          }
                          className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm p-0.5 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform shadow-xl"
                        >
                          <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                            <Music2 className="h-10 w-10 text-white" />
                          </div>
                        </button>
                      )}
                    </div>
                    {(item.type === "video" || item.type === "music") && (
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.views}
                        </span>
                        <span>{item.duration}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30">
                      {item.type === "video" ? (
                        <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Music2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                    {item.tribe} Tribe
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Videos */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Popular Videos
              </h2>
            </div>
            <button className="group flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingVideos.map((video) => (
              <div
                key={video.videoId}
                className="group cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3">
                  <img
                    src={'https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg'}
                    alt={video.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform">
                        <Play className="h-8 w-8 text-white fill-current" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {video.views}
                      </span>
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {video.tribe} Tribe
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Music */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Music2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Featured Music
              </h2>
            </div>
            <button className="group flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
              <span>View All</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingMusic.map((song) => (
              <div
                key={song["Music Name"]}
                className="group cursor-pointer relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700 hover:-translate-y-1 duration-300"
                onClick={() => setSelectedMusic(song)}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-bl-full -z-1" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-tr-full -z-1" />

                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={song["Thumb Image Link"]}
                    alt={song["Music Name"]}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm p-0.5 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform shadow-xl">
                        <div className="w-full h-full rounded-full bg-white/10 flex items-center justify-center">
                          <Music2 className="h-10 w-10 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-sm">
                      <span className="flex items-center gap-1">
                        <Music2 className="h-4 w-4" />
                        {song["Category"]}
                      </span>
                      <span>{song["Duration"]}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
                      <Music2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-heading mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {song["Music Name"]}
                  </h3>
                  <p className="text-sm text-subheading flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {song["Tribe Name"]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo.videoId}
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          selectedVideo={selectedVideo}
          setSelectedVideo={setSelectedVideo}
          title={selectedVideo.title}
          tribe={selectedVideo.tribe}
          tribeLogo={selectedVideo.tribeLogo}
          onVideoEnd={() => setSelectedVideo(null)}
          videos={trendingVideos}
        />
      )}

      {/* Music Player */}
      {/* {selectedMusic && (
        <MusicPlayerScreen
          song={selectedMusic}
          isOpen={!!selectedMusic}
          onClose={() => setSelectedMusic(null)}
        />
      )} */}
    </div>
  );
}
