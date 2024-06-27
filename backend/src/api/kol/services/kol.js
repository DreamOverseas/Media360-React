'use strict';

/**
 * kol service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::kol.kol');
