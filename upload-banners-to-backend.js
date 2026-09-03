const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { PrismaClient } = require('D:/Backend/glassophite_backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mongodb://sadik:rwneEX7oWsRqLvJY@ac-60kul68-shard-00-00.lw1wxb4.mongodb.net:27017,ac-60kul68-shard-00-01.lw1wxb4.mongodb.net:27017,ac-60kul68-shard-00-02.lw1wxb4.mongodb.net:27017/glassophite?ssl=true&replicaSet=atlas-11m0z9-shard-0&authSource=admin&appName=Cluster0",
    },
  },
});

const IMGBB_API_KEY = "8c400efc00a65e50fc6c79c628ccab48";

async function uploadToImgBB(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const base64Image = fileBuffer.toString('base64');

  const formData = new URLSearchParams();
  formData.append('image', base64Image);

  const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (response.data && response.data.data && response.data.data.url) {
    return response.data.data.url;
  }
  throw new Error('ImgBB upload failed: ' + JSON.stringify(response.data));
}

async function main() {
  console.log('🚀 Step 1: Uploading 4 banner images to ImgBB...');

  const desktopDarkPath = 'd:/Frontend/glassophite-frontend/public/assets/banners/banner_desktop_dark.jpg';
  const desktopLightPath = 'd:/Frontend/glassophite-frontend/public/assets/banners/banner_desktop_light.jpg';
  const mobileDarkPath = 'd:/Frontend/glassophite-frontend/public/assets/banners/banner_mobile_dark.jpg';
  const mobileLightPath = 'd:/Frontend/glassophite-frontend/public/assets/banners/banner_mobile_light.jpg';

  const desktopDarkUrl = await uploadToImgBB(desktopDarkPath);
  console.log('✅ Desktop Dark uploaded:', desktopDarkUrl);

  const desktopLightUrl = await uploadToImgBB(desktopLightPath);
  console.log('✅ Desktop Light uploaded:', desktopLightUrl);

  const mobileDarkUrl = await uploadToImgBB(mobileDarkPath);
  console.log('✅ Mobile Dark uploaded:', mobileDarkUrl);

  const mobileLightUrl = await uploadToImgBB(mobileLightPath);
  console.log('✅ Mobile Light uploaded:', mobileLightUrl);

  console.log('\n🚀 Step 2: Saving Banners into MongoDB database...');

  // Create Banner 1: Dark Edition
  const banner1 = await prisma.banner.create({
    data: {
      title: 'Visionary Elegance - Titanium Dark Series',
      subtitle: 'Handcrafted Swiss HD Optics & Japanese Featherweight Titanium',
      badge: 'EXCLUSIVE DROP',
      description: 'Experience uncompromising clarity with polarized cyan gradient optics, ultra-durable corrosion-resistant black frames, and timeless silhouette.',
      imageUrl: desktopDarkUrl,
      mobileImageUrl: mobileDarkUrl,
      linkUrl: '/product-filter?category=sunglasses',
      buttonText: 'Explore Dark Edition',
      discountTag: 'UP TO 40% OFF',
      status: 'ACTIVE',
      order: 1,
    },
  });
  console.log('✅ Banner 1 created in DB:', banner1.id, banner1.title);

  // Create Banner 2: Gold & Crystal Light Edition
  const banner2 = await prisma.banner.create({
    data: {
      title: 'Handcrafted Luxury - 24K Gold Crystal Series',
      subtitle: 'Minimalist Scandinavian Aesthetic with Gold Titanium Trim',
      badge: 'NEW ARRIVAL',
      description: 'Bright champagne crystal acetate frames with dual-bridge titanium architecture and signature Glassophite UV400 lenses.',
      imageUrl: desktopLightUrl,
      mobileImageUrl: mobileLightUrl,
      linkUrl: '/product-filter?category=optical-glasses',
      buttonText: 'Discover Gold Series',
      discountTag: 'LIMITED RUN',
      status: 'ACTIVE',
      order: 2,
    },
  });
  console.log('✅ Banner 2 created in DB:', banner2.id, banner2.title);

  console.log('\n🎉 ALL BANNERS UPLOADED AND SEEDED TO BACKEND SUCCESSFULLY!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
