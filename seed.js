const maleNames = [
  "Hasan Ahmed",
  "Mehedi Hasan",
  "Saif Uddin",
  "Rafiq Ahmed",
  "Tanvir Hasan",
  "Arif Hossain"
];

const femaleNames = [
  "Ayesha Rahman",
  "Shabnam Karim",
  "Nusrat Jahan",
  "Farhana Akter",
  "Jannat Ara",
  "Nabila Islam"
];
const hospitals = [
  "Labaid Cardiac Hospital",
  "Square Hospital",
  "Apollo Hospital",
  "Popular Diagnostic Centre",
  "United Hospital",
  "Ibn Sina Hospital",
  "Dhaka Medical College Hospital",
  "Evercare Hospital",
  "Green Life Hospital",
  "Central Hospital Ltd"
];



const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// auto generate 30 doctors
const doctors = Array.from({ length: 30 }, (_, i) => {
  const isMale = i % 2 === 0;

  return {
    id: `d${i + 1}`,

    name: isMale
      ? `Dr. ${maleNames[i % maleNames.length]}`
      : `Dr. ${femaleNames[i % femaleNames.length]}`,

    specialty:
      i % 3 === 0
        ? "Cardiologist"
        : i % 3 === 1
        ? "Neurologist"
        : "Dermatologist",

    // 👇 FIXED IMAGE MATCH
    image: `https://randomuser.me/api/portraits/${
      isMale ? "men" : "women"
    }/${(i % 70) + 1}.jpg`,

    experience: `${5 + (i % 10)} years`,
    hospital: hospitals[i % hospitals.length],
    location: "Dhaka",
    fee: 500 + i * 50,
  };
});

async function seedData() {
  try {
    await client.connect();

    const db = client.db("doctorDB");
    const collection = db.collection("doctors");

    await collection.deleteMany({});
    const result = await collection.insertMany(doctors);

    console.log("✅ Inserted doctors:", result.insertedCount);

  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
}

seedData();