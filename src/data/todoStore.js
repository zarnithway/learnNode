const db = require("./db");
console.log(typeof db, db);

function toTodo(row) {
    if(!row) return undefined;
    return {id: row.id, title: row.title, is_done: row.is_done === 1}
}

async function findAll(done) {
    if (done === undefined) {
        return db.prepare("SELECT * FROM todos").all().map(toTodo);
    }

    return db
        .prepare("SELECT * FROM todos WHERE is_done = ?")
        .all(done ? 1 : 0)
        .map(toTodo)
}

async function findById(id) {
    return toTodo(db.prepare("SELECT * FROM todos WHERE id = ?").get(id));
}

async function create({ title, is_done }) {
    const result = db
                .prepare("INSERT INTO todos (title, is_done) VALUES (?, ?)")
                .run(title, is_done ? 1 : 0);
    return findById(result.lastInsertRowid);
}

async function update(id, changes) {
    const current = await findById(id);
    if(!current) return undefined;

    const title = changes.title ?? current.title;
    const is_done = changes.is_done ?? current.is_done;

    db.prepare("UPDATE todos SET title = ?, is_done = ? WHERE id = ?")
        .run(title, is_done ? 1 : 0, id);

    return findById(id);
}

async function remove(id) {
    const result = db.prepare("DELETE FROM todos WHERE id = ?").run(id);
    return result.changes > 0;
}

module.exports = {findAll, findById, create, update, remove};

