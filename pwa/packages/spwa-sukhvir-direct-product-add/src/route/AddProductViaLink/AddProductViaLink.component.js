import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import Loader from 'Component/Loader';

/** @namespace SpwaSukhvirDirectProductAdd/Route/AddProductViaLink/Component/AddProductViaLinkComponent */
export class AddProductViaLinkComponent extends PureComponent {
    static propTypes = {
        isLoading: PropTypes.bool.isRequired
    };

    renderLoader() {
        const { isLoading } = this.props;
        return <Loader isLoading={ isLoading } />;
    }

    render() {
        return (
            <div block="addProductViaLink">
            <h3 style={ { textAlign: 'center' } }>Adding products to cart...</h3>
                { this.renderLoader() }
            </div>
        );
    }
}
