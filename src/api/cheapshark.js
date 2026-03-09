// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const axios = require('axios');

/**
 * Wrapper for CheapShark API to fetch game deals.
 */
class CheapSharkAPI {
    constructor() {
        this.baseUrl = 'https://www.cheapshark.com/api/1.0';
        this.storesMapping = {
            'steam': '1',
            'gog': '7',
            'epic': '25'
        };
    }

    /**
     * Fetch deals from CheapShark.
     * @param {Object} options 
     */
    async getDeals(options = {}) {
        const {
            store = 'steam',
            upperPrice = 50,
            sortBy = 'Metacritic',
            pageSize = 10,
            onSale = 1
        } = options;

        const storeID = this.storesMapping[store] || '1';

        try {
            const response = await axios.get(`${this.baseUrl}/deals`, {
                params: {
                    storeID,
                    upperPrice,
                    sortBy,
                    pageSize,
                    onSale
                }
            });

            return response.data.map(deal => ({
                title: deal.title,
                storeID: deal.storeID,
                salePrice: parseFloat(deal.salePrice),
                normalPrice: parseFloat(deal.normalPrice),
                savings: Math.round(parseFloat(deal.savings)),
                metacriticScore: deal.metacriticScore,
                steamAppID: deal.steamAppID,
                thumb: deal.thumb,
                dealID: deal.dealID,
                cheapestEver: deal.cheapestEver // We might need a separate lookup for full "worth it" logic if not provided
            }));
        } catch (error) {
            console.error(`CheapShark API Error:`, error.message);
            throw error;
        }
    }

    /**
     * Search for a game.
     */
    async searchGame(title) {
        try {
            const response = await axios.get(`${this.baseUrl}/games`, {
                params: { title, limit: 5 }
            });
            return response.data;
        } catch (error) {
            console.error(`CheapShark Search Error:`, error.message);
            throw error;
        }
    }

    /**
     * Get details for a specific deal (includes historical low).
     */
    async getDealLookup(dealID) {
        try {
            // CheapShark IDs can be returned already URL-encoded.
            // axios.get(..., { params }) encodes them again.
            // We decode once to ensure raw characters are passed to axios.
            const decodedID = decodeURIComponent(dealID);
            const response = await axios.get(`${this.baseUrl}/deals`, {
                params: { id: decodedID }
            });
            return response.data;
        } catch (error) {
            console.error(`CheapShark Lookup Error:`, error.message);
            throw error;
        }
    }
}

module.exports = new CheapSharkAPI();
