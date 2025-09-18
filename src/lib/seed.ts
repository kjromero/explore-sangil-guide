import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Clear all documents from a collection
async function clearCollection(collectionName: string) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log(`✅ Cleared ${collectionName} collection (${querySnapshot.size} documents)`);
  } catch (error) {
    console.error(`Error clearing ${collectionName} collection:`, error);
    throw error;
  }
}

// Clear all collections before seeding
async function clearAllCollections() {
  console.log("🗑️  Clearing all collections...");

  try {
    await clearCollection("categories");
    await clearCollection("locations");
    await clearCollection("products");

    console.log("✅ All collections cleared successfully");
  } catch (error) {
    console.error("Error clearing collections:", error);
    throw error;
  }
}

// Function to ask for confirmation before clearing data
async function confirmAndClear() {
  console.log("⚠️  WARNING: This will delete all existing data in your Firebase database!");
  console.log("Collections to be cleared:");
  console.log("  - categories");
  console.log("  - locations");
  console.log("  - products");
  console.log("");

  // For Node.js environment, we'll proceed with a clear warning
  // In a browser environment, you might want to use window.confirm()
  console.log("🔄 Proceeding with clearing in 5 seconds... (Ctrl+C to cancel)");

  // Give user time to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));

  return clearAllCollections();
}

const categoriesData = [
  {
    id: "comidas",
    slug: "comidas",
    name: "Comidas",
    subcategories: [
      {
        id: "lunch",
        name: "Lunch",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "cafes",
        name: "Cafés",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "comidas-rapidas",
        name: "Comidas rápidas",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "panaderias",
        name: "Panaderías",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "postres-heladerias",
        name: "Postres y Heladerías",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "gastro-bar",
        name: "Gastro Bar & Bar",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "dinner",
        name: "Dinner",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "hospedajes",
    slug: "hospedajes",
    name: "Hospedajes",
    subcategories: [
      {
        id: "hoteles",
        name: "Hoteles",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "glamping",
        name: "Glamping",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "aventura",
    slug: "aventura",
    name: "Aventura",
    subcategories: [
      {
        id: "actividades-extremas",
        name: "Actividades extremas",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "naturaleza",
        name: "Naturaleza",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "tours-guiados",
        name: "Tours guiados",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "market",
    slug: "market",
    name: "Market",
    subcategories: [
      {
        id: "supermercados",
        name: "Supermercados",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "shops",
    slug: "shops",
    name: "Shops",
    subcategories: [
      {
        id: "fitness",
        name: "Fitness",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "todo-a-5000",
        name: "Todo a $5.000",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "tendero-tiendas",
        name: "Tendero / Tiendas de barrio",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "drogueria",
    slug: "drogueria",
    name: "Droguería",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "recomendado-pet",
    slug: "recomendado-pet",
    name: "Recomendado Pet",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "recomendado-kits",
    slug: "recomendado-kits",
    name: "Recomendado Kits",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "artesanias",
    slug: "artesanias",
    name: "Artesanías",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "mall",
    slug: "mall",
    name: "Mall",
    subcategories: [
      {
        id: "tiendas-ropa",
        name: "Tiendas de ropa",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "restaurantes",
        name: "Restaurantes",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "entretenimiento",
        name: "Entretenimiento (cine, bolera, juegos)",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "servicios",
        name: "Servicios",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "emergencias",
    slug: "emergencias",
    name: "Emergencias",
    subcategories: [
      {
        id: "policia",
        name: "Policía",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "hospital",
        name: "Hospital",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "bomberos",
        name: "Bomberos",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "ambulancia",
        name: "Ambulancia",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "recomendado-del-mes",
    slug: "recomendado-del-mes",
    name: "Recomendado del mes",
    subcategories: [],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "cultural",
    slug: "cultural",
    name: "Cultural",
    subcategories: [
      {
        id: "rutas-por-hacer",
        name: "Rutas por hacer",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "museos",
        name: "Museos",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "senderismo",
        name: "Senderismo",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "calles-con-historia",
        name: "Calles con historia",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "parques",
        name: "Parques",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "catedrales",
        name: "Catedrales",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "vecinos",
    slug: "vecinos",
    name: "Vecinos",
    subcategories: [
      {
        id: "barichara",
        name: "Barichara",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "socorro",
        name: "Socorro",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "curiti",
        name: "Curití",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "charala",
        name: "Charalá",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "valle-de-san-jose",
        name: "Valle de San José",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "otros-pueblos",
        name: "Otros pueblos cercanos",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
  {
    id: "emprendedores",
    slug: "emprendedores",
    name: "Emprendedores",
    subcategories: [
      {
        id: "tiendas-locales",
        name: "Tiendas locales destacadas",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "productos-region",
        name: "Productos únicos de la región",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
      {
        id: "startups-nuevos",
        name: "Startups / Nuevos negocios",
        createdAt: "2025-09-16T00:00:00.000Z",
        updatedAt: "2025-09-16T00:00:00.000Z",
      },
    ],
    createdAt: "2025-09-16T00:00:00.000Z",
    updatedAt: "2025-09-16T00:00:00.000Z",
  },
];

export async function seedCategories() {
  try {
    for (const category of categoriesData) {
      const { id, slug, ...categoryRest } = category;
      const categoryRef = doc(db, "categories", id);

      await setDoc(categoryRef, {
        ...categoryRest,
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`Added category: ${category.name} with ID: ${id}`);
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
    wazeUrl: "https://waze.com/ul?ll=6.556,-73.133&navigate=yes",
    customUrl: "https://reservations.mock/jenny",
    tags: ["familiar", "comida local", "tradicional"],
    category: "comidas",
    subcategory: "lunch",
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
    wazeUrl: "https://waze.com/ul?ll=6.558,-73.135&navigate=yes",
    tags: ["café", "pasteles", "relajante"],
    category: "comidas",
    subcategory: "cafes",
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
    wazeUrl: "https://waze.com/ul?ll=6.559,-73.140&navigate=yes",
    tags: ["patrimonio", "visitas guiadas", "naturaleza"],
    category: "cultural",
    subcategory: "calles-con-historia",
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
    wazeUrl: "https://waze.com/ul?ll=6.554,-73.134&navigate=yes",
    tags: ["colonial", "arquitectura", "religioso"],
    category: "cultural",
    subcategory: "catedrales",
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
    wazeUrl: "https://waze.com/ul?ll=6.56,-73.135&navigate=yes",
    customUrl: "https://adventure.mock/paragliding",
    tags: ["adrenalina", "adultos", "vistas panorámicas"],
    category: "aventura",
    subcategory: "actividades-extremas",
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
    wazeUrl: "https://waze.com/ul?ll=6.545,-73.120&navigate=yes",
    customUrl: "https://adventure.mock/rafting",
    tags: ["deportes acuáticos", "adrenalina", "grupos"],
    category: "aventura",
    subcategory: "actividades-extremas",
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
    wazeUrl: "https://waze.com/ul?ll=6.553,-73.137&navigate=yes",
    tags: ["servicios", "electrónica", "reparación"],
    category: "emprendedores",
    subcategory: "tiendas-locales",
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
    wazeUrl: "https://waze.com/ul?ll=6.555,-73.132&navigate=yes",
    customUrl: "https://artesanias-sangil.mock",
    tags: ["artesanías", "souvenirs", "arte local"],
    category: "artesanias",
    subcategory: "",
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
  {
    id: "prod-3",
    name: "Gorra San Gil Explorer",
    description: "Gorra ajustable con logo bordado y diseño de aventura.",
    price: "$20.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  },
  {
    id: "prod-4",
    name: "Mochila de Senderismo San Gil",
    description:
      "Mochila resistente al agua con múltiples compartimentos y diseño ergonómico.",
    price: "$80.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  },
  {
    id: "prod-5",
    name: "Kit de Supervivencia para Aventureros",
    description:
      "Kit compacto con herramientas esenciales para actividades al aire libre.",
    price: "$60.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  },
  {
    id: "prod-6",
    name: "Mapa Ilustrado de San Gil",
    description:
      "Mapa artístico con puntos de interés, rutas de senderismo y actividades destacadas.",
    price: "$15.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  },
  {
    id: "prod-7",
    name: "Taza de Cerámica San Gil",
    description:
      "Taza de cerámica con diseño colorido que celebra la cultura y naturaleza de San Gil.",
    price: "$18.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  },
  {
    id: "prod-8",
    name: "Póster Fotográfico de San Gil",
    description:
      "Póster de alta calidad con fotografía profesional del paisaje de San Gil.",
    price: "$30.000 COP",
    image: "tshirt-mockup.jpg",
    instagramUrl: "https:instagram.com/sangiltourism",
  }
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
    // Clear all collections first with confirmation
    await confirmAndClear();

    // Seed fresh data
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
