const express = require('express');
const router = express.Router();
const FAQ = require('../models/FAQ');

// GET all FAQs
router.get('/', async (req, res) => {
	try {
		const faqs = await FAQ.find().lean();
		res.render('faq', { faqs });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// GET add FAQ page

router.get('/add', async (req, res) => {
	try {
		res.render('add-faq', );
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// GET one FAQ
router.get('/:id', getFAQ, (req, res) => {
	res.json(res.faq);
});

// CREATE one FAQ
router.post('/', async (req, res) => {
	const faq = new FAQ({
		question: req.body.question,
		answer: req.body.answer
	});

	try {
		const newFAQ = await faq.save();
        const faqs = await FAQ.find().lean();

        res.render('faq', {faqs})
    } catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// UPDATE one FAQ
router.patch('/:id', getFAQ, async (req, res) => {
	if (req.body.question != null) {
		res.faq.question = req.body.question;
	}
	if (req.body.answer != null) {
		res.faq.answer = req.body.answer;
	}
	try {
		const updatedFAQ = await res.faq.save();
		res.json(updatedFAQ);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// DELETE one FAQ
router.delete('/:id', getFAQ, async (req, res) => {
	try {
		await res.faq.remove();
		res.json({ message: 'FAQ deleted' });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// middleware function to get a single FAQ by ID
async function getFAQ(req, res, next) {
	let faq;
	try {
		faq = await FAQ.findById(req.params.id);
		if (faq == null) {
			return res.status(404).json({ message: 'Cannot find FAQ' });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	res.faq = faq;
	next();
}

module.exports = router;
