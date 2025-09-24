import { ChevronRight } from "lucide-react";

type CategoryProps = {
  categories: Category[];
  isLoading: boolean;
};

export default function Category({ categories, isLoading }: CategoryProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="text-sm text-yellow-600 font-semibold mb-2 tracking-wider">
              CURATED SELECTION
            </div>
            <h2 className="text-3xl font-bold relative before:content-[''] before:absolute before:w-16 before:h-1 before:-bottom-2 before:left-0 before:bg-yellow-600">
              Shop by Category
            </h2>
          </div>
          <a
            href="#"
            className="text-yellow-600 font-semibold flex items-center group"
          >
            <span className="relative overflow-hidden">
              <span className="inline-block relative">View All</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </span>
            <ChevronRight
              size={16}
              className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
            />
          </a>
        </div>

        {/* Grid Categories */}
        {isLoading ? (
          <p className="text-gray-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No categories available.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/category/${category.id}`}
                className="group flex items-center justify-center h-24 border rounded-xl shadow-sm hover:shadow-md transition duration-300 bg-white"
              >
                <span className="font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300">
                  {category.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


