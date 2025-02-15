import { Book, User2, Bookmark, ArrowRight } from "lucide-react";

export default function Books({books}) {
  return (
    <div className="py-20  dark:from-[#2d3748] dark:to-[#1f2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="flex items-center gap-3 mb-2">
            {/* <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div> */}
            <h2 className="text-3xl md:text-4xl font-bold text-heading">
              Folklore Stories & Books
            </h2>
          </div>
          <div className="absolute -bottom-2 left-0 w-1/3 h-1 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full"></div>
          <p className="text-base md:text-lg text-subheading mt-4">
            Discover the rich cultural heritage through our collection of traditional stories
          </p>
        </div>

        {/* Mobile Scrollable Books */}
        <div className="flex md:hidden overflow-x-auto pb-6 gap-4 snap-x snap-mandatory scrollbar-hide">
          {books.map((book, index) => (
            <div
              key={index}
              className="snap-start flex-none w-[260px] group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {/* Book Cover */}
              <div className="relative h-[280px] overflow-hidden">
                <img
                  src={book.thumbnail_path}
                  alt={book.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <button className="w-full px-3 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5">
                      <Bookmark className="h-3.5 w-3.5" />
                      Read Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-heading mb-1.2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {book.title}
                </h3>
                
                <div className="flex items-center gap-1.5 mb-3 text-subheading">
                  <User2 className="h-3.5 w-3.5" />
                  <span className="text-md text-semibold">{book.author}</span>
                </div>

                {/* <div className="flex flex-wrap gap-1.5">
                  {book.tribes.slice(0, 2).map((tribe, tribeIndex) => (
                    <span
                      key={tribeIndex}
                      className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                    >
                      {tribe}
                    </span>
                  ))}
                  {book.tribes.length > 2 && (
                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      +{book.tribes.length - 2}
                    </span>
                  )}
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book, index) => (
            <div
              key={index}
              className="group relative  bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {/* Book Cover */}
              <div className="relative h-[250px] overflow-hidden ">
                <img
                  src={book.thumbnail_path}
                  alt={book.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <button className="w-full px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                      <Bookmark className="h-4 w-4" />
                      Read Now
                    </button>
                  </div>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-heading mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {book.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-4 text-subheading">
                  <User2 className="h-4 w-4" />
                  <span className="text-md text-bold">{book.author}</span>
                </div>

                {/* <div className="flex flex-wrap gap-2">
                  {book.tribes.map((tribe, tribeIndex) => (
                    <span
                      key={tribeIndex}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/30 dark:to-teal-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800"
                    >
                      {tribe} Tribe
                    </span>
                  ))}
                </div> */}
              </div>
            </div>
          ))}
        </div>

        {/* View All Books Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-full hover:from-blue-700 hover:to-teal-600 transition-all shadow-md hover:shadow-lg group">
            <span className="font-medium">View All Books</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}