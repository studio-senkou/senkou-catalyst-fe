import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Showcase = () => {
  return (
    <section id="demo" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Preview Toko Afiliasi Anda
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lihat bagaimana toko afiliasi Anda akan terlihat untuk pengunjung
          </p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="home" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="products">Produk</TabsTrigger>
              <TabsTrigger value="detail">Detail Produk</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-4">
              <Card className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Toko Afiliasi Sarah</h3>
                  <p className="text-gray-600">Produk pilihan untuk lifestyle modern</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-4 text-center">
                      <div className="w-full h-24 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mb-2"></div>
                      <p className="text-sm font-medium">Produk {i}</p>
                      <p className="text-xs text-gray-500">Rp 99.000</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="space-y-4">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Semua Produk</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg"></div>
                      <div className="flex-1">
                        <h4 className="font-medium">Produk Unggulan {i}</h4>
                        <p className="text-sm text-gray-500">Kategori Fashion</p>
                        <p className="text-sm font-bold text-[#5A45FF]">Rp 149.000</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="detail" className="space-y-4">
              <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <div className="w-full h-64 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4"></div>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-full h-16 bg-gray-100 rounded-lg"></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Produk Premium</h3>
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">(124 reviews)</span>
                    </div>
                    <p className="text-3xl font-bold text-[#5A45FF] mb-4">Rp 299.000</p>
                    <p className="text-gray-600 mb-6">
                      Produk berkualitas tinggi dengan desain modern dan fitur terdepan. Cocok untuk
                      gaya hidup aktif dan dinamis.
                    </p>
                    <Button className="w-full bg-[#5A45FF] hover:bg-[#4A37E0] text-white">
                      Beli Sekarang
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};

export default Showcase;