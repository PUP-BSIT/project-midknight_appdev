import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class SearchService {
  private apiUrl = 'http://localhost:4000/api';

  async searchUsers(query: string): Promise<any[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/search`, { params: { query } });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching search results:', error);
      return [];
    }
  }
}
