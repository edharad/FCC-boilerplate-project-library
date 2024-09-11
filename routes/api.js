/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models').Book;

module.exports = function (app) {

  app
    .route('/api/books')
    .get(async (_req, res) => {
      let library = [];
      try{
        const books = await Book.find({});
        if(!books) {
          res.json([]);
          return;
        }
        
        const formatBooks = books.map((book) => {
          return {
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length,
          };
        });

        res.json(formatBooks);
       

      } catch (err) {
        res.json([])
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res) => {
      let bookTitle = req.body.title

      if(!bookTitle) {
        res.send("missing required field title");
        return;
      }

      const newBook = new Book({title: bookTitle, comments: []});
      try{  
          const book = await newBook.save();
          res.json({_id: book._id, title: book.title})
      } catch(err) {
        res.send("there was an error saving")
      }
      
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async (req, res) => {

      try{
        const deleted = await Book.deleteMany();
        console.log("Deleted books : >> ", deleted);
        res.send("complete delete successful")

      } catch(err) {
        res.send("Error")
      }
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;

      try {
        let book = await Book.findById(bookid, '_id title comments').exec();
        if(!book) {
          res.send("no book exists");
          return;
        }
        res.json(book);
        return;
      } catch (err) {
        res.send("no book exists")
      }
      
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if(!comment) {
          res.send("missing required field comment");
          return;
        }

      try {
        let updatedBook = await Book.findByIdAndUpdate(
          bookid, 
          {$push: {comments: comment}},
          {new: true}
        )

        if(!updatedBook) {
          res.send("no book exists");
          return;
        }
        res.json({
          _id: updatedBook._id,
          title: updatedBook.title,
          comments: updatedBook.comments,
          commentcount: updatedBook.comments.length
        });
        
      } catch(err) {
        res.send("no book exists")
      }

      //json res format same as .get
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;

      try{
        if(!bookid) {
          res.send("please enter an id");
          return;
        }

        let deletedBook = await Book.findByIdAndDelete(bookid);
        if(!deletedBook) {
          res.send("no book exists");
          return;
        }
        res.send('delete successful')

      } catch (err) {
        res.send("no book exists")
      }
      
      //if successful response will be 'delete successful'
    });
  
};
