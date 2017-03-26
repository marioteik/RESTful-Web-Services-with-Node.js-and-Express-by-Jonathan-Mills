var bookController = function (Book) {
    var post = function (req, res) {
        var book = new Book(req.body);

        if(!req.body.title) {
            res.status(400);
            res.send('Title is required');
        } else {
            book.save();
            res.status(201);
            res.send(book);
        }
    };
    var get = function (req, res) {
        var query = {};
        if(req.query.genre)
            query.genre = req.query.genre;

        Book.find(query, function (err, books) {
            if(err)
                res.status(500).send(err);
            else
                var returnBooks = [];
                books.forEach(function (elem, i, arr) {
                    var el = elem.toJSON();
                    el.links = {};
                    el.links.self = 'http://' + req.headers.host + '/api/books/' + el._id;
                    returnBooks.push(el);
                });
                res.json(returnBooks);
        });
    };
    var getOne = function (req, res) {
        var returnBook = req.book.toJSON();
        returnBook.links = {};
        var newLink = 'http://' + req.headers.host + '/api/books?genre=' + returnBook.genre;
        returnBook.links.filterByThisGenre = newLink.replace(' ', '%20');
        res.json(returnBook);
    };
    var put = function (req, res) {
        req.book.title = req.body.title;
        req.book.author = req.body.author;
        req.book.genre = req.body.genre;
        req.book.read = req.body.read;
        req.book.save(function (err) {
            if(err)
                res.status(500).send(err);
            else
                res.json(req.book);
        });
    };
    var patch = function (req, res) {
        if(req.body._id)
            delete req.body._id;
        for(var p in req.body) {
            req.book[p] = req.body[p]
        }
        req.book.save(function (err) {
            if(err)
                res.status(500).send(err);
            else
                res.json(req.book);
        });
    };
    var deleteOne = function (req, res) {
        req.book.remove(function (err) {
            if(err)
                res.status(500).send(err);
            else
                res.status(204).send('Removed');
        });
    };
    var returnOne = function (req, res, next) {
        Book.findById(req.params.bookId, function (err, book) {
            if(err)
                res.status(500).send(err);
            else if (book) {
                req.book = book;
                next();
            } else
                res.status(404).send('no book found');
        });
    };

    return {
        get: get,
        post: post,
        getOne: getOne,
        put: put,
        patch: patch,
        delete: deleteOne,
        returnOne: returnOne
    }
};

module.exports = bookController;