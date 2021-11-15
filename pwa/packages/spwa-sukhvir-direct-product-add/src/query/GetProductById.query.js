import { Field } from 'Util/Query';

/** @namespace SpwaSukhvirDirectProductAdd/Query/GetProductById/Query/getProductByIdQuery */
export const getProductByIdQuery = (productId) => (new Field('getProductSKUById')
    .addArgument('product_id', 'Int', Number(productId))
    .addField('ProductSku'));
