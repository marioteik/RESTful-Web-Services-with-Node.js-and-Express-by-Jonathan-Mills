var express = require('express');

var routes = function (Book) {
    var bookRouter = express.Router();
    var bookController = require('../controllers/bookController')(Book);

    bookRouter.route('/')
        .get(bookController.get)
        .post(bookController.post);

    bookRouter.use('/:bookId', bookController.returnOne);

    bookRouter.route('/:bookId')
        .get(bookController.getOne)
        .put(bookController.put)
        .patch(bookController.patch)
        .delete(bookController.delete);

    return bookRouter;
};

module.exports = routes;