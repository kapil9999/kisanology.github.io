const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const validateToken= require('../utils/validateToken')


console.log(Post);
// Display all forum posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ created_at: 'desc' }).lean();
        res.render('posts/index', { posts });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});


//Display form for creating new post
router.get('/new', (req, res) => {
    res.render('posts/new');
});

// Display form for creating new post
router.get('/help', (req, res) => {
    res.render('help');
});
// Display single post with question and answers
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).lean();
        res.render('posts/show', { post });
    } catch (err) {
        console.error(err);
        res.render('error/404');
    }
});

// Handle POST request to add an answer to a post
router.post('/:id/answers', async (req, res) => {
    const post = await Post.findById(req.params.id);
    const {reqToken}= req.body;

    const validToken= validateToken(reqToken)
    if(!validToken)
        return res.status(401).send("Invalid token")
    
    
    if (!post) {
        return res.status(404).send('Post not found');
    }

    post.answers.push({ answer: req.body.answer, user: validToken.username } );
    await post.save();

    res.redirect(`/posts/${post.id}`);
});

// Create new post
router.post('/', async (req, res) => {
    const { question } = req.body;
    try {
        const post = new Post({ question });
        await post.save();
        res.redirect('/posts');
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});





module.exports = router;
