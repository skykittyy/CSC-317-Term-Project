// const sqlite3 = require('sqlite3').verbose();
// const path = require('path');

// const dbPath = path.join(__dirname, 'database.sqlite');
// const db = new sqlite3.Database(dbPath);

// const products = [
//   {
//     name: '🌊Nibbles the Narwhal Plush🦄',
//     price: 19.99,
//     description: `A magical narwhal plush with a shiny horn. 
// Meet Nibbles the Narwhal, your whimsical underwater buddy! 
// With his soothing seafoam blue body, sparkly spiral tusk, and a dapper striped bowtie, 
// Nibbles is always dressed to impress. He's not just charming—he’s a fantastic cuddle companion, 
// perfect for story time, nap time, or deep-sea daydreams. 
// Nibbles loves to spread smiles and magic wherever he goes, 
// one soft snuggle at a time!`,
//     image: 'https://www.safariltd.com/cdn/shop/products/10-plush-nevil-narwhal-assorted-306656.jpg?v=1690039337&width=900'
//   },
//   {
//     name: '🐝Bumbleboo the Snuggle Bee✨',
//     price: 14.99,
//     description: `Say hello to Bumbleboo, the softest, roundest, and most lovable little bee you'll ever meet! 
// With his plushy yellow fuzz, velvety chocolate-brown stripes, and tiny fluttery wings, 
// Bumbleboo is always ready to buzz into your heart. 
// Whether you're having a lazy day, a cozy movie night, or just need a comforting cuddle, 
// Bumbleboo’s here to make you feel warm and happy. 
// He’s not just a plush—he’s your personal pollen-powered cuddle buddy!`,
//     image: 'https://m.media-amazon.com/images/I/41s95NitPcL._SL500_._SL250_.jpg'
//   },
//   {
//     name: '🧡Cappy the Chill Capybara🛁',
//     price: 16.49,
//     description: `Meet Cappy, the mellowest plush on the planet! 
// With his warm caramel fur, cozy cocoa-colored paws, and endlessly calm expression, 
// Cappy is your go-to buddy for ultimate relaxation. 
// Whether you're taking a break, sipping tea, or just vibing with lo-fi beats, 
// this capybara companion brings the peaceful energy of a zen garden straight to your arms. 
// Hug him once, and you’ll wonder how you ever de-stressed without him!`,
//     image: 'https://cdn4.volusion.store/9nxdj-fchy5/v/vspfiles/photos/FA-A13450-2.jpg?v-cache=1740511032'
//   },
//   {
//     name: '🐯Tigrillo the Curious Cub🐾',
//     price: 18.00,
//     description: `Tigrillo is a soft, adventurous tiger cub plush who’s always on the prowl for fun and friendship! 
// With velvety orange fur, bold black stripes, and a fluffy white chest, 
// Tigrillo brings the wild spirit of the jungle into your arms. 
// His wide eyes and sweet pink nose give him an irresistibly curious expression, 
// making him the perfect companion for imaginative play or cozy snuggles. 
// Whether he's exploring new lands or cuddling at bedtime, 
// Tigrillo is always ready to be your loyal little explorer.`,
//     image: 'https://douglascuddletoy.com/wp-content/uploads/2018/11/4082.jpg'
//   },
//   {
//     name: '🐕Rusty the Loyal Pup🦴',
//     price: 21.95,
//     description: `Meet Rusty, the fluffiest little guardian with a heart full of love and paws ready for adventure! 
// With his warm caramel-colored fur and sleek black saddle markings, 
// Rusty looks just like a mini German Shepherd—and he's every bit as brave. 
// His bright eyes sparkle with curiosity and kindness, always on the lookout for fun or someone to cheer up. 
// Whether he's curled up by your side or leading the way on pretend patrol, 
// Rusty is your forever friend and fearless companion.`,
//     image: 'https://shop.akc.org/cdn/shop/files/81HeefhXNQL._AC_SL1500.jpg?v=1682709742&width=945'
//   },
//   {
//     name: '🧊MochiPop the Chill Puff🐼',
//     price: 13.95,
//     description: `Say hello to MochiPop, the squishy little cloud of joy who’s softer than a marshmallow and cooler than an ice cube! 
// With dreamy pastel blue ears, chubby cheeks blushed in pink, and a perfectly round body, 
// MochiPop is the ultimate cuddle companion. 
// This gentle puffball waddles through life spreading calm vibes, cozy naps, and quiet giggles. 
// Whether stacked with friends or snuggled solo, 
// MochiPop brings a sprinkle of kawaii magic wherever they go!`,
//     image: 'https://cdn11.bigcommerce.com/s-do3nxddvbo/images/stencil/1280x1280/products/5957/10317/file_4__34381.1616086562.1280.1280__08939.1680738167.1280.1280__55893.1680741972.jpg?c=1'
//   },
//   {
//     name: '🦊Rusty Paws🌲',
//     price: 17.25,
//     description: `Say hello to Rusty Paws — your fluffy forest friend full of curiosity and charm! 
// With his soft orange coat, snow-white chest, and velvety black legs, 
// he’s the perfect cuddle buddy for cozy nights and big adventures alike. 
// His bright eyes sparkle with wonder and his fluffy white-tipped tail is always wagging with excitement! 
// Whether you're telling stories, exploring your imagination, or just need a warm hug, 
// Rusty Paws is always there with a soft smile and loyal heart.`,
//     image: 'https://shop.wildrepublic.com/cdn/shop/products/10944-2_grande.jpg?v=1745604374'
//   },
//   {
//     name: '🐦Skye Beak💙',
//     price: 22.00,
//     description: `Say chirp-chirp to Skye Beak, the tiny songbird with a big heart and even bigger dreams! 
// Dressed in brilliant sky-blue feathers with a peachy belly as soft as a cloud, 
// Skye loves to perch on your shoulder or windowsill and sing stories of sunshine, spring breezes, and faraway skies. 
// With shiny eyes full of wonder and a plump little body perfect for palm-sized cuddles, 
// Skye Beak is the fluffiest feathered friend you'll ever meet. 
// Whether it’s a morning hug or a nighttime lullaby, this chirpy buddy is always ready to brighten your day.`,
//     image: 'https://cdn4.volusion.store/9nxdj-fchy5/v/vspfiles/photos/WR-18230-2.jpg?v-cache=1740511032'
//   },
//   {
//     name: '🐸Frooble the Hug Hopper💚',
//     price: 15.75,
//     description: `Say hello to Frooble, the fluffiest frog friend you’ll ever meet! 
// With his super soft lime-green fur, chubby cheeks, and cute little cream-colored toes, 
// Frooble is made for maximum snuggles. 
// His big round eyes are full of curiosity and kindness, and his squishy belly is the perfect place to rest your head after a long day. 
// Whether he’s hopping into a new adventure or chilling on your bed, 
// Frooble is always ready to bring joy, giggles, and the coziest cuddles ever!`,
//     image: 'https://avocatt.com/cdn/shop/products/image_155b096f-41cf-4f06-8167-060cc95e6780.jpg'
//   },
//   {
//     name: '❤️Lovelina the Llama🦙',
//     price: 19.50,
//     description: `Meet Lovelina, the queen of cuddles and heart-eyed happiness! 
// With her cloud-like white fluff, dazzling red heart-shaped eyes, and stylish matching red hooves, 
// Lovelina spreads love wherever she trots. She's a walking Valentine—soft, sweet, and full of charm. 
// Whether you're celebrating a special moment or just need a fluffy mood booster, 
// Lovelina’s loving gaze and snuggly hugs will instantly brighten your day.`,
//     image: 'https://auroragift.com/cdn/shop/products/77103_531984c3-53a3-48af-b30e-7dd23bec6078.jpg?v=1741640961'
//   },
//   {
//     name: '❄️Howlie the Husky Cub🐺',
//     price: 18.60,
//     description: `Say hello to Howlie, the fluffiest little adventurer from the snowy north! 
// With his soft grey fur, round button eyes, and teeny pink paw pads, 
// Howlie is always ready to lead a cuddly expedition—right from your bed or couch! 
// His tail’s extra plush for hugs, and his ears perk up whenever there’s fun to be had. 
// Howlie is loyal, playful, and the best snuggle buddy on chilly days. 
// Whether you're braving a blizzard or just watching cartoons, 
// he’ll stick by your side with cozy vibes and tail wags.`,
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR59V4t_W4aQQgmBvSPnWhik57B2qGvBjUgZA&s'
//   },
//   {
//     name: '🐔Cluckleberry Puff🐣',
//     price: 20.25,
//     description: `Meet Cluckleberry Puff, the roundest, softest, most lovable chicken in the coop! 
// With his fluffy caramel feathers, cuddly cream belly, and a bright red comb that wiggles when he bobs, 
// Cluckleberry is pure plush perfection. 
// His tiny wings give the best squish-hugs, and his little eyes sparkle with endless curiosity. 
// Whether he's chilling on your bed, riding in your backpack, or starring in an imaginary barnyard adventure, Cluckleberry Puff is your go-to pal for comfort, giggles, and good vibes all day long!`,
//     image: 'https://m.media-amazon.com/images/I/71X7bfRUlML.jpg'
//   }
// ];

// db.serialize(() => {
//   db.run(`DROP TABLE IF EXISTS products`, (err) => {
//     if (err) {
//       console.error('Error dropping products table:', err);
//       return;
//     }

//     db.run(`
//       CREATE TABLE products (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT NOT NULL,
//         price REAL NOT NULL,
//         description TEXT NOT NULL,
//         image TEXT NOT NULL
//       )
//     `, (err) => {
//       if (err) {
//         console.error('Error creating products table:', err);
//         return;
//       }

//       const stmt = db.prepare(`INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)`);

//       for (const p of products) {
//         stmt.run(p.name, p.price, p.description, p.image, (err) => {
//           if (err) console.error('Error inserting product:', err);
//         });
//       }

//       stmt.finalize((err) => {
//         if (err) {
//           console.error('Error finalizing statement:', err);
//         } else {
//           console.log('Database initialized with products!');
//         }
//         db.close();
//       });
//     });
//   });
// });
