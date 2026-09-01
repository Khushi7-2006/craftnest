// Seeds the database with demo categories/products so the site works immediately.
// Run with: npm run seed
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "DIY Scrapbook Starter Kit",
    description: "Everything you need to start your first scrapbook: patterned papers, stickers, glue tabs and a blank kraft album.",
    price: 799,
    category: "Scrapbooking Kits",
    image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=600",
    stock: 25,
    rating: 4.6,
  },
  {
    name: "Floral Sticker Pack",
    description: "120 waterproof floral stickers perfect for journals, laptops and planners.",
    price: 149,
    category: "Sticker Packs",
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=600",
    stock: 60,
    rating: 4.7,
  },
  {
    name: "Pastel Washi Tape Set",
    description: "10 rolls of pastel washi tape in coordinating shades for decorating journals and gifts.",
    price: 299,
    category: "Washi Tapes",
    image: "https://images.unsplash.com/photo-1600431521340-491eca880813?w=600",
    stock: 40,
    rating: 4.5,
  },
  {
    name: "Handmade Kraft Journal",
    description: "A5 handmade kraft-cover journal with 120 pages of thick, ink-friendly paper.",
    price: 449,
    category: "Handmade Notebooks",
    image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=600",
    stock: 30,
    rating: 4.8,
  },
  {
    name: "DIY Bookmark Kit",
    description: "Design and laminate 8 custom bookmarks with included cardstock, tassels and stencils.",
    price: 199,
    category: "Bookmark Kits",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600",
    stock: 35,
    rating: 4.4,
  },
  {
    name: "Decorative Paper Collection",
    description: "30 sheets of double-sided decorative paper in floral, geometric and vintage prints.",
    price: 349,
    category: "Decorative Papers",
    image: "https://images.unsplash.com/photo-1524169113253-c6ba17d64d20?w=600",
    stock: 45,
    rating: 4.5,
  },
  {
    name: "Mini Journaling Kit",
    description: "A compact travel-friendly journaling kit with a pocket notebook, stickers and a fine-tip pen.",
    price: 249,
    category: "DIY Journals",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600",
    stock: 50,
    rating: 4.6,
  },
  {
    name: "Handmade Greeting Card Kit",
    description: "Make 12 handmade greeting cards with pre-cut cardstock, envelopes and embellishments.",
    price: 399,
    category: "DIY Cards",
    image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600",
    stock: 20,
    rating: 4.7,
  },
  {
    name: "Aesthetic Sticky Notes",
    description: "Set of 6 pastel sticky note pads in fun shapes, great for planners and desks.",
    price: 129,
    category: "Gift Stationery",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600",
    stock: 70,
    rating: 4.3,
  },
  {
    name: "DIY Memory Book Kit",
    description: "Create a keepsake memory book with a linen cover, photo corners and themed page inserts.",
    price: 899,
    category: "Scrapbooking Kits",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600",
    stock: 15,
    rating: 4.9,
  },
  {
    name: "Creative Lettering Set",
    description: "Brush pens, guide sheets and practice cards to learn hand lettering and calligraphy.",
    price: 549,
    category: "Art & Craft Kits",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600",
    stock: 28,
    rating: 4.6,
  },
  {
    name: "DIY Gift Wrapping Kit",
    description: "Kraft wrapping paper, twine, gift tags and dried flowers for beautifully wrapped presents.",
    price: 299,
    category: "Gift Stationery",
    image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?w=600",
    stock: 33,
    rating: 4.5,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log(`Seeded ${products.length} demo products successfully.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
