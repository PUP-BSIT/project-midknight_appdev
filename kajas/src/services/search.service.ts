import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class SearchService {
  private apiUrl = 'https://kajas-backend.onrender.com/api';

  searchUsers(query: string): Promise<any[]> {
    return axios.get(`${this.apiUrl}/search`, { params: { query } })
      .then(response => response.data.data)
      .catch(error => {
        console.error('Error fetching search results:', error);
        return [];
      });
  }
}
