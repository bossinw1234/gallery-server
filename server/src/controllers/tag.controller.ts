import { Request, Response } from 'express';
import { TagService } from '../services/tag.service.js';


export class TagController {
  private service: TagService;

  constructor(service?: TagService) {
    this.service = service || new TagService();
  }

  public async getTags(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.getAllTags();
      res.json(result);
    } catch (error) {
      console.error('Error fetching tags:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to fetch tags',
      });
    }
  }
}