import { Request, Response } from 'express';
import Page from '../models/Page.js';

export const getAllPages = async (req: Request, res: Response) => {
  try {
    const pages = await Page.find();
    res.json(pages);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPageBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const page = await Page.findOne({ slug });
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePage = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { title, content } = req.body;
    
    let page = await Page.findOne({ slug });
    
    if (page) {
      page.title = title || page.title;
      page.content = content || page.content;
      page.lastUpdated = new Date();
      await page.save();
    } else {
      page = await Page.create({
        title,
        slug,
        content,
        lastUpdated: new Date()
      });
    }
    
    res.json(page);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
