// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const axios = require('axios');

/**
 * Service to fetch free games from Epic Games Store.
 */
class EpicGamesAPI {
    constructor() {
        this.baseUrl = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions';
    }

    /**
     * Fetch current free games.
     */
    async getFreeGames() {
        try {
            const response = await axios.get(this.baseUrl);
            const elements = response.data.data.Catalog.searchStore.elements;

            return elements
                .filter(game => {
                    const promotions = game.promotions;
                    if (!promotions) return false;

                    const activePromos = promotions.promotionalOffers.length > 0
                        ? promotions.promotionalOffers[0].promotionalOffers
                        : [];
                    
                    return activePromos.some(promo => {
                        const discount = promo.discountSetting;
                        return discount && discount.discountType === 'PERCENTAGE' && discount.discountPercentage === 0;
                    });
                })
                .map(game => ({
                    title: game.title,
                    description: game.description,
                    id: game.id,
                    namespace: game.namespace,
                    thumb: game.keyImages.find(img => img.type === 'Thumbnail')?.url || game.keyImages[0]?.url,
                    originalPrice: game.price.totalPrice.fmtPrice.originalPrice,
                    url: `https://store.epicgames.com/en-US/p/${game.catalogNs.mappings[0].pageSlug}`
                }));
        } catch (error) {
            console.error('Epic Games API Error:', error.message);
            return [];
        }
    }
}

module.exports = new EpicGamesAPI();
