import express from 'express';
import jwt from 'jsonwebtoken';

// models
import tagsModel from '../models/tagsModel.js';

// config 
const route = express.Router();

// env variable
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

route.get('/get_all_user_tags', async (req, res) => {
    // return a list of valid tags based on user id
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const result = await tagsModel.getAllUserTags({ userId });
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
    }
})
route.post('/create_tag', async (req, res) => {
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" })
        const userId = verify.userId;
        const name = req.body.name;
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: "tag name cannot be empty" });
        }
        // create slug
        const slug = name.toLowerCase()
            .replace(/\s+/g, '-') // ganti spasi (termasuk spasi ganda) dengan -
            .replace(/[^\w\-]+/g, '') // hapus semua karakter non-word (selain huruf, angka, _) dan non-hyphen
            .replace(/\-\-+/g, '-') // ganti hyphen ganda dengan satu hyphen
            .replace(/^-+/, '') // hapus hyphen di awal
            .replace(/-+$/, ''); // hapus hyphen di akhir

        let finalSlug = slug;
        let counter = 1;

        // Loop selama slug yang akan kita gunakan sudah ada di database
        while (await tagsModel.checkSlugExists({ userId, slug: finalSlug })) {
            // Jika sudah ada, tambahkan counter ke slug dasar
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        // Gunakan finalSlug yang sudah dijamin unik untuk membuat tag
        const result = await tagsModel.createTag({ userId, name, slug: finalSlug });
        if (result) res.status(201).json({ message: "tag created successfully", name, slug: finalSlug });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "failed to create tag" });
    }
})

route.delete('/delete_tag', async (req, res) => {
    // delete tags based on tag id
    try {
        const verify = jwt.verify(req.headers.authorization.split(' ')[1], ACCESS_TOKEN_SECRET);
        if (!verify) return res.status(403).json({ message: "invalid token" });
        const userId = verify.userId;
        const tagId = req.body.tagId;
        const result = await tagsModel.deleteTag({ userId, tagId });
        if (result) return res.status(200).json({ message: "tag deleted successfully" });
        return res.status(404).json({ message: "tag not found" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "failed to delete tag" });
    }
});

export default route;