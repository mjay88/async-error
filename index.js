const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const AppError = require("./AppError");
const Product = require("./models/product");

mongoose
	.connect("mongodb://127.0.0.1:27017/farmStand2")
	.then(() => {
		console.log("MONGO CONNECTION OPEN!");
	})
	.catch((e) => {
		console.log("MONGO CONNECTION ERROR: ", e);
	});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middlewares
//tell express to use middleware, so we can send post request
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//dealing with 'selected'
const categories = ["fruit", "vegetable", "dairy", "mushrooms"];

//show all products route
app.get(
	"/products",
	wrapAsync(async (req, res, next) => {
		const { category } = req.query;
		if (category) {
			const products = await Product.find({ category: category });
			res.render("products/index", { products, category });
		} else {
			const products = await Product.find({});
			res.render("products/index", { products, category: "All" });
		}

		// console.log(products, "all products"); //shows up in terminal
		// res.render("products/index", { products });
	})
);
//create new products routes, serve new products form
app.get("/products/new", (req, res) => {
	// throw new AppError("NOT ALLOWED", 401);
	res.render("products/new", { categories });
});
//create new products post route
app.post(
	"/products",
	wrapAsync(async (req, res, next) => {
		const newProduct = new Product(req.body);
		await newProduct.save();
		// console.log(newProduct);
		res.redirect(`/products/${newProduct._id}`);
	})
);

function wrapAsync(fn) {
	return function (req, res, next) {
		fn(req, res, next).catch((e) => next(e));
	};
}

//show route/dynamic route
app.get(
	"/products/:id",
	wrapAsync(async (req, res, next) => {
		//get the id
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			throw new AppError("PRODUCT NOT FOUND", 404); //next won't stop our code, it calls the 'next' middleware, in this case the creation of a new error
		}
		// console.log(product);
		res.render("products/show", { product }); //this code still runs after executing next, that why we get the ejs error in nodemon it tries to compile our code, unless we add the return
	})
);

//edit route
app.get(
	"/products/:id/edit",
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const product = await Product.findById(id);
		if (!product) {
			throw new AppError("PRODUCT NOT FOUND", 404);
		}
		res.render("products/edit", { product, categories });
	})
);
//edit route
app.put(
	"/products/:id",
	wrapAsync(async (req, res, next) => {
		const { id } = req.params;
		const product = await Product.findByIdAndUpdate(id, req.body, {
			runValidators: true,
			new: true,
		});
		// console.log(req.body);
		res.redirect(`/products/${product._id}`);
	})
);
//delete route
app.delete(
	"/products/:id",
	wrapAsync(async (req, res) => {
		const { id } = req.params;
		const deletedProduct = await Product.findByIdAndDelete(id);
		res.redirect("/products");
	})
);

function handleValidationErr(error) {
	console.dir(error);
	return new AppError(`Validation Failed...${error.message}`, 400);
}
//mongoose errors
app.use((err, req, res, next) => {
	console.log(err.name);
	if (err.name === "ValidationError") err = handleValidationErr(err);
	next(err);
});

app.use((err, req, res, next) => {
	const { status = 500, message = "SOMETHING WENT WRONG" } = err;
	res.status(status).send(message);
});

app.listen(3000, () => {
	console.log("APP IS LISTENING ON PORT 3000");
});
