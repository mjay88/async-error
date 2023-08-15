const mongoose = require("mongoose");
//we will just run this file on it's own anytime we want new data in the data base
const Product = require("./models/product");

mongoose
	.connect("mongodb://127.0.0.1:27017/farmStand2")
	.then(() => {
		console.log("MONGO CONNECTION OPEN!");
	})
	.catch((e) => {
		console.log("MONGO CONNECTION ERROR: ", e);
	});

// const p = new Product({
// 	name: "Ruby Grapefruit",
// 	price: 1.99,
// 	category: "fruit",
// });
// p.save()
// 	.then((p) => {
// 		console.log(p);
// 	})
// 	.catch((e) => {
// 		console.log("ERROR: ", e);
// 	});

const seedProducts = [
	{
		name: "Ruby Grapefruit",
		price: 1.99,
		category: "fruit",
	},
	{
		name: "Banana",
		price: 0.59,
		category: "fruit",
	},
	{
		name: "Broccoli",
		price: 2.49,
		category: "vegetable",
	},
	{
		name: "Carrot",
		price: 1.29,
		category: "vegetable",
	},
	{
		name: "Whole Milk",
		price: 3.09,
		category: "dairy",
	},
	{
		name: "Strawberries",
		price: 2.99,
		category: "fruit",
	},
	{
		name: "Greek Yogurt",
		price: 1.49,
		category: "dairy",
	},
	{
		name: "Spinach",
		price: 1.79,
		category: "vegetable",
	},
	{
		name: "Cheddar Cheese",
		price: 4.49,
		category: "dairy",
	},
	{
		name: "Tomato",
		price: 0.89,
		category: "vegetable",
	},
	{
		name: "Apple",
		price: 0.99,
		category: "fruit",
	},
];

//if there are any validation errors mongoose will not insert anything
Product.insertMany(seedProducts)
	.then((res) => {
		console.log(res);
	})
	.catch((e) => {
		console.log("ERROR: :", e);
	});
