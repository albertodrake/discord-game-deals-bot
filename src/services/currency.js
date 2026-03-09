// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const axios = require('axios');

/**
 * Currency service to handle USD to INR conversion.
 */
class CurrencyService {
    constructor() {
        this.baseRate = 83.50; // Fallback rate
        this.lastFetched = 0;
        this.cacheDuration = 3600000 * 24; // 24 hours
    }

    /**
     * Get the latest USD to INR rate.
     * @returns {Promise<number>}
     */
    async getRate() {
        const now = Date.now();
        if (now - this.lastFetched < this.cacheDuration) {
            return this.baseRate;
        }

        try {
            // Using a free API for exchange rates (e.g., Frankfurter or similar)
            const response = await axios.get('https://api.frankfurter.app/latest?from=USD&to=INR');
            if (response.data && response.data.rates && response.data.rates.INR) {
                this.baseRate = response.data.rates.INR;
                this.lastFetched = now;
            }
        } catch (error) {
            console.error('Failed to fetch exchange rate, using fallback:', error.message);
        }

        return this.baseRate;
    }

    /**
     * Convert USD to INR.
     * @param {number} usdAmount 
     * @returns {Promise<string>} Formatted INR string
     */
    async convertToINR(usdAmount) {
        const rate = await this.getRate();
        const inrAmount = usdAmount * rate;
        
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(inrAmount);
    }
}

module.exports = new CurrencyService();
