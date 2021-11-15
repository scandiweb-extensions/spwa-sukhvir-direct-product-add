<?php
/**
 * @category    ScandiWeb
 * @author      ScandiWeb Team <info@scandiweb.com>
 * @package     ScandiWeb_DirectAddProductViaLinkGraphQl
 * @copyright   Copyright (c) 2021 Scandiweb, Ltd (https://scandiweb.com)
 */

namespace Scandiweb\DirectAddProductViaLinkGraphQl\Model\Resolver;

use Magento\Framework\GraphQl\Config\Element\Field;
use Magento\Framework\GraphQl\Exception\GraphQlInputException;
use Magento\Framework\GraphQl\Query\Resolver\Value;
use Magento\Framework\GraphQl\Query\ResolverInterface;
use Magento\Framework\GraphQl\Schema\Type\ResolveInfo;

use Magento\Catalog\Api\ProductRepositoryInterface;

class GetProductSkuById implements ResolverInterface
{

    protected $productRepository;

    public function __construct(
        ProductRepositoryInterface $productRepository
      ) {

          $this->productRepository = $productRepository;
      }

    /**
     * @param Field $field
     * @param ContextInterface $context
     * @param ResolveInfo $info
     * @param array|null $value
     * @param array|null $args
     *
     * @return array|Value|mixed
     */
    public function resolve(
        Field $field,
        $context,
        ResolveInfo $info,
        array $value = null,
        array $args = null
    )
    {
        $product = $this->productRepository->getById($args['product_id']);
        return ['ProductSku' => $product->getSku()];
    }
}
