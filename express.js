import express, { json } from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (request, response) => {
    response.json({
        message: 'Welcome from Home Page!',
        success: true
    });
});

app.listen(PORT, () => {
    console.log(`Server is listen on http://localhost:${PORT}`);
})
