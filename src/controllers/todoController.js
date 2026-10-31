const store = require("../data/todoStore");
const AppError = require("../utils/AppError");

const {
    validateCreate,
    validateUpdate,
    parseId,
    parseDone,
} = require("../validators/todoValidators");

async function getAll(req, res) {
    const done = parseDone(req.query.done);
    res.json(await store.findAll(done));
}

async function getOne(req, res) {
    const todo = await store.findById(parseId(req.params.id));
    if(!todo) throw new AppError("Todo not found" , 404);
    res.json(todo);
}

async function create(req, res) {
    const data = validateCreate(req.body);
    res.status(201).json(await store.create(data));
}

async function update(req, res) {
    const id = parseId(req.params.id);
    const changes = validateUpdate(req.body);
    const todo = await store.update(id, changes);
    if(!todo) throw new AppError("Todo not found", 404);
    res.json(todo);
}

async function remove(req, res) {
    const id = parseId(req.params.id);
    const deleted = await store.remove(id);

    if(!deleted) throw new AppError("Todo not found", 404);
    res.status(204).send();
}

module.exports = { getAll, getOne, create, update, remove };