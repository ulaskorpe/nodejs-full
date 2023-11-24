const Category = require("../models/category");
const Blog = require("../models/blog");
const faker = require('faker');
const slugField = require("../helpers/slugfield");
async function populate() {
    const count = await Category.count();

    if(count == 0) { 

        await Category.bulkCreate([
            { name: "Web Development" },
            { name: "Mobil Development" },
            { name: "Programming" },
            { name: "Data Structures" },
            { name: "Beer and fun" },
            { name: "Death Metal" },
            { name: "Black Metal" },
            { name: "Doom Metal" }
        ]);

        for(let i = 1 ; i< 2 ; i++ ){
            
        await Blog.create({
            title: faker.lorem.sentence(),
            pre: faker.lorem.sentences(2),
            url :slugField(faker.lorem.sentence()),
            description: faker.lorem.sentences(10),
            image: i+".jpg",
            home: true,
            verified: true,
            categoryId: Math.floor(Math.random() * 8) + 1
        });
        }///for


        // await Blog.create({
        //     title: "Python ile Sıfırdan İleri Seviye Python Programlama",
        //     pre: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        //     description: "Python, son zamanların en popüler programlama dili haline geldi. Python' ın bu kadar popüler olmasındaki sebep şüphesiz öğrenmesi kolay bir yazılım dili olmasıdır.sadikturan adreslerinde paylaşmış olduğum python dersleri serisini takip ederek ister video ister yazılı kaynaklar yardımıyla kısa zamanda python programlama alanında uzmanlık kazanın ve hayal ettiğiniz projeyi gerçekleştirin.",
        //     image: "3.jpeg",
        //     home: true,
        //     verified: true,
        //     categoryId: 1
        // });

        // await Blog.create({
        //     title: "Python ile Sıfırdan İleri Seviye Python Programlama",
        //     pre: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        //     description: "Python, son zamanların en popüler programlama dili haline geldi. Python' ın bu kadar popüler olmasındaki sebep şüphesiz öğrenmesi kolay bir yazılım dili olmasıdır.sadikturan adreslerinde paylaşmış olduğum python dersleri serisini takip ederek ister video ister yazılı kaynaklar yardımıyla kısa zamanda python programlama alanında uzmanlık kazanın ve hayal ettiğiniz projeyi gerçekleştirin.",
        //     image: "2.jpeg",
        //     home: true,
        //     verified: true,
        //     categoryId: 2
        // });

        // await Blog.create({
        //     title: "Python ile Sıfırdan İleri Seviye Python Programlama",
        //     pre: "Sıfırdan İleri Seviye Python Dersleri.Veritabanı,Veri Analizi,Bot Yazımı,Web Geliştirme(Django)",
        //     description: "Python, son zamanların en popüler programlama dili haline geldi. Python' ın bu kadar popüler olmasındaki sebep şüphesiz öğrenmesi kolay bir yazılım dili olmasıdır.sadikturan adreslerinde paylaşmış olduğum python dersleri serisini takip ederek ister video ister yazılı kaynaklar yardımıyla kısa zamanda python programlama alanında uzmanlık kazanın ve hayal ettiğiniz projeyi gerçekleştirin.",
        //     image: "2.jpeg",
        //     home: true,
        //     verified: true,
        //     categoryId: 3
        // });
    }

}

module.exports = populate;