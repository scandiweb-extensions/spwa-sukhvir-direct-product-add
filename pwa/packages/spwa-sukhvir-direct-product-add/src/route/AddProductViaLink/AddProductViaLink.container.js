/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { showNotification } from 'Store/Notification/Notification.action';
import { fetchQuery } from 'Util/Request';
import { appendWithStoreCode } from 'Util/Url';

import { getProductByIdQuery } from '../../query/GetProductById.query';
import { redirectionPathQuery } from '../../query/GetRedirectionPath.query';
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
        isLoading: true,
        redirect: false
    };

    // gets the url path and then redirects to it.
    async getRedirectionPath() {
        const { history } = this.props;
        const redirectionPath = await fetchQuery(redirectionPathQuery);
        const redirect_to = () => {
            if (redirectionPath.getRedirectRoute.redirect_to === 'checkout/cart/') {
                return 'cart';
            }

            return 'checkout/cart';
        };

        history.push({
            pathname: appendWithStoreCode(`/${redirect_to()}`)
        });
        // return this.setState({ redirect: `/${redirectionPath.getRedirectRoute.redirect_to}` });
    }

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
            const productSku = await fetchQuery(getProductByIdQuery(productId))
                .catch(
                /** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/fetchQuery/catch */
                    () => {
                        history.push('/');
                        showErrorNotification(
                            __(`Couldn't find a product with this ID: ${productId}`)
                        );
                    }
                );

            if (!productSku) {
                return;
            }

            const product = {
                sku: productSku.getProductSKUById.ProductSku
            };

            await addProductToCart({ product, quantity: productsQuantities[index] })
                .catch(
                /** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/addProductToCart/catch */
                    () => {
                        history.push('/');
                        showErrorNotification(
                            __(`Product with ID ${ productId } :
                            Either the quantity you requested is not available, or this product couldn't be found!`)
                        );
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
            const product = {
                sku: productSku
            };

            await addProductToCart({ product, quantity: Number(productsQuantities[index]) })
                .catch(
                    /** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Container/addProductToCart/catch */
                    () => {
                        history.push('/');
                        showErrorNotification(
                            __(`Product with SKU: ${ productSku } couldn't be found!`)
                        );
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
        const productsSplitted = {
            productsQuantities: [],
            productsSpecifier: []
        };

        const { identifier } = this.props;
        const products = urlParams.split(',');
        const isSuccess = products.every((product) => {
            const holder = [];
            if ((product.match(/-/g) || []).length > 1
                && (identifier === 'sku' || identifier === 'sku-coupon')) {
                const quantity = product
                    .substr(product.lastIndexOf('-') + 1, product.length - product.lastIndexOf('-'));

                const productsSpecifier = product.substr(0, product.lastIndexOf('-'));
                holder[0] = productsSpecifier;
                holder[1] = quantity;
            } else {
                const splitted = product.split('-');
                holder[0] = splitted[0];
                holder[1] = splitted[1];
            }
            // eslint-disable-next-line no-restricted-globals
            if (isNaN(holder[1]) && holder[1] !== undefined) {
                productsSplitted.productsQuantities = 0;
                productsSplitted.productsSpecifier = 0;
                products.length = 0;
                return false;
            }
            productsSplitted.productsSpecifier.push(holder[0]);
            productsSplitted.productsQuantities.push(holder[1] || '1');

            return true;
        });

        return isSuccess ? [productsSplitted.productsQuantities, productsSplitted.productsSpecifier] : [];
    }

    render() {
        const {
            identifier,
            history,
            showErrorNotification,
            match
        } = this.props;

        const { redirect } = this.state;
        const areProductsAdded = (identifier === 'sku' || identifier === 'sku-coupon') ? this.addProductToCartBySku()
            : (identifier === 'id') ? this.addProductToCartById()
                : undefined;

        if (!areProductsAdded) {
            history.push('/');
            showErrorNotification('Invalid URL request parameters, try that again!');
        } else {
            this.getRedirectionPath();

            if (identifier === 'sku-coupon') {
                this.handleApplyCouponToCart(match.params.coupon);
            }
        }

        return (
            <>
                <AddProductViaLinkComponent { ...this.state } />
                { redirect ? <Redirect to={ redirect } /> : '' }
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddProductViaLinkContainer);
