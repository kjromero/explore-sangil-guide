import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

const categoriesData = [
  {
    id: "comidas",
    name: "Comidas",
    subcategories: [
      "Lunch",
      "Cafés",
      "Comidas rápidas",
      "Panaderías",
      "Postres y Heladerías",
      "Gastro Bar & Bar",
      "Dinner",
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "hospedajes",
    name: "Hospedajes",
    subcategories: ["Hoteles", "Glamping"],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "aventura",
    name: "Aventura",
    subcategories: ["Actividades extremas", "Naturaleza", "Tours guiados"],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "market",
    name: "Market",
    subcategories: ["Supermercados"],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "shops",
    name: "Shops",
    subcategories: ["Fitness", "Todo a $5.000", "Tendero / Tiendas de barrio"],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "drogueria",
    name: "Droguería",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "recomendado-pet",
    name: "Recomendado Pet",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "recomendado-kits",
    name: "Recomendado Kits",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "artesanias",
    name: "Artesanías",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "mall",
    name: "Mall",
    subcategories: [
      "Tiendas de ropa",
      "Restaurantes",
      "Entretenimiento (cine, bolera, juegos)",
      "Servicios",
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "emergencias",
    name: "Emergencias",
    subcategories: ["Policía", "Hospital", "Bomberos", "Ambulancia"],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "recomendado-del-mes",
    name: "Recomendado del mes",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "cultural",
    name: "Cultural",
    subcategories: [
      "Rutas por hacer",
      "Museos",
      "Senderismo",
      "Calles con historia",
      "Parques",
      "Catedrales",
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "vecinos",
    name: "Vecinos",
    subcategories: [
      "Barichara",
      "Socorro",
      "Curití",
      "Charalá",
      "Valle de San José",
      "Otros pueblos cercanos",
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "emprendedores",
    name: "Emprendedores",
    subcategories: [
      "Tiendas locales destacadas",
      "Productos únicos de la región",
      "Startups / Nuevos negocios",
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
];

export async function seedCategories() {
  try {
    const categoriesCollection = collection(db, "categories");

    for (const category of categoriesData) {
      const { id, ...categoryRest } = category;

      await addDoc(categoriesCollection, {
        ...categoryRest,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`Added category: ${category.name}`);
    }

    console.log("All categories uploaded successfully!");
  } catch (error) {
    console.error("Error uploading categories:", error);
    throw error;
  }
}

const locationsData = [
  {
    id: "loc-1",
    name: "Restaurante Jenny",
    description:
      "Auténtica comida santandereana con platos tradicionales como cabrito, mute y pescado fresco de río en un ambiente familiar acogedor.",
    address: "Calle 10 #5-20, San Gil",
    photo: "restaurant-jenny.jpg",
    mapsUrl: "https://maps.google.com/?q=6.556,-73.133",
    bookingUrl: "https://reservations.mock/jenny",
    tags: ["familiar", "comida local", "tradicional"],
    category: "gastronomía",
    subcategory: "Restaurantes",
    coordinates: [6.556, -73.133],
  },
  {
    id: "loc-2",
    name: "Café del Río",
    description:
      "Cafetería especializada con granos cultivados localmente y pasteles caseros. Lugar perfecto para relajarse después de actividades de aventura.",
    address: "Carrera 9 #8-15, San Gil",
    photo: "restaurant-jenny.jpg",
    mapsUrl: "https://maps.google.com/?q=6.558,-73.135",
    tags: ["café", "pasteles", "relajante"],
    category: "gastronomía",
    subcategory: "Cafés",
    coordinates: [6.558, -73.135],
  },
  {
    id: "loc-3",
    name: "Cueva del Indio",
    description:
      "Sistema histórico de cuevas de piedra caliza con antiguos petroglifos indígenas y visitas guiadas a través de impresionantes formaciones rocosas.",
    address: "Vereda Curití, San Gil",
    photo: "cueva-del-indio.jpg",
    mapsUrl: "https://maps.google.com/?q=6.559,-73.140",
    tags: ["patrimonio", "visitas guiadas", "naturaleza"],
    category: "cultura",
    subcategory: "Sitios Históricos",
    coordinates: [6.559, -73.14],
  },
  {
    id: "loc-4",
    name: "Catedral de San Gil",
    description:
      "Hermosa catedral colonial que data del siglo XVIII, con impresionante arquitectura y arte religioso.",
    address: "Parque Principal, San Gil",
    photo: "cueva-del-indio.jpg",
    mapsUrl: "https://maps.google.com/?q=6.554,-73.134",
    tags: ["colonial", "arquitectura", "religioso"],
    category: "cultura",
    subcategory: "Sitios Históricos",
    coordinates: [6.554, -73.134],
  },
  {
    id: "loc-5",
    name: "Paragliding San Gil",
    description:
      "Experiencia de parapente en tándem sobre el impresionante Cañón del Chicamocha con instructores certificados y vistas impresionantes.",
    address: "Mesa de Los Santos, San Gil",
    photo: "paragliding.jpg",
    mapsUrl: "https://maps.google.com/?q=6.560,-73.135",
    bookingUrl: "https://adventure.mock/paragliding",
    tags: ["adrenalina", "adultos", "vistas panorámicas"],
    category: "aventura",
    subcategory: "Deportes Extremos",
    coordinates: [6.56, -73.135],
  },
  {
    id: "loc-6",
    name: "Rafting Río Suarez",
    description:
      "Emocionante aventura de rafting en aguas blancas a través de rápidos Clase II-III con guías profesionales y equipo de seguridad incluido.",
    address: "Puerto Bogotá, San Gil",
    photo: "paragliding.jpg",
    mapsUrl: "https://maps.google.com/?q=6.545,-73.120",
    bookingUrl: "https://adventure.mock/rafting",
    tags: ["deportes acuáticos", "adrenalina", "grupos"],
    category: "aventura",
    subcategory: "Deportes Extremos",
    coordinates: [6.545, -73.12],
  },
  {
    id: "loc-7",
    name: "FixMyPhone",
    description:
      "Servicios profesionales de reparación de teléfonos y dispositivos electrónicos con piezas genuinas y tiempos de entrega rápidos.",
    address: "Carrera 8 #7-12, San Gil",
    photo: "phone-repair.jpg",
    mapsUrl: "https://maps.google.com/?q=6.553,-73.137",
    tags: ["servicios", "electrónica", "reparación"],
    category: "tiendas",
    subcategory: "Servicios",
    coordinates: [6.553, -73.137],
  },
  {
    id: "loc-8",
    name: "Artesanías del Fonce",
    description:
      "Artesanías y souvenirs tradicionales hechos por artesanos locales, incluyendo textiles tejidos y cerámica.",
    address: "Calle 12 #9-8, San Gil",
    photo: "phone-repair.jpg",
    mapsUrl: "https://maps.google.com/?q=6.555,-73.132",
    tags: ["artesanías", "souvenirs", "arte local"],
    category: "tiendas",
    subcategory: "Artesanías",
    coordinates: [6.555, -73.132],
  },
];

export async function seedLocations() {
  try {
    const locationsCollection = collection(db, "locations");

    for (const location of locationsData) {
      const { id, coordinates, ...locationRest } = location;
      const [latitude, longitude] = coordinates;

      await addDoc(locationsCollection, {
        ...locationRest,
        latitude,
        longitude,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`Added location: ${location.name}`);
    }

    console.log("All locations uploaded successfully!");
  } catch (error) {
    console.error("Error uploading locations:", error);
    throw error;
  }
}

const productsData = [
  {
    id: "prod-1",
    name: "Camiseta de Aventura San Gil",
    description:
      "Camiseta de algodón premium con el paisaje icónico de San Gil y gráficos de deportes de aventura.",
    price: "$25.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  },
  {
    id: "prod-2",
    name: "Sudadera Cañón del Chicamocha",
    description:
      "Sudadera cómoda con impresionante diseño del cañón y marca de San Gil.",
    price: "$45.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  },
];

export async function seedProducts() {
  try {
    const productsCollection = collection(db, "products");

    for (const product of productsData) {
      await addDoc(productsCollection, {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`Added product: ${product.name}`);
    }

    console.log("All products uploaded successfully!");
  } catch (error) {
    console.error("Error uploading products:", error);
    throw error;
  }
}

async function main() {
  console.log("Starting Firebase data seeding...");

  try {
    await seedCategories();
    await seedLocations();
    await seedProducts();

    console.log("✅ All data uploaded successfully to Firebase!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log("Seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
