import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class SearchService {
  private apiUrl = 'https://api.kajas.site/api';

  searchUsers(query: string): Promise<any[]> {
    return axios.get(`${this.apiUrl}/search`, { params: { query } })
      .then(response => response.data.data)
      .catch(error => {
        console.error('Error fetching search results:', error);
        return [];
      });
  }
}
