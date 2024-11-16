import request from 'supertest';
import { app, server, db } from './index';

const invalidId = '000000000000000000000000';

describe('GET /todos', () => {
    it('sollte alle Todos abrufen', async () => {
        const response = await request(app)
            .get('/todos');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();

        response.body.forEach(todo => {
            expect(todo).toHaveProperty('_id');
            expect(todo).toHaveProperty('title');
            expect(todo).toHaveProperty('due');
            expect(todo).toHaveProperty('status');
        });
    });

    it('sollte einen 400-Fehler zurückgeben, wenn die ID ein ungültiges Format hat', async () => {
        const tooShortId = '12345';

        const response = await request(app)
            .get(`/todos/${tooShortId}`);

        expect(response.statusCode).toBe(400);
    });
});

describe('POST /todos', () => {
    it('sollte ein neues Todo erstellen', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe(newTodo.title);
        expect(response.body.due).toBe(newTodo.due);
        expect(response.body.status).toBe(newTodo.status);
    });

    it('sollte einen 400-Fehler zurückgeben, wenn das Todo unvollständig ist', async () => {
        const newTodo = {
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0,
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);

        expect(response.statusCode).toBe(400);
    });

    it('sollte einen 400-Fehler zurückgeben, wenn das Todo zusätzliche Felder hat', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0,
            "invalid": "invalid"
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);

        expect(response.statusCode).toBe(400);
    });

    it('sollte einen 400-Fehler zurückgeben, wenn Felder den falschen Datentyp haben', async () => {
        const newTodo = {
            "title": 123, // Sollte ein String sein
            "due": "Ungültiges Datum",
            "status": "nicht gültig" // Sollte eine Zahl sein
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);

        expect(response.statusCode).toBe(400);
    });
}); 0

describe('GET /todos/:id', () => {
    it('sollte ein Todo abrufen', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);

        const id = response.body._id;

        const getResponse = await request(app)
            .get(`/todos/${id}`);

        expect(getResponse.statusCode).toBe(200);
        expect(getResponse.body._id).toBe(id);
        expect(getResponse.body.title).toBe(newTodo.title);
        expect(getResponse.body.due).toBe(newTodo.due);
        expect(getResponse.body.status).toBe(newTodo.status);
    });

    it('sollte einen 404-Fehler zurückgeben, wenn das Todo nicht gefunden wurde', async () => {
        const getResponse = await request(app)
            .get(`/todos/${invalidId}`);

        expect(getResponse.statusCode).toBe(404);
        expect(getResponse.body.error).toMatch(/Todo with id .+ not found/);
    });
});

describe('PUT /todos/:id', () => {
    it('sollte ein Todo aktualisieren', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);

        const updatedTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 1,
            "_id": response.body._id
        };

        const updateResponse = await request(app)
            .put(`/todos/${response.body._id}`)
            .send(updatedTodo);

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body.status).toBe(updatedTodo.status);
    });

    it('sollte einen 400-Fehler zurückgeben, wenn Felder den falschen Datentyp haben', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);

        const updatedTodo = {
            "title": 123,
            "due": "Ungültiges Datum",
            "status": "nicht gültig",
            "_id": response.body._id
        };

        const updateResponse = await request(app)
            .put(`/todos/${response.body._id}`)
            .send(updatedTodo);

        expect(updateResponse.statusCode).toBe(400);
    });

    it('sollte einen 404-Fehler zurückgeben, wenn das Todo nicht existiert', async () => {
        const updatedTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0,
            "_id": invalidId
        };

        const response = await request(app)
            .put(`/todos/${invalidId}`)
            .send(updatedTodo);

        expect(response.statusCode).toBe(404);
    });
});

describe('DELETE /todos/:id', () => {
    it('sollte ein Todo löschen', async () => {
        const newTodo = {
            "title": "Übung 4 machen",
            "due": "2022-11-12T00:00:00.000Z",
            "status": 0
        };

        const response = await request(app)
            .post('/todos')
            .send(newTodo);

        const deleteResponse = await request(app)
            .delete(`/todos/${response.body._id}`);


        expect(deleteResponse.statusCode).toBe(204);

        const getResponse = await request(app)
            .get(`/todos/${response.body._id}`);

        expect(getResponse.statusCode).toBe(404);
    });

    it('sollte einen 404-Fehler zurückgeben, wenn das Todo nicht existiert', async () => {
        const response = await request(app)
            .delete(`/todos/${invalidId}`);

        expect(response.statusCode).toBe(404);
    });
});


afterAll(async () => {
    server.close()
    db.close()
})
