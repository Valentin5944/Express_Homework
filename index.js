import express from "express"

const app = express();

// ОБОВ'ЯЗКОВО: додаємо middleware для читання JSON з Postman
app.use(express.json());

const HOST = 'localhost';
const PORT = 3000;

app.get('/timestamp', (req, res) => {
    const currentDate = new Date();
    res.json({ timestamp: currentDate.toISOString() });
});

app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

app.get('/stats', (req, res) => {
    res.json({
        uptime: Math.floor(process.uptime()),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

const products = [
    { id: 1, name: "Тв", price: 500, category: "electronics" },
    { id: 2, name: "Телефон", price: 800, category: "electronics" },
    { id: 3, name: "ноутбук", price: 1200, category: "electronics" },
    { id: 4, name: "Стіл", price: 150, category: "furniture" },
    { id: 5, name: "Стол", price: 250, category: "furniture" }
];

app.get('/products', (req, res) => {
    let filteredProducts = products;
    if (req.query.category) {
        filteredProducts = filteredProducts.filter(item => item.category === req.query.category);
    }
    if (req.query.take) {
        if (isNaN(req.query.take) === false) {
            const count = Number(req.query.take);
            filteredProducts = filteredProducts.slice(0, count);
        }
    }
    res.json(filteredProducts);
});

app.get('/products/:id', (req, res) => {
    const targetId = Number(req.params.id);
    const foundProduct = products.find(product => product.id === targetId);

    if (!foundProduct) {
        return res.status(404).json({ error: "Такого продукта нема" });
    }
    res.json(foundProduct);
});

app.post('/products', (req, res) => {
    if (req.query.fail === 'true') {
        return res.status(500).json({ error: "Помилка при додаванні продукту" });
    }
    
    const { name, price, category, image } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0 || !Number.isInteger(price) || price <= 0 || !category || typeof category !== 'string' || category.trim().length === 0 || image && typeof image !== 'string') {
        return res.status(422).json({ error: "Semantic Error" });
    }
    if (products.some(product => product.name === name)) {
        return res.status(409).json({ error: "Conflict Error" });
    }


    const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const addedProduct = { 
        id: newId, 
        name: name.trim(), 
        price, 
        category: category.trim(),
        ...(image && { image })
    };

    products.push(addedProduct);
    res.status(201).json({
        message: "Продукт успешно добавлен!",
        product: addedProduct
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}/products`);
});
