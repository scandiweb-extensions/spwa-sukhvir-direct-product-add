/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/no-jsx-variables */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */

import { lazy } from 'react';
import { Route } from 'react-router-dom';

export const AddProductViaLinkComponent = lazy(() => import(
    /* webpackMode: "lazy", webpackChunkName: "spwa-sukhvir-direct-product-add" */
    '../../route/AddProductViaLink'
));
const withStoreRegex = (path) => window.storeRegexText.concat(path);

const SWITCH_ITEMS_TYPE = (member) => [
    ...member,
    {
        component: (
            <Route path={ withStoreRegex('/dpa/add/tocart/sku/:sku') } exact render={ (props) => <AddProductViaLinkComponent { ...props } identifier="sku" /> } />
        ),
        position: 101
    },
    {
        component: <Route path={ withStoreRegex('/dpa/add/tocart/sku/:sku/coupon/:coupon') } exact render={ (props) => <AddProductViaLinkComponent { ...props } identifier="sku-coupon" /> } />,
        position: 102
    },
    {
        component: <Route path={ withStoreRegex('/dpa/add/tocart/id/:id') } exact render={ (props) => <AddProductViaLinkComponent { ...props } identifier="id" /> } />,
        position: 103
    }
];
export default {
    'Component/Router/Component': {
        'member-property': {
            SWITCH_ITEMS_TYPE
        }
    }
};
