/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @scandipwa/scandipwa-guidelines/no-jsx-variables */
/* eslint-disable @scandipwa/scandipwa-guidelines/jsx-no-props-destruction */

import { Route } from 'react-router-dom';

import { SWITCH_ITEMS_TYPE } from 'SourceComponent/Router/Router.config';

import AddProductViaLinkComponent from '../../route/AddProductViaLink';

const withStoreRegex = (path) => window.storeRegexText.concat(path);
const newRouteAddProductDirect = (member, _instance) => [
    ...member,
    {
        component: <Route path={ withStoreRegex('/dpa/add/tocart/sku/:sku') } exact render={ (props) => <AddProductViaLinkComponent { ...props } identifier="sku" /> } />,
        position: 14,
        name: 'ADDPRODUCTDIRECTBYSKU'
    },
    {
        component: <Route path={ withStoreRegex('/dpa/add/tocart/sku/:sku/coupon/:coupon') } exact render={ (props) => <AddProductViaLinkComponent { ...props } identifier="sku-coupon" /> } />,
        position: 14,
        name: 'ADDPRODUCTDIRECTBYSKUWITHCUOPON'
    },
    {
        component: <Route path={ withStoreRegex('/dpa/add/tocart/id/:id') } exact render={ (props) => <AddProductViaLinkComponent { ...props } identifier="id" /> } />,
        position: 14,
        name: 'ADDPRODUCTDIRECTBYID'
    }
];

export default {
    'Component/Router/Component': {
        'member-property': {
            [SWITCH_ITEMS_TYPE]: newRouteAddProductDirect
        }
    }
};
