/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
/* eslint-disable fp/no-let */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showNotification } from 'Store/Notification/Notification.action';
import { fetchQuery } from 'Util/Request';

import { getProductByIdQuery } from '../../query/GetProductById.query';
import { AddProductViaLinkComponent } from './AddProductViaLink.component';

export const CartDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    'Store/Cart/Cart.dispatcher'
);

/** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    addProductToCart: (options) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.addProductToCart(dispatch, options)
    ),
    applyCouponToCart: (couponCode) => CartDispatcher.then(
        ({ default: dispatcher }) => dispatcher.applyCouponToCart(dispatch, couponCode)
    ),
    showErrorNotification: (error) => dispatch(showNotification('error', error))
});

/** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/mapStateToProps */
export const mapStateToProps = (_dispatch) => ({});

/** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/AddProductViaLinkContainer */
export class AddProductViaLinkContainer extends PureComponent {
    static propTypes = {
        identifier: PropTypes.string.isRequired,
        addProductToCart: PropTypes.func.isRequired,
        showErrorNotification: PropTypes.func.isRequired,
        applyCouponToCart: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired
    };

    state = {
        isLoading: true
    };

    addProductToCartById() {
        const {
            addProductToCart,
            showErrorNotification,
            history,
            match
        } = this.props;
        const [productsQuantities, productsIds] = this.getProductDetailsFromUrl(match.params.id);
        if (productsIds === undefined) {
            return false;
        }

        productsIds.forEach(async (productId, index) => {
            const productSku = await fetchQuery(getProductByIdQuery(productId));

            if (!productSku.getProductSKUById.ProductSku) {
                history.push('/');
                const errorMessage = "Couldn't find a product with ID: ";
                showErrorNotification(errorMessage + productId);
            }

            const product = {
                sku: productSku.getProductSKUById.ProductSku
            };

            await addProductToCart({ product, quantity: productsQuantities[index] })
                .catch(
                /** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/addProductToCart/catch */
                    () => {
                        history.push('/');
                        const errorMessage = `Product with ID ${ productId
                        } : Either the quantity you requested is not available, or this product couldn't be found!`;

                        showErrorNotification(errorMessage);
                    }
                );
        });

        return true;
    }

    handleApplyCouponToCart(couponCode) {
        const { applyCouponToCart } = this.props;
        applyCouponToCart(couponCode);
    }

    addProductToCartBySku() {
        const {
            addProductToCart,
            showErrorNotification,
            history,
            match
        } = this.props;
        const [productsQuantities, productsSkus] = this.getProductDetailsFromUrl(match.params.sku);
        if (productsSkus === undefined) {
            return false;
        }

        productsSkus.forEach(async (productSku, index) => {
            const productNew = {
                sku: productSku
            };

            await addProductToCart({ product: productNew, quantity: productsQuantities[index] })
                .catch(
                /** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/addProductToCart/catch */
                    () => {
                        history.push('/');
                        const errorMessage = `Product ${ productSku
                        } : Either the quantity you requested is not available, or this product couldn't be found!`;

                        showErrorNotification(errorMessage);
                    }
                );
        });

        return true;
    }

    /* Steps inside getProductDetailsFromUrl() function:
        1. Split the url into multiple products.
        2. Split each product into product specifier and the desired quantity, based on the existence of
        the "-" symbol.
        3. Return an array of products splitted and ready for adding to cart.

        Edge cases:
        1. If the product's SKU contains details, like has the size, color, etc..
           then we'll have to split the param string based on where is the last "-" symbol is, not just
           based on its existence.
        2. If the quantity is not a number return false, means the operation is failed.
    */

    getProductDetailsFromUrl(urlParams) {
        let productsQuantities = [];
        let productsIds = [];

        const { identifier } = this.props;
        const products = urlParams.split(',');
        const isSuccess = products.every((product) => {
            let holder = [];

            if ((product.match(/-/g) || []).length > 1 && (identifier === 'sku' || identifier === 'sku-coupon')) {
                const quantity = product
                    .substr(product.lastIndexOf('-') + 1, product.length - product.lastIndexOf('-'));

                const productSku = product.substr(0, product.lastIndexOf('-'));
                holder = [productSku, quantity];
            } else {
                holder = product.split('-');
            }
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(holder[1]) && holder[1] !== undefined) {
                productsQuantities = 0;
                productsIds = 0;
                products.length = 0;
                return false;
            }
            productsIds.push(holder[0]);
            productsQuantities.push(holder[1] || '1');

            return true;
        });

        return isSuccess ? [productsQuantities, productsIds] : [];
    }

    render() {
        const {
            identifier,
            history,
            showErrorNotification,
            match
        } = this.props;

        const areProductsAdded = (identifier === 'sku' || identifier === 'sku-coupon') ? this.addProductToCartBySku()
            : (identifier === 'id') ? this.addProductToCartById()
                : undefined;

        if (!areProductsAdded) {
            history.push('/');
            showErrorNotification('Invalid URL request parameters, try that again!');
            this.setState({ isLoading: false });
        } else {
            history.push('/cart');
            if (identifier === 'sku-coupon') {
                this.handleApplyCouponToCart(match.params.coupon);
            }
        }

        return (
            <AddProductViaLinkComponent { ...this.state } />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProductViaLinkContainer);
