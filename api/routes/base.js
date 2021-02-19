const path = require('path');
const router = require('express').Router();
const { wrap, general } = require('../../utils');
const middlewares = require('../middlewares');

const { fileSystem } = general;

router.get('/', (req, res) => res.json({ api: 'still in dev' }));

router.post('/upload', wrap.asyncHandler(middlewares.uploadFiles));
router.post('/upload', (req, res) => wrap.response(res).send(req.body));

router.get('/logs/:id?', (req, res) => {
    let base = path.join(process.cwd(), 'logs');

    if(req.params?.id) {
        let filepath = path.join(base, `${ req.params.id }.log`);
        return fileSystem.read.file(filepath)
            ? res.sendFile(filepath)
            : wrap.response(res).notFound();
    }

    return wrap.response(res).send(fileSystem.read.dir(base));
});

module.exports = router;