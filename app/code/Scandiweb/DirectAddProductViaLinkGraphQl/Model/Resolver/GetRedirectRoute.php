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


class GetRedirectRoute implements ResolverInterface
{

    protected $scopeConfig;

    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scope_config
      ) {
          $this->scopeConfig = $scope_config;
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
        return [
            'redirect_to' => $this->scopeConfig->getValue('sukhvirdirectproductadd/general/redirects', \Magento\Store\Model\ScopeInterface::SCOPE_STORE)
        ];
    }
}
